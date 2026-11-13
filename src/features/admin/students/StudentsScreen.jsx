import { useEffect, useState } from "react";
import { adminService } from "../admin.service.js";
import { AdminMetric, FormField, Modal, ModalActions, StatusBadge } from "../shared/AdminComponents.jsx";
import { CalendarDays, Plus, Search, UserPlus, Users } from "lucide-react";

export function AdminStudentsScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadStudents() {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.listStudents();
      const list = Array.isArray(data) ? data : (data && data.students) || [];
      setStudentsList(list);
    } catch (err) {
      setError(err.message || "Erro ao carregar alunos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const visibleStudents = studentsList.filter((student) => {
    const matchesQuery = `${student.name} ${student.email}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "Todos" || student.status === filter;
    return matchesQuery && matchesFilter;
  });

  async function addStudent(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await adminService.createStudent({
        name: form.get("name").toString(),
        email: form.get("email").toString(),
        plan: form.get("plan").toString(),
      });
      setShowForm(false);
      await loadStudents();
    } catch (err) {
      setError(err.message || "Erro ao cadastrar aluno.");
    }
  }

  return (
    <>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminMetric label="Alunos ativos" value={String(studentsList.length)} detail="total cadastrado no banco" icon={Users} tone="bg-blue-50 text-blue-600" />
        <AdminMetric label="Novos alunos" value="—" detail="em breve" icon={UserPlus} tone="bg-emerald-50 text-emerald-600" />
        <AdminMetric label="Planos a vencer" value="—" detail="em breve" icon={CalendarDays} tone="bg-amber-50 text-amber-600" />
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Todos os alunos</h2>
            <p className="mt-1 text-xs text-slate-400">
              {loading ? "Carregando..." : `${visibleStudents.length} cadastro(s) encontrados`}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-slate-400">
              <Search size={15} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar aluno..." className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 sm:w-40" />
            </label>
            <select aria-label="Filtrar alunos por situação" value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-brand-500">
              {["Todos", "Ativo", "Vence em breve", "Pendente"].map((status) => <option key={status}>{status}</option>)}
            </select>
            <button onClick={() => setShowForm(true)} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-xs font-semibold text-white transition hover:bg-brand-700">
              <Plus size={15} /> Novo aluno
            </button>
          </div>
        </div>

        {error && (
          <div className="border-t border-red-100 bg-red-50 px-5 py-3 text-xs text-red-700 sm:px-6">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[690px] text-left">
            <thead><tr className="border-y border-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-semibold sm:px-6">Aluno</th><th className="px-3 py-3 font-semibold">Plano</th><th className="px-3 py-3 font-semibold">Renovação</th><th className="px-3 py-3 font-semibold">Situação</th><th className="px-5 py-3 sm:px-6" />
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {visibleStudents.map((student) => (
                <tr key={student.email || student.id} className="text-xs">
                  <td className="px-5 py-3.5 sm:px-6"><p className="font-semibold text-slate-700">{student.name}</p><p className="mt-1 text-[11px] text-slate-400">{student.email}</p></td>
                  <td className="px-3 py-3.5 text-slate-500">Plano {student.plan}</td>
                  <td className="px-3 py-3.5 text-slate-500">{student.renewal}</td>
                  <td className="px-3 py-3.5"><StatusBadge status={student.status} /></td>
                  <td className="px-5 py-3.5 text-right text-slate-300 sm:px-6">—</td>
                </tr>
              ))}
              {loading && <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-400">Carregando alunos...</td></tr>}
              {!loading && visibleStudents.length === 0 && <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-400">Nenhum aluno encontrado com esses filtros.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="border-t border-slate-50 px-5 py-3 text-[11px] text-slate-400 sm:px-6">Dados carregados do banco MySQL via API.</p>
      </section>

      {showForm && (
        <Modal title="Cadastrar aluno" onClose={() => setShowForm(false)}>
          <form onSubmit={addStudent} className="space-y-4">
            <FormField label="Nome completo" name="name" placeholder="Nome do aluno" required />
            <FormField label="E-mail" name="email" type="email" placeholder="aluno@email.com" required />
            <label className="block text-xs font-medium text-slate-700">Plano
              <select name="plan" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500">
                <option>Mensal</option><option>Trimestral</option><option>Anual</option>
              </select>
            </label>
            <ModalActions onCancel={() => setShowForm(false)} submitLabel="Cadastrar aluno" />
          </form>
        </Modal>
      )}
    </>
  );
}