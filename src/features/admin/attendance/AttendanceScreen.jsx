import { useState } from "react";
import { AdminMetric, StatusBadge } from "../shared/AdminComponents.jsx";
import { Activity, CalendarCheck, Download, Search, Users } from "lucide-react";

export function AdminAttendanceScreen() {
  const [period, setPeriod] = useState("Hoje");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const checkins = [
    { name: "Mariana Oliveira", plan: "Plano anual", date: "04 out, 2026", time: "08:42", status: "Presente" },
    { name: "Lucas Ferreira", plan: "Plano mensal", date: "04 out, 2026", time: "08:35", status: "Presente" },
    { name: "Beatriz Santos", plan: "Plano trimestral", date: "04 out, 2026", time: "08:21", status: "Presente" },
    { name: "Pedro Henrique", plan: "Plano anual", date: "04 out, 2026", time: "08:04", status: "Presente" },
    { name: "Camila Rodrigues", plan: "Plano mensal", date: "03 out, 2026", time: "18:12", status: "Presente" },
    { name: "Rafael Costa", plan: "Plano mensal", date: "03 out, 2026", time: "—", status: "Ausente" },
  ];
  const filteredCheckins = checkins.filter((entry) => {
    const matchesQuery = entry.name.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "Todos" || entry.status === statusFilter;
    const matchesPeriod = period !== "Hoje" || entry.date === "04 out, 2026";
    return matchesQuery && matchesStatus && matchesPeriod;
  });

  function exportCsv() {
    const csv = ["Aluno,Plano,Data,Horário,Situação", ...filteredCheckins.map((entry) => [entry.name, entry.plan, entry.date, entry.time, entry.status].join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "frequencia-gestaofit.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminMetric label="Check-ins hoje" value="36" detail="registros de entrada na academia" icon={CalendarCheck} tone="bg-blue-50 text-blue-600" />
        <AdminMetric label="Frequência do mês" value="1.284" detail="visitas registradas em outubro" icon={Activity} tone="bg-emerald-50 text-emerald-600" />
        <AdminMetric label="Média diária" value="42" detail="alunos por dia neste mês" icon={Users} tone="bg-violet-50 text-violet-600" />
      </section>
      <section className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-sm font-bold text-slate-800">Movimento da academia</h2><p className="mt-1 text-xs text-slate-400">Check-ins registrados ao longo do mês</p></div><button onClick={exportCsv} className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Download size={14} /> Exportar CSV</button></div>
        <div className="mt-5 flex h-32 items-end gap-2 border-b border-slate-100 pb-2 sm:gap-3">{[35, 52, 46, 68, 58, 80, 66, 55, 73, 91, 71, 62].map((height, index) => <div key={index} className="group flex h-full flex-1 items-end"><div title={`${height} check-ins`} className={`w-full rounded-t-md ${index === 9 ? "bg-brand-600" : "bg-brand-100 group-hover:bg-brand-200"}`} style={{ height: `${height}%` }} /></div>)}</div>
        <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>01 out</span><span>08 out</span><span>15 out</span><span>22 out</span><span>31 out</span></div>
      </section>
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6"><div><h2 className="text-sm font-bold text-slate-800">Registros de frequência</h2><p className="mt-1 text-xs text-slate-400">{filteredCheckins.length} registro(s) encontrados</p></div><div className="flex flex-wrap gap-2"><label className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-slate-400"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar aluno..." className="w-32 bg-transparent text-xs outline-none placeholder:text-slate-400" /></label><select aria-label="Período dos registros" value={period} onChange={(event) => setPeriod(event.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600"><option>Hoje</option><option>Este mês</option></select><select aria-label="Filtrar por presença" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600"><option>Todos</option><option>Presente</option><option>Ausente</option></select></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left"><thead><tr className="border-y border-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><th className="px-5 py-3 font-semibold sm:px-6">Aluno</th><th className="px-3 py-3 font-semibold">Plano</th><th className="px-3 py-3 font-semibold">Data</th><th className="px-3 py-3 font-semibold">Horário</th><th className="px-5 py-3 font-semibold sm:px-6">Situação</th></tr></thead><tbody className="divide-y divide-slate-50">{filteredCheckins.map((entry) => <tr key={`${entry.name}-${entry.date}`} className="text-xs"><td className="px-5 py-3.5 font-semibold text-slate-700 sm:px-6">{entry.name}</td><td className="px-3 py-3.5 text-slate-500">{entry.plan}</td><td className="px-3 py-3.5 text-slate-500">{entry.date}</td><td className="px-3 py-3.5 text-slate-500">{entry.time}</td><td className="px-5 py-3.5 sm:px-6"><StatusBadge status={entry.status} /></td></tr>)}</tbody></table></div>
      </section>
    </>
  );
}
