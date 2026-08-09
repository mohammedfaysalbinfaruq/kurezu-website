import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Lock, 
  LogOut, 
  BarChart2, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  Tag, 
  Star, 
  Settings as SettingsIcon, 
  Layers, 
  Search, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Bell,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AdminView: React.FC = () => {
  const { 
    isAdmin, 
    adminLogin, 
    adminLogout, 
    orders, 
    products, 
    settings, 
    coupons, 
    reviews, 
    batches, 
    backInStock,
    updateSettings, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    addBatch, 
    addCoupon, 
    updateReviewStatus 
  } = useStore();

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'batches' | 'profit' | 'reviews' | 'coupons' | 'restock' | 'settings'>('analytics');

  // Search/Filter states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // New Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState<any>({
    name: '',
    scale: '1:64',
    category: 'JDM',
    price: 1800,
    salePrice: 0,
    images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'],
    description: '',
    material: 'Die-cast Zinc Alloy',
    color: 'Original Finish',
    exactStock: 10,
    stockState: 'IN STOCK',
    purchaseCost: 900,
    importCost: 150,
    packagingCost: 40,
    isFeatured: false,
    isLimitedDrop: false,
    isNewArrival: false,
    isBestSeller: false,
  });

  // Batch Form State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchForm, setBatchForm] = useState({
    supplier: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    quantity: 20,
    purchaseCost: 20000,
    importCost: 3000,
    packagingCost: 800,
    arrivalDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Coupon Form State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    minOrder: 1000,
    expiryDate: '2026-12-31',
    usageLimit: 100
  });

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState(settings);

  if (!isAdmin) {
    const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');
      const ok = await adminLogin(password);
      if (!ok) {
        setLoginError('Invalid Admin Password. Try "kurezu2026" or "admin".');
      }
    };

    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-2xl space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 bg-[#E10600]/10 text-[#E10600] rounded-full flex items-center justify-center mx-auto border border-[#E10600]/20">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">PROTECTED ROUTE</span>
            <h1 className="font-oswald text-2xl font-bold uppercase text-[var(--text-primary)] mt-1">KUREZU ADMIN PORTAL</h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Authorized access only for inventory, sales & payment verification.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">ADMIN PASSWORD</label>
              <input
                type="password"
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E10600]"
              />
            </div>

            {loginError && (
              <p className="text-[10px] text-red-400">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#E10600] hover:bg-red-700 text-white font-oswald py-3 rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              AUTHENTICATE ADMIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Metrics Calculations
  const pendingVerificationOrders = orders.filter(o => o.paymentStatus === 'VERIFICATION_PENDING');
  const totalSalesRevenue = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const lowStockProducts = products.filter(p => p.exactStock <= settings.lowStockThreshold);

  // Profit Calculations
  const totalEstimatedProfit = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => {
      const orderLandedCost = o.items.reduce((itemSum, item) => itemSum + ((item.purchaseCost || item.price * 0.5) * item.quantity), 0);
      return sum + (o.productSubtotal - orderLandedCost);
    }, 0);

  // Chart Data
  const categoryData = ['JDM', 'SUPERCARS', 'EUROPEAN', 'MUSCLE', 'RACING', 'SUV', 'CLASSIC'].map(cat => ({
    name: cat,
    count: products.filter(p => p.category === cat).length
  }));

  const COLORS = ['#E10600', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#64748B'];

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'ALL' && o.orderStatus !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.transactionId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      await updateProduct(editingProductId, prodForm);
    } else {
      await addProduct(prodForm);
    }
    setIsProductModalOpen(false);
    setEditingProductId(null);
  };

  const handleEditProductClick = (p: any) => {
    setEditingProductId(p.id);
    setProdForm(p);
    setIsProductModalOpen(true);
  };

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalLandedCost = Number(batchForm.purchaseCost) + Number(batchForm.importCost) + Number(batchForm.packagingCost);
    await addBatch({
      ...batchForm,
      totalLandedCost
    });
    setIsBatchModalOpen(false);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCoupon(couponForm);
    setIsCouponModalOpen(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    alert("Store settings updated successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#E10600] font-oswald text-xs tracking-widest uppercase font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>AUTHENTICATED ADMIN SESSION</span>
          </div>
          <h1 className="font-oswald text-2xl md:text-3xl font-bold uppercase text-[var(--text-primary)]">
            KUREZU BUSINESS CONTROL CENTER
          </h1>
        </div>

        <button
          onClick={adminLogout}
          className="bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/60 font-oswald text-xs px-4 py-2.5 rounded-lg uppercase tracking-wider font-semibold inline-flex items-center space-x-2 w-max"
        >
          <LogOut className="w-4 h-4" />
          <span>LOGOUT ADMIN</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex overflow-x-auto space-x-2 pb-2 border-b border-[var(--border-color)]">
        {[
          { id: 'analytics', label: 'ANALYTICS & METRICS', icon: BarChart2 },
          { id: 'orders', label: `ORDERS & PAYMENTS (${pendingVerificationOrders.length})`, icon: ShoppingBag },
          { id: 'products', label: `CATALOG (${products.length})`, icon: Package },
          { id: 'batches', label: 'INVENTORY BATCHES', icon: Layers },
          { id: 'profit', label: 'PROFIT TRACKER', icon: DollarSign },
          { id: 'reviews', label: `REVIEWS (${reviews.filter(r => r.status === 'pending').length})`, icon: Star },
          { id: 'coupons', label: 'PROMO COUPONS', icon: Tag },
          { id: 'restock', label: `RESTOCK REQUESTS (${backInStock.length})`, icon: Bell },
          { id: 'settings', label: 'STORE SETTINGS', icon: SettingsIcon },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`font-oswald text-xs tracking-wider px-4 py-2.5 rounded-lg whitespace-nowrap flex items-center space-x-2 transition-colors uppercase ${
                isActive ? 'bg-[#E10600] text-white font-bold' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS & METRICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-1">
              <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">TOTAL SALES REVENUE</span>
              <p className="font-oswald text-2xl font-bold text-[#E10600]">৳{totalSalesRevenue.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-400">All non-cancelled orders</span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-1">
              <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">TOTAL ORDERS</span>
              <p className="font-oswald text-2xl font-bold text-[var(--text-primary)]">{orders.length}</p>
              <span className="text-[10px] text-amber-400">{pendingVerificationOrders.length} verification pending</span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-1">
              <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">ESTIMATED NET PROFIT</span>
              <p className="font-oswald text-2xl font-bold text-emerald-400">৳{totalEstimatedProfit.toLocaleString()}</p>
              <span className="text-[10px] text-[var(--text-secondary)]">Private admin ledger</span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-1">
              <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">LOW STOCK ALERTS</span>
              <p className="font-oswald text-2xl font-bold text-amber-400">{lowStockProducts.length}</p>
              <span className="text-[10px] text-[var(--text-secondary)]">Threshold ≤ {settings.lowStockThreshold} units</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4">
              <h3 className="font-oswald text-base font-bold uppercase text-[var(--text-primary)]">CATEGORY DISTRIBUTION</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" stroke="#a3a3a3" fontSize={10} />
                    <YAxis stroke="#a3a3a3" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#121212', border: '1px solid #262626', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#E10600" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4">
              <h3 className="font-oswald text-base font-bold uppercase text-[var(--text-primary)]">PRIVATE INVENTORY LOW STOCK ALERTS</h3>
              <div className="space-y-3">
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={p.images[0]} alt="" className="w-8 h-8 object-cover rounded" />
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{p.name}</p>
                          <span className="text-[10px] font-oswald text-[#E10600]">{p.scale} • {p.category}</span>
                        </div>
                      </div>
                      <span className="font-oswald font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded">
                        EXACT STOCK: {p.exactStock}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--text-secondary)]">All models have sufficient stock above threshold.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ORDERS & PAYMENTS VERIFICATION */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search Order ID, Name, Phone, TrxID..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="text-xs font-oswald text-[var(--text-secondary)] uppercase">STATUS:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-oswald text-[var(--text-primary)] p-2 rounded-lg"
              >
                <option value="ALL">ALL ORDERS</option>
                <option value="Payment Verification">PAYMENT VERIFICATION</option>
                <option value="Confirmed">CONFIRMED</option>
                <option value="Processing">PROCESSING</option>
                <option value="Shipped">SHIPPED</option>
                <option value="Delivered">DELIVERED</option>
                <option value="Cancelled">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4">
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[var(--border-color)] pb-3 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-oswald text-lg font-bold text-[var(--text-primary)]">{order.id}</span>
                      <span className={`text-[10px] font-oswald px-2 py-0.5 rounded font-semibold uppercase ${
                        order.paymentStatus === 'ADVANCE PAYMENT VERIFIED' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)]">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-oswald text-[var(--text-secondary)]">ORDER STATUS:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value, order.paymentStatus)}
                      className="bg-[var(--bg-primary)] border border-[#E10600] text-xs font-oswald text-white font-bold px-3 py-1.5 rounded-lg uppercase"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Payment Verification">Payment Verification</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase block">CUSTOMER INFO</span>
                    <p className="font-bold text-[var(--text-primary)]">{order.customerName}</p>
                    <p className="text-[var(--text-secondary)]">{order.phone}</p>
                    <p className="text-[var(--text-secondary)]">{order.address}, {order.district}</p>
                  </div>

                  <div className="bg-[var(--bg-primary)] p-3 rounded-xl border border-[var(--border-color)]">
                    <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase block">bKash / NAGAD ADVANCE TRX</span>
                    <p className="font-mono text-sm font-bold text-[#E10600] mt-0.5">{order.transactionId}</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Method: {order.paymentMethod.toUpperCase()} • Sender: {order.senderPhone}</p>
                    <p className="text-[10px] text-emerald-400 font-bold">Advance Paid: ৳{order.payNowAdvance}</p>

                    {order.paymentStatus === 'VERIFICATION_PENDING' && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Confirmed', 'ADVANCE PAYMENT VERIFIED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-oswald text-[10px] px-3 py-1 rounded font-bold uppercase flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>VERIFY ADVANCE</span>
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Cancelled', 'PAYMENT REJECTED')}
                          className="bg-red-600 hover:bg-red-700 text-white font-oswald text-[10px] px-3 py-1 rounded font-bold uppercase flex items-center space-x-1"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>REJECT</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase block">FINANCIALS</span>
                    <p className="text-[var(--text-secondary)]">Product Subtotal: ৳{order.productSubtotal.toLocaleString()}</p>
                    <p className="text-[var(--text-secondary)]">Delivery Charge: ৳{order.deliveryCharge}</p>
                    <p className="font-oswald font-bold text-[var(--text-primary)] text-sm">Grand Total: ৳{order.grandTotal.toLocaleString()}</p>
                    <p className="font-oswald font-bold text-emerald-400">COD Due: ৳{order.payOnDeliveryCOD.toLocaleString()}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-[var(--border-color)]/50 pt-2 space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                      <span>{item.productName} ({item.scale}) x {item.quantity}</span>
                      <span className="font-oswald font-semibold text-[var(--text-primary)]">৳{item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-oswald text-xl font-bold uppercase">PRODUCT CATALOG MANAGEMENT</h2>
            <button
              onClick={() => {
                setEditingProductId(null);
                setProdForm({
                  name: '',
                  scale: '1:64',
                  category: 'JDM',
                  price: 1800,
                  salePrice: 0,
                  images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'],
                  description: '',
                  material: 'Die-cast Zinc Alloy',
                  color: 'Original Finish',
                  exactStock: 10,
                  stockState: 'IN STOCK',
                  purchaseCost: 900,
                  importCost: 150,
                  packagingCost: 40,
                  isFeatured: false,
                  isLimitedDrop: false,
                  isNewArrival: false,
                  isBestSeller: false,
                });
                setIsProductModalOpen(true);
              }}
              className="bg-[#E10600] text-white font-oswald text-xs px-4 py-2 rounded-lg uppercase tracking-wider font-bold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW DIE-CAST MODEL</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl flex space-x-4">
                <img src={p.images[0]} alt="" className="w-20 h-20 object-cover rounded-lg shrink-0 border border-[var(--border-color)]" />
                <div className="flex-1 space-y-1 text-xs">
                  <span className="text-[10px] font-oswald text-[#E10600] font-semibold uppercase">{p.scale} • {p.category}</span>
                  <h4 className="font-sans font-semibold text-[var(--text-primary)] line-clamp-1">{p.name}</h4>
                  <p className="font-oswald text-sm font-bold text-[var(--text-primary)]">৳{p.price.toLocaleString()}</p>
                  
                  {/* PRIVATE EXACT STOCK FOR ADMIN */}
                  <span className="text-[10px] font-oswald text-amber-400 block font-bold">
                    EXACT INVENTORY STOCK: {p.exactStock} units
                  </span>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleEditProductClick(p)}
                      className="p-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[#E10600] rounded text-[var(--text-primary)]"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                      }}
                      className="p-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-red-500 rounded text-red-400"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BATCH MANAGEMENT */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-oswald text-xl font-bold uppercase">PRIVATE IMPORT BATCH LOGISTICS</h2>
              <p className="text-xs text-[var(--text-secondary)]">Track landed costs, shipping, supplier imports and profit margins per batch.</p>
            </div>
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="bg-[#E10600] text-white font-oswald text-xs px-4 py-2 rounded-lg uppercase tracking-wider font-bold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>RECORD NEW BATCH</span>
            </button>
          </div>

          <div className="space-y-4">
            {batches.map(batch => (
              <div key={batch.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between border-b border-[var(--border-color)] pb-3">
                  <span className="font-oswald text-base font-bold text-[#E10600]">{batch.batchNumber}</span>
                  <span className="text-[var(--text-secondary)]">Arrival: {batch.arrivalDate}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase block">SUPPLIER</span>
                    <p className="font-bold text-[var(--text-primary)]">{batch.supplier}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase block">QUANTITY</span>
                    <p className="font-bold text-[var(--text-primary)]">{batch.quantity} models</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase block">PURCHASE COST</span>
                    <p className="font-bold text-[var(--text-primary)]">৳{batch.purchaseCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase block">LANDED COST</span>
                    <p className="font-bold text-emerald-400">৳{batch.totalLandedCost.toLocaleString()}</p>
                  </div>
                </div>

                {batch.notes && <p className="text-[10px] text-[var(--text-secondary)] italic">Notes: {batch.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PROFIT TRACKER */}
      {activeTab === 'profit' && (
        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4">
            <h2 className="font-oswald text-xl font-bold uppercase text-[var(--text-primary)]">PRIVATE PROFIT & MARGIN CALCULATOR</h2>
            <p className="text-xs text-[var(--text-secondary)]">Calculates selling price vs landed costs across all catalog models.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] font-oswald text-[var(--text-secondary)] uppercase">
                    <th className="py-2">MODEL NAME</th>
                    <th className="py-2">SELLING PRICE</th>
                    <th className="py-2">PURCHASE COST</th>
                    <th className="py-2">IMPORT/PKG COST</th>
                    <th className="py-2">TOTAL LANDED COST</th>
                    <th className="py-2">EST. PROFIT / UNIT</th>
                    <th className="py-2">MARGIN %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {products.map(p => {
                    const price = p.salePrice || p.price;
                    const pCost = p.purchaseCost || Math.round(price * 0.5);
                    const iCost = (p.importCost || 150) + (p.packagingCost || 40);
                    const landed = pCost + iCost;
                    const profitUnit = price - landed;
                    const margin = Math.round((profitUnit / price) * 100);

                    return (
                      <tr key={p.id}>
                        <td className="py-3 font-semibold text-[var(--text-primary)]">{p.name} ({p.scale})</td>
                        <td className="py-3 font-oswald font-bold">৳{price.toLocaleString()}</td>
                        <td className="py-3 font-oswald text-[var(--text-secondary)]">৳{pCost}</td>
                        <td className="py-3 font-oswald text-[var(--text-secondary)]">৳{iCost}</td>
                        <td className="py-3 font-oswald font-bold text-[var(--text-primary)]">৳{landed}</td>
                        <td className="py-3 font-oswald font-bold text-emerald-400">৳{profitUnit}</td>
                        <td className="py-3 font-oswald font-bold text-emerald-400">{margin}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: REVIEWS APPROVAL */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h2 className="font-oswald text-xl font-bold uppercase">CUSTOMER REVIEWS MODERATION</h2>
          <div className="space-y-4">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-oswald font-bold text-[var(--text-primary)]">{rev.customerName} ({rev.rating}★)</span>
                  <span className={`text-[10px] font-oswald px-2 py-0.5 rounded font-bold uppercase ${
                    rev.status === 'approved' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-amber-950/80 text-amber-300'
                  }`}>
                    {rev.status}
                  </span>
                </div>
                <h4 className="font-oswald font-semibold">{rev.title}</h4>
                <p className="text-[var(--text-secondary)]">{rev.comment}</p>
                <div className="flex gap-2 pt-2">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => updateReviewStatus(rev.id, 'approved')}
                      className="bg-emerald-600 text-white font-oswald text-[10px] px-3 py-1 rounded font-bold uppercase"
                    >
                      APPROVE REVIEW
                    </button>
                  )}
                  {rev.status !== 'hidden' && (
                    <button
                      onClick={() => updateReviewStatus(rev.id, 'hidden')}
                      className="bg-red-600 text-white font-oswald text-[10px] px-3 py-1 rounded font-bold uppercase"
                    >
                      HIDE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: PROMO COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-oswald text-xl font-bold uppercase">PROMO COUPONS</h2>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="bg-[#E10600] text-white font-oswald text-xs px-4 py-2 rounded-lg font-bold uppercase"
            >
              CREATE COUPON
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map(c => (
              <div key={c.code} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-mono text-base font-bold text-[#E10600]">{c.code}</span>
                  <span className="text-[10px] font-oswald text-emerald-400 uppercase">ACTIVE</span>
                </div>
                <p className="text-[var(--text-secondary)]">
                  Discount: {c.value}{c.discountType === 'percentage' ? '%' : ' BDT'}
                </p>
                <p className="text-[var(--text-secondary)]">Min Order: ৳{c.minOrder}</p>
                <p className="text-[var(--text-secondary)]">Used: {c.usedCount} times</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: RESTOCK REQUESTS */}
      {activeTab === 'restock' && (
        <div className="space-y-6">
          <h2 className="font-oswald text-xl font-bold uppercase">CUSTOMER BACK-IN-STOCK REQUESTS</h2>
          <div className="space-y-3">
            {backInStock.length > 0 ? (
              backInStock.map(req => (
                <div key={req.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">{req.productName}</h4>
                    <p className="text-[var(--text-secondary)]">Contact: {req.contact}</p>
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)]">{new Date(req.date).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--text-secondary)]">No restock requests submitted yet.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 9: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-2xl space-y-6">
          <h2 className="font-oswald text-xl font-bold uppercase text-[var(--text-primary)]">CONFIGURABLE STORE SETTINGS</h2>
          
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">bKash NUMBER</label>
                <input
                  type="text"
                  value={settingsForm.bkashNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">NAGAD NUMBER</label>
                <input
                  type="text"
                  value={settingsForm.nagadNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">INSIDE CHATTOGRAM DELIVERY (৳)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryChargeInside}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryChargeInside: Number(e.target.value) })}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">OUTSIDE CHATTOGRAM DELIVERY (৳)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryChargeOutside}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryChargeOutside: Number(e.target.value) })}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">LOW STOCK THRESHOLD</label>
              <input
                type="number"
                value={settingsForm.lowStockThreshold}
                onChange={(e) => setSettingsForm({ ...settingsForm, lowStockThreshold: Number(e.target.value) })}
                className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-[var(--text-primary)]"
              />
            </div>

            <button type="submit" className="bg-[#E10600] text-white font-oswald py-3 px-6 rounded-lg font-bold uppercase tracking-wider">
              SAVE STORE SETTINGS
            </button>
          </form>
        </div>
      )}

      {/* PRODUCT ADD/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="font-oswald text-lg font-bold uppercase">{editingProductId ? 'EDIT DIE-CAST MODEL' : 'ADD DIE-CAST MODEL'}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">MODEL NAME</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">SCALE</label>
                  <select
                    value={prodForm.scale}
                    onChange={(e) => setProdForm({ ...prodForm, scale: e.target.value })}
                    className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg text-[var(--text-primary)]"
                  >
                    <option value="1:64">1:64</option>
                    <option value="1:43">1:43</option>
                    <option value="1:32">1:32</option>
                    <option value="1:24">1:24</option>
                    <option value="1:18">1:18</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">CATEGORY</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg text-[var(--text-primary)]"
                  >
                    <option value="JDM">JDM</option>
                    <option value="SUPERCARS">SUPERCARS</option>
                    <option value="EUROPEAN">EUROPEAN</option>
                    <option value="MUSCLE">MUSCLE</option>
                    <option value="RACING">RACING</option>
                    <option value="SUV">SUV</option>
                    <option value="CLASSIC">CLASSIC</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">EXACT STOCK</label>
                  <input
                    type="number"
                    value={prodForm.exactStock}
                    onChange={(e) => setProdForm({ ...prodForm, exactStock: Number(e.target.value) })}
                    className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">PRICE (BDT)</label>
                  <input
                    type="number"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">PURCHASE COST (BDT)</label>
                  <input
                    type="number"
                    value={prodForm.purchaseCost}
                    onChange={(e) => setProdForm({ ...prodForm, purchaseCost: Number(e.target.value) })}
                    className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">IMAGE URL</label>
                <input
                  type="text"
                  value={prodForm.images[0]}
                  onChange={(e) => setProdForm({ ...prodForm, images: [e.target.value] })}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg text-[var(--text-primary)]"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isFeatured}
                    onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isLimitedDrop}
                    onChange={(e) => setProdForm({ ...prodForm, isLimitedDrop: e.target.checked })}
                  />
                  <span>Limited Drop</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-[#E10600] text-white font-oswald py-2.5 px-6 rounded-lg uppercase font-bold">
                  SAVE PRODUCT
                </button>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="bg-[var(--bg-primary)] text-[var(--text-secondary)] font-oswald py-2.5 px-4 rounded-lg uppercase">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BATCH MODAL */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="font-oswald text-lg font-bold uppercase">RECORD IMPORT BATCH</h3>
            <form onSubmit={handleSaveBatch} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">SUPPLIER NAME</label>
                <input
                  type="text"
                  required
                  value={batchForm.supplier}
                  onChange={(e) => setBatchForm({ ...batchForm, supplier: e.target.value })}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">QUANTITY</label>
                  <input
                    type="number"
                    value={batchForm.quantity}
                    onChange={(e) => setBatchForm({ ...batchForm, quantity: Number(e.target.value) })}
                    className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">PURCHASE COST (৳)</label>
                  <input
                    type="number"
                    value={batchForm.purchaseCost}
                    onChange={(e) => setBatchForm({ ...batchForm, purchaseCost: Number(e.target.value) })}
                    className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-[#E10600] text-white font-oswald py-2.5 px-6 rounded-lg uppercase font-bold">
                  RECORD BATCH
                </button>
                <button type="button" onClick={() => setIsBatchModalOpen(false)} className="bg-[var(--bg-primary)] text-[var(--text-secondary)] font-oswald py-2.5 px-4 rounded-lg uppercase">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="font-oswald text-lg font-bold uppercase">CREATE PROMO COUPON</h3>
            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">COUPON CODE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KUREZU20"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">TYPE</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                    className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed BDT (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-oswald text-[var(--text-secondary)] uppercase">VALUE</label>
                  <input
                    type="number"
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                    className="w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2.5 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-[#E10600] text-white font-oswald py-2.5 px-6 rounded-lg uppercase font-bold">
                  SAVE COUPON
                </button>
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="bg-[var(--bg-primary)] text-[var(--text-secondary)] font-oswald py-2.5 px-4 rounded-lg uppercase">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
