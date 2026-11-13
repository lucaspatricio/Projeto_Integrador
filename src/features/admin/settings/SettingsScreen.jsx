import { useState } from "react";
import { Bell, Mail, MapPin, Save, Settings } from "lucide-react";
import { FormField } from "../shared/AdminComponents.jsx";

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    name: "GestãoFit Academia",
    email: "contato@gestaofit.com.br",
    phone: "(11) 3456-7890",
    address: "Av. dos Autonomistas, 1234 — Osasco, SP",
    paymentAlerts: true,
    maintenanceAlerts: true,
    weeklyReport: false,
  });
  const [saved, setSaved] = useState(false);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  }

  return (
    <form
      className="mt-7 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Settings size={19} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Dados da academia</h2>
            <p className="mt-1 text-xs text-slate-400">Informações básicas da sua unidade</p>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          <FormField label="Nome da academia" name="name" value={settings.name} onChange={updateField} required />
          <FormField label="E-mail de contato" name="email" type="email" value={settings.email} onChange={updateField} required />
          <FormField label="Telefone" name="phone" type="tel" value={settings.phone} onChange={updateField} />
          <FormField label="Endereço" name="address" value={settings.address} onChange={updateField} />
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-800">
          <MapPin size={15} /> Unidade principal · Osasco, SP
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Bell size={18} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Notificações</h2>
            <p className="mt-1 text-xs text-slate-400">Escolha os avisos da equipe</p>
          </div>
        </div>
        <div className="mt-2 divide-y divide-slate-100">
          {[
            ["paymentAlerts", "Cobranças pendentes", "Avisar quando uma mensalidade vencer."],
            ["maintenanceAlerts", "Manutenções", "Lembrar sobre revisões programadas."],
            ["weeklyReport", "Resumo semanal", "Receber um resumo da academia por e-mail."],
          ].map(([name, title, description]) => (
            <label key={name} className="flex cursor-pointer items-start justify-between gap-4 py-4">
              <span>
                <span className="block text-xs font-semibold text-slate-700">{title}</span>
                <span className="mt-1 block text-[11px] leading-4 text-slate-400">{description}</span>
              </span>
              <input
                type="checkbox"
                name={name}
                checked={settings[name]}
                onChange={updateField}
                className="mt-0.5 h-4 w-4 accent-[#267345]"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Mail size={15} />
            <span className="text-xs font-semibold">E-mail administrativo</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">{settings.email}</p>
        </div>
        <button
          type="submit"
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-xs font-semibold text-white hover:bg-brand-700"
        >
          <Save size={15} /> Salvar configurações
        </button>
        {saved && (
          <p role="status" className="mt-3 text-center text-xs font-medium text-emerald-700">
            Configurações salvas nesta sessão.
          </p>
        )}
      </section>
      <p className="text-[11px] text-slate-400 xl:col-span-2">
        Protótipo: as preferências e os dados editados não são enviados para um servidor.
      </p>
    </form>
  );
}
