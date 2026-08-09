import { Product, StoreSettings, Coupon, Review, InventoryBatch, Order } from '../types';

export const initialSettings: StoreSettings = {
  bkashNumber: '01338344292',
  nagadNumber: '01338344292',
  deliveryChargeInside: 80,
  deliveryChargeOutside: 150,
  bkashEnabled: true,
  nagadEnabled: true,
  codEnabled: true,
  lowStockThreshold: 5,
  whatsappNumber: '8801338344292',
  facebookUrl: 'https://www.facebook.com/officialkurezu',
  instagramUrl: 'https://www.instagram.com/kurezudiecast',
};

export const initialCoupons: Coupon[] = [
  {
    code: 'KUREZU10',
    discountType: 'percentage',
    value: 10,
    minOrder: 1500,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 34,
    isActive: true,
  },
  {
    code: 'FIRSTORDER',
    discountType: 'fixed',
    value: 200,
    minOrder: 2000,
    expiryDate: '2026-12-31',
    usageLimit: 1000,
    usedCount: 89,
    isActive: true,
  },
  {
    code: 'LAUNCH2026',
    discountType: 'percentage',
    value: 15,
    minOrder: 3000,
    expiryDate: '2026-09-30',
    usageLimit: 200,
    usedCount: 12,
    isActive: true,
  },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Nissan Skyline GT-R R34 V-Spec II (Bayside Blue)',
    slug: 'nissan-skyline-gtr-r34-bayside-blue',
    scale: '1:64',
    category: 'JDM',
    price: 1850,
    salePrice: 1650,
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Precision die-cast 1:64 model of the legendary Nissan Skyline GT-R R34 in iconic Bayside Blue. Features opening hood, detailed RB26DETT twin-turbo engine bay, rubber real-rider tires, and gold NISMO LM GT4 rims.',
    material: 'Die-cast Zinc Alloy, ABS, Rubber Tires',
    color: 'Bayside Blue',
    dimensions: '7.2 x 3.0 x 2.1 cm',
    stockState: 'IN STOCK',
    exactStock: 18,
    purchaseCost: 950,
    importCost: 150,
    packagingCost: 40,
    isFeatured: true,
    isBestSeller: true,
    isLimitedDrop: false,
    specifications: {
      'Engine Bay': 'Detailed RB26DETT Twin-Turbo',
      'Wheels': 'NISMO LM GT4 Gold Finish',
      'Chassis': 'Full Die-Cast Metal Chassis',
      'Packaging': 'Acrylic Display Case + Collector Box'
    },
    created_at: '2026-01-15'
  },
  {
    id: 'prod-2',
    name: 'Toyota Supra MK4 Turbo (1998 Renaissance Red)',
    slug: 'toyota-supra-mk4-renaissance-red',
    scale: '1:64',
    category: 'JDM',
    price: 1950,
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The holy grail JDM icon. 1:64 scale die-cast replica of the 1998 Toyota Supra MK4 Turbo with iconic rear wing, detailed 2JZ-GTE engine block, opening hood, and clear acrylic display cover.',
    material: 'Die-cast Zinc Alloy, Rubber Tires',
    color: 'Renaissance Red',
    dimensions: '7.1 x 2.9 x 2.0 cm',
    stockState: 'LIMITED STOCK',
    exactStock: 3,
    purchaseCost: 1050,
    importCost: 160,
    packagingCost: 40,
    isFeatured: true,
    isLimitedDrop: true,
    specifications: {
      'Engine': '2JZ-GTE 3.0L Twin-Turbo',
      'Interior': 'Right-Hand Drive Twin-Cockpit',
      'License Plate': 'KUREZU JDM'
    },
    created_at: '2026-02-01'
  },
  {
    id: 'prod-3',
    name: 'Porsche 911 GT3 RS (992 Acid Green / Carbon)',
    slug: 'porsche-911-gt3-rs-acid-green',
    scale: '1:32',
    category: 'EUROPEAN',
    price: 3800,
    salePrice: 3450,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Track monster in 1:32 scale. High-detail die-cast Porsche 911 GT3 RS with active wing aero elements, opening gullwing/side doors, steerable front wheels, and carbon fiber texture hood accents.',
    material: 'Die-cast Metal, ABS, Soft Rubber',
    color: 'Acid Green / Exposed Carbon',
    dimensions: '14.2 x 6.1 x 4.0 cm',
    stockState: 'IN STOCK',
    exactStock: 12,
    purchaseCost: 1900,
    importCost: 280,
    packagingCost: 70,
    isFeatured: true,
    isNewArrival: true,
    specifications: {
      'Doors': 'Opening Driver & Passenger Doors',
      'Steering': 'Working Front Axle Steering',
      'Exhaust': 'Dual Central Titanium Finish Tips'
    },
    created_at: '2026-02-10'
  },
  {
    id: 'prod-4',
    name: 'Mazda RX-7 FD3S Spirit R Type-A (Pure White)',
    slug: 'mazda-rx7-fd3s-spirit-r',
    scale: '1:64',
    category: 'JDM',
    price: 1900,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Rotary power perfection. 1:64 scale die-cast Mazda RX-7 Spirit R with pop-up headlight details, BBS forged alloy wheel replicas, and crimson Recaro bucket seats inside.',
    material: 'Die-cast Zinc Alloy',
    color: 'Pure White',
    dimensions: '7.0 x 2.8 x 1.9 cm',
    stockState: 'IN STOCK',
    exactStock: 15,
    purchaseCost: 980,
    importCost: 140,
    packagingCost: 40,
    isNewArrival: true,
    created_at: '2026-02-15'
  },
  {
    id: 'prod-5',
    name: 'Lamborghini Aventador SVJ Roadster (Verde Alceo)',
    slug: 'lamborghini-aventador-svj-roadster',
    scale: '1:24',
    category: 'SUPERCARS',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'V12 Italian fury. Premium 1:24 die-cast model featuring scissor doors, rear ALA 2.0 active aerodynamics, engine cover glass display, and working spring suspension.',
    material: 'Die-cast Zinc Alloy, Rubber, Carbon Trim',
    color: 'Matte Verde Alceo (Green)',
    dimensions: '19.5 x 8.8 x 5.1 cm',
    stockState: 'LIMITED STOCK',
    exactStock: 2,
    purchaseCost: 2400,
    importCost: 350,
    packagingCost: 80,
    isFeatured: true,
    isLimitedDrop: true,
    created_at: '2026-02-20'
  },
  {
    id: 'prod-6',
    name: 'Nissan GT-R R35 Nismo Special Edition (Stealth Gray)',
    slug: 'nissan-gtr-r35-nismo-stealth-gray',
    scale: '1:64',
    category: 'JDM',
    price: 2100,
    salePrice: 1890,
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Godzilla evolved. Carbon fiber bonnet with NACA ducts, Rays 20-inch forged aluminum wheels, Brembo carbon ceramic brakes, and red striping around the aerodynamic skirts.',
    material: 'Die-cast Metal',
    color: 'Stealth Gray',
    dimensions: '7.3 x 3.1 x 2.2 cm',
    stockState: 'IN STOCK',
    exactStock: 22,
    purchaseCost: 1100,
    importCost: 160,
    packagingCost: 40,
    isBestSeller: true,
    created_at: '2026-01-20'
  },
  {
    id: 'prod-7',
    name: 'Ford Mustang Shelby GT500 (1967 Eleanor Custom)',
    slug: 'ford-mustang-shelby-gt500-1967',
    scale: '1:32',
    category: 'MUSCLE',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Classic American Muscle legend. Pepper Gray metallic paint with black racing stripes, side exhaust pipes, opening hood with V8 engine, and working steering.',
    material: 'Die-cast Zinc Alloy',
    color: 'Pepper Gray Metallic',
    dimensions: '14.8 x 5.8 x 4.2 cm',
    stockState: 'IN STOCK',
    exactStock: 9,
    purchaseCost: 1600,
    importCost: 220,
    packagingCost: 60,
    created_at: '2026-01-28'
  },
  {
    id: 'prod-8',
    name: 'Honda Civic Type-R FK8 (Championship White)',
    slug: 'honda-civic-typer-fk8-white',
    scale: '1:64',
    category: 'JDM',
    price: 1750,
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Track-ready hot hatch in classic Honda Championship White. Vortex generators, triple center exhaust tips, and red badge details.',
    material: 'Die-cast Metal',
    color: 'Championship White',
    dimensions: '7.1 x 2.9 x 2.1 cm',
    stockState: 'SOLD OUT',
    exactStock: 0,
    purchaseCost: 880,
    importCost: 130,
    packagingCost: 40,
    created_at: '2026-01-10'
  },
  {
    id: 'prod-9',
    name: 'Mercedes-AMG G63 6x6 Brabus 800 (Obsidian Black)',
    slug: 'mercedes-amg-g63-6x6-brabus',
    scale: '1:24',
    category: 'SUV',
    price: 5200,
    images: [
      'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Ultimate 6-wheel terrain beast in 1:24 scale. All 6 wheels functional with spring suspension, opening doors and tailgate, wood bed detail.',
    material: 'Die-cast Metal, Heavy Duty Polymer',
    color: 'Obsidian Black',
    dimensions: '22.0 x 9.5 x 9.0 cm',
    stockState: 'IN STOCK',
    exactStock: 7,
    purchaseCost: 2800,
    importCost: 420,
    packagingCost: 100,
    isFeatured: true,
    created_at: '2026-02-05'
  },
  {
    id: 'prod-10',
    name: 'Ferrari F40 LM Competizione (Rosso Corsa)',
    slug: 'ferrari-f40-lm-rosso-corsa',
    scale: '1:18',
    category: 'CLASSIC',
    price: 8900,
    salePrice: 7990,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The pinnacle 1:18 scale collector item. Full opening rear clam shell exposing the twin-turbo V8, opening doors, pop-up lights, and authentic Kevlar tub texture inside.',
    material: 'High-Precision Die-Cast Zinc, Etched Metal Parts',
    color: 'Rosso Corsa Red',
    dimensions: '24.5 x 11.2 x 6.2 cm',
    stockState: 'LIMITED STOCK',
    exactStock: 1,
    purchaseCost: 4800,
    importCost: 750,
    packagingCost: 150,
    isLimitedDrop: true,
    isFeatured: true,
    created_at: '2026-02-18'
  },
  {
    id: 'prod-11',
    name: 'Subaru Impreza WRX STI 22B (Sonic Blue)',
    slug: 'subaru-impreza-wrx-sti-22b',
    scale: '1:64',
    category: 'RACING',
    price: 1950,
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'WRC Rally icon. Widebody 22B STI with gold BBS wheels, pink STI badge accents, and high-downforce rear wing.',
    material: 'Die-cast Metal',
    color: 'Sonic Blue',
    dimensions: '7.0 x 2.9 x 2.1 cm',
    stockState: 'IN STOCK',
    exactStock: 11,
    purchaseCost: 1020,
    importCost: 150,
    packagingCost: 40,
    created_at: '2026-02-12'
  },
  {
    id: 'prod-12',
    name: 'LB-WORKS Nissan GT-R R35 Type 2 (Martini Livery)',
    slug: 'lb-works-nissan-gtr-r35-martini',
    scale: '1:64',
    category: 'JDM',
    price: 2400,
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Liberty Walk custom widebody masterpiece with exposed rivet arches, deep dish rims, and legendary racing livery.',
    material: 'Die-cast Zinc Alloy',
    color: 'Martini Racing Livery',
    dimensions: '7.4 x 3.2 x 2.0 cm',
    stockState: 'IN STOCK',
    exactStock: 8,
    purchaseCost: 1250,
    importCost: 180,
    packagingCost: 50,
    isLimitedDrop: true,
    created_at: '2026-02-22'
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    customerName: 'Tanvir Hossain',
    rating: 5,
    title: 'Mind-blowing detail on the R34!',
    comment: 'The paint finish and RB26 engine bay details are unbelievable for a 1:64 model. Packed with heavy bubble wrap. KUREZU is the real deal for collectors in BD!',
    verifiedPurchase: true,
    status: 'approved',
    date: '2026-02-12'
  },
  {
    id: 'rev-2',
    productId: 'prod-3',
    customerName: 'Siam Rahman',
    rating: 5,
    title: 'Porsche GT3 RS is breathtaking',
    comment: 'Delivered to Chattogram within 24 hours after advance payment verification. The active wing movement and Acid Green color are flawless.',
    verifiedPurchase: true,
    status: 'approved',
    date: '2026-02-18'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    customerName: 'Arif Chowdhury',
    rating: 5,
    title: 'Must-have Supra MK4 for JDM fans',
    comment: 'The 2JZ engine opening hood is super crisp. 10/10 quality check. Will buy again!',
    verifiedPurchase: true,
    status: 'approved',
    date: '2026-02-20'
  }
];

