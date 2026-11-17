import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';
import type { NavSection, PublicUser } from '../shared/types.ts';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  cartCount: number;
  user: PublicUser | null;
}

const NAV_ITEMS: { id: NavSection; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'productos', label: 'Productos' },
  { id: 'servicio-tecnico', label: 'Servicio Técnico' },
  { id: 'contacto', label: 'Contacto' },
];

export function BrandMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="7"
        fill="#101010"
        stroke="#00FF55"
        strokeWidth="1.5"
      />
      <path
        d="M17.5 6.5L10 17.5H15.5L14.5 25.5L22 14.5H16.5L17.5 6.5Z"
        fill="#00FF55"
      />
    </svg>
  );
}

export function Navbar({
  activeSection,
  onNavigate,
  onOpenSearch,
  onOpenCart,
  onOpenAuth,
  cartCount,
  user,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (section: NavSection) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#00FF55]/15 bg-[#050505]/92 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('inicio')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group cursor-pointer"
        >
          <BrandMark />
          <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-[#00FF55] transition-colors duration-200">
            Electro Tecno
          </span>
        </button>

        {/* Zone 2: Primary navigation links */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'text-[#00FF55]'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 bg-[#00FF55] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Action group (Search + Account + Cart + Mobile Menu) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Buscar productos"
            className="w-10 h-10 rounded-lg border border-white/10 bg-[#101010] text-neutral-300 hover:text-[#00FF55] hover:border-[#00FF55]/45 flex items-center justify-center transition-colors duration-150 cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            aria-label={user ? `Cuenta de ${user.name}` : 'Mi cuenta'}
            className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-lg border border-white/10 bg-[#101010] text-xs font-medium text-neutral-200 hover:text-[#00FF55] hover:border-[#00FF55]/45 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <User className="w-4 h-4 text-[#00FF55]" />
            <span>{user ? user.name.split(' ')[0] : 'Cuenta'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Carrito de compras (${cartCount} productos)`}
            className="h-10 px-3.5 rounded-lg bg-[#00FF55] text-[#050505] font-semibold text-xs sm:text-sm hover:bg-[#33FF77] transition-all duration-150 flex items-center gap-2 whitespace-nowrap shrink-0 shadow-[0_0_20px_rgba(0,255,85,0.22)] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Carrito</span>
            <span className="font-mono tabular-nums font-bold">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            className="lg:hidden w-10 h-10 rounded-lg border border-white/10 bg-[#101010] text-neutral-200 hover:border-[#00FF55]/50 flex items-center justify-center cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0A0A0A] px-4 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#00FF55]/12 text-[#00FF55] border border-[#00FF55]/30'
                    : 'text-neutral-300 hover:bg-[#151515] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenAuth();
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-[#151515] hover:text-white flex items-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4 text-[#00FF55]" />
            <span>{user ? `Cuenta (${user.name})` : 'Iniciar sesión / Registrarme'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
