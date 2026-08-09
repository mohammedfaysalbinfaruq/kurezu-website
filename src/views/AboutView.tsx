import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShieldCheck, Layers, Award, ArrowRight } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setView } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">
          THE KUREZU MANIFESTO
        </span>
        <h1 className="font-oswald text-4xl sm:text-6xl font-bold uppercase text-[var(--text-primary)] tracking-tight">
          BUILT FOR THE OBSESSED.
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
          KUREZU is a Bangladesh-based die-cast car store built around a simple idea — great cars deserve to be collected, displayed and enjoyed.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="glass-card rounded-2xl p-8 md:p-12 space-y-6">
        <h2 className="font-oswald text-2xl font-bold uppercase text-[var(--text-primary)]">
          OUR STORY & PASSION
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
          Whether it is the iconic roar of a twin-turbo RB26DETT inside a Bayside Blue R34 GT-R or the raw track aero of a 911 GT3 RS, die-cast models capture automotive dreams in hand-held precision. KUREZU was created to give Bangladeshi collectors and automotive enthusiasts access to authentic, high-quality die-cast cars without compromising on detail, packaging, or customer support.
        </p>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
          Every model in our store undergoes a rigorous physical inspection prior to shipping. We ensure acrylic display cases are flawless, real-rider rubber tires are aligned, and paint finishes shine right out of the collector box.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="space-y-6">
        <h2 className="font-oswald text-2xl font-bold uppercase text-[var(--text-primary)] text-center">
          THE KUREZU PILLARS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="glass-card p-6 rounded-2xl space-y-2">
            <span className="font-oswald text-2xl font-bold text-[#E10600]">01</span>
            <h3 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase">CURATED</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Models selected specifically for collectors and automotive enthusiasts — from JDM legends to rare track supercars.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-2">
            <span className="font-oswald text-2xl font-bold text-[#E10600]">02</span>
            <h3 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase">QUALITY</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Products selected with uncompromising attention to finish, die-cast weight, paint depth, and overall scale accuracy.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-2">
            <span className="font-oswald text-2xl font-bold text-[#E10600]">03</span>
            <h3 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase">COLLECTIBLE</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Cars made to display, collect and appreciate. Acrylic cases and original collector box art included with every model.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-2">
            <span className="font-oswald text-2xl font-bold text-[#E10600]">04</span>
            <h3 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase">LIMITED</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Small-batch limited drops make every addition to your shelf feel rare, exclusive, and special.
            </p>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => setView('shop')}
          className="bg-[#E10600] text-white font-oswald text-sm px-8 py-4 rounded-xl tracking-wider uppercase font-semibold inline-flex items-center space-x-2"
        >
          <span>EXPLORE OUR CURATED CATALOG</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
