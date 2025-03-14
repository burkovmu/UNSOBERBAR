import { MenuItem, MenuCategory } from '@/types/menu';

class MenuService {
  async loadMenu(): Promise<MenuCategory[]> {
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error('Ошибка загрузки меню');
      return await response.json();
    } catch (error) {
      console.error('Ошибка при загрузке меню:', error);
      return [];
    }
  }

  async saveMenu(menu: MenuCategory[]): Promise<void> {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menu),
      });
      
      if (!response.ok) throw new Error('Ошибка сохранения меню');
    } catch (error) {
      console.error('Ошибка при сохранении меню:', error);
      throw error;
    }
  }

  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Ошибка загрузки изображения');

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) throw new Error('Ошибка удаления изображения');
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
    }
  }

  findItemAndParent(
    menu: MenuCategory[],
    itemId: string,
    parentPath: string[] = []
  ): { item: MenuItem | null; parent: MenuItem | MenuCategory | null; index: number } {
    for (const category of menu) {
      if (category.id === itemId) {
        return { item: category as unknown as MenuItem, parent: null, index: menu.indexOf(category) };
      }

      let result = this.findItemInCategory(category, itemId, parentPath);
      if (result.item) return result;
    }

    return { item: null, parent: null, index: -1 };
  }

  private findItemInCategory(
    parent: MenuCategory | MenuItem,
    itemId: string,
    parentPath: string[]
  ): { item: MenuItem | null; parent: MenuItem | MenuCategory; index: number } {
    const items = 'items' in parent ? parent.items || [] : [];
    
    for (const item of items) {
      if (item.id === itemId) {
        return { item, parent, index: items.indexOf(item) };
      }

      if (item.isSubcategory && item.items) {
        const result = this.findItemInCategory(item, itemId, [...parentPath, item.id]);
        if (result.item) return result;
      }
    }

    return { item: null, parent: parent, index: -1 };
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export const menuService = new MenuService(); 