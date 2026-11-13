import { useState } from "react";
import { AdminMetric, FormField, Modal, ModalActions, StatusBadge } from "../shared/AdminComponents.jsx";
import { Check, Dumbbell, Plus, Wrench } from "lucide-react";

export function AdminEquipmentScreen() {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [equipment, setEquipment] = useState([
    { name: "Esteira 03", category: "Cardio", lastReview: "10 set, 2026", nextReview: "08 out, 2026", status: "Manutenção pendente" },
    { name: "Bicicleta 02", category: "Cardio", lastReview: "01 out, 2026", nextReview: "01 nov, 2026", status: "Disponível" },
    { name: "Leg press", category: "Musculação", lastReview: "18 set, 2026", nextReview: "18 out, 2026", status: "Agendada" },
    { name: "Esteira 01", category: "Cardio", lastReview: "25 set, 2026", nextReview: "25 out, 2026", status: "Disponível" },
  ]);
  const pendingCount = equipment.filter((item) => item.status === "Manutenção pendente").length;
  const visibleEquipment = equipment.filter((item) => filter === "Todos" || item.status === filter);

  function addMaintenance(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setEquipment((current) => [
      { name: form.get("equipment").toString(), category: form.get("category").toString(), lastReview: "—", nextReview: form.get("date").toString(), status: "Manutenção pendente" },
      ...current,
    ]);
    setShowForm(false);
  }

  function completeMaintenance(name) {
    setEquipment((current) => current.map((item) => item.name === name ? { ...item, status: "Disponível" } : item));
  }

  return (
    <>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminMetric label="Equipamentos cadastrados" value={String(equipment.length + 28)} detail="distribuídos pela unidade" icon={Dumbbell} tone="bg-blue-50 text-blue-600" />
        <AdminMetric label="Disponíveis" value={String(equipment.filter((item) => item.status === "Disponível").length + 26)} detail="prontos para uso" icon={Check} tone="bg-emerald-50 text-emerald-600" />
        <AdminMetric label="Manutenções pendentes" value={String(pendingCount + equipment.filter((item) => item.status === "Agendada").length + 1)} detail="equipamentos para revisar" icon={Wrench} tone="bg-amber-50 text-amber-600" />
      </section>
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6"><div><h2 className="text-sm font-bold text-slate-800">Equipamentos e manutenção</h2><p className="mt-1 text-xs text-slate-400">Acompanhe disponibilidade e revisões preventivas</p></div><div className="flex gap-2"><select aria-label="Filtrar equipamentos" value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600"><option>Todos</option><option>Disponível</option><option>Agendada</option><option>Manutenção pendente</option></select><button onClick={() => setShowForm(true)} className="flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-3 text-xs font-semibold text-white hover:bg-brand-700"><Plus size={15} /> Registrar manutenção</button></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[740px] text-left"><thead><tr className="border-y border-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><th className="px-5 py-3 font-semibold sm:px-6">Equipamento</th><th className="px-3 py-3 font-semibold">Categoria</th><th className="px-3 py-3 font-semibold">Última revisão</th><th className="px-3 py-3 font-semibold">Próxima revisão</th><th className="px-3 py-3 font-semibold">Situação</th><th className="px-5 py-3 sm:px-6" /></tr></thead><tbody className="divide-y divide-slate-50">{visibleEquipment.map((item) => <tr key={item.name} className="text-xs"><td className="px-5 py-3.5 font-semibold text-slate-700 sm:px-6">{item.name}</td><td className="px-3 py-3.5 text-slate-500">{item.category}</td><td className="px-3 py-3.5 text-slate-500">{item.lastReview}</td><td className="px-3 py-3.5 text-slate-500">{item.nextReview}</td><td className="px-3 py-3.5"><StatusBadge status={item.status} /></td><td className="px-5 py-3.5 text-right sm:px-6">{item.status === "Manutenção pendente" && <button onClick={() => completeMaintenance(item.name)} className="whitespace-nowrap rounded-lg border border-brand-100 px-2.5 py-1.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-50">Concluir</button>}</td></tr>)}</tbody></table></div><p className="border-t border-slate-50 px-5 py-3 text-[11px] text-slate-400 sm:px-6">Registros demonstrativos. Concluir a manutenção atualiza o estado nesta sessão.</p>
      </section>
      {showForm && <Modal title="Registrar manutenção" onClose={() => setShowForm(false)}><form onSubmit={addMaintenance} className="space-y-4"><FormField label="Equipamento" name="equipment" placeholder="Ex.: Bicicleta 04" required /><label className="block text-xs font-medium text-slate-700">Categoria<select name="category" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500"><option>Cardio</option><option>Musculação</option><option>Acessório</option></select></label><FormField label="Data prevista" name="date" type="date" required /><ModalActions onCancel={() => setShowForm(false)} submitLabel="Salvar manutenção" /></form></Modal>}
    </>
  );
}
