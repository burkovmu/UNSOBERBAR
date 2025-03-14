'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroProps {
  onBookingClick: () => void;
}

export default function Hero({ onBookingClick }: HeroProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(230,185,128,0.05),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_3px_3px,rgba(255,255,255,0.15)_0%,transparent_100%)] bg-[length:6px_6px] pointer-events-none opacity-20" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="w-full max-w-screen-xl mx-auto px-4 relative z-10 flex flex-col items-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <h1 className="text-6xl sm:text-8xl lg:text-[12rem] font-light text-white mb-6 break-words">
            <span className="inline-block mr-2 sm:mr-6 opacity-90">Rest</span>
            <span className="inline-block bg-gradient-to-r from-[#E6B980] to-[#D4A56A] text-transparent bg-clip-text relative">
              Bar
              <div className="absolute -inset-4 bg-gradient-to-r from-[#E6B980]/0 via-[#E6B980]/5 to-[#E6B980]/0 blur-2xl" />
            </span>
          </h1>
          <div className="flex flex-col items-center">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#E6B980]/30 to-transparent mb-8" />
            <p className="text-sm uppercase tracking-[0.5em] text-white/70 font-light">
              Изысканная кухня и коктейли
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 mb-24">
            <Link href="/menu">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-56 px-8 py-4 rounded-full text-base tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[#E6B980] to-[#D4A56A] hover:opacity-90 transition-all flex items-center justify-center"
              >
                Меню
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-56 px-8 py-4 rounded-full text-base tracking-[0.2em] uppercase text-white/90 border border-white/10 hover:border-[#E6B980]/30 hover:text-[#E6B980] transition-all bg-white/[0.02] backdrop-blur-sm flex items-center justify-center"
              >
                О нас
              </motion.button>
            </Link>
            <motion.button
              onClick={onBookingClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-56 px-8 py-4 rounded-full text-base tracking-[0.2em] uppercase text-white/90 border border-white/10 hover:border-[#E6B980]/30 hover:text-[#E6B980] transition-all bg-white/[0.02] backdrop-blur-sm flex items-center justify-center"
            >
              Забронировать
            </motion.button>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="w-full max-w-[24rem] px-4 sm:px-8 py-3 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm flex items-center justify-center"
            >
              <a href="tel:+79991234567" className="text-white/90 text-sm tracking-[0.2em] font-light hover:text-[#E6B980] transition-colors">
                +7 999 123-45-67
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="w-full max-w-[24rem] px-4 sm:px-8 py-3 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm flex flex-col items-center justify-center space-y-1"
            >
              <div className="flex items-center space-x-2">
                <span className="text-[#E6B980] text-sm tracking-[0.2em] font-light">Пн-Чт:</span>
                <span className="text-white/90 text-sm tracking-[0.2em] font-light">12:00 - 02:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#E6B980] text-sm tracking-[0.2em] font-light">Пт:</span>
                <span className="text-white/90 text-sm tracking-[0.2em] font-light">12:00 - 04:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#E6B980] text-sm tracking-[0.2em] font-light">Сб:</span>
                <span className="text-white/90 text-sm tracking-[0.2em] font-light">15:00 - 04:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#E6B980] text-sm tracking-[0.2em] font-light">Вс:</span>
                <span className="text-white/90 text-sm tracking-[0.2em] font-light">15:00 - 02:00</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="w-full max-w-[24rem] px-4 sm:px-8 py-3 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm flex items-center justify-center"
            >
              <span className="text-white/70 text-sm tracking-[0.2em] font-light">
                Санкт-Петербург, Невский Проспект, д. 12
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 