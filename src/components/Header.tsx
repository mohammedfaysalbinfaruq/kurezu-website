import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { KurezuLogo } from './KurezuLogo';
import { 
  Sun, 
  Moon, 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, currentView, setView, cart, wishlist } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const navLinks = [
    { label: 'HOME', view: 'home' },
    { label: 'SHOP', view: 'shop' },
    { label: 'WISHLIST', view: 'wishlist' },
    { label: 'ABOUT', view: 'about' },
    { label: 'FAQ', view: 'faq' },
    { label: 'CONTACT', view: 'contact' },
    { label: 'TRACK ORDER', view: 'track-order' },
  ];

  const handleNavClick = (view: string) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setView('shop');
      // Search is handled in shop view via query or state
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-card)]/75 backdrop-blur-xl border-b border-[var(--border-color)] shadow-xl shadow-black/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* LEFT: Official KUREZU Logo */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center focus:outline-none group py-1"
          >
            <KurezuLogo theme={theme} size="md" />
          </button>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleNavClick(link.view)}
                  className={`font-oswald tracking-wider text-sm transition-colors py-1 relative ${
                    isActive 
                      ? 'text-[#E10600] font-medium' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E10600]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Actions (Search, Wishlist, Cart, Theme Toggle, Shop CTA) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-card)]"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className="hidden sm:flex p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-card)] relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E10600] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => handleNavClick('cart')}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-card)] relative"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E10600] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle (Sun/Moon) */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-card)]"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* SHOP / CATALOG CTA (Desktop) */}
            <button
              onClick={() => handleNavClick('shop')}
              className="hidden md:inline-flex items-center justify-center font-oswald text-xs uppercase tracking-wider bg-[#E10600] hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors shadow-sm"
            >
              SHOP CATALOG
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH MODAL OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 px-4">
          <div className="glass-card rounded-2xl w-full max-w-xl p-6 shadow-2xl relative border border-white/20">
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-oswald text-lg mb-4 text-[var(--text-primary)]">SEARCH DIE-CAST MODELS</h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Search by model (e.g. Skyline, Supra, Porsche, 1:64)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 glass-input rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
              />
              <button
                type="submit"
                className="bg-[#E10600] hover:bg-red-700 text-white font-oswald px-6 py-3 rounded-xl text-sm tracking-wider shadow-lg shadow-red-900/30"
              >
                SEARCH
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] glass-card border-b border-[var(--border-color)] shadow-2xl px-6 py-6 transition-all duration-300 backdrop-blur-2xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`flex items-center justify-between font-oswald text-base tracking-wider text-left py-2 border-b border-[var(--border-color)]/50 ${
                  currentView === link.view ? 'text-[#E10600] font-semibold' : 'text-[var(--text-primary)]'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            ))}

            <div className="pt-2 flex flex-col space-y-3">
              <button
                onClick={() => handleNavClick('shop')}
                className="w-full bg-[#E10600] text-white font-oswald py-3 rounded-lg tracking-wider text-center"
              >
                EXPLORE CATALOG
              </button>

              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center justify-center space-x-2 text-xs text-[var(--text-secondary)] py-2 hover:text-[var(--text-primary)]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
