import { Check, Minus, Plus, ShieldCheck, ShoppingCart, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../lib/api.ts';
import type { Product } from '../shared/types.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => Promise<void>;
  onBuyNow: (product: Product, quantity: number) => Promise<void>;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  if (!product) return null;

  const handleAdd = async () => {
    setBusy(true);
    try {
      await onAddToCart(product, quantity);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const handleBuy = async () => {
    setBusy(true);
    try {
      await onBuyNow(product, quantity);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="relative w-full max-w-4xl rounded-2xl border border-[#00FF55]/30 bg-[#101010] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.85)] my-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle de producto"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-lg border border-white/15 bg-[#050505]/90 text-neutral-300 hover:text-white hover:border-[#00FF55]/60 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Sticky left gallery */}
          <div className="md:col-span-6 bg-[#151515] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/10">
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
              <ResilientImage
                src={product.image}
                alt={product.name}
                fallbackTitle={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Contiguous purchase module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                <span className="text-[#00FF55] font-semibold">{product.condition}</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.brand}</span>
              </div>

              <h2 className="font-display text-2xl font-bold text-white leading-tight mb-3">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-3xl font-bold text-white tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice ? (
                  <span className="font-mono text-sm text-neutral-500 line-through tabular-nums">
                    {formatPrice(product.oldPrice)}
                  </span>
                ) : null}
                {product.onSale && product.discountPercent ? (
                  <span className="rounded bg-[#00FF55] px-2 py-0.5 text-xs font-bold text-[#050505] tabular-nums">
                    -{product.discountPercent}%
                  </span>
                ) : null}
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Specs */}
              <div className="border-t border-b border-white/10 py-4 mb-5 space-y-2">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between gap-4 text-xs sm:text-sm"
                  >
                    <span className="text-neutral-400">{spec.label}</span>
                    <span className="text-neutral-100 font-medium text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-300 mb-6">
                <ShieldCheck className="w-4 h-4 text-[#00FF55] shrink-0" />
                <span>{product.warranty}</span>
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-neutral-400">
                  Cantidad ({product.stock} disponibles)
                </span>
                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-[#151515] p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Disminuir cantidad"
                    className="w-8 h-8 rounded flex items-center justify-center text-neutral-300 hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-semibold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    aria-label="Aumentar cantidad"
                    className="w-8 h-8 rounded flex items-center justify-center text-neutral-300 hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={busy || product.stock <= 0}
                  onClick={handleBuy}
                  className="h-11 px-4 rounded-xl bg-[#00FF55] text-[#050505] text-sm font-bold hover:bg-[#33FF77] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Comprar ahora</span>
                </button>
                <button
                  type="button"
                  disabled={busy || product.stock <= 0}
                  onClick={handleAdd}
                  className="h-11 px-4 rounded-xl border border-[#00FF55]/45 bg-[#00FF55]/10 text-[#00FF55] text-sm font-semibold hover:bg-[#00FF55]/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar al carrito</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#00FF55]" />
                <span>Envío sin cargo superando $120.000</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
