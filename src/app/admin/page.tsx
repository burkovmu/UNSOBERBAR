'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  EyeSlashIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { MenuItem, MenuCategory, DragItem, FilterType, SortType } from '@/types/menu';
import { menuService } from '@/services/menuService';
import { MenuTree } from './components/MenuTree';
import { ItemEditForm } from './components/ItemEditForm';
import { SearchBar } from './components/SearchBar';
import { Breadcrumbs } from './components/Breadcrumbs';

export default function AdminPage() {
  // Состояние меню
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
    item: MenuItem;
    categoryId: string;
    parentPath: string[];
  } | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{id: string; name: string; categoryId?: string}>>([]);
  
  // Состояние UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Состояние для нового блюда
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [pendingNewItem, setPendingNewItem] = useState<{
    isSubcategory: boolean;
    tempId?: string;
  } | null>(null);
  
  // Состояние для новой категории
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Состояние для редактирования категории
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Загрузка меню при монтировании
  useEffect(() => {
    loadMenu();
  }, []);

  // Функция загрузки меню
    const loadMenu = async () => {
      try {
      setIsLoading(true);
      setError(null);
        const data = await menuService.loadMenu();
      setMenu(data);
    } catch (err) {
      setError('Ошибка при загрузке меню');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция сохранения меню
  const saveMenu = async (newMenu: MenuCategory[]) => {
    try {
      setIsSaving(true);
      setError(null);
      await menuService.saveMenu(newMenu);
      setMenu(newMenu);
    } catch (err) {
      setError('Ошибка при сохранении меню');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Функции для работы с категориями
  const addCategory = async () => {
    setShowCategoryForm(true);
    setNewCategoryName('Новая категория');
  };
  
  const createCategory = async (name: string) => {
    const newCategory: MenuCategory = {
      id: Date.now().toString(),
      name: name,
      items: [],
      order: menu.length,
      isVisible: true,
      lastModified: new Date().toISOString(),
      slug: menuService.generateSlug(name)
    };
    
    // Добавляем новую категорию в конец списка
    const newMenu = [...menu, newCategory];
    await saveMenu(newMenu);
    setShowCategoryForm(false);
        setNewCategoryName('');
  };

  const updateCategory = async (categoryId: string, updates: Partial<MenuCategory>) => {
    const newMenu = menu.map(cat => 
      cat.id === categoryId ? { ...cat, ...updates } : cat
    );
    await saveMenu(newMenu);
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };
  
  const editCategory = (categoryId: string) => {
    const category = menu.find(cat => cat.id === categoryId);
    if (category) {
      setEditingCategoryId(categoryId);
      setEditingCategoryName(category.name);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию и все её содержимое?')) return;
    
    const category = menu.find(cat => cat.id === categoryId);
    if (category) {
      // Удаляем все изображения в категории
      await deleteImagesInCategory(category);
    }
    
    const newMenu = menu.filter(cat => cat.id !== categoryId);
    await saveMenu(newMenu);
    setSelectedItem(null);
  };

  const deleteImagesInCategory = async (category: MenuCategory | MenuItem) => {
    if ('image' in category && category.image) {
      await menuService.deleteImage(category.image);
    }
    
    if ('items' in category && category.items) {
      for (const item of category.items) {
        await deleteImagesInCategory(item);
      }
    }
  };

  // Функции для работы с элементами
  const addItem = async (categoryId: string, parentPath: string[] = [], isSubcategory: boolean = false) => {
    const tempId = Date.now().toString();
    const newItem: MenuItem = {
      id: tempId,
      name: isSubcategory ? 'Новая подкатегория' : 'Новое блюдо',
      isSubcategory,
      order: 0,
      isVisible: true,
      lastModified: new Date().toISOString(),
      slug: menuService.generateSlug(isSubcategory ? 'Новая подкатегория' : 'Новое блюдо'),
      ...(isSubcategory ? { items: [] } : {
        price: '',
        description: '',
        image: '',
        weight: '',
        nutrition: { calories: 0, protein: 0, fats: 0, carbs: 0 }
      })
    };

    // Определяем порядок нового элемента
    const newMenu = menu.map(category => {
      if (category.id !== categoryId) return category;

      let items = category.items;
      if (parentPath.length > 0) {
        // Если добавляем в подкатегорию, находим её и определяем порядок
        items = addItemToPath(items, parentPath, newItem);
      } else {
        // Если добавляем непосредственно в категорию, устанавливаем порядок в конец списка
        newItem.order = items.length;
        items = [...items, newItem];
      }

      return { ...category, items };
    });

    await saveMenu(newMenu);
    
    // Формируем хлебные крошки перед установкой selectedItem
    const newBreadcrumbs = generateBreadcrumbs(categoryId, parentPath);
    setBreadcrumbs(newBreadcrumbs);
    
    setSelectedItem({ item: newItem, categoryId, parentPath });
    
    // Сохраняем временный ID для возможного удаления при отмене
    setPendingNewItem({ 
      isSubcategory, 
      tempId 
    });
  };

  const addItemToPath = (items: MenuItem[], path: string[], newItem: MenuItem): MenuItem[] => {
    if (path.length === 0) return [...items, newItem];

    const [currentId, ...restPath] = path;
    return items.map(item => {
      if (item.id !== currentId) return item;
      
      if (restPath.length === 0) {
        // Если это конечная подкатегория, добавляем элемент в её items
        const updatedItems = item.items || [];
        // Устанавливаем порядок в конец списка
        newItem.order = updatedItems.length;
            return {
              ...item,
          items: [...updatedItems, newItem]
        };
      }
      
      // Иначе продолжаем поиск по пути
      return {
        ...item,
        items: addItemToPath(item.items || [], restPath, newItem)
      };
        });
      };

  const updateItem = async (
    categoryId: string,
    itemId: string,
    parentPath: string[] = [],
    updates: Partial<MenuItem>
  ) => {
    const newMenu = menu.map(category => {
      if (category.id !== categoryId) return category;

      let items = category.items;
      if (parentPath.length > 0) {
        items = updateItemInPath(items, parentPath, itemId, updates);
      } else {
        items = items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        );
      }

      return { ...category, items };
    });

    await saveMenu(newMenu);
  };

  const updateItemInPath = (
    items: MenuItem[],
    path: string[],
    itemId: string,
    updates: Partial<MenuItem>
  ): MenuItem[] => {
    if (path.length === 0) {
      return items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      );
    }

    const [currentId, ...restPath] = path;
    return items.map(item => {
      if (item.id !== currentId) return item;
            return {
              ...item,
        items: updateItemInPath(item.items || [], restPath, itemId, updates)
            };
        });
      };

  const deleteItem = async (categoryId: string, itemId: string, parentPath: string[] = []) => {
    if (!confirm('Вы уверены, что хотите удалить этот элемент?')) return;

    const newMenu = menu.map(category => {
      if (category.id !== categoryId) return category;

      let items = category.items;
      if (parentPath.length > 0) {
        items = deleteItemFromPath(items, parentPath, itemId);
      } else {
        const item = items.find(item => item.id === itemId);
        if (item?.image) {
          menuService.deleteImage(item.image);
        }
        items = items.filter(item => item.id !== itemId);
      }

      return { ...category, items };
    });

    await saveMenu(newMenu);
    setSelectedItem(null);
  };

  const deleteItemFromPath = (items: MenuItem[], path: string[], itemId: string): MenuItem[] => {
        if (path.length === 0) {
      const item = items.find(item => item.id === itemId);
      if (item?.image) {
        menuService.deleteImage(item.image);
      }
      return items.filter(item => item.id !== itemId);
    }

    const [currentId, ...restPath] = path;
        return items.map(item => {
      if (item.id !== currentId) return item;
            return {
              ...item,
        items: deleteItemFromPath(item.items || [], restPath, itemId)
            };
        });
      };

  // Функция для перемещения элементов
  const moveItem = async (draggedItem: DragItem, targetItem: DragItem) => {
    // Создаем копию меню для изменений
    const newMenu = [...menu];
    
    // Перемещение категорий
    if (draggedItem.type === 'category' && targetItem.type === 'category') {
      // Находим индексы категорий
      const draggedIndex = newMenu.findIndex(cat => cat.id === draggedItem.id);
      const targetIndex = newMenu.findIndex(cat => cat.id === targetItem.id);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Извлекаем категорию
        const draggedCategory = newMenu[draggedIndex];
        
        // Удаляем категорию из текущей позиции
        newMenu.splice(draggedIndex, 1);
        
        // Вставляем категорию на новую позицию
        // Если целевой индекс был больше исходного, нужно учесть смещение после удаления
        const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        newMenu.splice(adjustedTargetIndex, 0, draggedCategory);
        
        // Обновляем порядок категорий
        newMenu.forEach((cat, index) => {
          cat.order = index;
        });
        
        await saveMenu(newMenu);
        return;
      }
    }
    
    // Перемещение элементов внутри категории или подкатегории
    if (draggedItem.categoryId && targetItem.categoryId) {
      const categoryId = draggedItem.categoryId;
      const category = newMenu.find(cat => cat.id === categoryId);
      
      if (!category) return;
      
      // Если оба элемента находятся в одной категории и на одном уровне вложенности
      if (
        draggedItem.categoryId === targetItem.categoryId && 
        JSON.stringify(draggedItem.parentPath) === JSON.stringify(targetItem.parentPath)
      ) {
        // Находим массив элементов для перемещения
        let items: MenuItem[] = [];
        
        if (draggedItem.parentPath && draggedItem.parentPath.length > 0) {
          // Элементы находятся в подкатегории
          let currentItems = category.items;
          let currentParent: MenuItem | MenuCategory = category;
          
          for (const pathId of draggedItem.parentPath) {
            const pathItem = currentItems.find(item => item.id === pathId);
            if (pathItem && pathItem.isSubcategory && pathItem.items) {
              currentParent = pathItem;
              currentItems = pathItem.items;
      } else {
              return; // Путь не найден
            }
          }
          
          items = currentItems;
        } else {
          // Элементы находятся непосредственно в категории
          items = category.items;
        }
        
        // Находим индексы элементов
        const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
        const targetIndex = items.findIndex(item => item.id === targetItem.id);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
          // Извлекаем элемент
          const draggedElement = items[draggedIndex];
          
          // Удаляем элемент из текущей позиции
          items.splice(draggedIndex, 1);
          
          // Вставляем элемент на новую позицию
          // Если целевой индекс был больше исходного, нужно учесть смещение после удаления
          const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
          items.splice(adjustedTargetIndex, 0, draggedElement);
          
          // Обновляем порядок элементов
          items.forEach((item, index) => {
            item.order = index;
          });
          
          await saveMenu(newMenu);
        return;
      }
      }
    }
    
    // Если мы дошли до этой точки, значит что-то пошло не так
    console.error('Не удалось переместить элемент', { draggedItem, targetItem });
  };

  // Функции для перемещения элементов
  const moveItemUp = async (categoryId: string, itemId: string, parentPath: string[] = []) => {
    const newMenu = [...menu];
    const category = newMenu.find(cat => cat.id === categoryId);
    
    if (!category) return;
    
    // Если элемент находится в подкатегории
    if (parentPath.length > 0) {
      let currentItems = category.items;
      let currentParent: MenuItem | null = null;
      
      // Находим родительскую подкатегорию
      for (const pathId of parentPath) {
        currentParent = currentItems.find(item => item.id === pathId) as MenuItem;
        if (!currentParent || !currentParent.items) return;
        currentItems = currentParent.items;
      }
      
      // Находим индекс элемента
      const itemIndex = currentItems.findIndex(item => item.id === itemId);
      if (itemIndex <= 0) return; // Элемент уже первый или не найден
      
      // Меняем местами с предыдущим элементом
      const temp = currentItems[itemIndex];
      currentItems[itemIndex] = currentItems[itemIndex - 1];
      currentItems[itemIndex - 1] = temp;
      
      // Обновляем порядок
      currentItems.forEach((item, index) => {
        item.order = index;
      });
    } else {
      // Элемент находится непосредственно в категории
      const itemIndex = category.items.findIndex(item => item.id === itemId);
      if (itemIndex <= 0) return; // Элемент уже первый или не найден
      
      // Меняем местами с предыдущим элементом
      const temp = category.items[itemIndex];
      category.items[itemIndex] = category.items[itemIndex - 1];
      category.items[itemIndex - 1] = temp;
      
      // Обновляем порядок
      category.items.forEach((item, index) => {
        item.order = index;
      });
    }
    
    await saveMenu(newMenu);
  };
  
  const moveItemDown = async (categoryId: string, itemId: string, parentPath: string[] = []) => {
    const newMenu = [...menu];
    const category = newMenu.find(cat => cat.id === categoryId);
    
    if (!category) return;
    
    // Если элемент находится в подкатегории
    if (parentPath.length > 0) {
    let currentItems = category.items;
      let currentParent: MenuItem | null = null;
      
      // Находим родительскую подкатегорию
      for (const pathId of parentPath) {
        currentParent = currentItems.find(item => item.id === pathId) as MenuItem;
        if (!currentParent || !currentParent.items) return;
        currentItems = currentParent.items;
      }
      
      // Находим индекс элемента
      const itemIndex = currentItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1 || itemIndex >= currentItems.length - 1) return; // Элемент уже последний или не найден
      
      // Меняем местами со следующим элементом
      const temp = currentItems[itemIndex];
      currentItems[itemIndex] = currentItems[itemIndex + 1];
      currentItems[itemIndex + 1] = temp;
      
      // Обновляем порядок
      currentItems.forEach((item, index) => {
        item.order = index;
      });
      } else {
      // Элемент находится непосредственно в категории
      const itemIndex = category.items.findIndex(item => item.id === itemId);
      if (itemIndex === -1 || itemIndex >= category.items.length - 1) return; // Элемент уже последний или не найден
      
      // Меняем местами со следующим элементом
      const temp = category.items[itemIndex];
      category.items[itemIndex] = category.items[itemIndex + 1];
      category.items[itemIndex + 1] = temp;
      
      // Обновляем порядок
      category.items.forEach((item, index) => {
        item.order = index;
      });
    }
    
    await saveMenu(newMenu);
  };
  
  const moveCategoryUp = async (categoryId: string) => {
    const newMenu = [...menu];
    const categoryIndex = newMenu.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex <= 0) return; // Категория уже первая или не найдена
    
    // Меняем местами с предыдущей категорией
    const temp = newMenu[categoryIndex];
    newMenu[categoryIndex] = newMenu[categoryIndex - 1];
    newMenu[categoryIndex - 1] = temp;
    
    // Обновляем порядок
    newMenu.forEach((category, index) => {
      category.order = index;
    });
    
    await saveMenu(newMenu);
  };
  
  const moveCategoryDown = async (categoryId: string) => {
    const newMenu = [...menu];
    const categoryIndex = newMenu.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1 || categoryIndex >= newMenu.length - 1) return; // Категория уже последняя или не найдена
    
    // Меняем местами со следующей категорией
    const temp = newMenu[categoryIndex];
    newMenu[categoryIndex] = newMenu[categoryIndex + 1];
    newMenu[categoryIndex + 1] = temp;
    
    // Обновляем порядок
    newMenu.forEach((category, index) => {
      category.order = index;
    });
    
    await saveMenu(newMenu);
  };

  // Функции для работы с UI
  const toggleItemVisibility = async (
    categoryId: string,
    itemId: string,
    parentPath: string[] = []
  ) => {
    const { item } = menuService.findItemAndParent(menu, itemId, parentPath);
    if (item) {
      await updateItem(
        categoryId,
        itemId,
        parentPath,
        { isVisible: !item.isVisible }
      );
    }
  };

  const duplicateItem = async (
    categoryId: string,
    itemId: string,
    parentPath: string[] = []
  ) => {
    const { item } = menuService.findItemAndParent(menu, itemId, parentPath);
    if (!item) return;

    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
      name: `${item.name} (копия)`,
      slug: menuService.generateSlug(`${item.name} (копия)`),
      lastModified: new Date().toISOString()
    };

    const newMenu = menu.map(cat => {
      if (cat.id !== categoryId) return cat;

      let items = cat.items;
      if (parentPath.length > 0) {
        items = addItemToPath(items, parentPath, newItem);
      } else {
        items = [...items, newItem];
      }

      return { ...cat, items };
    });

    await saveMenu(newMenu);
  };

  const navigateToItem = (item: MenuItem, categoryId: string, parentPath: string[] = []) => {
    // Формируем хлебные крошки
    const newBreadcrumbs = generateBreadcrumbs(categoryId, parentPath);
    setBreadcrumbs(newBreadcrumbs);
    
    setSelectedItem({ item, categoryId, parentPath });
    
      if (item.isSubcategory) {
      setExpandedItems(prev =>
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    }
  };
  
  // Вспомогательная функция для генерации хлебных крошек
  const generateBreadcrumbs = (categoryId: string, parentPath: string[] = []): Array<{id: string; name: string; categoryId?: string}> => {
    const breadcrumbs = [];
    const category = menu.find(cat => cat.id === categoryId);
    
    if (category) {
      breadcrumbs.push({ id: category.id, name: category.name });
    }

    if (parentPath.length > 0) {
      let currentItems = category?.items || [];
      for (const pathId of parentPath) {
        const pathItem = currentItems.find(item => item.id === pathId);
        if (pathItem && pathItem.isSubcategory) {
          breadcrumbs.push({ id: pathItem.id, name: pathItem.name, categoryId });
          currentItems = pathItem.items || [];
        }
      }
    }
    
    return breadcrumbs;
  };

  // Функция для открытия модального окна выбора категории
  const openCategorySelector = (isSubcategory: boolean = false) => {
    setPendingNewItem({ isSubcategory });
    setShowCategorySelector(true);
  };
  
  // Функция для открытия модального окна выбора подкатегории
  const openSubcategorySelector = (categoryId: string, parentPath: string[] = []) => {
    addItem(categoryId, parentPath, false);
  };

  // Обновляем кнопку "Добавить блюдо" в верхней части
  const handleAddNewItem = () => {
    if (menu.length === 0) {
      // Если нет категорий, сначала создаем категорию
      setShowCategoryForm(true);
      setNewCategoryName('Новая категория');
            } else {
      openCategorySelector(false);
    }
  };
  
  // Функция для отмены добавления нового элемента
  const cancelAddItem = () => {
    if (pendingNewItem?.tempId && selectedItem) {
      // Удаляем временно созданный элемент
      deleteItem(selectedItem.categoryId, selectedItem.item.id, selectedItem.parentPath);
    }
    setSelectedItem(null);
    setPendingNewItem(null);
  };

  if (isLoading) {
        return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        );
      }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-hidden flex flex-col md:flex-row">
      {/* Боковая панель */}
      <div 
        className="bg-[#111111] border-b md:border-r border-[#E6B980] p-4 md:p-6 md:fixed md:left-0 md:top-0 md:h-screen md:overflow-y-auto md:z-10 md:w-[600px] w-full"
      >
        {/* Содержимое боковой панели */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-lg md:text-xl font-medium tracking-wide text-white/90">
            Управление меню
          </h1>
          <div className="flex items-center space-x-2">
          <Link href="/">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="На главную">
                <XMarkIcon className="w-5 h-5 text-white/60" />
            </button>
          </Link>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
            <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
              Структура меню
            </h2>
            <div className="flex flex-wrap gap-2">
                      <button
                onClick={handleAddNewItem}
                className="p-2 rounded-lg bg-[#E6B980]/20 hover:bg-[#E6B980]/30 transition-colors text-[#E6B980] hover:text-white flex items-center space-x-2"
                title="Добавить новое блюдо"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Добавить блюдо</span>
                      </button>
                        <button
                onClick={addCategory}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white/90 flex items-center space-x-2"
                title="Добавить категорию"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Добавить категорию</span>
                        </button>
                      </div>
                    </div>

          <MenuTree
            menu={menu}
            onItemSelect={navigateToItem}
            onItemMove={moveItem}
            onAddItem={addItem}
            onDeleteItem={deleteItem}
            onDuplicate={duplicateItem}
            onToggleVisibility={toggleItemVisibility}
            onDeleteCategory={deleteCategory}
            onEditCategory={editCategory}
            moveItemUp={moveItemUp}
            moveItemDown={moveItemDown}
            moveCategoryUp={moveCategoryUp}
            moveCategoryDown={moveCategoryDown}
            expandedItems={expandedItems}
            onExpandItem={(itemId) => setExpandedItems(prev =>
              prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
            )}
            filterType="all"
            searchQuery=""
            sortType="order"
          />
                  </div>
      </div>

      {/* Основной контент */}
      <div 
        className="p-4 md:p-8 md:ml-[600px] w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            )}
            </div>
          <Link href="/">
            <button className="flex items-center space-x-2 px-4 py-2 bg-[#E6B980]/10 hover:bg-[#E6B980]/20 text-[#E6B980] rounded-lg transition-colors">
              <span>На главную</span>
            </button>
          </Link>
          </div>

        <div className="bg-[#111111] rounded-2xl border border-white/5 p-4 md:p-6">
          {selectedItem ? (
                  <div>
              <Breadcrumbs
                items={breadcrumbs}
                onNavigate={(index) => {
                  if (index === 0) {
                    setSelectedItem(null);
                    setBreadcrumbs([]);
                  } else {
                    const item = menu
                      .find(cat => cat.id === breadcrumbs[index].categoryId)
                      ?.items.find(item => item.id === breadcrumbs[index].id);
                    if (item) {
                      navigateToItem(
                        item,
                        breadcrumbs[index].categoryId!,
                        breadcrumbs
                          .slice(1, index)
                          .map(bc => bc.id)
                      );
                    }
                  }
                }}
              />
                  </div>
          ) : (
            <div className="h-[300px] md:h-[400px] flex items-center justify-center text-white/40">
              <div className="text-center">
                <ArrowPathIcon className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 opacity-40" />
                <p>Выберите элемент для редактирования</p>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Модальное окно редактирования блюда для всех устройств */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-xl border border-white/10 p-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <Breadcrumbs
                items={breadcrumbs}
                onNavigate={(index) => {
                  if (index === 0) {
                    setSelectedItem(null);
                    setBreadcrumbs([]);
                  } else {
                    const item = menu
                      .find(cat => cat.id === breadcrumbs[index].categoryId)
                      ?.items.find(item => item.id === breadcrumbs[index].id);
                    if (item) {
                      navigateToItem(
                        item,
                        breadcrumbs[index].categoryId!,
                        breadcrumbs
                          .slice(1, index)
                          .map(bc => bc.id)
                      );
                    }
                  }
                }}
              />
              <button
                onClick={cancelAddItem}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Закрыть"
              >
                <XMarkIcon className="w-5 h-5 text-white/60" />
                </button>
              </div>
            <ItemEditForm
              item={selectedItem.item}
              onSave={(updates) => {
                if (selectedItem.categoryId) {
                  updateItem(
                    selectedItem.categoryId,
                    selectedItem.item.id,
                    selectedItem.parentPath,
                    updates
                  ).then(() => {
                    // Закрываем форму редактирования после сохранения
                    setSelectedItem(null);
                    setPendingNewItem(null);
                    setBreadcrumbs([]);
                              });
                            }
                          }}
              onCancel={cancelAddItem}
                            />
                          </div>
                      </div>
      )}

      {/* Модальное окно выбора категории */}
      {showCategorySelector && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-xl border border-white/10 p-4 md:p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white/90">
                Выберите категорию для {pendingNewItem?.isSubcategory ? 'подкатегории' : 'блюда'}
              </h3>
                  <button
                    onClick={() => {
                  setShowCategorySelector(false);
                  setPendingNewItem(null);
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Закрыть"
              >
                <XMarkIcon className="w-5 h-5 text-white/60" />
                  </button>
            </div>
            <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto space-y-2 mb-4">
              {menu.map(category => (
                <div key={category.id} className="space-y-1">
                  <button
                    onClick={() => {
                      if (pendingNewItem) {
                        addItem(category.id, [], pendingNewItem.isSubcategory);
                        setShowCategorySelector(false);
                        setPendingNewItem(null);
                      }
                    }}
                    className="w-full text-left p-3 rounded-lg bg-[#E6B980]/10 hover:bg-[#E6B980]/20 transition-colors flex items-center justify-between"
                  >
                    <span className="text-[#E6B980] font-medium">{category.name}</span>
                    <PlusIcon className="w-5 h-5 text-[#E6B980]" />
                  </button>
                  
                  {/* Отображаем подкатегории, если они есть */}
                  {category.items.filter(item => item.isSubcategory).length > 0 && (
                    <div className="pl-4 space-y-1 mt-1 border-l border-[#E6B980]/20 ml-2">
                      {category.items
                        .filter(item => item.isSubcategory)
                        .map(subcategory => (
                          <div key={subcategory.id}>
                <button
                  onClick={() => {
                                if (pendingNewItem) {
                                  addItem(category.id, [subcategory.id], pendingNewItem.isSubcategory);
                                  setShowCategorySelector(false);
                                  setPendingNewItem(null);
                                }
                              }}
                              className="w-full text-left p-2.5 rounded-lg bg-[#111111] border border-[#E6B980]/30 hover:bg-[#1a1a1a] transition-colors flex items-center justify-between"
                            >
                              <span className="text-[#E6B980]/80 font-medium">{subcategory.name}</span>
                              <PlusIcon className="w-4 h-4 text-[#E6B980]/80" />
                </button>
                            
                            {/* Рекурсивно отображаем вложенные подкатегории */}
                            {subcategory.items && subcategory.items.filter(item => item.isSubcategory).length > 0 && (
                              <div className="pl-4 space-y-1 mt-1 border-l border-[#E6B980]/20 ml-2">
                                {subcategory.items
                                  .filter(item => item.isSubcategory)
                                  .map(nestedSubcategory => (
                                    <RenderNestedSubcategories 
                                      key={nestedSubcategory.id}
                                      subcategory={nestedSubcategory}
                                      categoryId={category.id}
                                      parentPath={[subcategory.id]}
                                      pendingNewItem={pendingNewItem}
                                      onSelect={(path) => {
                                        if (pendingNewItem) {
                                          addItem(category.id, path, pendingNewItem.isSubcategory);
                                          setShowCategorySelector(false);
                                          setPendingNewItem(null);
                                        }
                                      }}
                                    />
                                  ))}
                        </div>
                      )}
                    </div>
                        ))}
                      </div>
                  )}
                      </div>
              ))}
                      </div>
            <div className="flex justify-end">
                  <button
                    onClick={() => {
                  setShowCategorySelector(false);
                  setPendingNewItem(null);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/[0.15] text-sm text-white rounded-lg transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
      )}
      
      {/* Модальное окно создания новой категории */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-xl border border-white/10 p-4 md:p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-white/90 mb-4">
              Создание новой категории
              </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/60 mb-2">
                Название категории
              </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
                  autoFocus
                />
            </div>
            <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                  setShowCategoryForm(false);
                      setNewCategoryName('');
                    }}
                className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Отмена
                  </button>
                <button
                onClick={() => createCategory(newCategoryName)}
                className="px-4 py-2 bg-white/10 hover:bg-white/[0.15] text-sm text-white rounded-lg transition-colors"
                disabled={!newCategoryName.trim()}
              >
                Создать
                </button>
              </div>
                </div>
        </div>
      )}
      
      {/* Модальное окно редактирования категории */}
      {editingCategoryId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-xl border border-white/10 p-4 md:p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-white/90 mb-4">
              Редактирование категории
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/60 mb-2">
                Название категории
                  </label>
                  <input
                    type="text"
                value={editingCategoryName}
                onChange={(e) => setEditingCategoryName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
                    autoFocus
                  />
                </div>
            <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                  setEditingCategoryId(null);
                  setEditingCategoryName('');
                    }}
                className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                onClick={() => updateCategory(editingCategoryId, { name: editingCategoryName })}
                className="px-4 py-2 bg-white/10 hover:bg-white/[0.15] text-sm text-white rounded-lg transition-colors"
                disabled={!editingCategoryName.trim()}
              >
                Сохранить
                  </button>
                </div>
              </div>
            </div>
      )}
    </div>
  );
}

