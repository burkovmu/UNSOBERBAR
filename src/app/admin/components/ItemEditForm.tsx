import { useState, useRef } from 'react';
import Image from 'next/image';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { MenuItem } from '@/types/menu';
import { menuService } from '@/services/menuService';

interface ItemEditFormProps {
  item: MenuItem;
  onSave: (updates: Partial<MenuItem>) => void;
  onCancel: () => void;
}

export const ItemEditForm: React.FC<ItemEditFormProps> = ({
  item,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<MenuItem>({
    ...item,
    nutrition: item.nutrition || { calories: 0, protein: 0, fats: 0, carbs: 0 }
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const imageUrl = await menuService.uploadImage(file);
      setFormData({ ...formData, image: imageUrl });
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h2 className="text-base md:text-lg font-medium text-white/90">
          {item.isSubcategory ? 'Редактирование подкатегории' : 'Редактирование блюда'}
        </h2>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-white/60 mb-1">
              Название
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
            />
          </div>

          {!item.isSubcategory && (
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/60 mb-1">
                Цена
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
              />
            </div>
          )}
        </div>

        {!item.isSubcategory && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-white/60 mb-1">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors min-h-[60px] md:min-h-[80px] resize-none"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="block text-xs md:text-sm font-medium text-white/60 mb-1">
                  Изображение
                </label>
                <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                  {formData.image ? (
                    <div className="relative group">
                      <Image
                        src={formData.image}
                        alt={formData.name || ''}
                        width={70}
                        height={70}
                        className="rounded-lg object-cover w-[70px] h-[70px] md:w-[80px] md:h-[80px]"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-[70px] h-[70px] md:w-[80px] md:h-[80px] flex items-center justify-center border border-dashed border-white/10 rounded-lg cursor-pointer hover:border-white/20 transition-colors bg-white/[0.02]"
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white/60" />
                      ) : (
                        <PlusIcon className="w-5 h-5 text-white/40" />
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-white/60 mb-1">
                  Вес/Объем
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-medium text-white/60 mb-1">
                  Видимость
                </label>
                <select
                  value={formData.isVisible === false ? "false" : "true"}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    isVisible: e.target.value === "true" ? true : false 
                  })}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
                >
                  <option value="true">Видимый</option>
                  <option value="false">Скрытый</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-white/60 mb-1">
                Пищевая ценность
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Калории
                  </label>
                  <input
                    type="number"
                    value={formData.nutrition?.calories}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutrition: { ...formData.nutrition!, calories: parseInt(e.target.value) }
                    })}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Белки
                  </label>
                  <input
                    type="number"
                    value={formData.nutrition?.protein}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutrition: { ...formData.nutrition!, protein: parseInt(e.target.value) }
                    })}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Жиры
                  </label>
                  <input
                    type="number"
                    value={formData.nutrition?.fats}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutrition: { ...formData.nutrition!, fats: parseInt(e.target.value) }
                    })}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Углеводы
                  </label>
                  <input
                    type="number"
                    value={formData.nutrition?.carbs}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutrition: { ...formData.nutrition!, carbs: parseInt(e.target.value) }
                    })}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        
        {item.isSubcategory && (
          <div>
            <label className="block text-xs md:text-sm font-medium text-white/60 mb-1">
              Видимость
            </label>
            <select
              value={formData.isVisible === false ? "false" : "true"}
              onChange={(e) => setFormData({ 
                ...formData, 
                isVisible: e.target.value === "true" ? true : false 
              })}
              className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors"
            >
              <option value="true">Видимая</option>
              <option value="false">Скрытая</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-3 md:pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 md:px-4 py-1.5 md:py-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-3 md:px-4 py-1.5 md:py-2 bg-white/10 hover:bg-white/[0.15] text-sm text-white rounded-lg transition-colors"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}; 