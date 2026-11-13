import { ActivityChart, StatCard } from "../../../components/Stats.jsx";
import { students } from "../../../data/roles.js";
import { Activity, ArrowRight, ArrowUpRight, Check, ChevronDown, CreditCard, MoreHorizontal, Users, Wallet, Wrench } from "lucide-react";

export default function AdminDashboardHome() {
  return (
    <>
      <section aria-label="Indicadores da academia" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Alunos ativos"
                    value="248"
                    detail="em relação ao mês passado"
                    trend="12,8%"
                    icon={Users}
                    iconStyle="bg-blue-50 text-blue-600"
                  />
                  <StatCard
                    title="Receita do mês"
                    value="R$ 18.450"
                    detail="em relação ao mês passado"
                    trend="8,2%"
                    icon={CreditCard}
                    iconStyle="bg-emerald-50 text-emerald-600"
                  />
                  <StatCard
                    title="Check-ins hoje"
                    value="36"
                    detail="média diária de 42 alunos"
                    trend="5,4%"
                    icon={Activity}
                    iconStyle="bg-violet-50 text-violet-600"
                  />
                  <StatCard
                    title="Mensalidades pendentes"
                    value="12"
                    detail="Total em aberto: R$ 1.440"
                    trend="2 pendentes"
                    icon={Wallet}
                    iconStyle="bg-amber-50 text-amber-600"
                    down
                  />
                </section>
      
                <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
                  <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-bold text-slate-800">Frequência dos alunos</h2>
                        <p className="mt-1 text-xs text-slate-400">Acompanhe os check-ins ao longo do mês</p>
                      </div>
                      <button className="flex items-center gap-1.5 rounded-lg border border-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                        Outubro <ChevronDown size={13} />
                      </button>
                    </div>
                    <div className="mt-4 flex items-end gap-2">
                      <span className="text-2xl font-bold tracking-tight">1.284</span>
                      <span className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <ArrowUpRight size={14} /> 14,6%
                      </span>
                      <span className="mb-1 text-xs text-slate-400">vs. mês passado</span>
                    </div>
                    <ActivityChart />
                  </article>
      
                  <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-sm font-bold text-slate-800">Resumo financeiro</h2>
                        <p className="mt-1 text-xs text-slate-400">Outubro, 2026</p>
                      </div>
                      <button aria-label="Mais opções do resumo financeiro" className="text-slate-300 hover:text-slate-500">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                    <p className="mt-6 text-xs text-slate-500">Receita total</p>
                    <p className="mt-1 text-[27px] font-bold tracking-tight text-slate-900">R$ 18.450,00</p>
                    <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-slate-100">
                      <span className="w-[68%] rounded-l-full bg-brand-600" />
                      <span className="w-[20%] bg-emerald-300" />
                      <span className="w-[12%] rounded-r-full bg-amber-300" />
                    </div>
                    <div className="mt-5 space-y-3.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-slate-500"><i className="h-2 w-2 rounded-full bg-brand-600" /> Mensalidades</span>
                        <span className="font-semibold text-slate-700">R$ 12.546 <span className="font-normal text-slate-400">(68%)</span></span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-slate-500"><i className="h-2 w-2 rounded-full bg-emerald-300" /> Planos e matrículas</span>
                        <span className="font-semibold text-slate-700">R$ 3.690 <span className="font-normal text-slate-400">(20%)</span></span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-slate-500"><i className="h-2 w-2 rounded-full bg-amber-300" /> Outros</span>
                        <span className="font-semibold text-slate-700">R$ 2.214 <span className="font-normal text-slate-400">(12%)</span></span>
                      </div>
                    </div>
                    <button className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-100 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                      Ver relatório financeiro <ArrowRight size={14} />
                    </button>
                  </article>
                </section>
      
                <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
                  <article className="rounded-2xl border border-slate-100 bg-white shadow-soft">
                    <div className="flex items-center justify-between px-5 py-5 sm:px-6">
                      <div>
                        <h2 className="text-sm font-bold text-slate-800">Últimos check-ins</h2>
                        <p className="mt-1 text-xs text-slate-400">Alunos que chegaram hoje</p>
                      </div>
                      <button className="text-xs font-semibold text-brand-600 hover:text-brand-700">Ver todos</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[480px] text-left">
                        <thead>
                          <tr className="border-y border-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            <th className="px-5 py-3 font-semibold sm:px-6">Aluno</th>
                            <th className="px-3 py-3 font-semibold">Plano</th>
                            <th className="px-3 py-3 font-semibold">Horário</th>
                            <th className="px-5 py-3 sm:px-6" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {students.map((student) => (
                            <tr key={student.name} className="text-xs">
                              <td className="px-5 py-3.5 sm:px-6">
                                <div className="flex items-center gap-3">
                                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${student.color}`}>
                                    {student.initials}
                                  </span>
                                  <span className="font-semibold text-slate-700">{student.name}</span>
                                </div>
                              </td>
                              <td className="px-3 py-3.5 text-slate-500">{student.plan}</td>
                              <td className="px-3 py-3.5 text-slate-500">{student.time}</td>
                              <td className="px-5 py-3.5 text-right sm:px-6">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                                  <Check size={11} /> Presente
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
      
                  <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-sm font-bold text-slate-800">Atenção necessária</h2>
                        <p className="mt-1 text-xs text-slate-400">Acompanhe o que precisa de cuidado</p>
                      </div>
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-amber-50 px-2 text-xs font-bold text-amber-700">3</span>
                    </div>
                    <div className="mt-5 space-y-3">
                      <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3.5">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                          <Wallet size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800">Mensalidades em atraso</p>
                          <p className="mt-1 text-[11px] leading-4 text-slate-500">12 alunos estão com pagamento pendente.</p>
                          <button className="mt-2 text-[11px] font-semibold text-amber-800">Conferir pagamentos <ArrowRight className="ml-1 inline" size={12} /></button>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-3.5">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                          <Wrench size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800">Manutenção programada</p>
                          <p className="mt-1 text-[11px] leading-4 text-slate-500">Esteira 03 precisa de revisão nesta semana.</p>
                          <button className="mt-2 text-[11px] font-semibold text-rose-700">Ver equipamento <ArrowRight className="ml-1 inline" size={12} /></button>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                          <Users size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800">Planos próximos do vencimento</p>
                          <p className="mt-1 text-[11px] leading-4 text-slate-500">5 planos vencem nos próximos 7 dias.</p>
                          <button className="mt-2 text-[11px] font-semibold text-blue-700">Ver alunos <ArrowRight className="ml-1 inline" size={12} /></button>
                        </div>
                      </div>
                    </div>
                  </article>
                </section>
    </>
  );
}
