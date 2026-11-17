export type NavSection =
  | 'inicio'
  | 'productos'
  | 'servicio-tecnico'
  | 'contacto';

export type ProductCategory =
  | 'Celulares'
  | 'PC y Netbooks'
  | 'Monitores'
  | 'Periféricos'
  | 'Accesorios';

export type ProductCondition = 'Nuevo' | 'Usado';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  condition: ProductCondition;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  shortDescription: string;
  description: string;
  specs: ProductSpec[];
  stock: number;
  warranty: string;
  image: string;
  featured?: boolean;
  onSale?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  freeShippingThreshold: number;
  total: number;
  itemCount: number;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: 'Transferencia' | 'Tarjeta' | 'Efectivo / Contra entrega';
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'Confirmado' | 'En preparación' | 'Despachado';
  createdAt: string;
}

export interface RepairRequest {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceModel: string;
  issueType: string;
  description: string;
  status: 'Recibido' | 'En diagnóstico';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}
