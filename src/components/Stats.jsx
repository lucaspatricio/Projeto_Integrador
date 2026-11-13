import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  MoreHorizontal,
} from "lucide-react";

export function StatCard({ title, value, detail, trend, icon: Icon, iconStyle, down }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}>
          <Icon size={19} />
        </span>
        <button aria-label={`Mais opções: ${title}`} className="text-slate-300 hover:text-slate-500">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <p className="mt-5 text-sm text-slate-500">{title}</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
        <p className="text-[27px] font-bold tracking-tight text-slate-900">{value}</p>
        <span
          className={`mb-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
            down ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {down ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
          {trend}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </article>
  );
}

export function ActivityChart() {
  const bars = [44, 59, 50, 71, 62, 82, 68, 57, 75, 91, 73, 63];
  return (
    <div className="mt-6">
      <div className="relative h-[190px]">
        <div className="absolute inset-0 flex flex-col justify-between pb-7">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="border-t border-dashed border-slate-100" />
          ))}
        </div>
        <div className="absolute inset-0 flex items-end justify-between gap-2 px-1 pb-7">
          {bars.map((height, index) => (
            <div key={index} className="group flex h-full flex-1 items-end justify-center">
              <div
                className={`w-full max-w-7 rounded-t-md transition-colors ${
                  index === 9 ? "bg-brand-600" : "bg-brand-100 group-hover:bg-brand-200"
                }`}
                style={{ height: `${height}%` }}
                title={`${height} check-ins`}
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400">
          {["01", "04", "07", "10", "13", "16", "19", "22", "25", "28", "31"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <span className="h-2 w-2 rounded-full bg-brand-600" />
        Check-ins realizados
      </div>
    </div>
  );
}
