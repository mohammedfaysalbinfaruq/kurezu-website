import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  Share2, 
  Check, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Bell,
  ArrowLeft,
  X
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    setView, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    reviews,
    submitReview,
    requestBackInStock
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyContact, setNotifyContact] = useState('');

  // Review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-oswald text-2xl uppercase">Product Not Found</p>
        <button onClick={() => setView('shop')} className="bg-[#E10600] text-white font-oswald px-6 py-2 rounded-lg">
          RETURN TO SHOP
        </button>
      </div>
    );
  }

  const isSoldOut = product.stockState === 'SOLD OUT' || product.exactStock <= 0;
  const isWishlisted = isInWishlist(product.id);
  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    addToCart(product, quantity);
    setView('checkout');
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyContact.trim()) {
      requestBackInStock(product.id, product.name, notifyContact);
      alert("Thank you! We will alert you on WhatsApp/Email when restocked.");
      setIsNotifyModalOpen(false);
      setNotifyContact('');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewName && reviewTitle && reviewComment) {
      submitReview({
        productId: product.id,
        customerName: reviewName,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        verifiedPurchase: true,
      });
      alert("Thank you! Your review has been submitted for admin verification.");
      setIsReviewModalOpen(false);
      setReviewName('');
      setReviewTitle('');
      setReviewComment('');
    }
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.scale === product.scale))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      
      {/* Back to Shop */}
      <button
        onClick={() => setView('shop')}
        className="inline-flex items-center space-x-2 text-xs font-oswald tracking-wider text-[var(--text-secondary)] hover:text-[#E10600] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO CATALOG</span>
      </button>

      {/* Product Detail Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-neutral-900 border border-[var(--border-color)] rounded-2xl overflow-hidden relative shadow-lg">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Scale badge */}
            <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white font-oswald text-xs px-3 py-1 rounded border border-white/20 uppercase tracking-widest">
              SCALE {product.scale}
            </span>

            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                isWishlisted ? 'bg-[#E10600] text-white' : 'bg-black/50 text-white/80 hover:bg-black/80'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx ? 'border-[#E10600]' : 'border-[var(--border-color)] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center space-x-2 text-xs font-oswald tracking-widest text-[#E10600] uppercase font-semibold">
              <span>{product.category}</span>
              <span>•</span>
              <span>{product.scale} SCALE</span>
            </div>

            <h1 className="font-oswald text-2xl sm:text-4xl font-bold text-[var(--text-primary)] uppercase tracking-tight mt-1">
              {product.name}
            </h1>

            {/* Customer Stock Status */}
            <div className="mt-3 flex items-center space-x-3">
              {isSoldOut ? (
                <span className="bg-red-950/80 text-red-400 border border-red-500/30 text-xs font-oswald font-semibold px-3 py-1 rounded tracking-wider uppercase">
                  SOLD OUT
                </span>
              ) : product.stockState === 'LIMITED STOCK' ? (
                <span className="bg-amber-950/80 text-amber-300 border border-amber-500/30 text-xs font-oswald font-semibold px-3 py-1 rounded tracking-wider uppercase animate-pulse">
                  LIMITED STOCK AVAILABLE
                </span>
              ) : (
                <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs font-oswald font-semibold px-3 py-1 rounded tracking-wider uppercase">
                  IN STOCK • READY TO SHIP
                </span>
              )}

              {/* Verified Inspection Badge */}
              <span className="text-xs text-[var(--text-secondary)] flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-[#E10600]" />
                <span>KUREZU Quality Checked</span>
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 flex items-baseline space-x-4">
            <span className="font-oswald text-3xl font-bold text-[var(--text-primary)]">
              ৳{(product.salePrice || product.price).toLocaleString()}
            </span>
            {product.salePrice && (
              <span className="font-oswald text-base text-[var(--text-secondary)] line-through">
                ৳{product.price.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-emerald-500 font-oswald uppercase tracking-wider ml-auto">
              CASH ON DELIVERY
            </span>
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg">
              <span className="text-[var(--text-secondary)] block uppercase font-oswald">MATERIAL</span>
              <span className="font-medium text-[var(--text-primary)] mt-0.5 block">{product.material}</span>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg">
              <span className="text-[var(--text-secondary)] block uppercase font-oswald">COLOR / FINISH</span>
              <span className="font-medium text-[var(--text-primary)] mt-0.5 block">{product.color}</span>
            </div>
          </div>

          {/* Quantity & Buy Controls */}
          {!isSoldOut ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-oswald text-[var(--text-secondary)] uppercase tracking-wider">QUANTITY:</span>
                <div className="flex items-center border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-sm hover:text-[#E10600]"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-oswald font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-sm hover:text-[#E10600]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#E10600] text-[var(--text-primary)] font-oswald py-3.5 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 tracking-wider transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 text-[#E10600]" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-[#E10600] hover:bg-red-700 text-white font-oswald py-3.5 px-6 rounded-xl font-bold tracking-wider transition-colors shadow-lg shadow-red-600/30"
                >
                  BUY NOW (COD)
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 space-y-3">
              <p className="text-xs text-red-300 font-medium">
                This model is currently sold out. Submit your contact details below to be notified immediately when restocked.
              </p>
              <button
                onClick={() => setIsNotifyModalOpen(true)}
                className="w-full bg-[#E10600] hover:bg-red-700 text-white font-oswald py-3 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center space-x-2"
              >
                <Bell className="w-4 h-4" />
                <span>NOTIFY ME WHEN AVAILABLE</span>
              </button>
            </div>
          )}

          {/* Direct WhatsApp Chat */}
          <a
            href="https://wa.me/8801338344292"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-oswald py-3 px-4 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center space-x-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>CHAT WITH US ON WHATSAPP (+8801338344292)</span>
          </a>

          {/* Description & Specifications */}
          <div className="border-t border-[var(--border-color)] pt-6 space-y-4">
            <h3 className="font-oswald text-base text-[var(--text-primary)] uppercase tracking-wider">DESCRIPTION</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">{product.description}</p>

            {product.specifications && (
              <div className="pt-2">
                <h4 className="font-oswald text-xs text-[var(--text-primary)] uppercase tracking-wider mb-2">SPECIFICATIONS</h4>
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg divide-y divide-[var(--border-color)] text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="p-2.5 flex justify-between">
                      <span className="text-[var(--text-secondary)] font-oswald">{key}</span>
                      <span className="text-[var(--text-primary)] font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Share & Copy */}
          <div className="flex items-center space-x-4 border-t border-[var(--border-color)] pt-4 text-xs">
            <span className="font-oswald text-[var(--text-secondary)] uppercase">SHARE:</span>
            <button
              onClick={handleShareFacebook}
              className="text-[var(--text-secondary)] hover:text-[#1877F2] font-oswald flex items-center space-x-1"
            >
              <Share2 className="w-4 h-4" />
              <span>Facebook</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="text-[var(--text-secondary)] hover:text-[#E10600] font-oswald flex items-center space-x-1"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Product Reviews Section */}
      <section className="border-t border-[var(--border-color)] pt-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-oswald text-2xl font-bold text-[var(--text-primary)] uppercase">CUSTOMER REVIEWS & RATINGS</h2>
            <p className="text-xs text-[var(--text-secondary)]">Verified collector reviews and ratings for this die-cast model.</p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#E10600] text-[var(--text-primary)] font-oswald text-xs px-5 py-2.5 rounded-lg tracking-wider uppercase font-semibold"
          >
            WRITE A REVIEW
          </button>
        </div>

        {productReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productReviews.map(rev => (
              <div key={rev.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-neutral-600'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)]">{rev.date}</span>
                </div>

                <h4 className="font-oswald text-sm font-semibold text-[var(--text-primary)]">{rev.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{rev.comment}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]/50 text-[10px] text-[var(--text-secondary)]">
                  <span className="font-oswald text-[var(--text-primary)]">{rev.customerName}</span>
                  {rev.verifiedPurchase && (
                    <span className="text-emerald-400 font-oswald flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Purchase</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] p-6 rounded-xl text-center">
            No reviews yet for this model. Be the first collector to review!
          </p>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[var(--border-color)] pt-10 space-y-6">
          <h2 className="font-oswald text-2xl font-bold text-[var(--text-primary)] uppercase">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* NOTIFY BACK-IN-STOCK MODAL */}
      {isNotifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card border border-white/20 p-6 rounded-2xl max-w-md w-full relative shadow-2xl">
            <button onClick={() => setIsNotifyModalOpen(false)} className="absolute top-4 right-4 text-[var(--text-secondary)]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-oswald text-lg font-bold uppercase mb-2">NOTIFY ME WHEN RESTOCKED</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Enter your WhatsApp mobile number or email. We will notify you the moment this model arrives in Bangladesh.
            </p>
            <form onSubmit={handleNotifySubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Mobile Number (017...) or Email..."
                value={notifyContact}
                onChange={(e) => setNotifyContact(e.target.value)}
                className="w-full glass-input p-3 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
              />
              <button type="submit" className="w-full bg-[#E10600] hover:bg-red-700 text-white font-oswald py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-900/30">
                SUBMIT RESTOCK REQUEST
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card border border-white/20 p-6 rounded-2xl max-w-md w-full relative shadow-2xl">
            <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 text-[var(--text-secondary)]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-oswald text-lg font-bold uppercase mb-4">WRITE COLLECTOR REVIEW</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">YOUR NAME</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Your Name..."
                  className="w-full glass-input p-2.5 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">RATING</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full glass-input p-2.5 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                >
                  <option value={5} className="bg-slate-900 text-white">5 Stars ★★★★★ - Masterpiece</option>
                  <option value={4} className="bg-slate-900 text-white">4 Stars ★★★★☆ - Excellent</option>
                  <option value={3} className="bg-slate-900 text-white">3 Stars ★★★☆☆ - Good</option>
                  <option value={2} className="bg-slate-900 text-white">2 Stars ★★☆☆☆ - Fair</option>
                  <option value={1} className="bg-slate-900 text-white">1 Star ★☆☆☆☆ - Poor</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">REVIEW TITLE</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your review..."
                  className="w-full glass-input p-2.5 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">WRITTEN REVIEW</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about the die-cast build quality, packaging, or delivery..."
                  className="w-full glass-input p-2.5 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <button type="submit" className="w-full bg-[#E10600] hover:bg-red-700 text-white font-oswald py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-900/30">
                SUBMIT REVIEW FOR VERIFICATION
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
