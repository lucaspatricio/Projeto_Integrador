import { useEffect, useState } from "react";
import { Brand } from "../../components/Brand.jsx";
import { roleNavigation, roles } from "../../data/roles.js";
import { getAdminModuleDescription } from "../admin/AdminFeature.jsx";
import { getStudentModuleDescription } from "../aluno/StudentFeature.jsx";
import { getProfessorModuleDescription } from "../professor/ProfessorFeature.jsx";
import FeatureContent from "./FeatureContent.jsx";
import { getDashboardDateTime } from "../../lib/dateTime";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Dumbbell,
  LogOut,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react";

export default function Dashboard({ email, name, role, onLogout }) {
  const [activeNav, setActiveNav] = useState(role === "aluno" ? "Meu painel" : "Visão geral");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [dateTime, setDateTime] = useState(() => getDashboardDateTime());
  const menuItems = roleNavigation[role] ?? roleNavigation.admin;
  const roleLabel = roles[role]?.label ?? roles.admin.label;
  const isAdmin = role === "admin";
  const homeSection = role === "aluno" ? "Meu painel" : "Visão geral";
  const isHome = activeNav === homeSection;
  const moduleDescription = role === "admin"
    ? getAdminModuleDescription(activeNav)
    : role === "professor"
      ? getProfessorModuleDescription(activeNav)
      : getStudentModuleDescription(activeNav);
  const displayName = (name || email.split("@")[0].split(/[._-]/)[0]).split(/\s+/)[0];
  const firstName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setDateTime(getDashboardDateTime());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  function selectNav(label) {
    setActiveNav(label);
    setMobileMenuOpen(false);
  }

  async function handleLogout() {
    setLogoutError("");
    try {
      await onLogout();
    } catch (error) {
      setLogoutError(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-slate-900">
      {mobileMenuOpen && (
        <button
          aria-label="Fechar menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col overflow-y-auto overscroll-contain border-r border-slate-100 bg-white px-5 py-6 transition-transform lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-1">
          <Brand />
          <button
            aria-label="Fechar menu"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-10">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Menu principal
          </p>
          <nav aria-label="Menu principal" className="space-y-1">
            {menuItems.map(({ label, icon: Icon, count, dot }) => (
              <button
                key={label}
                onClick={() => selectNav(label)}
                className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
                  activeNav === label
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span className="flex-1 text-left">{label}</span>
                {count && <span className="text-xs text-slate-400">{count}</span>}
                {dot && <span className="h-2 w-2 rounded-full bg-amber-400" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Preferências
          </p>
          <button
            onClick={() => selectNav("Configurações")}
            className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
              activeNav === "Configurações" ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Settings size={18} strokeWidth={1.8} /> Configurações
          </button>
        </div>

        <div className="mt-auto rounded-2xl bg-[#173a2b] p-4 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
            <Dumbbell size={18} />
          </div>
          <p className="mt-4 text-sm font-semibold">
            {role === "aluno" ? "Cada treino conta." : role === "professor" ? "Inspire. Ensine. Evolua." : "Movimento é evolução."}
          </p>
          <p className="mt-1 text-xs leading-5 text-emerald-50/65">
            {role === "aluno"
              ? "Acompanhe seu progresso e celebre cada conquista."
              : role === "professor"
                ? "Sua dedicação transforma a jornada dos alunos."
                : "Sua equipe está fazendo a diferença todos os dias."}
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-3/4 rounded-full bg-emerald-300" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-emerald-50/60">
            <span>Meta de check-ins</span>
            <span>75%</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        >
          <LogOut size={17} /> Sair da conta
        </button>
      </aside>

      <div className="min-h-screen lg:pl-[258px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <span>Academia</span>
              <span>/</span>
              <span className="font-medium text-slate-700">{activeNav}</span>
            </div>
            <span className="text-sm font-semibold sm:hidden">{activeNav}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {role !== "aluno" && (
            <label className="hidden h-10 w-[230px] items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 md:flex">
              <Search size={16} className="text-slate-400" />
              <input
                aria-label="Buscar"
                placeholder={role === "professor" ? "Buscar aluno..." : "Buscar..."}
                className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
              />
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘ K</kbd>
            </label>
            )}
            <button aria-label="Notificações" className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-50">
              <Bell size={19} strokeWidth={1.8} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border border-white bg-rose-500" />
            </button>
            <span className="hidden h-8 w-px bg-slate-100 sm:block" />
            <button className="flex items-center gap-2.5 rounded-xl py-1 sm:pr-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {firstName.slice(0, 2).toUpperCase()}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold text-slate-800">{firstName}</span>
                <span className="mt-0.5 block text-[10px] text-slate-400">{roleLabel}</span>
              </span>
              <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          {logoutError && (
            <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Não foi possível encerrar sua sessão: {logoutError}
            </p>
          )}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm capitalize text-slate-500">{dateTime.dateLabel}</p>
              <h1 className="mt-1.5 text-[27px] font-bold tracking-tight text-slate-900">
                {isHome ? (
                  <>
                    {dateTime.greeting}, {firstName}!{" "}
                    <span aria-hidden="true">{dateTime.greeting === "Boa noite" ? "🌙" : "☀️"}</span>
                  </>
                ) : activeNav}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {isHome
                  ? role === "aluno"
                    ? "Acompanhe sua rotina e continue evoluindo."
                    : role === "professor"
                      ? "Aqui está sua agenda e o resumo das suas turmas."
                      : "Aqui está o resumo da sua academia hoje."
                  : moduleDescription}
              </p>
            </div>
            {isAdmin && isHome && (
              <button className="flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-brand-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:self-auto">
                <CalendarDays size={15} /> Este mês <ChevronDown size={14} />
              </button>
            )}
          </div>

          <FeatureContent role={role} section={activeNav} />

          <footer className="flex flex-col gap-2 py-7 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 GestãoFit · {role === "aluno" ? "Sua jornada, no seu ritmo." : "Feito para sua academia crescer."}</span>
            <span>{roleLabel} · Seus dados, sua gestão.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
