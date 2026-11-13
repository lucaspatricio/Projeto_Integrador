import { useEffect, useState } from "react";
import { StatCard } from "../../components/Stats.jsx";
import { studentService } from "./student.service.js";
import { apiRequest } from "../../lib/api/client.js";
import {
  Activity, ArrowRight, CalendarCheck, Check, Clock3, CreditCard,
  Dumbbell, Flame, HeartPulse, Target,
} from "lucide-react";

export default function StudentOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await studentService.getDashboard();
        setData(res);
      } catch (err) {
        setError(err.message || "Erro ao carregar dashboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function fazerCheckin() {
    if (checkedIn || checking) return;
    try {
      setChecking(true);
      await apiRequest("/aluno/checkin", { method: "POST" });
      setCheckedIn(true);
    } catch (err) {
      setError(err.message || "Erro ao fazer check-in.");
    } finally {
      setChecking(false);
    }
  }

  const plano = data?.plano || { tipo: "—", vencimento: null, status: "—" };
  const m = data?.metrics || {
    treinosMes: 0, metaMensal: 16, progresso: 0, frequenciaMedia: 0, sequencia: 0,
  };
  const nome = data?.aluno?.nome || "Aluno";

  const vencimentoFmt = plano.vencimento
    ? new Date(plano.vencimento).toLocaleDateString("pt-BR")
    : "—";

  return (
    <>
      {error && (
        <div className="mt-7 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {!loading && data && (
        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/50 px-5 py-3 text-xs text-brand-800">
          <strong>Olá, {nome}!</strong> Continue firme nos treinos. 💪
        </div>
      )}

      <section aria-label="Resumo do aluno" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Meu plano"
          value={loading ? "..." : plano.tipo}
          detail={`válido até ${vencimentoFmt}`}
          trend={plano.status}
          icon={CreditCard}
          iconStyle="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Treinos neste mês"
          value={loading ? "..." : String(m.treinosMes)}
          detail={`meta mensal: ${m.metaMensal} treinos`}
          trend={`${m.progresso}%`}
          icon={Dumbbell}
          iconStyle="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Sequência atual"
          value={loading ? "..." : `${m.sequencia} dias`}
          detail="seu recorde é 9 dias"
          trend="Continue!"
          icon={Flame}
          iconStyle="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Minha frequência"
          value={loading ? "..." : `${m.frequenciaMedia}%`}
          detail="presença nos últimos 30 dias"
          trend="—"
          icon={Activity}
          iconStyle="bg-violet-50 text-violet-600"
        />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> SEU PRÓXIMO TREINO
              </span>
              <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">Treino A · Peito e tríceps</h2>
              <p className="mt-1.5 text-xs text-slate-500">Hoje às 18:30 · Sala de musculação</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Dumbbell size={21} /></span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Exercícios", value: "6" },
              { label: "Duração", value: "50 min" },
              { label: "Série", value: "Treino A" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] text-slate-400">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={fazerCheckin}
              disabled={checkedIn || checking}
              className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition ${
                checkedIn ? "bg-emerald-50 text-emerald-700" : "bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60"
              }`}
            >
              {checkedIn ? <><Check size={15} /> Check-in confirmado</> : checking ? <>Salvando...</> : <><CalendarCheck size={15} /> Fazer check-in</>}
            </button>
            <button className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
              Ver ficha de treino <ArrowRight size={14} />
            </button>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Sua meta do mês</h2>
              <p className="mt-1 text-xs text-slate-400">Você está no caminho certo!</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Target size={19} /></span>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {loading ? "..." : m.treinosMes}
              <span className="text-base font-medium text-slate-400"> / {m.metaMensal} treinos</span>
            </span>
            <span className="text-xs font-semibold text-brand-600">{m.progresso}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(100, m.progresso)}%` }} />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Faltam {Math.max(0, m.metaMensal - m.treinosMes)} treinos para alcançar sua meta mensal. Você consegue!
          </p>
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold text-slate-700">Próximos horários</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Clock3 size={17} /></span>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-700">Hoje · Treino A</p>
                <p className="mt-0.5 text-[11px] text-slate-400">18:30 · Sala de musculação</p>
              </div>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">Agendado</span>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600"><HeartPulse size={20} /></span>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Seu progresso, no seu ritmo</h2>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Acompanhe seus treinos e sua frequência por aqui. Em caso de dúvida, converse com seu professor.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}