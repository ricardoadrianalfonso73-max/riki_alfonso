import { ArrowRight, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import type { NavSection, ProductCategory } from '../shared/types.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface HomeViewProps {
  onNavigate: (section: NavSection) => void;
  onSelectCategory: (category: ProductCategory) => void;
}

const BENEFITS = [
  {
    icon: Truck,
    title: 'Envíos a todo el país',
    description:
      'Despachos asegurados en 24 hs hábiles con seguimiento en tiempo real hasta tu domicilio.',
  },
  {
    icon: ShieldCheck,
    title: 'Compra segura',
    description:
      'Equipos nuevos sellados y usados certificados con 32 puntos de control técnico y garantía escrita.',
  },
  {
    icon: Wrench,
    title: 'Soporte técnico',
    description:
      'Asesoramiento pre y postventa directo con especialistas de nuestro laboratorio electrónico.',
  },
];

const CATEGORIES = [
  {
    title: 'CELULARES',
    subtitle: 'Smartphones nuevos y usados certificados con garantía.',
    image: '/src/assets/images/cat_celulares_showcase_1794919175186.jpg',
    actionLabel: 'Explorar celulares',
    onClickType: 'category' as const,
    category: 'Celulares' as ProductCategory,
  },
  {
    title: 'SERVICIO TÉCNICO',
    subtitle: 'Micro-soldadura, módulos OLED, baterías y diagnóstico integral.',
    image: '/src/assets/images/service_tech_repair_1794919175314.jpg',
    actionLabel: 'Ir al laboratorio',
    onClickType: 'section' as const,
    section: 'servicio-tecnico' as NavSection,
  },
  {
    title: 'ACCESORIOS',
    subtitle: 'Auriculares, cargadores rápidos GaN, fundas y periféricos.',
    image: '/src/assets/images/cat_accesorios_showcase_1794919175345.jpg',
    actionLabel: 'Ver accesorios',
    onClickType: 'category' as const,
    category: 'Accesorios' as ProductCategory,
  },
];

export function HomeView({ onNavigate, onSelectCategory }: HomeViewProps) {
  return (
    <div className="bg-[#050505]">
      {/* 3. Portada Principal (Hero Section) */}
      <section className="relative overflow-hidden border-b border-[#00FF55]/15 tech-grid-bg">
        {/* Subtle green radial ambiance */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-[460px] w-[520px] rounded-full bg-[#00FF55]/10 blur-[130px]"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <p className="text-xs sm:text-sm font-medium tracking-wide text-[#00FF55] mb-3">
                Electro Tecno · Tecnología Nocturna
              </p>

              <h1
                className="font-display font-extrabold tracking-tight text-white leading-[1.05] mb-4"
                style={{ fontSize: 'clamp(2.35rem, 4.4vw, 3.85rem)', textWrap: 'balance' }}
              >
                ELECTRO TECNO
                <span className="block text-[#00FF55] mt-1">
                  TECNOLOGÍA A TU ALCANCE
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-xl mb-8">
                Celulares nuevos y usados, reparación y accesorios. Encontrá todo lo que necesitás en un solo lugar.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('productos')}
                  className="h-12 px-7 rounded-xl bg-[#00FF55] text-[#050505] font-display font-bold text-sm sm:text-base tracking-tight hover:bg-[#33FF77] transition-all duration-150 shadow-[0_0_28px_rgba(0,255,85,0.28)] hover:shadow-[0_0_36px_rgba(0,255,85,0.45)] flex items-center gap-2.5 whitespace-nowrap cursor-pointer"
                >
                  <span>VER PRODUCTO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('servicio-tecnico')}
                  className="h-12 px-6 rounded-xl border border-white/15 bg-[#101010] text-neutral-200 font-medium text-sm hover:border-[#00FF55]/50 hover:text-white transition-colors duration-150 whitespace-nowrap cursor-pointer"
                >
                  Servicio Técnico
                </button>
              </div>
            </motion.div>

            {/* Right Visual Anchor */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex"
            >
              <div className="relative w-full rounded-2xl border border-[#00FF55]/30 bg-[#101010] overflow-hidden shadow-[0_20px_60px_rgba(0,255,85,0.12)] aspect-[16/10] lg:aspect-auto lg:min-h-[420px]">
                <ResilientImage
                  src="/src/assets/images/hero_smartphone_neon_1794919175040.jpg"
                  alt="Smartphone insignia con iluminación verde sobre superficie oscura en Electro Tecno"
                  fallbackTitle="Electro Tecno · Smartphones"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/75 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 text-xs text-neutral-200">
                  <span className="font-medium">Equipos seleccionados · Stock inmediato</span>
                  <span className="font-mono text-[#00FF55]">Garantía escrita</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Sección de Beneficios */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-2xl border border-[#00FF55]/22 bg-[#101010] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00FF55]/60 hover:shadow-[0_0_24px_rgba(0,255,85,0.08)]"
              >
                <div className="w-11 h-11 rounded-xl border border-[#00FF55]/30 bg-[#00FF55]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#00FF55]" />
                </div>
                <h2 className="font-display text-lg font-semibold text-white mb-2">
                  {benefit.title}
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. Sección de Categorías */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium text-[#00FF55] mb-2">
                Explorá por especialidad
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                NUESTRAS CATEGORÍAS
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('productos')}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#00FF55] hover:text-[#33FF77] transition-colors cursor-pointer"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.title}
                type="button"
                onClick={() => {
                  if (cat.onClickType === 'category' && cat.category) {
                    onSelectCategory(cat.category);
                  } else if (cat.section) {
                    onNavigate(cat.section);
                  }
                }}
                className="group relative text-left rounded-2xl border border-[#00FF55]/20 bg-[#151515] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[#00FF55]/65 hover:shadow-[0_14px_36px_rgba(0,255,85,0.12)] cursor-pointer"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <ResilientImage
                    src={cat.image}
                    alt={cat.title}
                    fallbackTitle={cat.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 border-t border-white/10">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-[#00FF55] transition-colors mb-1.5">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                    {cat.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00FF55]">
                    <span>{cat.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