// Добавляем компонент для рекурсивного отображения вложенных подкатегорий
const RenderNestedSubcategories = ({ 
  subcategory, 
  categoryId, 
  parentPath, 
  pendingNewItem,
  onSelect 
}: { 
  subcategory: MenuItem; 
  categoryId: string; 
  parentPath: string[];
  pendingNewItem: { isSubcategory: boolean; tempId?: string } | null;
  onSelect: (path: string[]) => void;
}) => {
  const currentPath = [...parentPath, subcategory.id];
  
  return (
    <div>
                  <button
        onClick={() => onSelect(currentPath)}
        className="w-full text-left p-2 rounded-lg bg-[#0a0a0a] border border-[#E6B980]/20 hover:bg-[#151515] transition-colors flex items-center justify-between"
                  >
        <span className="text-[#E6B980]/70 font-medium">{subcategory.name}</span>
        <PlusIcon className="w-4 h-4 text-[#E6B980]/70" />
                  </button>
      
      {subcategory.items && subcategory.items.filter(item => item.isSubcategory).length > 0 && (
        <div className="pl-4 space-y-1 mt-1 border-l border-[#E6B980]/20 ml-2">
          {subcategory.items
            .filter(item => item.isSubcategory)
            .map(nestedSubcategory => (
              <RenderNestedSubcategories 
                key={nestedSubcategory.id}
                subcategory={nestedSubcategory}
                categoryId={categoryId}
                parentPath={currentPath}
                pendingNewItem={pendingNewItem}
                onSelect={onSelect}
              />
            ))}
                </div>
      )}
    </div>
  );
}; 