import { Check } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { AuthModal } from './components/AuthModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { ContactView } from './components/ContactView.tsx';
import { Footer } from './components/Footer.tsx';
import { HomeView } from './components/HomeView.tsx';
import { Navbar } from './components/Navbar.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { ProductsView } from './components/ProductsView.tsx';
import { ServiceView } from './components/ServiceView.tsx';
import { api } from './lib/api.ts';
import type {
  CartResponse,
  NavSection,
  Product,
  ProductCategory,
  ProductCondition,
  PublicUser,
} from './shared/types.ts';

const EMPTY_CART: CartResponse = {
  items: [],
  subtotal: 0,
  shippingCost: 0,
  freeShippingThreshold: 120000,
  total: 0,
  itemCount: 0,
};

function getSectionFromPath(pathname: string): NavSection {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/productos' || clean === '/ofertas') return 'productos';
  if (clean === '/servicio-tecnico') return 'servicio-tecnico';
  if (clean === '/contacto') return 'contacto';
  return 'inicio';
}

function getPathFromSection(section: NavSection): string {
  if (section === 'inicio') return '/';
  return `/${section}`;
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>(() =>
    getSectionFromPath(window.location.pathname)
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'Todos'>('Todos');
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | 'Todos'>('Todos');
  const [onlyOffers, setOnlyOffers] = useState<boolean>(
    () => window.location.pathname.replace(/\/+$/, '') === '/ofertas'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const [cart, setCart] = useState<CartResponse>(EMPTY_CART);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'cart' | 'checkout'>('cart');
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => {
      setToast((current) => (current === message ? null : current));
    }, 2800);
  }, []);

  const loadCatalog = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const res = await api.getProducts();
      setProducts(res.products);
    } catch (err) {
      setProductsError(
        err instanceof Error ? err.message : 'No se pudo cargar el catálogo.'
      );
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const loadCart = useCallback(async () => {
    try {
      const res = await api.getCart();
      setCart(res);
    } catch {
      // Keep empty fallback if backend is temporarily unreachable
    }
  }, []);

  useEffect(() => {
    loadCatalog();
    loadCart();
  }, [loadCatalog, loadCart]);

  useEffect(() => {
    const onPopState = () => {
      setActiveSection(getSectionFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = useCallback((section: NavSection) => {
    setActiveSection(section);
    const nextPath = getPathFromSection(section);
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectCategory = useCallback(
    (category: ProductCategory) => {
      setSelectedCategory(category);
      setSelectedCondition('Todos');
      setOnlyOffers(false);
      navigateTo('productos');
    },
    [navigateTo]
  );

  const handleOpenOffers = useCallback(() => {
    setSelectedCategory('Todos');
    setSelectedCondition('Todos');
    setOnlyOffers(true);
    navigateTo('productos');
  }, [navigateTo]);

  const handleOpenSearch = useCallback(() => {
    setOnlyOffers(false);
    navigateTo('productos');
  }, [navigateTo]);

  const handleAddToCart = async (product: Product, quantity = 1) => {
    setAddingProductId(product.id);
    try {
      const updated = await api.addToCart(product.id, quantity);
      setCart(updated);
      showToast(`${product.name} agregado al carrito`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No se pudo agregar al carrito.');
    } finally {
      setAddingProductId(null);
    }
  };

  const handleBuyNow = async (product: Product, quantity = 1) => {
    setAddingProductId(product.id);
    try {
      const updated = await api.addToCart(product.id, quantity);
      setCart(updated);
      setCartStep('checkout');
      setCartOpen(true);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No se pudo iniciar la compra.');
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#F5F7F6]">
      <Navbar
        activeSection={activeSection}
        onNavigate={(section) => {
          if (section === 'productos') setOnlyOffers(false);
          navigateTo(section);
        }}
        onOpenSearch={handleOpenSearch}
        onOpenCart={() => {
          setCartStep('cart');
          setCartOpen(true);
        }}
        onOpenAuth={() => setAuthOpen(true)}
        cartCount={cart.itemCount}
        user={user}
      />

      <main className="flex-1">
        {activeSection === 'inicio' && (
          <HomeView
            onNavigate={navigateTo}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {activeSection === 'productos' && (
          <ProductsView
            products={products}
            loading={loadingProducts}
            error={productsError}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedCondition={selectedCondition}
            onSelectCondition={setSelectedCondition}
            onlyOffers={onlyOffers}
            onToggleOffers={setOnlyOffers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onViewProduct={setDetailProduct}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onBuyNow={(product) => handleBuyNow(product, 1)}
            addingProductId={addingProductId}
            onRetry={loadCatalog}
          />
        )}

        {activeSection === 'servicio-tecnico' && <ServiceView />}

        {activeSection === 'contacto' && <ContactView />}
      </main>

      <Footer
        onNavigate={navigateTo}
        onSelectCategory={handleSelectCategory}
        onOpenOffers={handleOpenOffers}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        open={cartOpen}
        initialStep={cartStep}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onCartUpdated={setCart}
        user={user}
      />

      {/* Auth & Orders Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        user={user}
        onAuthChange={setUser}
      />

      {/* Feedback Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-[#00FF55]/45 bg-[#101010] px-4 py-3 text-sm font-medium text-white shadow-[0_12px_36px_rgba(0,0,0,0.75)]"
        >
          <Check className="w-4 h-4 text-[#00FF55] shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
