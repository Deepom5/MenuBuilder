import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    type ReactNode,
} from 'react';

import type { TemplateOverrides } from '@/features/templates/types/template';
import { copyPhotoToAppStorage, deletePhoto, loadMenu, saveMenu } from '@/storage/menu-storage';
import type { Category, DietType, Menu, MenuItem, Restaurant } from '@/types/menu';
import { createId } from '@/utils/id';

const MAX_RECENTS = 8;

type NewItemInput = {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  diet: DietType;
  photoUri?: string;
  available?: boolean;
};

type Action =
  | { type: 'HYDRATED'; menu: Menu }
  | { type: 'RESTAURANT_UPDATED'; patch: Partial<Restaurant> }
  | { type: 'TEMPLATE_SELECTED'; templateId: string }
  | { type: 'OVERRIDES_UPDATED'; patch: TemplateOverrides }
  | { type: 'OVERRIDES_RESET' }
  | { type: 'TEMPLATE_FAVORITED'; templateId: string }
  | { type: 'TEMPLATE_UNFAVORITED'; templateId: string }
  | { type: 'ONBOARDING_COMPLETED' }
  | { type: 'CATEGORY_ADDED'; category: Category }
  | { type: 'CATEGORY_UPDATED'; id: string; patch: Partial<Category> }
  | { type: 'CATEGORY_DELETED'; id: string }
  | { type: 'ITEM_ADDED'; item: MenuItem }
  | { type: 'ITEM_UPDATED'; id: string; patch: Partial<MenuItem> }
  | { type: 'ITEM_DELETED'; id: string }
  | { type: 'MENU_REPLACED'; menu: Menu };

type State = {
  menu: Menu | null;
  ready: boolean;
};

const initialState: State = { menu: null, ready: false };

function reducer(state: State, action: Action): State {
  if (action.type === 'HYDRATED') {
    return { menu: action.menu, ready: true };
  }
  if (!state.menu) return state;

  switch (action.type) {
    case 'RESTAURANT_UPDATED':
      return {
        ...state,
        menu: { ...state.menu, restaurant: { ...state.menu.restaurant, ...action.patch } },
      };
    case 'TEMPLATE_SELECTED': {
      const recent = [
        action.templateId,
        ...state.menu.recentTemplates.filter((id) => id !== action.templateId),
      ].slice(0, MAX_RECENTS);
      return {
        ...state,
        menu: {
          ...state.menu,
          restaurant: {
            ...state.menu.restaurant,
            templateId: action.templateId,
            // Switching template clears overrides so the new look is honest.
            overrides: {},
          },
          recentTemplates: recent,
        },
      };
    }
    case 'OVERRIDES_UPDATED':
      return {
        ...state,
        menu: {
          ...state.menu,
          restaurant: {
            ...state.menu.restaurant,
            overrides: mergeOverrides(state.menu.restaurant.overrides, action.patch),
          },
        },
      };
    case 'OVERRIDES_RESET':
      return {
        ...state,
        menu: {
          ...state.menu,
          restaurant: { ...state.menu.restaurant, overrides: {} },
        },
      };
    case 'TEMPLATE_FAVORITED':
      return {
        ...state,
        menu: {
          ...state.menu,
          favoriteTemplates: state.menu.favoriteTemplates.includes(action.templateId)
            ? state.menu.favoriteTemplates
            : [...state.menu.favoriteTemplates, action.templateId],
        },
      };
    case 'TEMPLATE_UNFAVORITED':
      return {
        ...state,
        menu: {
          ...state.menu,
          favoriteTemplates: state.menu.favoriteTemplates.filter((id) => id !== action.templateId),
        },
      };
    case 'ONBOARDING_COMPLETED':
      return { ...state, menu: { ...state.menu, onboardingComplete: true } };
    case 'CATEGORY_ADDED':
      return {
        ...state,
        menu: { ...state.menu, categories: [...state.menu.categories, action.category] },
      };
    case 'CATEGORY_UPDATED':
      return {
        ...state,
        menu: {
          ...state.menu,
          categories: state.menu.categories.map((c) =>
            c.id === action.id ? { ...c, ...action.patch } : c,
          ),
        },
      };
    case 'CATEGORY_DELETED':
      return {
        ...state,
        menu: {
          ...state.menu,
          categories: state.menu.categories.filter((c) => c.id !== action.id),
          items: state.menu.items.filter((i) => i.categoryId !== action.id),
        },
      };
    case 'ITEM_ADDED':
      return { ...state, menu: { ...state.menu, items: [...state.menu.items, action.item] } };
    case 'ITEM_UPDATED':
      return {
        ...state,
        menu: {
          ...state.menu,
          items: state.menu.items.map((i) =>
            i.id === action.id ? { ...i, ...action.patch } : i,
          ),
        },
      };
    case 'ITEM_DELETED':
      return {
        ...state,
        menu: { ...state.menu, items: state.menu.items.filter((i) => i.id !== action.id) },
      };
    case 'MENU_REPLACED':
      return { ...state, menu: action.menu };
    default:
      return state;
  }
}

