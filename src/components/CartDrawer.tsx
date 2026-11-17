import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, formatPrice } from '../lib/api.ts';
import type { CartResponse, Order, PublicUser } from '../shared/types.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface CartDrawerProps {
  open: boolean;
  initialStep?: 'cart' | 'checkout';
  onClose: () => void;
  cart: CartResponse;
  onCartUpdated: (cart: CartResponse) => void;
  user: PublicUser | null;
}

export function CartDrawer({
  open,
  initialStep = 'cart',
  onClose,
  cart,
  onCartUpdated,
  user,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>(initialStep);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] =
    useState<Order['paymentMethod']>('Transferencia');

  useEffect(() => {
    if (open) {
      setStep(initialStep);
      setError(null);
      if (user) {
        setCustomerName((prev) => prev || user.name);
        setCustomerEmail((prev) => prev || user.email);
      }
    }
  }, [open, initialStep, user]);

  if (!open) return null;

  const freeProgress = Math.min(
    100,
    Math.round((cart.subtotal / cart.freeShippingThreshold) * 100)
  );
  const remainingForFree = Math.max(0, cart.freeShippingThreshold - cart.subtotal);

  const handleQty = async (productId: string, nextQty: number) => {
    setBusyId(productId);
    setError(null);
    try {
      const updated = await api.updateCartQuantity(productId, nextQty);
      onCartUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el carrito.');
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    setBusyId(productId);
    setError(null);
    try {
      const updated = await api.removeFromCart(productId);
      onCartUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el producto.');
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.createOrder({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        postalCode,
        paymentMethod,
      });
      setConfirmedOrder(res.order);
      onCartUpdated(res.cart);
      setStep('confirmed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo confirmar el pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      <div className="w-full max-w-md bg-[#0D0D0D] border-l border-[#00FF55]/25 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Volver al carrito"
                className="w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-[#00FF55]" />
            <h2 className="font-display text-lg font-bold text-white">
              {step === 'cart'
                ? `Tu Carrito (${cart.itemCount})`
                : step === 'checkout'
                  ? 'Finalizar Compra'
                  : 'Pedido Confirmado'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="w-9 h-9 rounded-lg border border-white/15 text-neutral-300 hover:text-white hover:border-[#00FF55]/50 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          {step === 'confirmed' && confirmedOrder ? (
            <div className="rounded-2xl border border-[#00FF55]/40 bg-[#101010] p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-[#00FF55]">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <p className="font-display font-bold text-lg text-white">
                    Pedido {confirmedOrder.orderNumber} confirmado
                  </p>
                  <p className="text-xs text-[#00FF55]">Estado: {confirmedOrder.status}</p>
                </div>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                Enviamos el comprobante a{' '}
                <strong className="text-white">{confirmedOrder.customerEmail}</strong>.
                Despacharemos tu compra a {confirmedOrder.shippingAddress},{' '}
                {confirmedOrder.city}.
              </p>

              <div className="border-t border-white/10 pt-3 space-y-2 text-xs">
                {confirmedOrder.items.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-2 text-neutral-300">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-mono tabular-nums text-white">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-sm text-white">
                  <span>Total abonado ({confirmedOrder.paymentMethod})</span>
                  <span className="font-mono tabular-nums text-[#00FF55]">
                    {formatPrice(confirmedOrder.total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-[#00FF55] text-[#050505] text-sm font-bold hover:bg-[#33FF77] cursor-pointer"
              >
                Seguir explorando
              </button>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl border border-white/10 bg-[#151515] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-neutral-500" />
              </div>
              <p className="font-display text-base font-semibold text-white">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-neutral-400">
                Agregá celulares, equipos o accesorios para comenzar tu pedido.
              </p>
            </div>
          ) : step === 'cart' ? (
            <>
              {/* Free shipping bar */}
              <div className="rounded-xl border border-white/10 bg-[#151515] p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <Truck className="w-4 h-4 text-[#00FF55] shrink-0" />
                  {remainingForFree === 0 ? (
                    <span className="text-[#00FF55] font-medium">
                      Tenés envío gratis a todo el país.
                    </span>
                  ) : (
                    <span>
                      Te faltan{' '}
                      <strong className="font-mono tabular-nums text-white">
                        {formatPrice(remainingForFree)}
                      </strong>{' '}
                      para envío sin cargo.
                    </span>
                  )}
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#00FF55] transition-all duration-300"
                    style={{ width: `${freeProgress}%` }}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3.5 rounded-xl border border-white/10 bg-[#121212] p-3"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#181818] shrink-0">
                      <ResilientImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-white truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-neutral-400">
                            {item.product.condition} · {item.product.brand}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={busyId === item.productId}
                          onClick={() => handleRemove(item.productId)}
                          aria-label={`Eliminar ${item.product.name}`}
                          className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#181818] p-0.5">
                          <button
                            type="button"
                            disabled={busyId === item.productId}
                            onClick={() => handleQty(item.productId, item.quantity - 1)}
                            aria-label="Restar unidad"
                            className="w-7 h-7 rounded flex items-center justify-center text-neutral-300 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono text-xs font-semibold text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={
                              busyId === item.productId || item.quantity >= item.product.stock
                            }
                            onClick={() => handleQty(item.productId, item.quantity + 1)}
                            aria-label="Sumar unidad"
                            className="w-7 h-7 rounded flex items-center justify-center text-neutral-300 hover:text-white disabled:opacity-40 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-bold text-[#00FF55] tabular-nums">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Checkout Form */
            <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Nombre y apellido
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Dirección de envío
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Calle, número, piso/depto"
                  className="w-full h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-sm text-white placeholder:text-neutral-500 focus:border-[#00FF55] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Ciudad / Provincia
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Medio de pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as Order['paymentMethod'])
                  }
                  className="w-full h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                >
                  <option value="Transferencia">Transferencia bancaria</option>
                  <option value="Tarjeta">Tarjeta de crédito / débito</option>
                  <option value="Efectivo / Contra entrega">
                    Efectivo / Contra entrega
                  </option>
                </select>
              </div>
            </form>
          )}
        </div>

        {/* Footer Totals */}
        {cart.items.length > 0 && step !== 'confirmed' && (
          <div className="border-t border-white/10 bg-[#090909] px-6 py-5 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-neutral-200">
                  {formatPrice(cart.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Envío</span>
                <span className="font-mono tabular-nums text-neutral-200">
                  {cart.shippingCost === 0 ? 'Gratis' : formatPrice(cart.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-1.5 border-t border-white/10">
                <span>Total</span>
                <span className="font-mono tabular-nums text-[#00FF55]">
                  {formatPrice(cart.total)}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full h-11 rounded-xl bg-[#00FF55] text-[#050505] text-sm font-bold hover:bg-[#33FF77] transition-colors cursor-pointer"
              >
                Iniciar compra
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-[#00FF55] text-[#050505] text-sm font-bold hover:bg-[#33FF77] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {submitting ? 'Confirmando pedido...' : 'Confirmar pedido'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
