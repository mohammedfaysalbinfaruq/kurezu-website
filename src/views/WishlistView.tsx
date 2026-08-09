import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, products, setView } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      <div className="border-b border-[var(--border-color)] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">YOUR SAVED DIE-CASTS</span>
          <h1 className="font-oswald text-3xl font-bold uppercase text-[var(--text-primary)]">WISHLIST ({wishlistedProducts.length})</h1>
        </div>
        <button
          onClick={() => setView('shop')}
          className="text-xs font-oswald text-[#E10600] hover:underline"
        >
          EXPLORE CATALOG
        </button>
      </div>

      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 space-y-4">
          <div className="w-16 h-16 bg-[#E10600]/10 text-[#E10600] rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-oswald text-2xl font-bold uppercase text-[var(--text-primary)]">YOUR WISHLIST IS EMPTY</h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Click the heart icon on any die-cast model card to save it to your personal wishlist.
          </p>
          <button
            onClick={() => setView('shop')}
            className="bg-[#E10600] text-white font-oswald text-xs px-6 py-3 rounded-lg tracking-wider uppercase font-semibold inline-flex items-center space-x-2"
          >
            <span>BROWSE CATALOG</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
