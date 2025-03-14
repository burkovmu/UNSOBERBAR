'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContactProps {
  onClose?: () => void;
}

export default function Contact({ onClose }: ContactProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const availableTimes = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
    '00:00', '00:30', '01:00', '01:30'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ date, time, guests, name, phone, comment });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] overflow-y-auto">
      {/* Кнопка "Назад" */}
      {onClose && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onClose}
          className="absolute top-4 left-4 z-50 group overflow-hidden md:px-6 md:py-3 px-0 w-10 h-10 md:w-auto md:h-auto border border-[#333] rounded-full uppercase text-sm tracking-widest text-gray-500 transition-all hover:border-[#E6B980]/40 hover:text-[#E6B980]/40 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <span className="md:hidden inline-flex items-center justify-center relative">←</span>
          <span className="hidden md:inline relative">← Назад</span>
        </motion.button>
      )}

      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        {/* Фоновые эффекты */}
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-[#0A0A0A]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#E6B980]/5 via-transparent to-[#D4A56A]/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,185,128,0.1),transparent_70%)]" />
        </div>

        {/* Основной контент */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-3xl mx-auto overflow-visible [&_input[type=date]]:appearance-none [&_input[type=date]::-webkit-calendar-picker-indicator]:opacity-100 [&_input[type=date]::-webkit-calendar-picker-indicator]:filter [&_input[type=date]::-webkit-calendar-picker-indicator]:invert"
        >
          {/* Заголовок */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-light tracking-[0.2em] text-white mb-3">БРОНИРОВАНИЕ</h2>
              <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#E6B980] to-transparent" />
            </motion.div>
          </div>

          {/* Форма */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative p-8 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/5"
          >
            <form onSubmit={handleSubmit} className="relative space-y-6 md:space-y-8">
              {/* Основные поля */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs text-[#E6B980] tracking-[0.15em] uppercase mb-2">Дата</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border-0 border-b border-white/10 px-0 h-8 md:h-10 text-white/90 text-xs md:text-sm font-light focus:outline-none focus:border-[#E6B980]/30 transition-colors appearance-none pr-2"
                    onClick={(e) => e.currentTarget.showPicker()}
                  />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs text-[#E6B980] tracking-[0.15em] uppercase mb-2">Время</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border-0 border-b border-white/10 px-0 h-8 md:h-10 text-white/90 text-xs md:text-sm font-light focus:outline-none focus:border-[#E6B980]/30 transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-[#0A0A0A]">Выберите</option>
                    {availableTimes.map((t) => (
                      <option key={t} value={t} className="bg-[#0A0A0A] text-xs md:text-sm">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs text-[#E6B980] tracking-[0.15em] uppercase mb-2">Гости</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border-0 border-b border-white/10 px-0 h-8 md:h-10 text-white/90 text-xs md:text-sm font-light focus:outline-none focus:border-[#E6B980]/30 transition-colors appearance-none"
                  >
                    {[1,2,3,4,5,6,7,8].map((num) => (
                      <option key={num} value={num} className="bg-[#0A0A0A] text-xs md:text-sm">
                        {num} {num === 1 ? 'гость' : num < 5 ? 'гостя' : 'гостей'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs text-[#E6B980] tracking-[0.15em] uppercase mb-2">Ваше имя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Введите ваше имя"
                    className="w-full bg-white/[0.03] border-0 border-b border-white/10 px-0 h-8 md:h-10 text-white/90 text-xs md:text-sm font-light focus:outline-none focus:border-[#E6B980]/30 transition-colors placeholder:text-white/30 placeholder:font-light placeholder:text-xs md:placeholder:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs text-[#E6B980] tracking-[0.15em] uppercase mb-2">Телефон</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    placeholder="+7 (___) ___-__-__"
                    className="w-full bg-white/[0.03] border-0 border-b border-white/10 px-0 h-8 md:h-10 text-white/90 text-xs md:text-sm font-light focus:outline-none focus:border-[#E6B980]/30 transition-colors placeholder:text-white/30 placeholder:font-light placeholder:text-xs md:placeholder:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs text-[#E6B980] tracking-[0.15em] uppercase mb-2">Особые пожелания</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Напишите ваши пожелания"
                  className="w-full bg-white/[0.03] border-0 border-b border-white/10 px-0 py-2 text-white/90 text-xs md:text-sm font-light focus:outline-none focus:border-[#E6B980]/30 transition-colors h-16 md:h-20 resize-none placeholder:text-white/30 placeholder:font-light placeholder:text-xs md:placeholder:text-sm"
                />
              </div>

              <div className="flex flex-col space-y-4 md:space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <p className="flex-1 text-white/40 text-[10px] md:text-xs font-light italic">
                    Мы свяжемся с вами для подтверждения
                  </p>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      className="relative group overflow-hidden rounded-lg h-10 flex-1 md:w-32 border border-white/10"
                    >
                      <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
                      <div className="relative flex items-center justify-center">
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/60 group-hover:text-[#E6B980] transition-colors">
                          Закрыть
                        </span>
                      </div>
                    </button>
                    <button
                      type="submit"
                      className="relative group overflow-hidden rounded-lg h-10 flex-1 md:w-44"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#E6B980] to-[#D4A56A] opacity-20 group-hover:opacity-100 transition-all duration-300" />
                      <div className="relative flex items-center justify-center">
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#E6B980] group-hover:text-black transition-colors">
                          Забронировать
                        </span>
                      </div>
                      <div className="absolute inset-0 border border-[#E6B980]" />
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[#E6B980] text-[10px] md:text-xs tracking-[0.2em] uppercase mb-1">Адрес</p>
                  <p className="text-white/60 text-xs md:text-sm font-light">Санкт-Петербург, Невский Проспект, д. 12</p>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 