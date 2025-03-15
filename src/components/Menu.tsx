'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { menuService } from '@/services/menuService';
import { MenuItem as MenuItemType, MenuCategory as MenuCategoryType } from '@/types/menu';

interface MenuItem {
  name: string;
  price: string;
  description: string;
  image: string;
  nutrition: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
  };
  weight?: string;
  isSubcategory?: boolean;
  level?: number;
  items?: MenuItem[];
  isVisible?: boolean;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

// Функция для конвертации нового формата в старый
const convertToOldFormat = (newMenu: MenuCategoryType[]): MenuCategory[] => {
  // Фильтруем только видимые категории
  return newMenu
    .filter(category => category.isVisible !== false)
    .map(category => ({
      category: category.name,
      items: convertItems(category.items)
    }));
};

const convertItems = (items: MenuItemType[]): MenuItem[] => {
  // Фильтруем только видимые элементы
  return items
    .filter(item => item.isVisible !== false)
    .map(item => ({
      name: item.name,
      price: item.price || '',
      description: item.description || '',
      image: item.image || '',
      nutrition: item.nutrition || { calories: 0, protein: 0, fats: 0, carbs: 0 },
      weight: item.weight,
      isSubcategory: item.isSubcategory,
      isVisible: item.isVisible,
      items: item.items ? convertItems(item.items) : undefined
    }));
};

