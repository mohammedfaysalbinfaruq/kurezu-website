import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, ArrowRight, Tag, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    setView, 
    applyCoupon, 
    appliedCoupon, 
    removeCoupon 
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ success: boolean; message: string } | null>(null);

  const productSubtotal = cart.reduce(
    (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 
    0
  );

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const estimatedTotal = Math.max(0, productSubtotal - discount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const result = await applyCoupon(couponCodeInput);
    setCouponStatus({ success: result.success, message: result.message });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full flex items-center justify-center mx-auto text-[var(--text-secondary)]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-oswald text-3xl font-bold uppercase text-[var(--text-primary)]">YOUR CART IS EMPTY</h2>
        <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
          Explore our collection of premium die-cast cars and add your favorite JDM and supercar models to your cart.
        </p>
        <button
          onClick={() => setView('shop')}
          className="bg-[#E10600] text-white font-oswald py-3 px-8 rounded-xl text-sm font-semibold tracking-wider uppercase inline-flex items-center space-x-2"
        >
          <span>BROWSE DIE-CAST MODELS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div>
          <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">YOUR SELECTION</span>
          <h1 className="font-oswald text-3xl font-bold uppercase text-[var(--text-primary)]">SHOPPING CART</h1>
        </div>
        <button
          onClick={() => setView('shop')}
          className="text-xs font-oswald text-[var(--text-secondary)] hover:text-[#E10600] flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>CONTINUE SHOPPING</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => {
            const itemPrice = product.salePrice || product.price;
            const lineTotal = itemPrice * quantity;

            return (
              <div 
                key={product.id}
                className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg border border-[var(--border-color)] shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-oswald text-[#E10600] uppercase font-semibold">
                      {product.scale} • {product.category}
                    </span>
                    <h3 className="font-sans text-xs font-semibold text-[var(--text-primary)] line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="font-oswald text-sm font-bold text-[var(--text-primary)]">
                      ৳{itemPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border-color)]">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)]">
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="px-2.5 py-1 text-xs hover:text-[#E10600]"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-oswald text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="px-2.5 py-1 text-xs hover:text-[#E10600]"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-oswald text-base font-bold text-[var(--text-primary)] min-w-[80px] text-right">
                    ৳{lineTotal.toLocaleString()}
                  </span>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="space-y-6">
          
          {/* Coupon Box */}
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h3 className="font-oswald text-sm font-bold text-[var(--text-primary)] uppercase flex items-center space-x-2">
              <Tag className="w-4 h-4 text-[#E10600]" />
              <span>PROMO / COUPON CODE</span>
            </h3>

            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. KUREZU10)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 glass-input rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] uppercase focus:outline-none focus:border-[#E10600]"
                  />
                  <button
                    type="submit"
                    className="bg-[#E10600] text-white font-oswald text-xs px-4 py-2 rounded-xl font-semibold uppercase"
                  >
                    APPLY
                  </button>
                </div>
                {couponStatus && (
                  <p className={`text-[10px] ${couponStatus.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {couponStatus.message}
                  </p>
                )}
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Available promo codes: <span className="text-[#E10600] font-mono">KUREZU10</span>, <span className="text-[#E10600] font-mono">FIRSTORDER</span>
                </p>
              </form>
            ) : (
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-oswald font-bold text-emerald-400 uppercase">
                    COUPON: {appliedCoupon.code}
                  </span>
                  <p className="text-[10px] text-emerald-300">Discount of ৳{appliedCoupon.discount} applied!</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-oswald text-red-400 underline hover:text-red-300"
                >
                  REMOVE
                </button>
              </div>
            )}
          </div>

          {/* Subtotal Summary Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-oswald text-base font-bold text-[var(--text-primary)] uppercase border-b border-[var(--border-color)] pb-3">
              SUMMARY
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Product Subtotal</span>
                <span className="font-oswald font-semibold text-[var(--text-primary)]">৳{productSubtotal.toLocaleString()}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-oswald font-semibold">-৳{appliedCoupon.discount}</span>
                </div>
              )}

              <div className="flex justify-between text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]">
                <span>Delivery Charge</span>
                <span className="font-oswald text-[var(--text-secondary)]">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-[var(--border-color)] pt-3 flex justify-between items-baseline">
              <span className="font-oswald text-sm font-bold uppercase text-[var(--text-primary)]">ESTIMATED PRODUCT TOTAL</span>
              <span className="font-oswald text-2xl font-bold text-[#E10600]">
                ৳{estimatedTotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => setView('checkout')}
              className="w-full bg-[#E10600] hover:bg-red-700 text-white font-oswald py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-600/30"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-[var(--text-secondary)] text-center">
              Delivery charge is paid in advance via bKash/Nagad. Product amount is paid as Cash on Delivery.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
