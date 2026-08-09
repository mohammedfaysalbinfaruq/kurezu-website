import React, { useState } from 'react';
import { MessageCircle, Facebook, Instagram, MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setPhone('');
        setMessage('');
      }, 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      
      <div className="text-center space-y-2">
        <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">GET IN TOUCH</span>
        <h1 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-[var(--text-primary)]">
          CONTACT KUREZU
        </h1>
        <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
          Have a question about a model, drop schedule or order? Connect with our team via WhatsApp or official channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info & Channels */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4">
            <h3 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase border-b border-[var(--border-color)] pb-3">
              OFFICIAL CONTACT INFORMATION
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366]">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="font-oswald text-[var(--text-secondary)] uppercase block">WHATSAPP SUPPORT</span>
                  <a href="https://wa.me/8801338344292" target="_blank" rel="noopener noreferrer" className="font-oswald text-sm font-bold text-[var(--text-primary)] hover:text-[#25D366]">
                    +880 1338-344292
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-lg bg-[#E10600]/10 text-[#E10600]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-oswald text-[var(--text-secondary)] uppercase block">STORE HUB</span>
                  <span className="font-semibold text-[var(--text-primary)]">Chattogram, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4">
            <h3 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase border-b border-[var(--border-color)] pb-3">
              OFFICIAL SOCIAL MEDIA
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://www.facebook.com/officialkurezu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[#1877F2] text-[var(--text-primary)] hover:text-[#1877F2] font-oswald text-xs font-bold uppercase flex items-center justify-center space-x-2 transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span>FACEBOOK</span>
              </a>

              <a
                href="https://www.instagram.com/kurezudiecast"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[#E4405F] text-[var(--text-primary)] hover:text-[#E4405F] font-oswald text-xs font-bold uppercase flex items-center justify-center space-x-2 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>INSTAGRAM</span>
              </a>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 md:p-8 rounded-2xl">
          <h3 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase mb-4">
            SEND DIRECT MESSAGE
          </h3>

          {submitted ? (
            <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-oswald text-base text-emerald-400 font-bold uppercase">MESSAGE SENT</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Thank you for contacting KUREZU! Our team will respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">MOBILE NUMBER</label>
                <input
                  type="tel"
                  placeholder="017..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">YOUR MESSAGE *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E10600] hover:bg-red-700 text-white font-oswald py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>SEND MESSAGE</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
