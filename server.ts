import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

import { 
  initialProducts, 
  initialSettings, 
  initialCoupons, 
  initialReviews, 
  initialBatches, 
  initialOrders 
} from "./src/data/initialData.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory / persistent file storage state
const DATA_FILE = path.join(process.cwd(), "store_data.json");

let storeData = {
  products: initialProducts,
  settings: initialSettings,
  coupons: initialCoupons,
  reviews: initialReviews,
  batches: initialBatches,
  orders: initialOrders,
  backInStock: [] as any[],
};

// Try loading existing stored data if present
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    storeData = { ...storeData, ...parsed };
    console.log("Loaded existing store_data.json");
  } catch (err) {
    console.error("Failed to load store_data.json, using defaults", err);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(storeData, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save store_data.json", err);
  }
}

// ================= API ENDPOINTS =================

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Admin Auth
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  // Admin password default is 'kurezu2026' or 'admin'
  if (password === "kurezu2026" || password === "admin" || password === "kurezu") {
    res.json({ success: true, token: "kurezu_admin_valid_token_2026" });
  } else {
    res.status(401).json({ success: false, message: "Invalid admin password" });
  }
});

// Settings
app.get("/api/settings", (_req, res) => {
  res.json(storeData.settings);
});

app.put("/api/settings", (req, res) => {
  storeData.settings = { ...storeData.settings, ...req.body };
  saveData();
  res.json(storeData.settings);
});

// Products
app.get("/api/products", (_req, res) => {
  res.json(storeData.products);
});

app.post("/api/products", (req, res) => {
  const newProduct = {
    ...req.body,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString().split("T")[0],
  };
  storeData.products.unshift(newProduct);
  saveData();
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const idx = storeData.products.findIndex((p) => p.id === id);
  if (idx !== -1) {
    storeData.products[idx] = { ...storeData.products[idx], ...req.body };
    saveData();
    res.json(storeData.products[idx]);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  storeData.products = storeData.products.filter((p) => p.id !== id);
  saveData();
  res.json({ success: true });
});

// Coupons
app.get("/api/coupons", (_req, res) => {
  res.json(storeData.coupons);
});

app.post("/api/coupons/validate", (req, res) => {
  const { code, cartSubtotal } = req.body;
  const coupon = storeData.coupons.find(
    (c) => c.code.toUpperCase() === (code || "").trim().toUpperCase() && c.isActive
  );

  if (!coupon) {
    return res.status(400).json({ error: "Invalid or inactive coupon code" });
  }

  if (cartSubtotal < coupon.minOrder) {
    return res.status(400).json({
      error: `Minimum order amount for code ${coupon.code} is ৳${coupon.minOrder}`,
    });
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.round((cartSubtotal * coupon.value) / 100);
  } else {
    discount = coupon.value;
  }

  res.json({
    valid: true,
    code: coupon.code,
    discount,
    discountType: coupon.discountType,
    value: coupon.value,
  });
});

app.post("/api/coupons", (req, res) => {
  const newCoupon = {
    ...req.body,
    code: req.body.code.toUpperCase(),
    usedCount: 0,
    isActive: true,
  };
  storeData.coupons.push(newCoupon);
  saveData();
  res.status(201).json(newCoupon);
});

// Orders
app.get("/api/orders", (_req, res) => {
  res.json(storeData.orders);
});

app.post("/api/orders", (req, res) => {
  const orderCount = storeData.orders.length + 1;
  const orderId = `KZ-2026-${String(orderCount).padStart(4, "0")}`;

  const orderData = {
    ...req.body,
    id: orderId,
    createdAt: new Date().toISOString(),
    paymentStatus: "VERIFICATION_PENDING",
    orderStatus: "Payment Verification",
  };

  // Safely decrease stock
  orderData.items.forEach((item: any) => {
    const prod = storeData.products.find((p) => p.id === item.productId);
    if (prod) {
      prod.exactStock = Math.max(0, prod.exactStock - item.quantity);
      if (prod.exactStock === 0) {
        prod.stockState = "SOLD OUT";
      } else if (prod.exactStock <= 3) {
        prod.stockState = "LIMITED STOCK";
      }
    }
  });

  storeData.orders.unshift(orderData);
  saveData();
  res.status(201).json(orderData);
});

// Track Order
app.post("/api/orders/track", (req, res) => {
  const { orderId, phone } = req.body;
  const cleanId = (orderId || "").trim().toUpperCase();
  const cleanPhone = (phone || "").trim().replace(/[^0-9]/g, "");

  const order = storeData.orders.find((o) => {
    const oPhone = o.phone.replace(/[^0-9]/g, "");
    return o.id.toUpperCase() === cleanId && oPhone.includes(cleanPhone);
  });

  if (order) {
    // Hide internal cost details from track order response
    const safeOrder = {
      ...order,
      items: order.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        productImage: i.productImage,
        scale: i.scale,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.subtotal,
      })),
    };
    res.json(safeOrder);
  } else {
    res.status(404).json({ error: "Order not found. Please verify Order ID and Mobile Number." });
  }
});

// Admin Update Order Status / Payment
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const idx = storeData.orders.findIndex((o) => o.id === id);
  if (idx !== -1) {
    storeData.orders[idx] = { ...storeData.orders[idx], ...req.body };
    saveData();
    res.json(storeData.orders[idx]);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// Reviews
app.get("/api/reviews", (req, res) => {
  const { productId } = req.query;
  if (productId) {
    const prodReviews = storeData.reviews.filter(
      (r) => r.productId === productId && r.status === "approved"
    );
    return res.json(prodReviews);
  }
  res.json(storeData.reviews);
});

app.post("/api/reviews", (req, res) => {
  const newReview = {
    ...req.body,
    id: `rev-${Date.now()}`,
    status: "pending", // requires admin approval
    date: new Date().toISOString().split("T")[0],
  };
  storeData.reviews.unshift(newReview);
  saveData();
  res.status(201).json(newReview);
});

app.put("/api/reviews/:id", (req, res) => {
  const { id } = req.params;
  const idx = storeData.reviews.findIndex((r) => r.id === id);
  if (idx !== -1) {
    storeData.reviews[idx] = { ...storeData.reviews[idx], ...req.body };
    saveData();
    res.json(storeData.reviews[idx]);
  } else {
    res.status(404).json({ error: "Review not found" });
  }
});

// Batches
app.get("/api/batches", (_req, res) => {
  res.json(storeData.batches);
});

app.post("/api/batches", (req, res) => {
  const newBatch = {
    ...req.body,
    id: `batch-${Date.now()}`,
    batchNumber: `KZ-BATCH-${String(storeData.batches.length + 1).padStart(3, "0")}`,
  };
  storeData.batches.unshift(newBatch);
  saveData();
  res.status(201).json(newBatch);
});

// Back-in-stock notifications
app.get("/api/back-in-stock", (_req, res) => {
  res.json(storeData.backInStock);
});

app.post("/api/back-in-stock", (req, res) => {
  const newReq = {
    id: `req-${Date.now()}`,
    ...req.body,
    date: new Date().toISOString(),
  };
  storeData.backInStock.unshift(newReq);
  saveData();
  res.status(201).json({ success: true, message: "Restock notification requested" });
});

// Start Server with Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KUREZU Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
