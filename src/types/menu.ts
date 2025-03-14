export interface MenuItem {
  id: string;
  name: string;
  price?: string;
  description?: string;
  image?: string;
  weight?: string;
  nutrition?: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
  };
  isSubcategory?: boolean;
  items?: MenuItem[];
  order?: number;
  slug?: string;
  isVisible?: boolean;
  lastModified?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
  order?: number;
  slug?: string;
  isVisible?: boolean;
  lastModified?: string;
}

export interface DragItem {
  id: string;
  type: 'category' | 'subcategory' | 'item';
  categoryId?: string;
  parentPath?: string[];
}

export interface SearchResult extends MenuItem {
  categoryName?: string;
  path?: string[];
  breadcrumbs?: string[];
}

export type FilterType = 'all' | 'categories' | 'items' | 'hidden';
export type SortType = 'name' | 'date' | 'order'; 