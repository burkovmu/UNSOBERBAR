'use client';

import { motion } from 'framer-motion';
import Menu from '@/components/Menu';

export default function MenuPage() {
  return (
    <main className="h-screen overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#F7AB0A]/80">
      <Menu />
    </main>
  );
} 