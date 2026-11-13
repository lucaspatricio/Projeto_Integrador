import { useEffect, useState } from "react";
import { AdminMetric, StatusBadge } from "../shared/AdminComponents.jsx";
import { apiRequest } from "../../../lib/api/client.js";
import { Activity, CalendarCheck, Download, Search, Users } from "lucide-react";

export function AdminAttendanceScreen() {
  const [period, setPeriod] = useState("Hoje");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [checkins, setCheckins] = useState([]);
  const [metrics, setMetrics] = useState({ checkinsHoje: 0, frequenciaMes: 0, mediaDiaria: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadAttendance() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest("/admin/attendance");
      setCheckins(Array.isArray(data.records) ? data.records : []);
      setMetrics(data.metrics || { checkinsHoje: 0, frequenciaMes: 0, mediaDiaria: 0 });
    } catch (err) {
      setError(err.message || "Erro ao carregar frequência.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);

  const filteredCheckins = checkins.filter((entry) => {
    const matchesQuery = entry.name.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "Todos" || entry.status === statusFilter;
    const matchesPeriod =
      period === "Hoje"
        ? entry.date === today
        : entry.date && entry.date.slice(0, 7) === currentMonth;
    return matchesQuery && matchesStatus && matchesPeriod;
  });

  function exportCsv() {
    const csv = [
      "Aluno,Plano,Data,Horário,Situação",
      ...filteredCheckins.map((e) => [e.name, e.plan, e.dateLabel, e.time, e.status].join(",")),
    ].join("\n");
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
        <AdminMetric label="Check-ins hoje" value={String(metrics.checkinsHoje)} detail="registros de entrada na academia" icon={CalendarCheck} tone="bg-blue-50 text-blue-600" />
        <AdminMetric label="Frequência do mês" value={String(metrics.frequenciaMes)} detail="visitas registradas no mês atual" icon={Activity} tone="bg-emerald-50 text-emerald-600" />
        <AdminMetric label="Média diária" value={String(metrics.mediaDiaria)} detail="alunos por dia neste mês" icon={Users} tone="bg-violet-50 text-violet-600" />
      </section>

      {error && (
        <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      <section className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Movimento da academia</h2>
            <p className="mt-1 text-xs text-slate-400">Check-ins registrados ao longo do mês</p>
          </div>
          <button onClick={exportCsv} className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <Download size={14} /> Exportar CSV
          </button>
        </div>
        <div className="mt-5 flex h-32 items-end gap-2 border-b border-slate-100 pb-2 sm:gap-3">
          {[35, 52, 46, 68, 58, 80, 66, 55, 73, 91, 71, 62].map((height, index) => (
            <div key={index} className="group flex h-full flex-1 items-end">
              <div title={`${height} check-ins`} className={`w-full rounded-t-md ${index === 9 ? "bg-brand-600" : "bg-brand-100 group-hover:bg-brand-200"}`} style={{ height: `${height}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-slate-400">
          <span>01</span><span>08</span><span>15</span><span>22</span><span>31</span>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Registros de frequência</h2>
            <p className="mt-1 text-xs text-slate-400">
              {loading ? "Carregando..." : `${filteredCheckins.length} registro(s) encontrados`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-slate-400">
              <Search size={14} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar aluno..." className="w-32 bg-transparent text-xs outline-none placeholder:text-slate-400" />
            </label>
            <select aria-label="Período dos registros" value={period} onChange={(event) => setPeriod(event.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600">
              <option>Hoje</option><option>Este mês</option>
            </select>
            <select aria-label="Filtrar por presença" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600">
              <option>Todos</option><option>Presente</option><option>Ausente</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-y border-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold sm:px-6">Aluno</th>
                <th className="px-3 py-3 font-semibold">Plano</th>
                <th className="px-3 py-3 font-semibold">Data</th>
                <th className="px-3 py-3 font-semibold">Horário</th>
                <th className="px-5 py-3 font-semibold sm:px-6">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCheckins.map((entry) => (
                <tr key={entry.id} className="text-xs">
                  <td className="px-5 py-3.5 font-semibold text-slate-700 sm:px-6">{entry.name}</td>
                  <td className="px-3 py-3.5 text-slate-500">{entry.plan}</td>
                  <td className="px-3 py-3.5 text-slate-500">{entry.dateLabel}</td>
                  <td className="px-3 py-3.5 text-slate-500">{entry.time}</td>
                  <td className="px-5 py-3.5 sm:px-6"><StatusBadge status={entry.status} /></td>
                </tr>
              ))}
              {loading && <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-400">Carregando registros...</td></tr>}
              {!loading && filteredCheckins.length === 0 && <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-400">Nenhum registro encontrado com esses filtros.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="border-t border-slate-50 px-5 py-3 text-[11px] text-slate-400 sm:px-6">
          Dados carregados do banco MySQL via API.
        </p>
      </section>
    </>
  );
}