type MenuContextValue = {
  menu: Menu;
  ready: boolean;
  // restaurant
  updateRestaurant: (patch: Partial<Restaurant>) => void;
  // template + customization
  selectTemplate: (templateId: string) => void;
  updateOverrides: (patch: TemplateOverrides) => void;
  resetOverrides: () => void;
  toggleFavoriteTemplate: (templateId: string) => void;
  completeOnboarding: () => void;
  // categories
  addCategory: (name: string) => Category;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  // items
  addItem: (input: NewItemInput) => MenuItem;
  updateItem: (id: string, patch: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  // photos
  pickPhotoFromAsset: (sourceUri: string) => Promise<string>;
  // bulk
  replaceMenu: (menu: Menu) => void;
  // selectors
  itemsByCategory: (categoryId: string) => MenuItem[];
};

export const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadMenu().then((menu) => {
      if (!cancelled) dispatch({ type: 'HYDRATED', menu });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced persistence — collapses rapid edits into a single write.
  useEffect(() => {
    if (!state.menu || !state.ready) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      saveMenu(state.menu!);
    }, 250);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [state.menu, state.ready]);

  const updateRestaurant = useCallback((patch: Partial<Restaurant>) => {
    dispatch({ type: 'RESTAURANT_UPDATED', patch });
  }, []);

  const selectTemplate = useCallback((templateId: string) => {
    dispatch({ type: 'TEMPLATE_SELECTED', templateId });
  }, []);

  const updateOverrides = useCallback((patch: TemplateOverrides) => {
    dispatch({ type: 'OVERRIDES_UPDATED', patch });
  }, []);

  const resetOverrides = useCallback(() => {
    dispatch({ type: 'OVERRIDES_RESET' });
  }, []);

  const toggleFavoriteTemplate = useCallback(
    (templateId: string) => {
      const isFav = state.menu?.favoriteTemplates.includes(templateId);
      dispatch({ type: isFav ? 'TEMPLATE_UNFAVORITED' : 'TEMPLATE_FAVORITED', templateId });
    },
    [state.menu],
  );

  const completeOnboarding = useCallback(() => {
    dispatch({ type: 'ONBOARDING_COMPLETED' });
  }, []);

  const addCategory = useCallback((name: string): Category => {
    const category: Category = { id: createId(), name: name.trim() || 'Untitled', order: Date.now() };
    dispatch({ type: 'CATEGORY_ADDED', category });
    return category;
  }, []);

  const updateCategory = useCallback((id: string, patch: Partial<Category>) => {
    dispatch({ type: 'CATEGORY_UPDATED', id, patch });
  }, []);

  const deleteCategory = useCallback((id: string) => {
    // photo cleanup happens lazily; orphan files are harmless
    dispatch({ type: 'CATEGORY_DELETED', id });
  }, []);

  const addItem = useCallback((input: NewItemInput): MenuItem => {
    const item: MenuItem = {
      id: createId(),
      categoryId: input.categoryId,
      name: input.name.trim() || 'Untitled',
      description: input.description?.trim() || undefined,
      price: Number.isFinite(input.price) ? input.price : 0,
      diet: input.diet,
      photoUri: input.photoUri,
      available: input.available ?? true,
      order: Date.now(),
    };
    dispatch({ type: 'ITEM_ADDED', item });
    return item;
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<MenuItem>) => {
    dispatch({ type: 'ITEM_UPDATED', id, patch });
  }, []);

  const deleteItem = useCallback(
    (id: string) => {
      const target = state.menu?.items.find((i) => i.id === id);
      if (target?.photoUri) deletePhoto(target.photoUri);
      dispatch({ type: 'ITEM_DELETED', id });
    },
    [state.menu],
  );

  const pickPhotoFromAsset = useCallback(async (sourceUri: string) => {
    return copyPhotoToAppStorage(sourceUri);
  }, []);

  const replaceMenu = useCallback((menu: Menu) => {
    dispatch({ type: 'MENU_REPLACED', menu });
  }, []);

  const itemsByCategory = useCallback(
    (categoryId: string) => {
      const items = state.menu?.items ?? [];
      return items
        .filter((i) => i.categoryId === categoryId)
        .sort((a, b) => a.order - b.order);
    },
    [state.menu],
  );

  const value = useMemo<MenuContextValue | null>(() => {
    if (!state.menu) return null;
    return {
      menu: state.menu,
      ready: state.ready,
      updateRestaurant,
      selectTemplate,
      updateOverrides,
      resetOverrides,
      toggleFavoriteTemplate,
      completeOnboarding,
      addCategory,
      updateCategory,
      deleteCategory,
      addItem,
      updateItem,
      deleteItem,
      pickPhotoFromAsset,
      replaceMenu,
      itemsByCategory,
    };
  }, [
    state.menu,
    state.ready,
    updateRestaurant,
    selectTemplate,
    updateOverrides,
    resetOverrides,
    toggleFavoriteTemplate,
    completeOnboarding,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    pickPhotoFromAsset,
    replaceMenu,
    itemsByCategory,
  ]);

  return <MenuContext.Provider value={value}>{state.ready ? children : null}</MenuContext.Provider>;
}

export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error('useMenu must be used inside MenuProvider (or the menu is still loading)');
  }
  return ctx;
}

export function useMenuReady(): boolean {
  const ctx = useContext(MenuContext);
  return ctx !== null;
}

function mergeOverrides(
  prev: TemplateOverrides,
  patch: TemplateOverrides,
): TemplateOverrides {
  return {
    ...prev,
    ...patch,
    colors: patch.colors ? { ...prev.colors, ...patch.colors } : prev.colors,
    typography: patch.typography
      ? { ...prev.typography, ...patch.typography }
      : prev.typography,
    layout: patch.layout ? { ...prev.layout, ...patch.layout } : prev.layout,
  };
}
