import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Cpu,
  HardDrive,
  Send,
  Smartphone,
  Wrench,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { api } from '../lib/api.ts';
import type { RepairRequest } from '../shared/types.ts';
import { ResilientImage } from './ResilientImage.tsx';

const REPAIR_CAPABILITIES = [
  {
    icon: Smartphone,
    title: 'Cambio de módulos OLED y LCD',
    issueOption: 'Cambio de pantalla / módulo',
    description: 'Pantallas originales y grado AAA con calibración de brillo y sellado.',
  },
  {
    icon: BatteryCharging,
    title: 'Baterías y pines de carga',
    issueOption: 'Reemplazo de batería',
    description: 'Reemplazo de celdas certificadas y puertos USB-C / Lightning con garantía.',
  },
  {
    icon: Cpu,
    title: 'Micro-soldadura en placa',
    issueOption: 'Equipo mojado / falla de placa',
    description: 'Diagnóstico con microscopio digital, recuperación de equipos mojados y cortos.',
  },
  {
    icon: HardDrive,
    title: 'PC, netbooks y recuperación',
    issueOption: 'Mantenimiento PC / Netbook',
    description: 'Mantenimiento térmico, upgrades a SSD NVMe y resguardo de datos.',
  },
];

export function ServiceView() {
  const [panelOpen, setPanelOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [issueType, setIssueType] = useState('Cambio de pantalla / módulo');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<RepairRequest | null>(null);

  const openConsultPanel = (presetIssue?: string) => {
    if (presetIssue) {
      setIssueType(presetIssue);
    }
    setError(null);
    setTicket(null);
    setPanelOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { repair } = await api.submitRepair({
        customerName,
        customerEmail,
        customerPhone,
        deviceModel,
        issueType,
        description,
      });
      setTicket(repair);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setDeviceModel('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la consulta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Intro split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <p className="text-xs font-medium text-[#00FF55] mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <span>Laboratorio Técnico Especializado</span>
          </p>
          <h1
            className="font-display font-extrabold tracking-tight text-white leading-[1.08] mb-5"
            style={{ fontSize: 'clamp(2rem, 3.8vw, 3.25rem)', textWrap: 'balance' }}
          >
            LE DAMOS UNA SEGUNDA VIDA A TU CELULAR
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8">
            Realizamos diagnósticos y reparaciones para que tu dispositivo vuelva a funcionar correctamente.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => openConsultPanel()}
              className="h-12 px-7 rounded-xl bg-[#00FF55] text-[#050505] font-display font-bold text-sm tracking-tight hover:bg-[#33FF77] transition-all shadow-[0_0_24px_rgba(0,255,85,0.25)] cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <span>CONSULTAR SERVICIO TÉCNICO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/5491155550199?text=Hola%20Electro%20Tecno%2C%20quiero%20consultar%20por%20servicio%20t%C3%A9cnico"
              target="_blank"
              rel="noreferrer"
              className="h-12 px-6 rounded-xl border border-white/15 bg-[#101010] text-neutral-200 text-sm font-medium hover:border-[#00FF55]/50 hover:text-white flex items-center transition-colors whitespace-nowrap"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[320px] rounded-2xl border border-[#00FF55]/25 bg-[#101010] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
            <ResilientImage
              src="/src/assets/images/service_tech_repair_1794919175314.jpg"
              alt="Técnico de Electro Tecno reparando placa electrónica de celular bajo microscopio"
              fallbackTitle="Laboratorio Técnico Electro Tecno"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Capabilities (clickable to open consultation panel for that specific service) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Especialidades de reparación
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Seleccioná un servicio para abrir el panel de consulta directa con nuestro taller.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REPAIR_CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <button
                key={cap.title}
                type="button"
                onClick={() => openConsultPanel(cap.issueOption)}
                className="group text-left rounded-2xl border border-[#00FF55]/18 bg-[#101010] p-6 hover:-translate-y-0.5 hover:border-[#00FF55]/55 transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg border border-[#00FF55]/30 bg-[#00FF55]/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#00FF55]" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white group-hover:text-[#00FF55] transition-colors mb-1.5">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                    {cap.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00FF55]">
                  <span>Consultar este servicio</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* On-demand Technical Consultation Panel (Modal) */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Consulta de Servicio Técnico"
        >
          <div className="relative w-full max-w-xl rounded-2xl border border-[#00FF55]/35 bg-[#101010] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.85)] my-auto">
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label="Cerrar panel de consulta"
              className="absolute top-4 right-4 w-9 h-9 rounded-lg border border-white/15 bg-[#151515] text-neutral-300 hover:text-white hover:border-[#00FF55]/60 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6 pr-8">
              <p className="text-xs font-medium text-[#00FF55] mb-1">
                Electro Tecno · Taller Técnico
              </p>
              <h2 className="font-display text-2xl font-bold text-white">
                Consultar Servicio Técnico
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Enviá los datos de tu equipo y te responderemos con el diagnóstico y presupuesto estimado.
              </p>
            </div>

            {ticket ? (
              <div className="rounded-xl border border-[#00FF55]/45 bg-[#00FF55]/10 p-6 space-y-4">
                <div className="flex items-center gap-2.5 text-[#00FF55]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-display font-bold text-lg text-white">
                    Consulta enviada · Orden {ticket.ticketNumber}
                  </span>
                </div>
                <p className="text-sm text-neutral-200 leading-relaxed">
                  Recibimos tu mensaje para{' '}
                  <strong className="text-white">{ticket.deviceModel}</strong> (
                  {ticket.issueType}). Nuestro equipo técnico te responderá a{' '}
                  <span className="text-[#00FF55]">{ticket.customerEmail}</span>.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setTicket(null)}
                    className="h-10 px-4 rounded-lg border border-[#00FF55]/40 text-xs font-semibold text-[#00FF55] hover:bg-[#00FF55]/15 cursor-pointer"
                  >
                    Nueva consulta
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanelOpen(false)}
                    className="h-10 px-5 rounded-lg bg-[#00FF55] text-[#050505] text-xs font-bold hover:bg-[#33FF77] cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Nombre y apellido
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Martín Gómez"
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
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full h-11 px-3.5 rounded-lg border border-white/15 bg-[#151515] text-sm text-white placeholder:text-neutral-500 focus:border-[#00FF55] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+54 11 ..."
                      className="w-full h-11 px-3.5 rounded-lg border border-white/15 bg-[#151515] text-sm text-white placeholder:text-neutral-500 focus:border-[#00FF55] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Marca y modelo
                    </label>
                    <input
                      type="text"
                      required
                      value={deviceModel}
                      onChange={(e) => setDeviceModel(e.target.value)}
                      placeholder="Ej. iPhone 14 Pro / S23"
                      className="w-full h-11 px-3.5 rounded-lg border border-white/15 bg-[#151515] text-sm text-white placeholder:text-neutral-500 focus:border-[#00FF55] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Servicio a consultar
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-white/15 bg-[#151515] text-sm text-white focus:border-[#00FF55] focus:outline-none"
                  >
                    <option>Cambio de pantalla / módulo</option>
                    <option>Reemplazo de batería</option>
                    <option>Pin de carga / conector</option>
                    <option>Equipo mojado / falla de placa</option>
                    <option>Mantenimiento PC / Netbook</option>
                    <option>Otro diagnóstico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Mensaje o falla del equipo
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contanos qué problema presenta el dispositivo..."
                    className="w-full p-3.5 rounded-lg border border-white/15 bg-[#151515] text-sm text-white placeholder:text-neutral-500 focus:border-[#00FF55] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPanelOpen(false)}
                    className="h-11 px-5 rounded-xl border border-white/15 bg-[#151515] text-sm font-medium text-neutral-300 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-11 px-6 rounded-xl bg-[#00FF55] text-[#050505] text-sm font-bold hover:bg-[#33FF77] disabled:opacity-50 transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Enviando...' : 'Enviar consulta'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
