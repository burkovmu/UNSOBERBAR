import { MenuCategory } from '@/types/menu';

export const fetchMenu = async (): Promise<MenuCategory[]> => {
  try {
    const response = await fetch('/api/menu');
    if (!response.ok) {
      throw new Error('Ошибка при загрузке меню');
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при загрузке меню:', error);
    throw error;
  }
};

export const updateMenu = async (menu: MenuCategory[]): Promise<void> => {
  try {
    const response = await fetch('/api/menu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menu),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при обновлении меню');
    }
  } catch (error) {
    console.error('Ошибка при обновлении меню:', error);
    throw error;
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Ошибка при загрузке изображения');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    throw error;
  }
}; 