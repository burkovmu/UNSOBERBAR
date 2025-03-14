import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDownIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  HomeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { MenuItem, MenuCategory, DragItem, FilterType, SortType } from '@/types/menu';

interface MenuTreeProps {
  menu: MenuCategory[];
  onItemSelect: (item: MenuItem, categoryId: string, parentPath?: string[]) => void;
  onItemMove: (draggedItem: DragItem, targetItem: DragItem) => void;
  onAddItem: (categoryId: string, parentPath?: string[], isSubcategory?: boolean) => void;
  onDeleteItem: (categoryId: string, itemId: string, parentPath?: string[]) => void;
  onDuplicate: (categoryId: string, itemId: string, parentPath?: string[]) => void;
  onToggleVisibility: (categoryId: string, itemId: string, parentPath?: string[]) => void;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
  moveItemUp: (categoryId: string, itemId: string, parentPath?: string[]) => void;
  moveItemDown: (categoryId: string, itemId: string, parentPath?: string[]) => void;
  moveCategoryUp: (categoryId: string) => void;
  moveCategoryDown: (categoryId: string) => void;
  expandedItems: string[];
  onExpandItem: (itemId: string) => void;
  filterType: FilterType;
  searchQuery: string;
  sortType: SortType;
}

export const MenuTree: React.FC<MenuTreeProps> = ({
  menu,
  onItemSelect,
  onItemMove,
  onAddItem,
  onDeleteItem,
  onDuplicate,
  onToggleVisibility,
  onDeleteCategory,
  onEditCategory,
  moveItemUp,
  moveItemDown,
  moveCategoryUp,
  moveCategoryDown,
  expandedItems,
  onExpandItem,
  filterType,
  searchQuery,
  sortType
}) => {
  // Состояние для отслеживания развернутых категорий
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  const toggleExpand = (itemId: string) => {
    onExpandItem(itemId);
  };
  
  // Функция для переключения состояния категории (свернута/развернута)
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };
  
  // Функция для подсчета количества блюд в категории (включая подкатегории)
  const countItems = (items: MenuItem[]): number => {
    return items.reduce((count, item) => {
      if (item.isSubcategory && item.items) {
        return count + countItems(item.items);
      }
      return count + 1;
    }, 0);
  };

  // Фильтрация и сортировка меню
  const filteredMenu = menu
    .filter(category => {
      if (searchQuery) {
        return category.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (filterType === 'categories') return true;
      if (filterType === 'hidden') return !category.isVisible;
      return true;
    })
    .sort((a, b) => {
      if (sortType === 'name') return a.name.localeCompare(b.name);
      if (sortType === 'date') {
        if (!a.lastModified || !b.lastModified) return 0;
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
      return (a.order || 0) - (b.order || 0);
    });

  const renderItem = (item: MenuItem, categoryId: string, parentPath: string[] = [], level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasSubItems = item.isSubcategory && item.items && item.items.length > 0;
    const currentPath = [...parentPath, item.id];

    // Фильтрация элементов
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      if (!hasSubItems) return null;
      
      // Для подкатегорий проверяем, есть ли в них подходящие элементы
      const hasMatchingChildren = item.items?.some(subItem => 
        subItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (subItem.isSubcategory && subItem.items?.some(i => 
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
      
      if (!hasMatchingChildren) return null;
    }

    if (filterType === 'categories' && !item.isSubcategory) return null;
    if (filterType === 'items' && item.isSubcategory) return null;
    if (filterType === 'hidden' && item.isVisible) return null;

    // Сортировка элементов
    const sortedItems = item.items ? [...item.items].sort((a, b) => {
      if (sortType === 'name') return a.name.localeCompare(b.name);
      if (sortType === 'date') {
        if (!a.lastModified || !b.lastModified) return 0;
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
      return (a.order || 0) - (b.order || 0);
    }) : [];

    return (
      <div
        key={item.id}
        className="relative"
      >
        <div
          className={`group flex items-center space-x-2 px-3 md:px-4 py-2 cursor-pointer rounded-lg transition-all
            ${item.isSubcategory 
              ? 'bg-[#111111] border border-[#E6B980]/30 hover:bg-[#1a1a1a]' 
              : 'hover:bg-white/5'
            } ${!item.isVisible ? 'opacity-50' : ''}`}
          style={{ marginLeft: `${level * 1}rem` }}
        >
          <div className="flex-1 flex items-center min-w-0 space-x-2">
            {hasSubItems && (
              <motion.button
                onClick={() => toggleExpand(item.id)}
                initial={false}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4 text-white/40 hover:text-white/60 transition-colors flex-shrink-0"
              >
                <ChevronDownIcon className="w-4 h-4" />
              </motion.button>
            )}
            <span
              className={`truncate ${item.isSubcategory 
                ? 'text-[#E6B980]/80 font-medium' 
                : 'text-white/70'} group-hover:text-white transition-colors text-sm md:text-base`}
              onClick={() => {
                if (item.isSubcategory) {
                  toggleExpand(item.id);
                } else {
                  onItemSelect(item, categoryId, parentPath);
                }
              }}
            >
              {item.name}
            </span>
            {!item.isSubcategory && item.price && (
              <span className="text-xs md:text-sm text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0">{item.price}</span>
            )}
            {item.isSubcategory && (
              <span className="text-xs md:text-sm text-white/40 group-hover:text-white/60 transition-colors ml-1 md:ml-2 flex-shrink-0">
                {item.items ? countItems(item.items) : 0}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveItemUp(categoryId, item.id, parentPath);
              }}
              className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              title="Переместить вверх"
            >
              <ArrowUpIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveItemDown(categoryId, item.id, parentPath);
              }}
              className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              title="Переместить вниз"
            >
              <ArrowDownIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onItemSelect(item, categoryId, parentPath);
              }}
              className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              title="Редактировать"
            >
              <PencilIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            {item.isSubcategory && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddItem(categoryId, parentPath.concat(item.id), true);
                }}
                className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                title="Добавить подкатегорию"
              >
                <PlusIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(categoryId, item.id, parentPath);
              }}
              className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              title={item.isVisible ? "Скрыть" : "Показать"}
            >
              {item.isVisible ? (
                <EyeIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              ) : (
                <EyeSlashIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(categoryId, item.id, parentPath);
              }}
              className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              title="Дублировать"
            >
              <DocumentDuplicateIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(categoryId, item.id, parentPath);
              }}
              className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-red-400"
              title="Удалить"
            >
              <TrashIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </div>

        {hasSubItems && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-3 md:pl-4 border-l border-[#E6B980]/20 ml-4 md:ml-6 mt-1 space-y-0.5"
          >
            {sortedItems.map((subItem) =>
              renderItem(subItem, categoryId, currentPath, level + 1)
            )}
            <button
              onClick={() => onAddItem(categoryId, currentPath, false)}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 text-white/40 hover:text-white/60 transition-colors text-xs md:text-sm"
            >
              <PlusIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Добавить элемент</span>
            </button>
          </motion.div>
        )}

        {item.isSubcategory && !hasSubItems && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-3 md:pl-4 border-l border-[#E6B980]/20 ml-4 md:ml-6 mt-1 space-y-0.5"
          >
            <button
              onClick={() => onAddItem(categoryId, currentPath, false)}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 text-white/40 hover:text-white/60 transition-colors text-xs md:text-sm"
            >
              <PlusIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Добавить элемент</span>
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {filteredMenu.map((category, categoryIndex) => {
        const itemCount = countItems(category.items);
        const isCategoryExpanded = expandedCategories.includes(category.id);
        
        return (
          <div 
            key={category.id} 
            className="space-y-1 mb-3"
          >
            <div 
              className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 rounded-lg bg-[#E6B980]/10 border border-[#E6B980]/20 hover:bg-[#E6B980]/20 transition-colors group cursor-pointer"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  initial={false}
                  animate={{ rotate: isCategoryExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0"
                >
                  <ChevronDownIcon className="w-4 h-4" />
                </motion.div>
                <span className="font-medium text-[#E6B980] group-hover:text-white transition-colors text-sm md:text-base truncate">{category.name}</span>
                <span className="text-xs md:text-sm text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0">
                  {itemCount}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveCategoryUp(category.id);
                  }}
                  className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  title="Переместить категорию вверх"
                  disabled={categoryIndex === 0}
                >
                  <ArrowUpIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveCategoryDown(category.id);
                  }}
                  className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  title="Переместить категорию вниз"
                  disabled={categoryIndex === filteredMenu.length - 1}
                >
                  <ArrowDownIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(category.id);
                  }}
                  className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  title="Редактировать категорию"
                >
                  <PencilIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddItem(category.id, [], true);
                  }}
                  className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  title="Добавить подкатегорию"
                >
                  <PlusIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(category.id);
                  }}
                  className="p-1 md:p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-red-400"
                  title="Удалить категорию"
                >
                  <TrashIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
            {isCategoryExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5 pl-2 border-l-2 border-[#E6B980]/20 ml-2"
              >
                {category.items.map((item) => renderItem(item, category.id))}
                <button
                  onClick={() => onAddItem(category.id, [], false)}
                  className="flex items-center space-x-2 px-3 md:px-4 py-2 text-white/40 hover:text-white/60 transition-colors text-xs md:text-sm"
                >
                  <PlusIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>Добавить элемент</span>
                </button>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 