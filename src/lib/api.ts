import type {
  CartResponse,
  ContactMessage,
  Order,
  Product,
  PublicUser,
  RepairRequest,
} from '../shared/types.ts';

const CART_SESSION_KEY = 'electro_tecno_cart_session';

function getOrCreateCartSession(): string {
  if (typeof window === 'undefined') return 'ssr-session';
  let sessionId = window.localStorage.getItem(CART_SESSION_KEY);
  if (!sessionId) {
    sessionId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `et-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(CART_SESSION_KEY, sessionId);
  }
  return sessionId;
}

let inMemoryAuthToken: string | null = null;

export function setAuthToken(token: string | null): void {
  inMemoryAuthToken = token;
}

export function getAuthToken(): string | null {
  return inMemoryAuthToken;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('x-cart-session', getOrCreateCartSession());
  if (inMemoryAuthToken) {
    headers.set('Authorization', `Bearer ${inMemoryAuthToken}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Ocurrió un error al comunicarse con el servidor.');
  }
  return data as T;
}

export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`;
}

export const api = {
  getProducts(params?: {
    category?: string;
    condition?: string;
    sale?: boolean;
    q?: string;
  }): Promise<{ products: Product[] }> {
    const search = new URLSearchParams();
    if (params?.category && params.category !== 'Todos') search.set('category', params.category);
    if (params?.condition && params.condition !== 'Todos') search.set('condition', params.condition);
    if (params?.sale) search.set('sale', 'true');
    if (params?.q) search.set('q', params.q);
    const qs = search.toString();
    return request<{ products: Product[] }>(`/api/products${qs ? `?${qs}` : ''}`);
  },

  getCart(): Promise<CartResponse> {
    return request<CartResponse>('/api/cart');
  },

  addToCart(productId: string, quantity = 1): Promise<CartResponse> {
    return request<CartResponse>('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateCartQuantity(productId: string, quantity: number): Promise<CartResponse> {
    return request<CartResponse>(`/api/cart/${encodeURIComponent(productId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart(productId: string): Promise<CartResponse> {
    return request<CartResponse>(`/api/cart/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    });
  },

  createOrder(payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    postalCode: string;
    paymentMethod: Order['paymentMethod'];
  }): Promise<{ order: Order; cart: CartResponse }> {
    return request<{ order: Order; cart: CartResponse }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getOrders(): Promise<{ orders: Order[] }> {
    return request<{ orders: Order[] }>('/api/orders');
  },

  register(payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: PublicUser; token: string }> {
    return request<{ user: PublicUser; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload: {
    email: string;
    password: string;
  }): Promise<{ user: PublicUser; token: string }> {
    return request<{ user: PublicUser; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout(): Promise<{ ok: boolean }> {
    return request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
  },

  submitRepair(payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deviceModel: string;
    issueType: string;
    description: string;
  }): Promise<{ repair: RepairRequest }> {
    return request<{ repair: RepairRequest }>('/api/repairs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  submitContact(payload: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ contact: ContactMessage }> {
    return request<{ contact: ContactMessage }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
