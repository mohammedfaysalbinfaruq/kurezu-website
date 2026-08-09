import React from 'react';
import { useStore } from '../context/StoreContext';
import { KurezuLogo } from './KurezuLogo';
import { 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Lock, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Award, 
  RotateCcw
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { theme, setView } = useStore();

  return (
    <footer className="bg-[var(--bg-card)]/60 backdrop-blur-xl border-t border-[var(--border-color)] text-[var(--text-secondary)] transition-colors duration-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: Logo, Tagline, Links, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[var(--border-color)]">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <KurezuLogo theme={theme} size="md" />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              Die-cast cars. Curated for collectors, automotive enthusiasts, and anyone who loves legendary machines.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
              <MapPin className="w-4 h-4 text-[#E10600]" />
              <span>Chattogram, Bangladesh</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-oswald text-base text-[var(--text-primary)] tracking-wider mb-4">QUICK NAVIGATION</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setView('home')} className="hover:text-[#E10600] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setView('shop')} className="hover:text-[#E10600] transition-colors">
                  Shop Collection
                </button>
              </li>
              <li>
                <button onClick={() => setView('wishlist')} className="hover:text-[#E10600] transition-colors">
                  Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => setView('track-order')} className="hover:text-[#E10600] transition-colors">
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Information */}
          <div>
            <h4 className="font-oswald text-base text-[var(--text-primary)] tracking-wider mb-4">INFORMATION & HELP</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setView('about')} className="hover:text-[#E10600] transition-colors">
                  About KUREZU
                </button>
              </li>
              <li>
                <button onClick={() => setView('faq')} className="hover:text-[#E10600] transition-colors">
                  FAQ & Care Guide
                </button>
              </li>
              <li>
                <button onClick={() => setView('contact')} className="hover:text-[#E10600] transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => setView('admin')} className="hover:text-[#E10600] transition-colors flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Socials & Support */}
          <div>
            <h4 className="font-oswald text-base text-[var(--text-primary)] tracking-wider mb-4">OFFICIAL CHANNELS</h4>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Connect with our official Bangladesh community for drop announcements & previews.
            </p>
            
            <div className="flex items-center space-x-3 mb-6">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/officialkurezu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] hover:text-white hover:bg-[#1877F2] transition-colors"
                title="Official Facebook Page"
              >
                <Facebook className="w-5 h-5" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/kurezudiecast"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] hover:text-white hover:bg-[#E4405F] transition-colors"
                title="Official Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/8801338344292"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] hover:text-white hover:bg-[#25D366] transition-colors"
                title="WhatsApp Direct Support (+8801338344292)"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>

            <a
              href="https://wa.me/8801338344292"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-oswald text-[#25D366] bg-[#25D366]/10 px-3 py-2 rounded-lg hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>CHAT WITH US: +880 1338-344292</span>
            </a>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-secondary)] gap-4">
          <p>© 2026 KUREZU. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:underline cursor-pointer" onClick={() => setView('faq')}>Payment Terms (bKash / Nagad / COD)</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer" onClick={() => setView('faq')}>Nationwide Bangladesh Express</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
