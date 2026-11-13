import { useEffect, useState } from "react";
import { StatCard } from "../../components/Stats.jsx";
import { professorService } from "./professor.service.js";
import {
  ArrowRight, CalendarCheck, ChevronDown, ClipboardCheck,
  Clock3, Dumbbell, HeartPulse, Sparkles, Users,
} from "lucide-react";

export default function ProfessorOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await professorService.getDashboard();
        setData(res);
      } catch (err) {
        setError(err.message || "Erro ao carregar dashboard do professor.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const m = data?.metrics || {
    aulasHoje: 0, alunosTurno: 0, avaliacoesPendentes: 0, horasSemana: 0, checkinsHoje: 0,
  };
  const nome = data?.professor?.nome || "Professor";
  const disciplina = data?.professor?.disciplina || "";

  return (
    <>
      {error && (
        <div className="mt-7 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {!loading && data && (
        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/50 px-5 py-3 text-xs text-brand-800">
          <strong>Bem-vindo(a), {nome}</strong>
          {disciplina && <span className="ml-2 text-brand-700/70">· {disciplina}</span>}
        </div>
      )}

      <section aria-label="Resumo do professor" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Turmas ativas" value={loading ? "..." : String(m.aulasHoje)} detail="turmas sob sua responsabilidade" trend="—" icon={CalendarCheck} iconStyle="bg-blue-50 text-blue-600" />
        <StatCard title="Alunos nas turmas" value={loading ? "..." : String(m.alunosTurno)} detail="alunos vinculados" trend="—" icon={Users} iconStyle="bg-emerald-50 text-emerald-600" />
        <StatCard title="Check-ins hoje" value={loading ? "..." : String(m.checkinsHoje)} detail="presenças registradas" trend="—" icon={ClipboardCheck} iconStyle="bg-violet-50 text-violet-600" />
        <StatCard title="Horas nesta semana" value={loading ? "..." : `${m.horasSemana}h`} detail="de 24h na sua agenda" trend="75%" icon={Clock3} iconStyle="bg-amber-50 text-amber-600" />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Próximas aulas</h2>
              <p className="mt-1 text-xs text-slate-400">Sua agenda de hoje</p>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
              Hoje <ChevronDown size={13} />
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {loading && <p className="text-xs text-slate-400">Carregando aulas...</p>}
            {!loading && (
              [
                { time: "10:00", name: "Musculação", detail: "Sala de pesos · 8 alunos", icon: Dumbbell, color: "bg-brand-50 text-brand-700" },
                { time: "11:30", name: "Treinamento funcional", detail: "Sala 2 · 12 alunos", icon: HeartPulse, color: "bg-violet-50 text-violet-700" },
                { time: "14:00", name: "Avaliação física", detail: "Sala de avaliação · Mariana O.", icon: ClipboardCheck, color: "bg-amber-50 text-amber-700" },
              ].map(({ time, name, detail, icon: Icon, color }) => (
                <div key={time} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5">
                  <span className="w-12 text-xs font-bold text-slate-500">{time}</span>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800">{name}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
                  </div>
                  <ArrowRight size={15} className="text-slate-300" />
                </div>
              ))
            )}
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-100 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
            Abrir minha agenda <ArrowRight size={14} />
          </button>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Alunos para acompanhar</h2>
            <p className="mt-1 text-xs text-slate-400">Atenção especial nesta semana</p>
          </div>
          <div className="mt-5 space-y-4">
            {loading && <p className="text-xs text-slate-400">Carregando alunos...</p>}
            {!loading && (
              [
                { name: "Mariana Oliveira", initials: "MO", note: "Avaliação física agendada hoje", color: "bg-rose-100 text-rose-700" },
                { name: "Lucas Ferreira", initials: "LF", note: "Meta de frequência atingida", color: "bg-sky-100 text-sky-700" },
                { name: "Beatriz Santos", initials: "BS", note: "Sem treinar há 5 dias", color: "bg-amber-100 text-amber-700" },
              ].map((student) => (
                <div key={student.name} className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${student.color}`}>{student.initials}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-700">{student.name}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{student.note}</p>
                  </div>
                  <ArrowRight size={14} className="shrink-0 text-slate-300" />
                </div>
              ))
            )}
          </div>
          <div className="mt-5 rounded-xl bg-brand-50 p-4">
            <div className="flex items-center gap-2 text-brand-700">
              <Sparkles size={16} />
              <span className="text-xs font-semibold">Dica da semana</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              Um acompanhamento próximo ajuda seus alunos a manterem a consistência.
            </p>
          </div>
        </article>
      </section>
    </>
  );
}