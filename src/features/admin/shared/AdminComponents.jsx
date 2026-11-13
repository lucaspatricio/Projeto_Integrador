import { X } from "lucide-react";

export function AdminMetric({ label, value, detail, icon: Icon, tone }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></span>
      <p className="mt-4 text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
    </article>
  );
}

export function StatusBadge({ status }) {
  const tone = /ativo|recebido|presente|em dia|concluída|disponível/i.test(status)
    ? "bg-emerald-50 text-emerald-700"
    : /pendente|atrasado|vence|manutenção|atenção/i.test(status)
      ? "bg-amber-50 text-amber-700"
      : "bg-blue-50 text-blue-700";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${tone}`}>{status}</span>;
}

export function FormField({ label, name, type = "text", placeholder, required = false, value, onChange }) {
  return <label className="block text-xs font-medium text-slate-700">{label}<input name={name} type={type} placeholder={placeholder} required={required} value={value} onChange={onChange} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" /></label>;
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between"><h2 id="admin-modal-title" className="text-base font-bold text-slate-900">{title}</h2><button aria-label="Fechar" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"><X size={17} /></button></div>
        {children}
      </section>
    </div>
  );
}

export function ModalActions({ onCancel, submitLabel }) {
  return <div className="flex gap-3 pt-2"><button type="button" onClick={onCancel} className="h-11 flex-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button><button type="submit" className="h-11 flex-1 rounded-xl bg-brand-600 text-xs font-semibold text-white hover:bg-brand-700">{submitLabel}</button></div>;
}
