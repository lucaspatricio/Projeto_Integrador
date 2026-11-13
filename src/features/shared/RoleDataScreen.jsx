export default function RoleDataScreen({ role, section, content }) {
  if (!content) {
    return (
      <section className="mt-7 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-slate-800">{section}</h2>
        <p className="mt-2 text-sm text-slate-500">Esta área não está disponível para este perfil.</p>
      </section>
    );
  }

  return (
    <section aria-label={section} className="mt-7">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {content.metrics.map(([label, value], index) => (
          <article key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-[11px] text-slate-400">
              {role === "aluno" ? "Informação do seu perfil" : index === 0 ? "Resumo atualizado" : "Dados de demonstração"}
            </p>
          </article>
        ))}
      </div>

      <article className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="px-5 py-5 sm:px-6">
          <h2 className="text-sm font-bold text-slate-800">{section}</h2>
          <p className="mt-1 text-xs text-slate-400">{content.description}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="border-y border-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold sm:px-6">{role === "aluno" ? "Item" : "Nome / horário"}</th>
                <th className="px-3 py-3 font-semibold">Detalhes</th>
                <th className="px-5 py-3 text-right font-semibold sm:px-6">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {content.rows.map(([name, detail, status]) => (
                <tr key={`${name}-${detail}`} className="text-xs">
                  <td className="px-5 py-4 font-semibold text-slate-700 sm:px-6">{name}</td>
                  <td className="px-3 py-4 text-slate-500">{detail}</td>
                  <td className="px-5 py-4 text-right sm:px-6">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      /pendente|atenção|manutenção|acompanhar/i.test(status)
                        ? "bg-amber-50 text-amber-700"
                        : /ativo|concluído|presente|em dia/i.test(status)
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-blue-50 text-blue-700"
                    }`}>
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-slate-50 px-5 py-3 text-[11px] text-slate-400 sm:px-6">
          Dados ilustrativos para demonstração. As informações ainda não vêm de um banco de dados.
        </p>
      </article>
    </section>
  );
}
