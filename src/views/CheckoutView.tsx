import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import { 
  ShieldCheck, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Phone,
  Lock,
  Copy,
  Check
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { cart, settings, appliedCoupon, placeOrder, setView } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState<'Inside Chattogram' | 'Outside Chattogram'>('Inside Chattogram');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderSuccess, setPlacedOrderSuccess] = useState<any | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Calculations
  const productSubtotal = cart.reduce(
    (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 
    0
  );
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const productTotalAfterDiscount = Math.max(0, productSubtotal - discount);

  const deliveryCharge = district === 'Inside Chattogram' 
    ? settings.deliveryChargeInside 
    : settings.deliveryChargeOutside;

  const grandTotal = productTotalAfterDiscount + deliveryCharge;

  // Advance Payment = Delivery Charge
  const payNowAdvance = deliveryCharge;
  // Cash on Delivery = Product Amount
  const payOnDeliveryCOD = productTotalAfterDiscount;

  const currentPaymentNumber = paymentMethod === 'bkash' ? settings.bkashNumber : settings.nagadNumber;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentPaymentNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address || !senderPhone || !transactionId) {
      alert("Please fill in all required fields including Sender Mobile Number and Transaction ID.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        scale: item.product.scale,
        price: item.product.salePrice || item.product.price,
        quantity: item.quantity,
        subtotal: (item.product.salePrice || item.product.price) * item.quantity,
        purchaseCost: item.product.purchaseCost
      }));

      const newOrder = await placeOrder({
        customerName,
        phone,
        email,
        district,
        address,
        items: orderItems,
        productSubtotal,
        deliveryCharge,
        discount,
        couponCode: appliedCoupon?.code,
        grandTotal,
        payNowAdvance,
        payOnDeliveryCOD,
        paymentMethod,
        senderPhone,
        transactionId,
        customerNote: note,
      });

      setPlacedOrderSuccess(newOrder);
    } catch (err) {
      alert("Error placing order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">
            ORDER SUBMITTED SUCCESSFULLY
          </span>
          <h1 className="font-oswald text-3xl sm:text-4xl font-bold uppercase text-[var(--text-primary)]">
            ORDER ID: {placedOrderSuccess.id}
          </h1>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl text-left space-y-4 max-w-xl mx-auto text-xs">
          <div className="flex justify-between border-b border-[var(--border-color)] pb-3">
            <span className="text-[var(--text-secondary)] font-oswald uppercase">PAYMENT STATUS</span>
            <span className="text-amber-400 font-oswald font-bold uppercase animate-pulse">
              {placedOrderSuccess.paymentStatus}
            </span>
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed">
            Your delivery charge advance payment of <span className="text-[#E10600] font-bold">৳{placedOrderSuccess.payNowAdvance}</span> via {placedOrderSuccess.paymentMethod.toUpperCase()} (TrxID: {placedOrderSuccess.transactionId}) has been submitted and will be manually verified by our team.
          </p>

          <div className="bg-[var(--bg-primary)] p-3 rounded-lg space-y-1">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Cash on Delivery Due:</span>
              <span className="font-oswald font-bold text-[var(--text-primary)]">৳{placedOrderSuccess.payOnDeliveryCOD.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Delivery Address:</span>
              <span className="text-[var(--text-primary)]">{placedOrderSuccess.address}, {placedOrderSuccess.district}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setView('track-order')}
            className="w-full sm:w-auto bg-[#E10600] text-white font-oswald py-3 px-8 rounded-xl font-semibold tracking-wider uppercase"
          >
            TRACK YOUR ORDER
          </button>
          <button
            onClick={() => setView('shop')}
            className="w-full sm:w-auto bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-oswald py-3 px-8 rounded-xl font-semibold tracking-wider uppercase"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-oswald text-2xl uppercase">Cart is empty</p>
        <button onClick={() => setView('shop')} className="bg-[#E10600] text-white font-oswald px-6 py-2 rounded-lg">
          RETURN TO SHOP
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      <div>
        <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">SECURE CHECKOUT</span>
        <h1 className="font-oswald text-3xl font-bold uppercase text-[var(--text-primary)]">COMPLETE YOUR ORDER</h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Delivery Details & Payment Inputs */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Delivery Address */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h2 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase flex items-center space-x-2 border-b border-[var(--border-color)] pb-3">
              <MapPin className="w-5 h-5 text-[#E10600]" />
              <span>1. CUSTOMER & DELIVERY INFORMATION</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">FULL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="Collector Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full mt-1 glass-input p-3 rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">MOBILE NUMBER *</label>
                <input
                  type="tel"
                  required
                  placeholder="01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 glass-input p-3 rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">EMAIL ADDRESS (OPTIONAL)</label>
                <input
                  type="email"
                  placeholder="collector@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">DELIVERY LOCATION *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value as any)}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                >
                  <option value="Inside Chattogram">Inside Chattogram (৳{settings.deliveryChargeInside})</option>
                  <option value="Outside Chattogram">Outside Chattogram (৳{settings.deliveryChargeOutside})</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">FULL DELIVERY ADDRESS *</label>
              <textarea
                required
                rows={2}
                placeholder="House no, Road no, Area / Thana, District..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div className="text-xs">
              <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">ORDER NOTE (OPTIONAL)</label>
              <input
                type="text"
                placeholder="Any special instruction for delivery..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
              />
            </div>
          </div>

          {/* Section 2: Advance Payment Instructions (bKash / Nagad) */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase flex items-center space-x-2 border-b border-[var(--border-color)] pb-3">
                <ShieldCheck className="w-5 h-5 text-[#E10600]" />
                <span>2. ADVANCE DELIVERY PAYMENT (bKash / Nagad)</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                As per KUREZU store policy, <span className="text-[#E10600] font-bold">Delivery Charge (৳{deliveryCharge})</span> is paid in advance. Product total <span className="text-[var(--text-primary)] font-bold">(৳{productTotalAfterDiscount.toLocaleString()})</span> is paid via Cash on Delivery upon receiving your package.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4">
              {settings.bkashEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-xl border font-oswald font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                    paymentMethod === 'bkash'
                      ? 'bg-[#D12053]/20 border-[#D12053] text-white shadow'
                      : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#D12053]" />
                  <span>bKash ADVANCE</span>
                </button>
              )}

              {settings.nagadEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-xl border font-oswald font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                    paymentMethod === 'nagad'
                      ? 'bg-[#F7931E]/20 border-[#F7931E] text-white shadow'
                      : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#F7931E]" />
                  <span>NAGAD ADVANCE</span>
                </button>
              )}
            </div>

            {/* Payment Instructions Box */}
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-5 rounded-xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <span className="font-oswald text-[var(--text-secondary)] uppercase">
                  OFFICIAL KUREZU {paymentMethod.toUpperCase()} NUMBER:
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="font-oswald text-sm font-bold text-[#E10600] bg-[#E10600]/10 px-3 py-1 rounded flex items-center space-x-1"
                >
                  <span>{currentPaymentNumber}</span>
                  {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="space-y-2 text-[var(--text-secondary)] leading-relaxed">
                <p className="font-semibold text-[var(--text-primary)]">INSTRUCTIONS:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open your {paymentMethod.toUpperCase()} App or dial USSD menu.</li>
                  <li>Send exact delivery charge of <span className="text-[#E10600] font-bold">৳{deliveryCharge}</span> to <span className="font-mono text-[var(--text-primary)]">{currentPaymentNumber}</span>.</li>
                  <li>Copy the 10-character Transaction ID (TrxID) from SMS/App.</li>
                  <li>Fill in your Sender Mobile Number and Transaction ID below and submit order.</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">SENDER MOBILE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Your bKash/Nagad Number"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">TRANSACTION ID (TrxID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BK8X92M01Q"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)] font-mono uppercase focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Order Summary & Total Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-6 sticky top-24">
            <h2 className="font-oswald text-lg font-bold text-[var(--text-primary)] uppercase border-b border-[var(--border-color)] pb-3">
              ORDER BREAKDOWN ({cart.length} ITEMS)
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={product.images[0]} alt="" className="w-10 h-10 object-cover rounded border border-[var(--border-color)]" />
                    <div>
                      <p className="font-sans font-medium text-[var(--text-primary)] line-clamp-1">{product.name}</p>
                      <span className="text-[10px] text-[var(--text-secondary)] font-oswald">{product.scale} • Qty: {quantity}</span>
                    </div>
                  </div>
                  <span className="font-oswald font-bold text-[var(--text-primary)]">
                    ৳{((product.salePrice || product.price) * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-[var(--border-color)] pt-4 space-y-2 text-xs">
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

              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Delivery Charge ({district})</span>
                <span className="font-oswald font-semibold text-[var(--text-primary)]">৳{deliveryCharge}</span>
              </div>

              <div className="flex justify-between border-t border-[var(--border-color)] pt-2 font-bold text-sm text-[var(--text-primary)]">
                <span>TOTAL ORDER VALUE</span>
                <span className="font-oswald text-base">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* CLEAR PAYMENT SUMMARY BOX */}
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between bg-[#E10600]/10 border border-[#E10600]/20 p-3 rounded-lg">
                <div>
                  <span className="text-[10px] font-oswald text-[#E10600] uppercase font-bold block">1. PAY NOW (ADVANCE)</span>
                  <span className="text-xs text-[var(--text-secondary)]">Delivery Charge via {paymentMethod.toUpperCase()}</span>
                </div>
                <span className="font-oswald text-lg font-bold text-[#E10600]">৳{payNowAdvance}</span>
              </div>

              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                <div>
                  <span className="text-[10px] font-oswald text-emerald-400 uppercase font-bold block">2. PAY ON DELIVERY (COD)</span>
                  <span className="text-xs text-[var(--text-secondary)]">Product Amount upon receipt</span>
                </div>
                <span className="font-oswald text-lg font-bold text-emerald-400">৳{payOnDeliveryCOD.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E10600] hover:bg-red-700 text-white font-oswald py-4 rounded-xl font-bold tracking-wider uppercase text-base flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-600/30 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'SUBMITTING ORDER...' : 'SUBMIT ORDER FOR VERIFICATION'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center space-x-1 text-[10px] text-[var(--text-secondary)]">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Your payment info is verified manually by KUREZU team before shipment.</span>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
};
