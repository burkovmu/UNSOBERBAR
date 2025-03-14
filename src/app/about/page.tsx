'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const galleryImages = [
  {
    src: '/restaurant-interior-1.jpg',
    alt: 'Основной зал',
    description: 'Основной зал ресторана с панорамными окнами'
  },
  {
    src: '/restaurant-interior-2.jpg',
    alt: 'Барная стойка',
    description: 'Элегантная барная стойка с авторскими коктейлями'
  },
  {
    src: '/restaurant-interior-3.jpg',
    alt: 'VIP-зона',
    description: 'Уютная VIP-зона для особых случаев'
  },
  {
    src: '/restaurant-interior-4.jpg',
    alt: 'Летняя терраса',
    description: 'Просторная летняя терраса с видом на город'
  },
  {
    src: '/restaurant-interior-5.jpg',
    alt: 'Винный погреб',
    description: 'Коллекция изысканных вин в нашем погребе'
  },
  {
    src: '/restaurant-interior-6.jpg',
    alt: 'Каминный зал',
    description: 'Уютный каминный зал для романтического вечера'
  }
];

const teamMembers = [
  { 
    title: 'Шеф-повар', 
    name: 'Александр Петров',
    image: '/team/chef.jpg'
  },
  { 
    title: 'Су-шеф', 
    name: 'Мария Иванова',
    image: '/team/sous-chef.jpg'
  },
  { 
    title: 'Сомелье', 
    name: 'Дмитрий Соколов',
    image: '/team/sommelier.jpg'
  },
  { 
    title: 'Шеф-бармен', 
    name: 'Екатерина Волкова',
    image: '/team/bartender.jpg'
  }
];

export default function About() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Добавляем обработчик клавиатуры
  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImage === null) return;
    
    if (e.key === 'ArrowLeft') {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : galleryImages.length - 1);
    } else if (e.key === 'ArrowRight') {
      setSelectedImage(selectedImage < galleryImages.length - 1 ? selectedImage + 1 : 0);
    } else if (e.key === 'Escape') {
      setSelectedImage(null);
    }
  };

  // Добавляем и удаляем обработчик при монтировании/размонтировании
  useEffect(() => {
    if (selectedImage !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImage]);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0">
        <Image
          src="/restaurant-bg.jpg"
          alt="Restaurant background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(230,185,128,0.08),transparent_70%)] pointer-events-none" />
      </div>

      {/* Кнопка назад */}
      <Link href="/" className="fixed top-8 left-8 z-50">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative group overflow-hidden md:px-6 md:py-3 px-0 w-10 h-10 md:w-auto md:h-auto border border-[#333] rounded-full uppercase text-sm tracking-widest text-gray-500 transition-all hover:border-[#E6B980]/40 hover:text-[#E6B980]/40 flex items-center justify-center bg-black/20"
        >
          <span className="md:hidden inline-flex items-center justify-center relative">←</span>
          <span className="hidden md:inline relative">← Назад</span>
        </motion.button>
      </Link>

      {/* Основной контент */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] text-white mb-6">
              REST BAR
            </h1>
            <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#E6B980] to-transparent mb-6" />
            <p className="text-white/60 text-sm md:text-base font-light tracking-[0.2em] uppercase">
              Изысканная кухня и атмосфера
            </p>
          </motion.div>

          {/* Основные секции */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-32"
          >
            {/* История */}
            <motion.section variants={fadeIn} className="relative">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                  <Image
                    src="/restaurant-interior-1.jpg"
                    alt="Интерьер ресторана"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </div>
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-light text-[#E6B980] tracking-wide">
                    Наша История
                  </h2>
                  <p className="text-white/80 font-light leading-relaxed">
                    Rest Bar был основан в 2020 году с целью создать уникальное пространство, 
                    где современная гастрономия встречается с традиционными рецептами. 
                    Мы стремимся предложить нашим гостям не просто еду, а настоящее 
                    гастрономическое путешествие.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Галерея */}
            <motion.section variants={fadeIn} className="relative">
              <h2 className="text-2xl md:text-3xl font-light text-[#E6B980] tracking-wide text-center mb-12">
                Галерея
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white font-light text-lg mb-1">{image.alt}</h3>
                      <p className="text-white/80 text-sm">{image.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Кухня */}
            <motion.section variants={fadeIn} className="relative">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 space-y-6">
                  <h2 className="text-2xl md:text-3xl font-light text-[#E6B980] tracking-wide">
                    Наша Кухня
                  </h2>
                  <p className="text-white/80 font-light leading-relaxed">
                    Шеф-повар нашего ресторана создает уникальные блюда, сочетая 
                    классические рецепты с современными техниками приготовления. 
                    Мы используем только свежие, сезонные продукты от лучших 
                    локальных производителей.
                  </p>
                </div>
                <div className="order-1 md:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden group">
                  <Image
                    src="/restaurant-kitchen.jpg"
                    alt="Кухня ресторана"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
                </div>
              </div>
            </motion.section>

            {/* Команда */}
            <motion.section variants={fadeIn} className="relative text-center">
              <h2 className="text-2xl md:text-3xl font-light text-[#E6B980] tracking-wide mb-12">
                Наша Команда
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    className="relative group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-[#E6B980]/5 backdrop-blur-sm border border-white/5 group-hover:border-[#E6B980]/20 transition-colors">
                      <div className="relative w-full h-full">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                      </div>
                    </div>
                    <h3 className="text-white/90 font-light text-lg mb-1">{member.name}</h3>
                    <p className="text-[#E6B980]/60 text-sm">{member.title}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Контакты */}
            <motion.section variants={fadeIn} className="relative">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <h2 className="text-2xl md:text-3xl font-light text-[#E6B980] tracking-wide">
                  Контакты
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <p className="text-[#E6B980]/60 text-sm">Адрес</p>
                    <p className="text-white/80 font-light">
                      Санкт-Петербург,<br />
                      Невский проспект, д. 12
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#E6B980]/60 text-sm">Часы работы</p>
                    <p className="text-white/80 font-light">
                      Пн-Чт: 12:00 - 02:00<br />
                      Пт-Сб: 12:00 - 04:00<br />
                      Вс: 15:00 - 02:00
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#E6B980]/60 text-sm">Контакты</p>
                    <p className="text-white/80 font-light">
                      +7 999 123-45-67<br />
                      info@restbar.ru
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>

      {/* Модальное окно для просмотра изображений */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage > 0 ? selectedImage - 1 : galleryImages.length - 1);
              }}
              className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all z-10 text-2xl group"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/20 transition-colors" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full aspect-[16/9] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-xl font-light mb-2">
                  {galleryImages[selectedImage].alt}
                </h3>
                <p className="text-white/80">
                  {galleryImages[selectedImage].description}
                </p>
                <div className="mt-4 text-white/50 text-sm">
                  Используйте стрелки клавиатуры ← → или кнопки для навигации
                </div>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all text-2xl"
              >
                ×
              </button>
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage < galleryImages.length - 1 ? selectedImage + 1 : 0);
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all z-10 text-2xl group"
            >
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/20 transition-colors" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}