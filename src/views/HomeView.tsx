import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Layers, 
  Sparkles, 
  Bell, 
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, setView, requestBackInStock } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured || p.isLimitedDrop).slice(0, 8);
  const comingSoonProducts = products.filter(p => p.isComingSoon);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-neutral-950 border-b border-[var(--border-color)]">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=90"
            alt="KUREZU Premium JDM Die-cast Background"
            className="w-full h-full object-cover object-center filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-black/70 to-black/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-start justify-center min-h-[70vh]">
          
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-oswald tracking-widest text-white mb-6 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#E10600]" />
            <span>KUREZU DIE-CAST COLLECTIBLES • BANGLADESH</span>
          </div>

          <h1 className="font-oswald text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white uppercase leading-none max-w-4xl">
            YOUR NEXT <br />
            <span className="text-[#E10600]">DREAM CAR</span> <br />
            STARTS HERE.
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-sans leading-relaxed">
            Premium die-cast cars for collectors, enthusiasts and anyone who loves legendary machines.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setView('shop')}
              className="bg-[#E10600] hover:bg-red-700 text-white font-oswald text-base tracking-wider px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-600/30"
            >
              <span>SHOP COLLECTION</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setView('about')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-oswald text-base tracking-wider px-8 py-4 rounded-lg font-medium transition-all backdrop-blur-md flex items-center justify-center"
            >
              EXPLORE KUREZU
            </button>
          </div>
        </div>
      </section>

      {/* 2. CUSTOMER-FACING TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 glass-card rounded-2xl p-6 md:p-8">
          
          <div className="flex items-start space-x-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-[#E10600]/10 border border-[#E10600]/20 flex items-center justify-center text-[#E10600] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-oswald text-base text-[var(--text-primary)] font-semibold tracking-wide">CURATED COLLECTION</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Carefully selected die-cast models for serious collectors.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-[#E10600]/10 border border-[#E10600]/20 flex items-center justify-center text-[#E10600] shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-oswald text-base text-[var(--text-primary)] font-semibold tracking-wide">MULTIPLE SCALES</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">1:64 • 1:43 • 1:32 • 1:24 • 1:18 precision models.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-[#E10600]/10 border border-[#E10600]/20 flex items-center justify-center text-[#E10600] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-oswald text-base text-[var(--text-primary)] font-semibold tracking-wide">QUALITY CHECKED</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Every model is individually inspected before dispatch.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-[#E10600]/10 border border-[#E10600]/20 flex items-center justify-center text-[#E10600] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-oswald text-base text-[var(--text-primary)] font-semibold tracking-wide">NATIONWIDE DELIVERY</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Express delivery available across all 64 districts in BD.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURED PRODUCTS & LIMITED DROPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#E10600] text-xs font-oswald tracking-widest uppercase mb-1">
              <Flame className="w-4 h-4 fill-current" />
              <span>CURATED HIGHLIGHTS</span>
            </div>
            <h2 className="font-oswald text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight uppercase">
              LIMITED DROPS & FEATURED MODELS
            </h2>
          </div>

          <button
            onClick={() => setView('shop')}
            className="inline-flex items-center space-x-2 text-sm font-oswald tracking-wider text-[#E10600] hover:text-red-500 font-semibold uppercase"
          >
            <span>VIEW ALL ({products.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Grid: 2 columns mobile, 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BRAND NARRATIVE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden glass-card p-8 md:p-14 text-white">
          <div className="relative z-10 max-w-2xl">
            <span className="font-oswald text-xs tracking-widest text-[#E10600] uppercase font-bold">KUREZU MANIFESTO</span>
            <h2 className="font-oswald text-3xl sm:text-5xl font-bold tracking-tight uppercase mt-2 mb-4 leading-tight">
              BUILT FOR THE OBSESSED.
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              KUREZU is a Bangladesh-based die-cast car store built around a simple idea — great cars deserve to be collected, displayed and enjoyed. We source high-precision models crafted with die-cast zinc, real-rider rubber tires, and detailed engine bays.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-oswald text-neutral-400 uppercase tracking-widest">
              <span>01 — CURATED SELECTION</span>
              <span>•</span>
              <span>02 — QUALITY CHECKED</span>
              <span>•</span>
              <span>03 — LIMITED DROPS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEXT DROP / COMING SOON SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">UPCOMING RELEASES</span>
              <h2 className="font-oswald text-2xl sm:text-3xl font-bold text-[var(--text-primary)] uppercase">
                NEXT DROP • COMING SOON
              </h2>
            </div>
            <span className="bg-[#E10600]/10 text-[#E10600] border border-[#E10600]/30 font-oswald text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              BATCH #003 PREVIEW
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col sm:flex-row items-center glass-panel rounded-xl p-4 gap-4">
              <img
                src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80"
                alt="Coming Soon Model"
                className="w-full sm:w-36 h-28 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <span className="text-[10px] font-oswald text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-semibold uppercase">
                  LAUNCHING MARCH 2026
                </span>
                <h4 className="font-oswald text-base text-[var(--text-primary)] font-bold">
                  Lamborghini Countach LPI 800-4 (1:18 Metal)
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">Limited 1:18 scale drop with opening scissors doors.</p>
                <button
                  onClick={() => alert("Restock/Drop Notification saved! We will notify you via WhatsApp.")}
                  className="inline-flex items-center space-x-1.5 text-xs font-oswald text-[#E10600] hover:text-red-600 uppercase font-semibold"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>NOTIFY ME ON LAUNCH</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center glass-panel rounded-xl p-4 gap-4">
              <img
                src="https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=600&q=80"
                alt="Coming Soon Model 2"
                className="w-full sm:w-36 h-28 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <span className="text-[10px] font-oswald text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-semibold uppercase">
                  RESTOCK IN PROGRESS
                </span>
                <h4 className="font-oswald text-base text-[var(--text-primary)] font-bold">
                  Honda Civic Type-R FK8 (Championship White)
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">1:64 die-cast model restock Batch #003 arriving soon.</p>
                <button
                  onClick={() => alert("Restock notification saved! You will receive an alert.")}
                  className="inline-flex items-center space-x-1.5 text-xs font-oswald text-[#E10600] hover:text-red-600 uppercase font-semibold"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>NOTIFY ME ON RESTOCK</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
