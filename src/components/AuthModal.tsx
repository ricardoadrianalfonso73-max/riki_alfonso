import { LogOut, Package, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, formatPrice, setAuthToken } from '../lib/api.ts';
import type { Order, PublicUser } from '../shared/types.ts';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  user: PublicUser | null;
  onAuthChange: (user: PublicUser | null) => void;
}

export function AuthModal({ open, onClose, user, onAuthChange }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (open && user) {
      setLoadingOrders(true);
      api
        .getOrders()
        .then((res) => setOrders(res.orders))
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));
    }
  }, [open, user]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res =
        tab === 'login'
          ? await api.login({ email, password })
          : await api.register({ name, email, password });
      setAuthToken(res.token);
      onAuthChange(res.user);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo autenticar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await api.logout().catch(() => undefined);
    setAuthToken(null);
    onAuthChange(null);
    setOrders([]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Cuenta de usuario"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[#00FF55]/30 bg-[#101010] p-6 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana de cuenta"
          className="absolute top-4 right-4 w-9 h-9 rounded-lg border border-white/15 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {user ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl border border-[#00FF55]/40 bg-[#00FF55]/10 flex items-center justify-center">
                <User className="w-5 h-5 text-[#00FF55]" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  {user.name}
                </h2>
                <p className="text-xs text-neutral-400">{user.email}</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-xs font-semibold text-neutral-300 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#00FF55]" />
                <span>Mis pedidos recientes</span>
              </h3>
              {loadingOrders ? (
                <p className="text-xs text-neutral-500">Cargando pedidos...</p>
              ) : orders.length === 0 ? (
                <p className="text-xs text-neutral-500">
                  Todavía no registraste compras con esta cuenta.
                </p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border border-white/10 bg-[#151515] p-3 text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="font-mono font-semibold text-white">
                          {order.orderNumber}
                        </p>
                        <p className="text-neutral-400">{order.status}</p>
                      </div>
                      <span className="font-mono font-bold text-[#00FF55] tabular-nums">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full h-10 rounded-lg border border-white/15 bg-[#151515] text-xs font-medium text-neutral-200 hover:border-red-400/40 hover:text-red-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        ) : (
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-1">
              Mi cuenta Electro Tecno
            </h2>
            <p className="text-xs text-neutral-400 mb-5">
              Guardá tus datos de envío y consultá el historial de tus compras.
            </p>

            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl border border-white/10 bg-[#151515] mb-5">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                }}
                className={`h-9 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  tab === 'login'
                    ? 'bg-[#00FF55] text-[#050505]'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                }}
                className={`h-9 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  tab === 'register'
                    ? 'bg-[#00FF55] text-[#050505]'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                Crear cuenta
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full h-10 px-3 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-[#00FF55] text-[#050505] text-sm font-bold hover:bg-[#33FF77] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {submitting
                  ? 'Procesando...'
                  : tab === 'login'
                    ? 'Ingresar'
                    : 'Registrarme'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