export const initialBatches: InventoryBatch[] = [
  {
    id: 'batch-101',
    batchNumber: 'KZ-BATCH-001',
    supplier: 'Tokyo Collectibles Direct',
    purchaseDate: '2026-01-05',
    quantity: 50,
    purchaseCost: 45000,
    importCost: 7500,
    packagingCost: 2000,
    arrivalDate: '2026-01-14',
    totalLandedCost: 54500,
    notes: 'JDM Legends initial drop stock (R34, Supra, RX7)'
  },
  {
    id: 'batch-102',
    batchNumber: 'KZ-BATCH-002',
    supplier: 'European Diecast Import Co.',
    purchaseDate: '2026-01-20',
    quantity: 30,
    purchaseCost: 58000,
    importCost: 9200,
    packagingCost: 2500,
    arrivalDate: '2026-02-02',
    totalLandedCost: 69700,
    notes: 'Porsche GT3 RS & Lamborghini SVJ shipment'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'KZ-2026-0001',
    createdAt: '2026-02-24T10:15:00Z',
    customerName: 'Fahim Ahmed',
    phone: '01712345678',
    email: 'fahim@example.com',
    district: 'Inside Chattogram',
    address: 'House 42, Road 5, GEC Circle, Chattogram',
    items: [
      {
        productId: 'prod-1',
        productName: 'Nissan Skyline GT-R R34 V-Spec II (Bayside Blue)',
        productImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
        scale: '1:64',
        price: 1650,
        quantity: 1,
        subtotal: 1650,
        purchaseCost: 950
      }
    ],
    productSubtotal: 1650,
    deliveryCharge: 80,
    discount: 0,
    grandTotal: 1730,
    payNowAdvance: 80,
    payOnDeliveryCOD: 1650,
    paymentMethod: 'bkash',
    senderPhone: '01712345678',
    transactionId: 'BK8X92M01Q',
    paymentStatus: 'ADVANCE PAYMENT VERIFIED',
    orderStatus: 'Processing',
    customerNote: 'Please make sure acrylic case has no scratches.',
    adminNote: 'Advance bKash 80 BDT verified at 10:30 AM.'
  },
  {
    id: 'KZ-2026-0002',
    createdAt: '2026-02-25T14:30:00Z',
    customerName: 'Mahir Khan',
    phone: '01898765432',
    email: 'mahir@example.com',
    district: 'Outside Chattogram',
    address: 'Flat 4B, Sector 7, Uttara, Dhaka',
    items: [
      {
        productId: 'prod-3',
        productName: 'Porsche 911 GT3 RS (992 Acid Green / Carbon)',
        productImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        scale: '1:32',
        price: 3450,
        quantity: 1,
        subtotal: 3450,
        purchaseCost: 1900
      }
    ],
    productSubtotal: 3450,
    deliveryCharge: 150,
    discount: 200,
    couponCode: 'FIRSTORDER',
    grandTotal: 3400,
    payNowAdvance: 150,
    payOnDeliveryCOD: 3250,
    paymentMethod: 'nagad',
    senderPhone: '01898765432',
    transactionId: 'NG7712A802',
    paymentStatus: 'VERIFICATION_PENDING',
    orderStatus: 'Payment Verification',
    customerNote: 'Call before delivery.'
  }
];
