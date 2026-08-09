export type ScaleType = '1:64' | '1:43' | '1:32' | '1:24' | '1:18';

export type CategoryType = 'JDM' | 'SUPERCARS' | 'EUROPEAN' | 'MUSCLE' | 'RACING' | 'SUV' | 'CLASSIC';

export type CustomerStockState = 'IN STOCK' | 'LIMITED STOCK' | 'SOLD OUT';

export interface Product {
  id: string;
  name: string;
  slug: string;
  scale: ScaleType;
  category: CategoryType;
  price: number; // in BDT (৳)
  salePrice?: number;
  images: string[];
  description: string;
  material: string;
  color: string;
  dimensions?: string;
  stockState: CustomerStockState;
  exactStock: number; // Private for Admin
  purchaseCost?: number; // Private for Admin
  importCost?: number; // Private for Admin
  packagingCost?: number; // Private for Admin
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimitedDrop?: boolean;
  isComingSoon?: boolean;
  launchDate?: string;
  specifications?: Record<string, string>;
  created_at: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  scale: ScaleType;
  price: number;
  quantity: number;
  subtotal: number;
  purchaseCost?: number; // for admin profit calc
}

export type PaymentMethod = 'bkash' | 'nagad';
export type PaymentStatus = 'VERIFICATION_PENDING' | 'ADVANCE PAYMENT VERIFIED' | 'PAYMENT REJECTED';
export type OrderStatus = 'Pending' | 'Payment Verification' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string; // e.g. KZ-2026-0001
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  district: 'Inside Chattogram' | 'Outside Chattogram';
  address: string;
  items: OrderItem[];
  productSubtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  grandTotal: number;
  payNowAdvance: number; // Delivery charge
  payOnDeliveryCOD: number; // Product total after discount
  paymentMethod: PaymentMethod;
  senderPhone: string;
  transactionId: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  customerNote?: string;
  adminNote?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 10) or fixed amount BDT
  minOrder: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  photoUrl?: string;
  status: 'pending' | 'approved' | 'hidden';
  date: string;
}

export interface InventoryBatch {
  id: string;
  batchNumber: string;
  supplier: string;
  purchaseDate: string;
  quantity: number;
  purchaseCost: number;
  importCost: number;
  packagingCost: number;
  arrivalDate: string;
  totalLandedCost: number;
  notes?: string;
}

export interface BackInStockRequest {
  id: string;
  productId: string;
  productName: string;
  contact: string;
  date: string;
}

export interface StoreSettings {
  bkashNumber: string;
  nagadNumber: string;
  deliveryChargeInside: number;
  deliveryChargeOutside: number;
  bkashEnabled: boolean;
  nagadEnabled: boolean;
  codEnabled: boolean;
  lowStockThreshold: number;
  whatsappNumber: string;
  facebookUrl: string;
  instagramUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
