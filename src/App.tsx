import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { TrackOrderView } from './views/TrackOrderView';
import { WishlistView } from './views/WishlistView';
import { AboutView } from './views/AboutView';
import { FaqView } from './views/FaqView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'track-order':
        return <TrackOrderView />;
      case 'wishlist':
        return <WishlistView />;
      case 'about':
        return <AboutView />;
      case 'faq':
        return <FaqView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased selection:bg-[#E10600] selection:text-white transition-colors duration-200 relative overflow-x-hidden">
      {/* Background Ambient Lighting Orbs for Frosted Glass Aesthetics */}
      <div className="fixed -top-20 left-1/4 w-[32rem] h-[32rem] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-20 w-[36rem] h-[36rem] bg-indigo-600/20 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-10 left-10 w-[28rem] h-[28rem] bg-red-600/15 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <div>
          <Header />
          <main className="transition-all duration-300">
            {renderView()}
          </main>
        </div>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
