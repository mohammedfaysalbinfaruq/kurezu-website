import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/8801338344292"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20ba5a] transition-all transform hover:scale-110 flex items-center justify-center group"
      title="Chat with KUREZU Support on WhatsApp (+8801338344292)"
      aria-label="Chat with KUREZU Support on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-oswald text-xs tracking-wider font-semibold ml-0 group-hover:ml-2">
        CHAT WITH US
      </span>
    </a>
  );
};
