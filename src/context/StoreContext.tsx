import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  StoreSettings, 
  Order, 
  Coupon, 
  Review, 
  InventoryBatch, 
  CartItem, 
  BackInStockRequest 
} from '../types';
import { 
  initialProducts, 
  initialSettings, 
  initialCoupons, 
  initialReviews, 
  initialBatches, 
  initialOrders 
} from '../data/initialData';

interface StoreContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  products: Product[];
  settings: StoreSettings;
  coupons: Coupon[];
  reviews: Review[];
  batches: InventoryBatch[];
  orders: Order[];
  backInStock: BackInStockRequest[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  isAdmin: boolean;
  adminToken: string | null;
  currentView: string;
  selectedProductId: string | null;
  setView: (view: string, productId?: string | null) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => Promise<{ success: boolean; discount: number; message: string }>;
  appliedCoupon: { code: string; discount: number } | null;
  removeCoupon: () => void;
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  trackOrder: (orderId: string, phone: string) => Promise<Order>;
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
  refreshData: () => Promise<void>;
  // Admin Operations
  updateSettings: (newSettings: StoreSettings) => Promise<void>;
  addProduct: (productData: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, orderStatus: any, paymentStatus: any, adminNote?: string) => Promise<void>;
  addBatch: (batchData: Partial<InventoryBatch>) => Promise<void>;
  addCoupon: (couponData: Partial<Coupon>) => Promise<void>;
  updateReviewStatus: (reviewId: string, status: 'approved' | 'hidden') => Promise<void>;
  submitReview: (reviewData: Partial<Review>) => Promise<void>;
  requestBackInStock: (productId: string, productName: string, contact: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('kurezu_theme');
    return (saved === 'light' ? 'light' : 'dark');
  });

  // Navigation view state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Store data state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [batches, setBatches] = useState<InventoryBatch[]>(initialBatches);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [backInStock, setBackInStock] = useState<BackInStockRequest[]>([]);

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kurezu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kurezu_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Admin auth
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('kurezu_admin_token');
  });
  const isAdmin = !!adminToken;

  // Persist Theme & CSS Class
  useEffect(() => {
    localStorage.setItem('kurezu_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('kurezu_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist Wishlist
  useEffect(() => {
    localStorage.setItem('kurezu_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch initial data from backend API
  const refreshData = async () => {
    try {
      const [resProd, resSet, resCoup, resRev, resBat, resOrd] = await Promise.all([
        fetch('/api/products').then(r => r.ok ? r.json() : initialProducts),
        fetch('/api/settings').then(r => r.ok ? r.json() : initialSettings),
        fetch('/api/coupons').then(r => r.ok ? r.json() : initialCoupons),
        fetch('/api/reviews').then(r => r.ok ? r.json() : initialReviews),
        fetch('/api/batches').then(r => r.ok ? r.json() : initialBatches),
        fetch('/api/orders').then(r => r.ok ? r.json() : initialOrders),
      ]);

      setProducts(resProd);
      setSettings(resSet);
      setCoupons(resCoup);
      setReviews(resRev);
      setBatches(resBat);
      setOrders(resOrd);
    } catch (e) {
      console.warn("Using fallback local data state", e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setView = (view: string, productId: string | null = null) => {
    setCurrentView(view);
    setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stockState === 'SOLD OUT' || product.exactStock <= 0) return;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(newQty, product.exactStock || 10);
        return updated;
      } else {
        return [...prev, { product, quantity: Math.min(quantity, product.exactStock || 10) }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.min(quantity, item.product.exactStock || 10) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon application
  const applyCoupon = async (code: string) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal: subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon({ code: data.code, discount: data.discount });
        return { success: true, discount: data.discount, message: `Coupon ${data.code} applied successfully!` };
      } else {
        return { success: false, discount: 0, message: data.error || 'Invalid coupon' };
      }
    } catch {
      // Local fallback coupon validation
      const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
      if (!found) return { success: false, discount: 0, message: 'Invalid coupon code' };
      if (subtotal < found.minOrder) return { success: false, discount: 0, message: `Minimum order amount is ৳${found.minOrder}` };
      
      const discount = found.discountType === 'percentage' 
        ? Math.round((subtotal * found.value) / 100) 
        : found.value;

      setAppliedCoupon({ code: found.code, discount });
      return { success: true, discount, message: `Coupon ${found.code} applied!` };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Place Order
  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error("Failed to place order");
      const createdOrder: Order = await res.json();
      clearCart();
      refreshData();
      return createdOrder;
    } catch {
      // Local fallback
      const orderCount = orders.length + 1;
      const fallbackOrder: Order = {
        id: `KZ-2026-${String(orderCount).padStart(4, '0')}`,
        createdAt: new Date().toISOString(),
        customerName: orderData.customerName || '',
        phone: orderData.phone || '',
        email: orderData.email || '',
        district: orderData.district || 'Inside Chattogram',
        address: orderData.address || '',
        items: orderData.items || [],
        productSubtotal: orderData.productSubtotal || 0,
        deliveryCharge: orderData.deliveryCharge || 80,
        discount: orderData.discount || 0,
        couponCode: orderData.couponCode,
        grandTotal: orderData.grandTotal || 0,
        payNowAdvance: orderData.payNowAdvance || 80,
        payOnDeliveryCOD: orderData.payOnDeliveryCOD || 0,
        paymentMethod: orderData.paymentMethod || 'bkash',
        senderPhone: orderData.senderPhone || '',
        transactionId: orderData.transactionId || '',
        paymentStatus: 'VERIFICATION_PENDING',
        orderStatus: 'Payment Verification',
        customerNote: orderData.customerNote,
      };

      setOrders(prev => [fallbackOrder, ...prev]);
      clearCart();
      return fallbackOrder;
    }
  };

  // Track Order
  const trackOrder = async (orderId: string, phone: string): Promise<Order> => {
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, phone }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Order not found" }));
        throw new Error(err.error || "Order not found");
      }
      return await res.json();
    } catch (e: any) {
      // Local fallback for static site / GitHub Pages
      const found = orders.find(o => o.id.toUpperCase() === orderId.trim().toUpperCase() && o.phone === phone.trim());
      if (found) return found;
      throw new Error(e?.message || "Order not found");
    }
  };

  // Admin Auth
  const adminLogin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('kurezu_admin_token', data.token);
        setAdminToken(data.token);
        return true;
      }
    } catch {
      if (password === 'kurezu2026' || password === 'admin') {
        localStorage.setItem('kurezu_admin_token', 'kurezu_admin_valid_token_2026');
        setAdminToken('kurezu_admin_valid_token_2026');
        return true;
      }
    }
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem('kurezu_admin_token');
    setAdminToken(null);
    setView('home');
  };

  // Admin Operations
  const updateSettings = async (newSettings: StoreSettings) => {
    setSettings(newSettings);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    }).catch(() => {});
  };

  const addProduct = async (productData: Partial<Product>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (res.ok) refreshData();
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (res.ok) refreshData();
  };

  const deleteProduct = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    refreshData();
  };

  const updateOrderStatus = async (orderId: string, orderStatus: any, paymentStatus: any, adminNote?: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus, paymentStatus, adminNote }),
    });
    refreshData();
  };

  const addBatch = async (batchData: Partial<InventoryBatch>) => {
    await fetch('/api/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchData),
    });
    refreshData();
  };

  const addCoupon = async (couponData: Partial<Coupon>) => {
    await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData),
    });
    refreshData();
  };

  const updateReviewStatus = async (reviewId: string, status: 'approved' | 'hidden') => {
    await fetch(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    refreshData();
  };

  const submitReview = async (reviewData: Partial<Review>) => {
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    refreshData();
  };

  const requestBackInStock = async (productId: string, productName: string, contact: string) => {
    await fetch('/api/back-in-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, productName, contact }),
    });
  };

  return (
    <StoreContext.Provider value={{
      theme,
      toggleTheme,
      products,
      settings,
      coupons,
      reviews,
      batches,
      orders,
      backInStock,
      cart,
      wishlist,
      isAdmin,
      adminToken,
      currentView,
      selectedProductId,
      setView,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      applyCoupon,
      appliedCoupon,
      removeCoupon,
      placeOrder,
      trackOrder,
      adminLogin,
      adminLogout,
      refreshData,
      updateSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      addBatch,
      addCoupon,
      updateReviewStatus,
      submitReview,
      requestBackInStock
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};
