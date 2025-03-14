'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import Hero from '@/components/Hero';
import Contact from '@/components/Contact';
import VideoBackground from '@/components/VideoBackground';

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    setIsPageReady(true);
  }, []);

  return (
    <div className="relative min-h-screen">
      {isPageReady && <VideoBackground />}
      
      <div className="relative z-10">
        <Hero onBookingClick={() => setIsBookingOpen(true)} />
      </div>

      <Dialog
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0">
          <Contact onClose={() => setIsBookingOpen(false)} />
        </div>
      </Dialog>
    </div>
  );
}
