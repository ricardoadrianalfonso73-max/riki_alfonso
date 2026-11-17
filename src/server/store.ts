import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type {
  CartItem,
  CartResponse,
  ContactMessage,
  Order,
  Product,
  PublicUser,
  RepairRequest,
} from '../shared/types.ts';
import { serverConfig } from './config.ts';
import { SEED_PRODUCTS } from './seedProducts.ts';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface StoredSession {
  token: string;
  userId: string;
  expiresAt: number;
}

interface StoredCartRow {
  sessionId: string;
  productId: string;
  quantity: number;
}

interface DatabaseState {
  products: Product[];
  users: StoredUser[];
  sessions: StoredSession[];
  carts: StoredCartRow[];
  orders: Order[];
  repairs: RepairRequest[];
  contacts: ContactMessage[];
}

function createInitialState(): DatabaseState {
  return {
    products: SEED_PRODUCTS,
    users: [],
    sessions: [],
    carts: [],
    orders: [],
    repairs: [],
    contacts: [],
  };
}

class StoreRepository {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    const filePath = serverConfig.dataStorePath;
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      const initial = createInitialState();
      fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<DatabaseState>;
      const hasFullCatalog =
        Array.isArray(parsed.products) &&
        parsed.products.length === SEED_PRODUCTS.length;
      const merged: DatabaseState = {
        products: hasFullCatalog ? parsed.products! : SEED_PRODUCTS,
        users: Array.isArray(parsed.users) ? parsed.users : [],
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
        carts: Array.isArray(parsed.carts) ? parsed.carts : [],
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        repairs: Array.isArray(parsed.repairs) ? parsed.repairs : [],
        contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
      };
      if (!hasFullCatalog) {
        fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
      }
      return merged;
    } catch {
      const fallback = createInitialState();
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
  }

  private persist(): void {
    const filePath = serverConfig.dataStorePath;
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(this.state, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const derived = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${derived}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const derived = crypto.scryptSync(password, salt, 64);
    const keyBuf = Buffer.from(key, 'hex');
    if (derived.length !== keyBuf.length) return false;
    return crypto.timingSafeEqual(derived, keyBuf);
  }

  private toPublicUser(user: StoredUser): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  listProducts(filters: {
    category?: string;
    condition?: string;
    sale?: boolean;
    q?: string;
  }): Product[] {
    let list = [...this.state.products];

    if (filters.category && filters.category !== 'Todos') {
      list = list.filter((p) => p.category === filters.category);
    }

    if (filters.condition && filters.condition !== 'Todos') {
      list = list.filter((p) => p.condition === filters.condition);
    }

    if (filters.sale) {
      list = list.filter((p) => Boolean(p.onSale));
    }

    if (filters.q && filters.q.trim()) {
      const term = filters.q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.shortDescription.toLowerCase().includes(term)
      );
    }

    return list;
  }

  getProductById(id: string): Product | undefined {
    return this.state.products.find((p) => p.id === id || p.slug === id);
  }

  registerUser(name: string, email: string, password: string): { user: PublicUser; token: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = this.state.users.find((u) => u.email === normalizedEmail);
    if (existing) {
      throw new Error('EMAIL_EXISTS');
    }

    const user: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: this.hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    const token = crypto.randomBytes(32).toString('hex');
    this.state.users.push(user);
    this.state.sessions.push({
      token,
      userId: user.id,
      expiresAt: Date.now() + serverConfig.sessionTtlMs,
    });
    this.persist();

    return { user: this.toPublicUser(user), token };
  }

  loginUser(email: string, password: string): { user: PublicUser; token: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.state.users.find((u) => u.email === normalizedEmail);
    if (!user || !this.verifyPassword(password, user.passwordHash)) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = crypto.randomBytes(32).toString('hex');
    this.state.sessions = this.state.sessions.filter((s) => s.expiresAt > Date.now());
    this.state.sessions.push({
      token,
      userId: user.id,
      expiresAt: Date.now() + serverConfig.sessionTtlMs,
    });
    this.persist();

    return { user: this.toPublicUser(user), token };
  }

  logoutSession(token: string): void {
    this.state.sessions = this.state.sessions.filter((s) => s.token !== token);
    this.persist();
  }

  getUserByToken(token?: string): PublicUser | null {
    if (!token) return null;
    const session = this.state.sessions.find(
      (s) => s.token === token && s.expiresAt > Date.now()
    );
    if (!session) return null;
    const user = this.state.users.find((u) => u.id === session.userId);
    return user ? this.toPublicUser(user) : null;
  }

  getCart(sessionId: string): CartResponse {
    const rows = this.state.carts.filter((c) => c.sessionId === sessionId);
    const items: CartItem[] = [];

    for (const row of rows) {
      const product = this.getProductById(row.productId);
      if (product && row.quantity > 0) {
        items.push({
          productId: product.id,
          quantity: Math.min(row.quantity, product.stock),
          product,
        });
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingCost =
      items.length === 0 || subtotal >= serverConfig.freeShippingThreshold
        ? 0
        : serverConfig.flatShippingCost;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      subtotal,
      shippingCost,
      freeShippingThreshold: serverConfig.freeShippingThreshold,
      total: subtotal + shippingCost,
      itemCount,
    };
  }

  addToCart(sessionId: string, productId: string, quantity = 1): CartResponse {
    const product = this.getProductById(productId);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }
    if (product.stock <= 0) {
      throw new Error('OUT_OF_STOCK');
    }

    const existing = this.state.carts.find(
      (c) => c.sessionId === sessionId && c.productId === product.id
    );

    if (existing) {
      existing.quantity = Math.min(existing.quantity + Math.max(1, quantity), product.stock);
    } else {
      this.state.carts.push({
        sessionId,
        productId: product.id,
        quantity: Math.min(Math.max(1, quantity), product.stock),
      });
    }

    this.persist();
    return this.getCart(sessionId);
  }

  updateCartQuantity(sessionId: string, productId: string, quantity: number): CartResponse {
    const product = this.getProductById(productId);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    if (quantity <= 0) {
      this.state.carts = this.state.carts.filter(
        (c) => !(c.sessionId === sessionId && c.productId === product.id)
      );
    } else {
      const existing = this.state.carts.find(
        (c) => c.sessionId === sessionId && c.productId === product.id
      );
      if (existing) {
        existing.quantity = Math.min(quantity, product.stock);
      } else {
        this.state.carts.push({
          sessionId,
          productId: product.id,
          quantity: Math.min(quantity, product.stock),
        });
      }
    }

    this.persist();
    return this.getCart(sessionId);
  }

  removeFromCart(sessionId: string, productId: string): CartResponse {
    this.state.carts = this.state.carts.filter(
      (c) => !(c.sessionId === sessionId && c.productId === productId)
    );
    this.persist();
    return this.getCart(sessionId);
  }

  createOrder(
    sessionId: string,
    payload: {
      userId?: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      shippingAddress: string;
      city: string;
      postalCode: string;
      paymentMethod: Order['paymentMethod'];
    }
  ): Order {
    const cart = this.getCart(sessionId);
    if (cart.items.length === 0) {
      throw new Error('EMPTY_CART');
    }

    const orderNumber = `ET-${1040 + this.state.orders.length + 1}`;
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber,
      userId: payload.userId,
      customerName: payload.customerName.trim(),
      customerEmail: payload.customerEmail.trim(),
      customerPhone: payload.customerPhone.trim(),
      shippingAddress: payload.shippingAddress.trim(),
      city: payload.city.trim(),
      postalCode: payload.postalCode.trim(),
      paymentMethod: payload.paymentMethod,
      items: cart.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      total: cart.total,
      status: 'Confirmado',
      createdAt: new Date().toISOString(),
    };

    this.state.orders.unshift(order);
    this.state.carts = this.state.carts.filter((c) => c.sessionId !== sessionId);
    this.persist();
    return order;
  }

  listOrdersForUser(userId: string): Order[] {
    return this.state.orders.filter((o) => o.userId === userId);
  }

  createRepairRequest(payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deviceModel: string;
    issueType: string;
    description: string;
  }): RepairRequest {
    const ticketNumber = `ST-${320 + this.state.repairs.length + 1}`;
    const repair: RepairRequest = {
      id: crypto.randomUUID(),
      ticketNumber,
      customerName: payload.customerName.trim(),
      customerEmail: payload.customerEmail.trim(),
      customerPhone: payload.customerPhone.trim(),
      deviceModel: payload.deviceModel.trim(),
      issueType: payload.issueType.trim(),
      description: payload.description.trim(),
      status: 'Recibido',
      createdAt: new Date().toISOString(),
    };

    this.state.repairs.unshift(repair);
    this.persist();
    return repair;
  }

  createContactMessage(payload: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): ContactMessage {
    const contact: ContactMessage = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim(),
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      createdAt: new Date().toISOString(),
    };

    this.state.contacts.unshift(contact);
    this.persist();
    return contact;
  }
}

export const store = new StoreRepository();
