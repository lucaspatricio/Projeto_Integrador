import { Activity } from "lucide-react";

export function Brand({ light = false }) {
  return (
    <div className={`flex items-center gap-2.5 ${light ? "text-white" : "text-slate-900"}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
        <Activity size={21} strokeWidth={2.5} />
      </span>
      <span className="text-[19px] font-extrabold tracking-tight">
        Gestão<span className={light ? "text-emerald-300" : "text-brand-600"}>Fit</span>
      </span>
    </div>
  );
}
