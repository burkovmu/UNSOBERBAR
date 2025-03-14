'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative h-screen text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="section-heading">О нас</h3>

      <motion.div
        initial={{
          x: -200,
          opacity: 0,
        }}
        transition={{
          duration: 1.2,
        }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative mb-20 md:mb-0 flex-shrink-0 w-56 h-56 md:w-64 md:h-95 xl:w-[500px] xl:h-[600px]"
      >
        <Image
          src="https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf"
          alt="Интерьер ресторана"
          fill
          className="object-cover md:rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>

      <div className="space-y-10 px-0 md:px-10">
        <h4 className="text-4xl font-semibold">
          Немного о нашей{" "}
          <span className="underline decoration-[#F7AB0A]/50">истории</span>
        </h4>
        <p className="text-lg">
          Rest Bar - это уникальное место, где современная гастрономия встречается с
          традиционными рецептами. Наш ресторан основан в 2020 году с целью создать
          пространство, где каждый гость может насладиться изысканной кухней в
          атмосфере уюта и комфорта. Наши повара постоянно экспериментируют с
          вкусами, создавая неповторимые кулинарные шедевры, а бармены удивляют
          гостей авторскими коктейлями.
        </p>
      </div>
    </motion.div>
  );
} 