import { useEffect, useState } from "react";
import { AdminMetric, StatusBadge } from "../shared/AdminComponents.jsx";
import { apiRequest } from "../../../lib/api/client.js";
import { Clock3, CreditCard, Wallet } from "lucide-react";

export function AdminFinanceScreen() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPayments() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest("/admin/finance");
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar pagamentos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  const received = payments
    .filter((p) => p.status === "Recebido")
    .reduce((sum, p) => sum + p.amount, 0);
  const pending = payments
    .filter((p) => p.status !== "Recebido")
    .reduce((sum, p) => sum + p.amount, 0);
  const money = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  async function markReceived(id) {
    try {
      await apiRequest(`/admin/finance/${id}/receber`, { method: "PATCH" });
      await loadPayments();
    } catch (err) {
      setError(err.message || "Erro ao marcar como recebido.");
    }
  }

  return (
    <>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminMetric label="Recebido no período" value={money(received)} detail="pagamentos confirmados nesta lista" icon={CreditCard} tone="bg-emerald-50 text-emerald-600" />
        <AdminMetric label="Pagamentos pendentes" value={payments.filter((p) => p.status !== "Recebido").length} detail="mensalidades aguardando confirmação" icon={Clock3} tone="bg-amber-50 text-amber-600" />
        <AdminMetric label="Total em aberto" value={money(pending)} detail="valor pendente ou em atraso" icon={Wallet} tone="bg-blue-50 text-blue-600" />
      </section>

      {error && (
        <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Receita mensal</h2>
              <p className="mt-1 text-xs text-slate-400">Entradas ao longo dos últimos meses</p>
            </div>
            <span className="rounded-lg bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">2026</span>
          </div>
          <div className="mt-7 grid h-44 grid-cols-6 items-end gap-3 border-b border-slate-100 pb-2">
            {[48, 64, 53, 76, 68, 91].map((height, index) => (
              <div key={index} className="flex h-full flex-col items-center justify-end gap-2">
                <div className={`w-full max-w-10 rounded-t-md ${index === 5 ? "bg-brand-600" : "bg-brand-100"}`} style={{ height: `${height}%` }} />
                <span className="text-[10px] text-slate-400">{["Mai", "Jun", "Jul", "Ago", "Set", "Out"][index]}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Total recebido: <strong className="text-slate-700">{money(received)}</strong>
          </p>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-sm font-bold text-slate-800">Distribuição de receitas</h2>
          <p className="mt-1 text-xs text-slate-400">Por origem no mês atual</p>
          <div className="mt-6 space-y-5">
            {[["Mensalidades", "R$ 12.546", "68%", "w-[68%]", "bg-brand-600"], ["Planos e matrículas", "R$ 3.690", "20%", "w-1/5", "bg-emerald-300"], ["Outros serviços", "R$ 2.214", "12%", "w-[12%]", "bg-amber-300"]].map(([name, amount, percent, width, color]) => (
              <div key={name}>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{name}</span>
                  <span className="font-semibold text-slate-700">{amount} <span className="font-normal text-slate-400">({percent})</span></span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${width} ${color}`} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-800">Atenção aos vencimentos</p>
            <p className="mt-1 text-xs leading-5 text-amber-800/75">Há mensalidades pendentes. Confira a lista para atualizar os recebimentos.</p>
          </div>
        </article>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:px-6">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Lançamentos</h2>
            <p className="mt-1 text-xs text-slate-400">
              {loading ? "Carregando..." : `${payments.length} lançamento(s) no banco`}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-y border-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold sm:px-6">Aluno</th>
                <th className="px-3 py-3 font-semibold">Data</th>
                <th className="px-3 py-3 font-semibold">Valor</th>
                <th className="px-3 py-3 font-semibold">Método</th>
                <th className="px-3 py-3 font-semibold">Situação</th>
                <th className="px-5 py-3 sm:px-6" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((payment) => (
                <tr key={payment.id} className="text-xs">
                  <td className="px-5 py-3.5 sm:px-6">
                    <p className="font-semibold text-slate-700">{payment.name}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{payment.description}</p>
                  </td>
                  <td className="px-3 py-3.5 text-slate-500">{payment.date}</td>
                  <td className="px-3 py-3.5 font-semibold text-slate-700">{money(payment.amount)}</td>
                  <td className="px-3 py-3.5 text-slate-500">{payment.method}</td>
                  <td className="px-3 py-3.5"><StatusBadge status={payment.status} /></td>
                  <td className="px-5 py-3.5 text-right sm:px-6">
                    {payment.status !== "Recebido" && (
                      <button onClick={() => markReceived(payment.id)} className="whitespace-nowrap rounded-lg border border-brand-100 px-2.5 py-1.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-50">
                        Marcar recebido
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-400">Carregando pagamentos...</td></tr>}
              {!loading && payments.length === 0 && <tr><td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-400">Nenhum pagamento cadastrado no banco.</td></tr>}
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