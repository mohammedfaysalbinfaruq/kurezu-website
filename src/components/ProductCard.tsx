import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setView, addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWishlisted = isInWishlist(product.id);

  const isSoldOut = product.stockState === 'SOLD OUT' || product.exactStock <= 0;
  const isLimited = product.stockState === 'LIMITED STOCK';

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product, 1);
    setView('checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product, 1);
  };

  return (
    <div 
      onClick={() => setView('product-detail', product.id)}
      className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#E10600]/70 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer relative"
    >
      {/* Top Badges Overlay */}
      <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Container */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <span className="bg-black/80 backdrop-blur-md text-white font-oswald text-[11px] px-2.5 py-0.5 rounded uppercase border border-white/10 tracking-wider">
            {product.scale}
          </span>

          {product.isLimitedDrop && (
            <span className="bg-[#E10600] text-white font-oswald text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider shadow">
              LIMITED DROP
            </span>
          )}

          {product.isNewArrival && !product.isLimitedDrop && (
            <span className="bg-amber-500 text-black font-oswald text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              NEW
            </span>
          )}

          {product.isBestSeller && !product.isLimitedDrop && !product.isNewArrival && (
            <span className="bg-indigo-600 text-white font-oswald text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted 
              ? 'bg-[#E10600] text-white' 
              : 'bg-black/40 text-white/80 hover:bg-black/70 hover:text-white'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Stock Status Badge */}
        <div className="absolute bottom-2 left-2 z-10">
          {isSoldOut ? (
            <span className="bg-neutral-900/90 text-red-400 border border-red-500/30 text-[10px] font-oswald font-semibold px-2 py-0.5 rounded tracking-wider">
              SOLD OUT
            </span>
          ) : isLimited ? (
            <span className="bg-amber-900/90 text-amber-300 border border-amber-500/30 text-[10px] font-oswald font-semibold px-2 py-0.5 rounded tracking-wider animate-pulse">
              LIMITED STOCK
            </span>
          ) : (
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-oswald font-semibold px-2 py-0.5 rounded tracking-wider">
              IN STOCK
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-oswald tracking-widest text-[#E10600] font-semibold">
            {product.category}
          </span>
          <h3 className="font-sans font-semibold text-xs sm:text-sm text-[var(--text-primary)] line-clamp-2 leading-snug mt-0.5 group-hover:text-[#E10600] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price Section */}
        <div className="pt-2 border-t border-[var(--border-color)]/60 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-oswald text-base sm:text-lg font-bold text-[var(--text-primary)]">
              ৳{(product.salePrice || product.price).toLocaleString()}
            </span>
            {product.salePrice && (
              <span className="font-oswald text-xs text-[var(--text-secondary)] line-through">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Card Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`w-full py-2 px-2 rounded-md font-oswald text-xs tracking-wider font-medium flex items-center justify-center space-x-1 border transition-colors ${
              isSoldOut 
                ? 'opacity-40 cursor-not-allowed border-neutral-700 text-neutral-500'
                : 'border-[var(--border-color)] hover:border-[#E10600] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:text-[#E10600]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="truncate">ADD TO CART</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isSoldOut}
            className={`w-full py-2 px-2 rounded-md font-oswald text-xs tracking-wider font-semibold flex items-center justify-center space-x-1 transition-colors ${
              isSoldOut
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-[#E10600] hover:bg-red-700 text-white'
            }`}
          >
            <span className="truncate">BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