export const menuItems: MenuCategory[] = [
  {
    category: "Устрицы и Икра",
    items: [
      {
        name: "Устрицы",
        price: "2400₽",
        description: "3 шт.",
        image: "https://mt.delivery/img/img/Articles/17/1.jpg",
        nutrition: { calories: 44, protein: 5, fats: 2, carbs: 3 },
        weight: "3 шт."
      },
      {
        name: "Устрицы «Рокфеллер»",
        price: "2900₽",
        description: "3 шт.",
        image: "https://i.pinimg.com/originals/75/90/25/7590253c091d56e85261949854ef3bc7.jpg",
        nutrition: { calories: 120, protein: 8, fats: 8, carbs: 4 },
        weight: "3 шт."
      },
      {
        name: "Икра Щуки",
        price: "1500₽",
        description: "Свежая икра щуки с тостами",
        image: "https://sun9-15.userapi.com/impg/xLcYYZddUU_GJqqWhf6hrtx3lmCyhLjLILtTlQ/5bRYlYFZMcw.jpg?size=1039x960&quality=95&sign=ad8fb04f36c5351c4022e93b9c56d342&c_uniq_tag=mT_Ovd9chlpyKWG7TyKPrzOZ-ViBrgvqLKHjS2cUGf4&type=album",
        nutrition: { calories: 230, protein: 25, fats: 15, carbs: 1 },
        weight: "50 г"
      },
      {
        name: "Икра Осётра",
        price: "9500₽",
        description: "Премиальная осетровая икра",
        image: "https://iy.kommersant.ru/Issues.photo/REGIONS/PITER_TEMA/2013/172M/KSP_009864_00423_2_t218.jpg",
        nutrition: { calories: 264, protein: 26, fats: 18, carbs: 0 },
        weight: "50 г"
      },
      {
        name: "Икра Лосося",
        price: "1500₽",
        description: "Икра лосося с традиционными гарнирами",
        image: "https://frost-fish.ru/upload/medialibrary/5d0/5d044199890c2c1bc1660f5bc6771699.jpg",
        nutrition: { calories: 250, protein: 24, fats: 16, carbs: 1 },
        weight: "50 г"
      }
    ]
  },
  {
    category: "Мини-закуски",
    items: [
      {
        name: "Тартар на таллинском хлебе",
        price: "1600₽",
        description: "Говядина «Матрёшка», сливочный хрен, икра щуки",
        image: "https://avatars.mds.yandex.net/get-altay/2433982/2a00000174d8ece616c54d4dfe83e2666647/XXL",
        nutrition: { calories: 320, protein: 28, fats: 22, carbs: 12 },
        weight: "180 г"
      },
      {
        name: "Сибирские грузди",
        price: "1200₽",
        description: "Сметана, лук",
        image: "https://irk.restcafe.ru/uploads/irk.restcafe.ru/photos/3046/menu/dish_36479.jpg",
        nutrition: { calories: 180, protein: 4, fats: 15, carbs: 8 },
        weight: "150 г"
      },
      {
        name: "Сало Белорусское",
        price: "700₽",
        description: "Горчица, гренки",
        image: "https://sun9-74.userapi.com/impg/39Ugb8lXktMScJ9nQKXeg-LvGNkEaxXwx8S_iQ/6mgTKq52pdc.jpg?size=907x600&quality=96&sign=4de62cc5a39bc4396c649ac9fad14a38&c_uniq_tag=v0HwQ7wWG6HwaabWg_Yix0CuiYePuvG5kfe2B90Vr58&type=album",
        nutrition: { calories: 450, protein: 12, fats: 42, carbs: 6 },
        weight: "120 г"
      },
      {
        name: "Закуска a la Russe",
        price: "1600₽",
        description: "Маринованные томаты, малосольные огурцы, шпроты, селёдка с подсолнечным маслом, вяленая оленина, сало",
        image: "https://avatars.mds.yandex.net/i?id=1ae9d08a4084abe3248b0f764fc2a071_l-8307637-images-thumbs&n=13",
        nutrition: { calories: 480, protein: 25, fats: 38, carbs: 14 },
        weight: "350 г"
      }
    ]
  },
  {
    category: "Закуски",
    items: [
      {
        name: "Запечённый камамбер",
        price: "1600₽",
        description: "Трюфель, печёный виноград, розмарин, кленовый сироп",
        image: "https://images.unsplash.com/photo-1634487359989-3e90c9432133?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 420, protein: 18, fats: 35, carbs: 12 },
        weight: "220 г"
      },
      {
        name: "Обожжённый лосось «kiluvurst»",
        price: "2100₽",
        description: "Гриль-лук, ряженка, огурец, зелёное яблоко",
        image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 380, protein: 32, fats: 24, carbs: 8 },
        weight: "240 г"
      },
      {
        name: "Сугудай из муксуна",
        price: "1900₽",
        description: "Икра щуки, молодой картофель с укропом, настойка «Шмаковка»",
        image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 290, protein: 26, fats: 18, carbs: 10 },
        weight: "180 г"
      }
    ]
  },
  {
    category: "Салаты",
    items: [
      {
        name: "«Много овощей»",
        price: "990₽",
        description: "Гуакамоле, ассорти сезонных овощей, семечки, масло «TRAWA»",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 280, protein: 8, fats: 22, carbs: 16 },
        weight: "320 г"
      },
      {
        name: "Буррата с айвой и томатами",
        price: "1300₽",
        description: "Мизуна, малиновая эспума, трюфель, оливковое масло",
        image: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 350, protein: 14, fats: 28, carbs: 12 },
        weight: "280 г"
      },
      {
        name: "«Мимоза»",
        price: "1500₽",
        description: "Копчёный кижуч, осетровая икра",
        image: "https://sun9-76.userapi.com/impg/urlnG_KB8YXkf7vzp5cyHw2OxbSOFLi_FoTXgw/ePJSmPNy_4s.jpg?size=980x980&quality=95&sign=482cb164bd19c03b3ddee4e073bc0959&c_uniq_tag=c8X3tC9EkBr1zSpa04ZYWsyzLD8mXcEYt2edVzIwadU&type=album",
        nutrition: { calories: 320, protein: 22, fats: 24, carbs: 8 },
        weight: "260 г"
      }
    ]
  },
  {
    category: "Супы",
    items: [
      {
        name: "Борщ",
        price: "1100₽",
        description: "Утка, вишня, сметана",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 380, protein: 22, fats: 24, carbs: 28 },
        weight: "400 мл"
      },
      {
        name: "Томатный с рыбой и морепродуктами",
        price: "1650₽",
        description: "Бриошь, сливочный крем, икра",
        image: "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 320, protein: 24, fats: 18, carbs: 22 },
        weight: "380 мл"
      },
      {
        name: "Щи из кислой капусты",
        price: "1350₽",
        description: "Бычьи хвосты, белые грибы, брусника",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 340, protein: 26, fats: 20, carbs: 18 },
        weight: "400 мл"
      }
    ]
  },
  {
    category: "Горячие закуски",
    items: [
      {
        name: "Морской гребешок",
        price: "2100₽",
        description: "Крем из батата, соус умами, чипсы из водорослей",
        image: "https://i.pinimg.com/originals/42/4a/99/424a99f8abf2860e74fe0c9c1841d4a8.jpg",
        nutrition: { calories: 340, protein: 28, fats: 18, carbs: 22 },
        weight: "180 г"
      },
      {
        name: "Краб",
        price: "2300₽",
        description: "Пикантные томаты, сабайон с шафраном",
        image: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 280, protein: 26, fats: 16, carbs: 12 },
        weight: "160 г"
      },
      {
        name: "Пельмени с грибами",
        price: "1750₽",
        description: "Сезонные грибы, трюфель, сливочный грибной соус",
        image: "https://eda.yandex/images/1368744/69710f0f57edc0c60c6f0763a5f88ba5-1100x825.jpg",
        nutrition: { calories: 420, protein: 18, fats: 28, carbs: 36 },
        weight: "250 г"
      }
    ]
  },
  {
    category: "Горячие блюда",
    items: [
      {
        name: "Лосось-конфи",
        price: "2400₽",
        description: "Перлотто с молодой свёклой, соус с мидиями",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 460, protein: 38, fats: 28, carbs: 22 },
        weight: "320 г"
      },
      {
        name: "Сибас",
        price: "1950₽",
        description: "Филе на пару, зелёный горошек, лайм, огурцы, соус с лимонником",
        image: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 380, protein: 42, fats: 18, carbs: 12 },
        weight: "300 г"
      },
      {
        name: "Котлета из щуки и судака",
        price: "1900₽",
        description: "Цветок цукини, брокколи, желток конфи, соус с икрой",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 420, protein: 38, fats: 24, carbs: 16 },
        weight: "280 г"
      }
    ]
  },
  {
    category: "Десерты",
    items: [
      {
        name: "Медовик",
        price: "650₽",
        description: "Классический медовый торт с кремом",
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 380, protein: 6, fats: 18, carbs: 48 },
        weight: "150 г"
      },
      {
        name: "Наполеон",
        price: "650₽",
        description: "Традиционный слоёный торт с заварным кремом",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 420, protein: 8, fats: 22, carbs: 52 },
        weight: "180 г"
      },
      {
        name: "Птичье молоко",
        price: "650₽",
        description: "Нежное суфле в шоколадной глазури",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 350, protein: 5, fats: 16, carbs: 46 },
        weight: "130 г"
      }
    ]
  },
  {
    category: "Чай",
    items: [
      {
        name: "Те Гуань Инь",
        price: "590₽",
        description: "Те Гуань Инь – один из самых популярных сортов китайского улуна. Он произрастает в уезде Аньси провинции Фуцзянь и имеет общий цветочно-луговой профиль.",
        image: "https://www.chaochay.ru/image/catalog/articles/10.04.2021/3.jpg",
        nutrition: { calories: 0, protein: 0, fats: 0, carbs: 0 },
        weight: "500 мл"
      }
    ]
  },
  {
    category: "Крепкий алкоголь",
    items: [
      {
        name: "Ром",
        price: "",
        description: "Подкатегория",
        image: "https://images.unsplash.com/photo-1514218953589-2d7d37efd2dc?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 0, protein: 0, fats: 0, carbs: 0 },
        isSubcategory: true,
        level: 1,
        items: [
          {
            name: "Zacapa XO",
            price: "2100₽",
            description: "Гватемальский ром, выдержка 25 лет, 40%",
            image: "https://images.unsplash.com/photo-1514218953589-2d7d37efd2dc?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          },
          {
            name: "Diplomatico Reserva Exclusiva",
            price: "1800₽",
            description: "Венесуэльский ром, выдержка 12 лет, 40%",
            image: "https://images.unsplash.com/photo-1585975754487-03b0206d0e76?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          },
          {
            name: "Plantation XO",
            price: "1600₽",
            description: "Барбадосский ром, выдержка 20 лет, 40%",
            image: "https://images.unsplash.com/photo-1550985543-f1ea83691cd8?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          }
        ]
      },
      {
        name: "Джин",
        price: "",
        description: "Подкатегория",
        image: "https://images.unsplash.com/photo-1613008298824-89a8a8d2c595?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 0, protein: 0, fats: 0, carbs: 0 },
        isSubcategory: true,
        level: 1,
        items: [
          {
            name: "Monkey 47",
            price: "1400₽",
            description: "Немецкий джин, 47 ботаникалов, 47%",
            image: "https://images.unsplash.com/photo-1613008298824-89a8a8d2c595?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          },
          {
            name: "Hendrick's",
            price: "1200₽",
            description: "Шотландский джин с огурцом и лепестками роз, 41.4%",
            image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          },
          {
            name: "The Botanist",
            price: "1100₽",
            description: "Шотландский джин, 22 ботаникала, 46%",
            image: "https://images.unsplash.com/photo-1609345265499-b45b4ede0c67?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          }
        ]
      },
      {
        name: "Текила",
        price: "",
        description: "Подкатегория",
        image: "https://images.unsplash.com/photo-1516535794938-6063878f08cc?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 0, protein: 0, fats: 0, carbs: 0 },
        isSubcategory: true,
        level: 1,
        items: [
          {
            name: "Don Julio 1942",
            price: "2800₽",
            description: "Премиальная текила аньехо, 38%",
            image: "https://images.unsplash.com/photo-1516535794938-6063878f08cc?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          },
          {
            name: "Patron Silver",
            price: "1500₽",
            description: "Серебряная текила премиум-класса, 40%",
            image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          },
          {
            name: "Clase Azul Reposado",
            price: "2400₽",
            description: "Выдержанная текила в керамическом декантере, 40%",
            image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          }
        ]
      },
      {
        name: "Водка",
        price: "",
        description: "Подкатегория",
        image: "https://images.unsplash.com/photo-1613590928141-93e6f5f9639b?auto=format&fit=crop&w=800&q=80",
        nutrition: { calories: 0, protein: 0, fats: 0, carbs: 0 },
        isSubcategory: true,
        level: 1,
        items: [
          {
            name: "Beluga Noble",
            price: "950₽",
            description: "Премиальная русская водка, 40%",
            image: "https://images.unsplash.com/photo-1613590928141-93e6f5f9639b?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          },
          {
            name: "Grey Goose",
            price: "1100₽",
            description: "Французская водка из озимой пшеницы, 40%",
            image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          },
          {
            name: "Crystal Head",
            price: "1300₽",
            description: "Канадская водка в хрустальном черепе, 40%",
            image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&w=800&q=80",
            nutrition: { calories: 220, protein: 0, fats: 0, carbs: 0 }
          }
        ]
      }
    ]
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export default function Menu() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [currentMenu, setCurrentMenu] = useState<MenuCategory[]>(menuItems);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setIsLoading(true);
        // Проверяем, что мы на клиенте
        if (typeof window !== 'undefined') {
          const loadedMenu = await menuService.loadMenu();
          if (loadedMenu && loadedMenu.length > 0) {
            // Конвертируем новый формат в старый
            const convertedMenu = convertToOldFormat(loadedMenu);
            setCurrentMenu(convertedMenu);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке меню:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
        const modalContent = document.querySelector('[role="dialog"]');
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedItem]);

  const handleItemClick = (item: MenuItem) => {
    if (item.isSubcategory && item.items) {
      setCurrentPath([...currentPath, item.name]);
    } else {
      setSelectedItem(item);
    }
  };

  const getCurrentItems = (items: MenuItem[]): MenuItem[] => {
    if (currentPath.length === 0) return items;

    let currentItems = items;
    for (const pathItem of currentPath) {
      const nextLevel = currentItems.find(item => item.name === pathItem);
      if (nextLevel?.items) {
        currentItems = nextLevel.items;
      } else {
        return [];
      }
    }
    return currentItems;
  };

  const currentCategory = currentMenu[selectedCategory] || currentMenu[0];
  const currentItems = getCurrentItems(currentCategory.items);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#E6B980] text-xl">Загрузка меню...</div>
      </div>
    );
  }

  return (
    <motion.div
      id="menu-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen relative flex flex-col text-left max-w-full justify-start mx-auto items-center z-0 pt-20"
    >
      <div className="fixed inset-0">
        <Image
          src="/restaurant-bg.jpg"
          alt="Restaurant background"
          fill
          className="object-cover opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-black/90" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(230,185,128,0.03),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(230,185,128,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(230,185,128,0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      </div>

      <Link href="/" className="absolute top-8 left-8 z-10">
        <button className="relative group overflow-hidden md:px-6 md:py-3 px-0 w-10 h-10 md:w-auto md:h-auto border border-[#333] rounded-full uppercase text-sm tracking-widest text-gray-500 transition-all hover:border-[#E6B980]/40 hover:text-[#E6B980]/40 flex items-center justify-center bg-black/20">
          <span className="md:hidden inline-flex items-center justify-center relative">←</span>
          <span className="hidden md:inline relative">← Назад</span>
        </button>
      </Link>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mb-12 text-center"
      >
        <h3 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white mb-4">
          МЕНЮ
        </h3>
        <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#E6B980] to-transparent" />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl px-4 md:px-8 space-y-12">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {currentMenu.map((category, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setSelectedCategory(index);
                setCurrentPath([]);
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative w-full`}
            >
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                selectedCategory === index
                  ? 'opacity-100 shadow-[0_0_25px_rgba(230,185,128,0.15)]'
                  : 'opacity-0 group-hover:opacity-100'
              }`}>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#E6B980]/10 to-[#D4A56A]/5" />
                <div className="absolute inset-0 rounded-xl backdrop-blur-[1px]" />
              </div>

              <div className={`relative h-[4rem] flex items-center justify-center p-3 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                selectedCategory === index
                  ? 'bg-gradient-to-br from-[#E6B980] to-[#D4A56A] border-none shadow-[0_0_15px_rgba(230,185,128,0.2)]'
                  : 'bg-black/30 border border-white/5 group-hover:border-[#E6B980]/20 group-hover:bg-black/40'
              }`}>
                <div className={`transition-all duration-300 text-center ${
                  selectedCategory === index
                    ? 'scale-105'
                    : 'group-hover:scale-105'
                }`}>
                  <span className={`block text-[11px] md:text-xs font-light tracking-[0.15em] ${
                    selectedCategory === index
                      ? 'text-black'
                      : 'text-white/80 group-hover:text-[#E6B980]'
                  }`}>
                    {currentMenu[index].category}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {currentPath.length > 0 && (
          <div className="relative z-10 mb-8">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setCurrentPath(currentPath.slice(0, -1))}
              className="relative group overflow-hidden px-6 py-3 border border-[#333] rounded-full uppercase text-sm tracking-widest text-gray-500 transition-all hover:border-[#E6B980]/40 hover:text-[#E6B980]/40 flex items-center justify-center bg-black/20"
            >
              <span className="relative">← Назад к {currentPath[currentPath.length - 2] || currentCategory.category}</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4"
            >
              <h4 className="text-2xl font-light tracking-wide text-[#E6B980]">{currentPath[currentPath.length - 1]}</h4>
              <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#E6B980]/30 to-transparent mt-4" />
            </motion.div>
          </div>
        )}

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
        >
          {currentItems.sort((a, b) => {
            // Подкатегории всегда будут первыми
            if (a.isSubcategory && !b.isSubcategory) return -1;
            if (!a.isSubcategory && b.isSubcategory) return 1;
            return 0;
          }).map((item, itemIndex) => (
            <motion.div
              key={itemIndex}
              variants={fadeInUp}
              onClick={() => handleItemClick(item)}
              className={`group relative overflow-hidden backdrop-blur-sm rounded-lg cursor-pointer transition-all duration-300 border ${
                item.isSubcategory 
                  ? 'bg-gradient-to-br from-[#E6B980]/5 to-transparent border-[#E6B980]/20 hover:border-[#E6B980]/40'
                  : 'bg-black/30 hover:bg-black/50 border-white/10 hover:border-[#E6B980]/50'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#E6B980]/0 to-[#E6B980]/0 group-hover:from-[#E6B980]/5 group-hover:to-transparent transition-all duration-300" />
              
              {!item.isSubcategory ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover transform-gpu transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                </div>
              ) : null}

              <div className={`relative p-6 ${item.isSubcategory ? 'h-full flex items-center justify-center' : ''}`}>
                <div className={`space-y-3 ${item.isSubcategory ? 'w-full' : ''}`}>
                  <h5 className={`text-xl md:text-2xl font-light tracking-wide text-white group-hover:text-[#E6B980] transition-colors ${item.isSubcategory ? 'text-center' : ''}`}>
                    {item.name}
                  </h5>
                  {!item.isSubcategory && (
                    <>
                      <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      {item.weight || (currentCategory.category === "Крепкий алкоголь" ? '50 мл' : '') ? (
                        <div className="flex items-center mb-4">
                          <span className="text-white/60 text-xs bg-white/10 px-3 py-1.5 rounded-full">
                            {item.weight || (currentCategory.category === "Крепкий алкоголь" ? '50 мл' : '')}
                          </span>
                        </div>
                      ) : null}
                      {item.price && (
                        <div className="pt-2">
                          <div className="flex justify-between items-center">
                            <p className="text-[#E6B980] font-medium text-lg md:text-xl tracking-wide">{item.price}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {item.isSubcategory && (
                    <div className="pt-2">
                      <p className="text-[#E6B980]/60 text-sm tracking-wide flex items-center justify-center">
                        <span>Нажмите, чтобы посмотреть варианты</span>
                        <svg 
                          className="w-4 h-4 ml-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Dialog
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl rounded-2xl bg-gradient-to-br from-[#0A0A0A] to-[#141414] p-4 md:p-8 shadow-[0_0_50px_rgba(230,185,128,0.1)] border border-white/10 mt-4 md:mt-20">
              {selectedItem && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
                    {!selectedItem.isSubcategory && (
                      <div className="relative w-full md:w-[400px] aspect-square rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={selectedItem.image}
                          alt={selectedItem.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <Dialog.Title className="text-2xl md:text-3xl font-light tracking-wide text-[#E6B980]">
                          {selectedItem.name}
                        </Dialog.Title>
                      </div>
                      {!selectedItem.isSubcategory ? (
                        <>
                          <p className="text-gray-300 text-sm leading-relaxed font-light mb-4">
                            {selectedItem.description}
                          </p>
                          
                          {selectedItem.weight || (currentCategory.category === "Крепкий алкоголь" ? '50 мл' : '') ? (
                            <div className="flex items-center mb-4">
                              <span className="text-white/60 text-xs bg-white/10 px-3 py-1.5 rounded-full">
                                {selectedItem.weight || (currentCategory.category === "Крепкий алкоголь" ? '50 мл' : '')}
                              </span>
                            </div>
                          ) : null}
                          
                          <p className="text-2xl md:text-3xl font-medium tracking-wide text-white mb-6">{selectedItem.price}</p>

                          <div className="border-t border-white/10 pt-3">
                            <h4 className="text-[10px] uppercase tracking-wider text-[#E6B980]/70 mb-2 font-light">Пищевая ценность</h4>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { label: 'Калории', value: `${selectedItem.nutrition.calories} ккал` },
                                { label: 'Белки', value: `${selectedItem.nutrition.protein}г` },
                                { label: 'Жиры', value: `${selectedItem.nutrition.fats}г` },
                                { label: 'Углеводы', value: `${selectedItem.nutrition.carbs}г` }
                              ].map((item, index) => (
                                <div key={index} className="text-center p-2 rounded-lg bg-white/[0.02]">
                                  <p className="text-[#E6B980] text-sm font-medium mb-1">{item.value}</p>
                                  <p className="text-white/40 text-xs">{item.label}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedItem.items?.map((subItem, index) => (
                            <div
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(subItem);
                              }}
                              className="p-4 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
                            >
                              <h3 className="text-xl font-light text-white group-hover:text-[#E6B980] mb-2 transition-colors">
                                {subItem.name}
                              </h3>
                              <p className="text-gray-400 text-sm font-light mb-3">
                                {subItem.description}
                              </p>
                              <p className="text-[#E6B980] font-medium text-lg">{subItem.price}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="w-full border border-[#E6B980]/30 text-[#E6B980] py-3 px-6 rounded-lg font-medium tracking-wide hover:bg-[#E6B980]/10 transition-all text-sm uppercase"
                    >
                      Закрыть
                    </button>
                  </div>
                </motion.div>
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </motion.div>
  );
} 