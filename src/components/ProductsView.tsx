import { Search, SlidersHorizontal, Tag, X } from 'lucide-react';
import { useMemo } from 'react';
import type { Product, ProductCategory, ProductCondition } from '../shared/types.ts';
import { ProductCard } from './ProductCard.tsx';

interface ProductsViewProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: ProductCategory | 'Todos';
  onSelectCategory: (category: ProductCategory | 'Todos') => void;
  selectedCondition: ProductCondition | 'Todos';
  onSelectCondition: (condition: ProductCondition | 'Todos') => void;
  onlyOffers: boolean;
  onToggleOffers: (val: boolean) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc') => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  addingProductId: string | null;
  onRetry: () => void;
}

const CATEGORIES: (ProductCategory | 'Todos')[] = [
  'Todos',
  'Celulares',
  'PC y Netbooks',
  'Monitores',
  'Periféricos',
  'Accesorios',
];

const CONDITIONS: (ProductCondition | 'Todos')[] = ['Todos', 'Nuevo', 'Usado'];

export function ProductsView({
  products,
  loading,
  error,
  selectedCategory,
  onSelectCategory,
  selectedCondition,
  onSelectCondition,
  onlyOffers,
  onToggleOffers,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onViewProduct,
  onAddToCart,
  onBuyNow,
  addingProductId,
  onRetry,
}: ProductsViewProps) {
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (onlyOffers) {
      list = list.filter((p) => Boolean(p.onSale));
    }
    if (selectedCategory !== 'Todos') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedCondition !== 'Todos') {
      list = list.filter((p) => p.condition === selectedCondition);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => Number(Boolean(b.onSale)) - Number(Boolean(a.onSale)));
    }

    return list;
  }, [products, onlyOffers, selectedCategory, selectedCondition, searchQuery, sortBy]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <p className="text-xs font-medium text-[#00FF55] mb-2">
            Catálogo oficial Electro Tecno
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            PRODUCTOS
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl">
            Celulares nuevos y usados certificados, PC, netbooks, monitores, periféricos, accesorios y ofertas especiales seleccionadas.
          </p>
        </div>

        <div className="text-sm text-neutral-400 font-mono tabular-nums">
          {filteredProducts.length}{' '}
          {filteredProducts.length === 1 ? 'producto' : 'productos'}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="py-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar celular, PC, monitor, teclado..."
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-white/15 bg-[#101010] text-sm text-white placeholder:text-neutral-500 focus:border-[#00FF55] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Offers toggle, Condition & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleOffers(!onlyOffers)}
              aria-pressed={onlyOffers}
              className={`h-10 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                onlyOffers
                  ? 'border-[#00FF55] bg-[#00FF55] text-[#050505]'
                  : 'border-[#00FF55]/35 bg-[#00FF55]/10 text-[#00FF55] hover:bg-[#00FF55]/20'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Ofertas especiales</span>
            </button>

            <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-[#101010]">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => onSelectCondition(cond)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCondition === cond
                      ? 'bg-[#00FF55] text-[#050505] font-semibold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#101010] px-3 h-10">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#00FF55]" />
              <select
                aria-label="Ordenar productos"
                value={sortBy}
                onChange={(e) =>
                  onSortChange(e.target.value as 'featured' | 'price-asc' | 'price-desc')
                }
                className="bg-transparent text-xs font-medium text-neutral-200 focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#101010]">
                  Orden: Destacados y ofertas
                </option>
                <option value="price-asc" className="bg-[#101010]">
                  Menor precio
                </option>
                <option value="price-desc" className="bg-[#101010]">
                  Mayor precio
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-[#00FF55] bg-[#00FF55]/15 text-[#00FF55]'
                    : 'border-white/10 bg-[#101010] text-neutral-300 hover:border-white/25 hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* States: Loading / Error / Empty / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-[#101010] overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-[#151515]" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-28 bg-[#1A1A1A] rounded" />
                <div className="h-5 w-3/4 bg-[#1A1A1A] rounded" />
                <div className="h-4 w-full bg-[#1A1A1A] rounded" />
                <div className="h-10 w-full bg-[#1A1A1A] rounded-lg mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-[#101010] p-8 text-center my-8">
          <p className="text-sm text-red-300 mb-4">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="h-10 px-5 rounded-lg bg-[#00FF55] text-[#050505] text-sm font-semibold hover:bg-[#33FF77] cursor-pointer"
          >
            Reintentar carga
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101010] p-12 text-center my-6">
          <p className="font-display text-lg font-semibold text-white mb-2">
            No encontramos productos con ese filtro
          </p>
          <p className="text-sm text-neutral-400 mb-6">
            Probá limpiando la búsqueda o cambiando los filtros seleccionados.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectCategory('Todos');
              onSelectCondition('Todos');
              onToggleOffers(false);
              onSearchChange('');
            }}
            className="h-10 px-5 rounded-lg border border-[#00FF55]/40 bg-[#00FF55]/10 text-[#00FF55] text-sm font-medium hover:bg-[#00FF55]/20 cursor-pointer"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={onViewProduct}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              isAdding={addingProductId === product.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
