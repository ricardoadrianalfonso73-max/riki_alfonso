import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { api } from '../lib/api.ts';

export function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Consulta sobre productos');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.submitContact({ name, email, phone, subject, message });
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el mensaje.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="pb-8 border-b border-white/10 mb-10">
        <p className="text-xs font-medium text-[#00FF55] mb-2">
          Atención personalizada
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          CONTACTO
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl">
          Escribinos por asesoramiento comercial, stock de equipos o seguimiento de tu pedido.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info & Socials */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#00FF55]/20 bg-[#101010] p-6 space-y-5">
            <h2 className="font-display text-xl font-semibold text-white">
              Información de contacto
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00FF55] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Local comercial</p>
                  <p className="text-neutral-400">Av. Corrientes 2480, Local 14 · CABA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#00FF55] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Teléfono</p>
                  <p className="text-neutral-400 tabular-nums">+54 11 5555-0199</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#00FF55] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Correo electrónico</p>
                  <p className="text-neutral-400">soporte@electrotecno.com.ar</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#00FF55] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Horarios de atención</p>
                  <p className="text-neutral-400">
                    Lunes a Viernes: 9:30 a 19:00 hs
                    <br />
                    Sábados: 10:00 a 14:30 hs
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <a
                href="https://wa.me/5491155550199"
                target="_blank"
                rel="noreferrer"
                className="w-full h-11 rounded-xl bg-[#00FF55] text-[#050505] font-bold text-sm hover:bg-[#33FF77] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chatear por WhatsApp</span>
              </a>

              <div className="grid grid-cols-3 gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 rounded-lg border border-white/15 bg-[#151515] text-xs font-medium text-neutral-300 hover:border-[#00FF55]/50 hover:text-white flex items-center justify-center transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 rounded-lg border border-white/15 bg-[#151515] text-xs font-medium text-neutral-300 hover:border-[#00FF55]/50 hover:text-white flex items-center justify-center transition-colors"
                >
                  TikTok
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 rounded-lg border border-white/15 bg-[#151515] text-xs font-medium text-neutral-300 hover:border-[#00FF55]/50 hover:text-white flex items-center justify-center transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[#00FF55]/20 bg-[#101010] p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-white mb-2">
              Envianos tu consulta
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Completá el formulario y te respondemos en menos de 2 horas hábiles.
            </p>

            {sent ? (
              <div className="rounded-xl border border-[#00FF55]/45 bg-[#00FF55]/10 p-6 space-y-3">
                <div className="flex items-center gap-2.5 text-[#00FF55]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-display font-bold text-lg">
                    Consulta enviada correctamente
                  </span>
                </div>
                <p className="text-sm text-neutral-200">
                  Gracias por escribirnos. Nuestro equipo recibió tu mensaje y te contactará a la brevedad.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="h-9 px-4 rounded-lg border border-[#00FF55]/40 text-xs font-semibold text-[#00FF55] hover:bg-[#00FF55]/15 cursor-pointer"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full h-11 px-3.5 rounded-lg border border-white/15 bg-[#151515] text-sm text-white placeholder:text-neutral-500 focus:border-[#00FF55] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full h-11 px-3.5 rounded-lg border border-white/15 bg-[#151515] text-sm text-white placeholder:text-neutral-500 focus:border-[#00FF55] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Teléfono (opcional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+54 11 ..."
                      className="w-full h-11 px-3.5 rounded-lg border border-white/15 bg-[#151515] text-sm text-white placeholder:text-neutral-500 focus:border-[#00FF55] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Motivo
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                    >
                      <option>Consulta sobre productos</option>
                      <option>Stock y envíos</option>
                      <option>Garantía y postventa</option>
                      <option>Ventas corporativas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Mensaje
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribí tu consulta aquí..."
                    className="w-full p-3.5 rounded-lg border border-white/15 bg-[#151515] text-sm text-white placeholder:text-neutral-500 focus:border-[#00FF55] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-11 px-6 rounded-xl bg-[#00FF55] text-[#050505] text-sm font-bold hover:bg-[#33FF77] disabled:opacity-50 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Enviando...' : 'Enviar consulta'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
