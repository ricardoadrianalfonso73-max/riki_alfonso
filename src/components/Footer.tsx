import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { NavSection, ProductCategory } from '../shared/types.ts';
import { BrandMark } from './Navbar.tsx';

interface FooterProps {
  onNavigate: (section: NavSection) => void;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenOffers: () => void;
}

export function Footer({ onNavigate, onSelectCategory, onOpenOffers }: FooterProps) {
  return (
    <footer className="border-t border-[#00FF55]/15 bg-[#080808] text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className="font-display text-lg font-bold text-white">
                Electro Tecno
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              Celulares nuevos y usados seleccionados, computación, periféricos y laboratorio propio de reparación electrónica.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://wa.me/5493772430622?text=Hola%20Electro%20Tecno%2C%20te%20escribo%20para%20hacer%20una%20consulta."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00FF55] hover:text-[#33FF77] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <span className="text-neutral-700" aria-hidden="true">·</span>
              <a
                href="#instagram"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contacto');
                }}
                className="text-xs font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <span className="text-neutral-700" aria-hidden="true">·</span>
              <a
                href="#tiktok"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contacto');
                }}
                className="text-xs font-medium text-neutral-400 hover:text-white transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Navegación
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('inicio')}
                  className="text-neutral-400 hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('productos')}
                  className="text-neutral-400 hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Productos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenOffers}
                  className="text-neutral-400 hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Ofertas especiales
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('servicio-tecnico')}
                  className="text-neutral-400 hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Servicio Técnico
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contacto')}
                  className="text-neutral-400 hover:text-[#00FF55] transition-colors cursor-pointer"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Categorías
            </h3>
            <ul className="space-y-2.5 text-sm">
              {(
                [
                  'Celulares',
                  'PC y Netbooks',
                  'Monitores',
                  'Periféricos',
                  'Accesorios',
                ] as ProductCategory[]
              ).map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    className="text-neutral-400 hover:text-[#00FF55] transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Atención y Local
            </h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00FF55] shrink-0 mt-0.5" />
                <span>Alvear, Corrientes · Entre 9 de Julio y Marcelino Acuña</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00FF55] shrink-0" />
                <span className="tabular-nums">3772 430622</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00FF55] shrink-0" />
                <span>soporte@electrotecno.com.ar</span>
              </li>
              <li className="text-xs text-neutral-500 pt-1">
                Lun a Vie 8:00 a 21:00 hs · Sáb 8:00 a 19:00 hs
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Electro Tecno. Todos los derechos reservados.</p>
          <p>Garantía escrita en equipos nuevos, usados certificados y reparaciones.</p>
        </div>
      </div>
    </footer>
  );
}
