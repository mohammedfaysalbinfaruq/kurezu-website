import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

export const FaqView: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What scales do you sell?',
      a: 'We specialize in multiple die-cast scales including 1:64 (pocket/display size ~7cm), 1:43, 1:32 (~14cm), 1:24 (~19cm with opening parts), and 1:18 full-detail collector models (~24cm with opening hoods and working steering).'
    },
    {
      q: 'Are the cars die-cast metal?',
      a: 'Yes! All models in the KUREZU catalog feature heavy die-cast zinc alloy metal bodies, high-grade ABS interiors, real rubber tires, and acrylic display cases on selected scales.'
    },
    {
      q: 'How can I place an order?',
      a: 'Simply browse our catalog, select your desired die-cast model, click "Add to Cart" or "Buy Now", enter your delivery address, select your bKash or Nagad advance payment method for the delivery charge, enter your Transaction ID, and submit.'
    },
    {
      q: 'Do you deliver across Bangladesh?',
      a: 'Yes! We provide nationwide express delivery across all 64 districts in Bangladesh including Chattogram, Dhaka, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, and Mymensingh.'
    },
    {
      q: 'How much is delivery?',
      a: 'Delivery inside Chattogram is ৳80. Delivery outside Chattogram across the rest of Bangladesh is ৳150.'
    },
    {
      q: 'Why is delivery charge paid in advance?',
      a: 'Advance payment of the delivery charge prevents fake/unclaimed orders during long-distance courier dispatch. This ensures all models remain available for genuine collectors. The remaining product price is paid safely upon Cash on Delivery (COD).'
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order is placed, go to the "TRACK ORDER" page on our website and enter your unique Order ID (e.g., KZ-2026-0001) along with your mobile number to view live verification, processing, and shipping updates.'
    },
    {
      q: 'How do I pay through bKash?',
      a: 'Send the exact delivery charge (৳80 or ৳150) to our official KUREZU bKash number (+8801338344292). Copy the 10-character Transaction ID (TrxID) from your bKash app or SMS and paste it in the Transaction ID field at checkout.'
    },
    {
      q: 'How do I pay through Nagad?',
      a: 'Send the exact delivery charge to our official KUREZU Nagad number (+8801338344292). Copy the Transaction ID from your Nagad SMS/App and enter it in the checkout form.'
    },
    {
      q: 'What happens after I submit my Transaction ID?',
      a: 'Our administration team cross-checks your bKash/Nagad Transaction ID. Once verified (usually within 1-2 hours), your order status updates to "Confirmed" and moves to packaging and express dispatch.'
    },
    {
      q: 'How should I care for my die-cast car?',
      a: 'Keep models away from direct sunlight and extreme humidity. Clean dust gently using a soft microfiber cloth or fine lens brush. Avoid using harsh chemical solvents on painted surfaces or decal logos.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      
      <div className="text-center space-y-2">
        <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">COLLECTOR GUIDANCE</span>
        <h1 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-[var(--text-primary)]">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
          Everything you need to know about scales, die-cast materials, advance delivery payments, bKash/Nagad verification, and order tracking.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between font-oswald text-sm md:text-base font-semibold text-[var(--text-primary)] hover:text-[#E10600] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 text-[var(--text-secondary)] ${isOpen ? 'rotate-180 text-[#E10600]' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)]/50 font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl text-center space-y-3">
        <h3 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase">HAVE ANOTHER QUESTION?</h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
          Our team is available on WhatsApp to assist you with specific model dimensions or drop schedules.
        </p>
        <a
          href="https://wa.me/8801338344292"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-[#25D366] text-white font-oswald text-xs px-6 py-3 rounded-lg font-bold uppercase"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>CHAT WITH SUPPORT (+8801338344292)</span>
        </a>
      </div>

    </div>
  );
};
