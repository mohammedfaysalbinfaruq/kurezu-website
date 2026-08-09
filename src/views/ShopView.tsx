import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryType, ScaleType } from '../types';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { products } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedScale, setSelectedScale] = useState<string>('ALL');
  const [selectedStock, setSelectedStock] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('newest');

  const categories: (CategoryType | 'ALL')[] = [
    'ALL', 'JDM', 'SUPERCARS', 'EUROPEAN', 'MUSCLE', 'RACING', 'SUV', 'CLASSIC'
  ];

  const scales: (ScaleType | 'ALL')[] = [
    'ALL', '1:64', '1:43', '1:32', '1:24', '1:18'
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchScale = p.scale.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchScale && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
          return false;
        }

        // Scale filter
        if (selectedScale !== 'ALL' && p.scale !== selectedScale) {
          return false;
        }

        // Stock filter
        if (selectedStock === 'IN_STOCK' && p.stockState === 'SOLD OUT') {
          return false;
        }
        if (selectedStock === 'LIMITED_DROP' && !p.isLimitedDrop) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'best-selling') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        // Default newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, search, selectedCategory, selectedScale, selectedStock, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedScale('ALL');
    setSelectedStock('ALL');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--border-color)] pb-6 gap-4">
        <div>
          <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">DIE-CAST CATALOG</span>
          <h1 className="font-oswald text-3xl sm:text-5xl font-bold text-[var(--text-primary)] uppercase">
            EXPLORE COLLECTION
          </h1>
        </div>
        <p className="text-xs text-[var(--text-secondary)] font-oswald tracking-wider">
          SHOWING {filteredProducts.length} OF {products.length} MODELS
        </p>
      </div>

      {/* Filter Controls Row */}
      <div className="glass-card rounded-2xl p-4 md:p-6 space-y-4">
        
        {/* Top: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search model, scale or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 glass-input rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <span className="text-xs font-oswald text-[var(--text-secondary)] uppercase tracking-wider whitespace-nowrap">
              SORT BY:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input text-xs font-oswald text-[var(--text-primary)] px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#E10600] uppercase"
            >
              <option value="newest" className="bg-slate-900 text-white">NEWEST ARRIVALS</option>
              <option value="price-low" className="bg-slate-900 text-white">PRICE: LOW → HIGH</option>
              <option value="price-high" className="bg-slate-900 text-white">PRICE: HIGH → LOW</option>
              <option value="best-selling" className="bg-slate-900 text-white">BEST SELLING</option>
            </select>

            {(selectedCategory !== 'ALL' || selectedScale !== 'ALL' || search !== '') && (
              <button
                onClick={resetFilters}
                className="p-2 text-xs font-oswald text-[#E10600] hover:bg-[#E10600]/10 rounded-lg flex items-center space-x-1"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">RESET</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/60">
          <span className="text-[10px] font-oswald text-[var(--text-secondary)] tracking-widest uppercase">CATEGORIES:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-oswald tracking-wider px-3 py-1.5 rounded-md transition-colors uppercase ${
                  selectedCategory === cat 
                    ? 'bg-[#E10600] text-white font-semibold' 
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scale Pills */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/60">
          <span className="text-[10px] font-oswald text-[var(--text-secondary)] tracking-widest uppercase">MODEL SCALES:</span>
          <div className="flex flex-wrap gap-2">
            {scales.map((sc) => (
              <button
                key={sc}
                onClick={() => setSelectedScale(sc)}
                className={`text-xs font-oswald tracking-wider px-3 py-1 rounded-md transition-colors uppercase ${
                  selectedScale === sc
                    ? 'bg-[#E10600] text-white font-semibold'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: 2 columns mobile, 3 tablet, 4 desktop */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 space-y-4">
          <p className="font-oswald text-xl text-[var(--text-primary)] uppercase">NO DIE-CAST MODELS FOUND</p>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Try adjusting your search terms, category filters or scales to find what you are looking for.
          </p>
          <button
            onClick={resetFilters}
            className="bg-[#E10600] text-white font-oswald text-xs px-6 py-2.5 rounded-lg tracking-wider uppercase font-semibold"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}

    </div>
  );
};
