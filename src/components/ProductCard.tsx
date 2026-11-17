import { Eye, ShoppingCart, Zap } from 'lucide-react';
import { formatPrice } from '../lib/api.ts';
import type { Product } from '../shared/types.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  isAdding?: boolean;
}

export function ProductCard({
  product,
  onViewProduct,
  onAddToCart,
  onBuyNow,
  isAdding = false,
}: ProductCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl border border-[#00FF55]/18 bg-[#101010] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00FF55]/55 hover:shadow-[0_12px_36px_rgba(0,255,85,0.10)]">
      {/* Product Photography (4:3, unique per product) */}
      <div
        onClick={() => onViewProduct(product)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#151515] cursor-pointer"
      >
        <ResilientImage
          src={product.image}
          alt={product.name}
          fallbackTitle={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#101010]/75 to-transparent" />

        {product.onSale && product.discountPercent ? (
          <span className="absolute top-3 left-3 rounded-md bg-[#00FF55] px-2.5 py-1 text-xs font-bold text-[#050505] tracking-tight shadow-[0_0_14px_rgba(0,255,85,0.35)] tabular-nums">
            -{product.discountPercent}% OFF
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Unboxed metadata line */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-[#33FF77] font-medium">{product.condition}</span>
          <span aria-hidden="true">·</span>
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{product.brand}</span>
        </div>

        <h3 className="font-display text-base font-semibold text-white leading-snug mb-1.5 group-hover:text-[#00FF55] transition-colors">
          <button
            type="button"
            onClick={() => onViewProduct(product)}
            className="text-left cursor-pointer"
          >
            {product.name}
          </button>
        </h3>

        <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2 mb-4">
          {product.shortDescription}
        </p>

        {/* Price block */}
        <div className="mt-auto pt-3 border-t border-white/10">
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-xl font-bold text-white tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice ? (
                <span className="font-mono text-xs text-neutral-500 line-through tabular-nums">
                  {formatPrice(product.oldPrice)}
                </span>
              ) : null}
            </div>
            <span className="text-xs text-neutral-400 tabular-nums">
              {product.stock > 0 ? `${product.stock} disp.` : 'Sin stock'}
            </span>
          </div>

          {/* 3 Explicit Action Buttons requested */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={product.stock <= 0 || isAdding}
              onClick={() => onBuyNow(product)}
              className="col-span-2 h-10 px-4 rounded-lg bg-[#00FF55] text-[#050505] text-sm font-semibold hover:bg-[#33FF77] disabled:opacity-50 transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Comprar</span>
            </button>

            <button
              type="button"
              onClick={() => onViewProduct(product)}
              className="h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-neutral-200 text-xs font-medium hover:border-[#00FF55]/50 hover:text-white transition-colors duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#00FF55]" />
              <span>Ver producto</span>
            </button>

            <button
              type="button"
              disabled={product.stock <= 0 || isAdding}
              onClick={() => onAddToCart(product)}
              className="h-10 px-3 rounded-lg border border-[#00FF55]/35 bg-[#00FF55]/10 text-[#00FF55] text-xs font-semibold hover:bg-[#00FF55]/20 disabled:opacity-50 transition-colors duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Agregando...' : 'Agregar al carrito'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
