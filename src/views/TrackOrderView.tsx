import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { Search, CheckCircle, Clock, Truck, Package, AlertCircle, ShieldCheck } from 'lucide-react';

export const TrackOrderView: React.FC = () => {
  const { trackOrder } = useStore();

  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setTrackedOrder(null);

    if (!orderId.trim() || !phone.trim()) {
      setErrorMsg("Please enter both Order ID and Mobile Number.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await trackOrder(orderId, phone);
      setTrackedOrder(result);
    } catch (err: any) {
      setErrorMsg(err.message || "Order not found. Please verify Order ID and Mobile Number.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { label: 'ORDER PLACED', status: 'Pending' },
    { label: 'PAYMENT VERIFIED', status: 'Confirmed' },
    { label: 'PROCESSING', status: 'Processing' },
    { label: 'SHIPPED', status: 'Shipped' },
    { label: 'DELIVERED', status: 'Delivered' }
  ];

  const getStepIndex = (status: string) => {
    if (status === 'Cancelled') return -1;
    if (status === 'Delivered') return 4;
    if (status === 'Shipped') return 3;
    if (status === 'Processing') return 2;
    if (status === 'Confirmed') return 1;
    return 0; // Pending / Payment Verification
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      
      <div className="text-center space-y-2">
        <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">LIVE LOGISTICS</span>
        <h1 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-[var(--text-primary)]">
          TRACK YOUR ORDER
        </h1>
        <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
          Enter your unique KUREZU Order ID (e.g. KZ-2026-0001) and Mobile Number to check real-time verification and shipping status.
        </p>
      </div>

      {/* Track Form Box */}
      <div className="glass-card p-6 md:p-8 rounded-2xl shadow-xl">
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">ORDER ID *</label>
            <input
              type="text"
              required
              placeholder="e.g. KZ-2026-0001"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full mt-1 glass-input p-3 rounded-xl text-xs font-mono uppercase text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">MOBILE NUMBER *</label>
            <input
              type="tel"
              required
              placeholder="Mobile Number used at checkout"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 glass-input p-3 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E10600] hover:bg-red-700 text-white font-oswald py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? '...' : 'TRACK'}</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Track Results */}
      {trackedOrder && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 md:p-8 rounded-2xl space-y-8 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[var(--border-color)] pb-4 gap-2">
            <div>
              <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">ORDER REFERENCE</span>
              <h3 className="font-oswald text-2xl font-bold text-[var(--text-primary)]">{trackedOrder.id}</h3>
              <p className="text-[10px] text-[var(--text-secondary)]">Placed on {new Date(trackedOrder.createdAt).toLocaleString()}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase block">CURRENT STATUS</span>
              <span className="font-oswald text-sm font-bold text-[#E10600] bg-[#E10600]/10 px-3 py-1 rounded-md uppercase inline-block mt-0.5">
                {trackedOrder.orderStatus}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="font-oswald text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-6">LOGISTICS TIMELINE</h4>
            
            {trackedOrder.orderStatus === 'Cancelled' ? (
              <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-xl text-center text-red-400 text-xs font-oswald uppercase">
                THIS ORDER HAS BEEN CANCELLED.
              </div>
            ) : (
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
                {steps.map((step, idx) => {
                  const currentIdx = getStepIndex(trackedOrder.orderStatus);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.label} className="flex md:flex-col items-center space-x-3 md:space-x-0 space-y-0 md:space-y-2 flex-1 relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-oswald text-xs font-bold transition-colors ${
                        isCompleted ? 'bg-[#E10600] text-white shadow-lg' : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)]'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span className={`text-[10px] font-oswald tracking-wider uppercase text-center ${
                        isCurrent ? 'text-[#E10600] font-bold' : isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Item Details */}
          <div className="border-t border-[var(--border-color)] pt-6 space-y-4 text-xs">
            <h4 className="font-oswald text-sm font-bold text-[var(--text-primary)] uppercase">ORDER SUMMARY</h4>
            <div className="space-y-3">
              {trackedOrder.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)]">
                  <div className="flex items-center space-x-3">
                    <img src={item.productImage} alt="" className="w-10 h-10 object-cover rounded" />
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{item.productName}</p>
                      <span className="text-[10px] font-oswald text-[var(--text-secondary)]">Scale: {item.scale} • Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-oswald font-bold text-[var(--text-primary)]">৳{item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase block">ADVANCE PAYMENT</span>
                <p className="font-oswald font-bold text-emerald-400">{trackedOrder.paymentStatus}</p>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Advance Delivery Charge ৳{trackedOrder.payNowAdvance} paid via {trackedOrder.paymentMethod.toUpperCase()} (TrxID: {trackedOrder.transactionId})
                </p>
              </div>

              <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase block">CASH ON DELIVERY DUE</span>
                <p className="font-oswald font-bold text-[var(--text-primary)]">৳{trackedOrder.payOnDeliveryCOD.toLocaleString()}</p>
                <p className="text-[10px] text-[var(--text-secondary)]">Shipping to: {trackedOrder.address}, {trackedOrder.district}</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
