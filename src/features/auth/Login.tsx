import { useState } from "react";
import type { FormEvent } from "react";
import { Brand } from "../../components/Brand.jsx";
import { roles } from "../../data/roles.js";
import { roleKeys } from "./auth.types";
import type { Role } from "./auth.types";
import {
  ArrowRight,
  CircleHelp,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string, role: Role) => void | Promise<void>;
  error: string;
  isLoading: boolean;
  isApiMode: boolean;
}

export default function Login({ onLogin, error, isLoading, isApiMode }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("admin");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onLogin(
      String(form.get("email") ?? ""),
      String(form.get("password") ?? ""),
      selectedRole,
    );
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[1fr_1fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#173a2b] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-36 -top-24 h-[520px] w-[520px] rounded-full border border-white/10" />
        <div className="absolute -right-16 top-12 h-[360px] w-[360px] rounded-full border border-white/10" />
        <div className="absolute -bottom-52 -left-32 h-[560px] w-[560px] rounded-full bg-brand-600/25 blur-2xl" />
        <div className="relative z-10">
          <Brand light />
        </div>

        <div className="relative z-10 max-w-xl pb-8">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Gestão que acompanha seu ritmo
          </span>
          <h1 className="max-w-lg text-4xl font-semibold leading-[1.15] tracking-tight xl:text-5xl">
            Sua academia mais organizada.{" "}
            <span className="text-emerald-300">Seus alunos, mais perto.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-emerald-50/70">
            Tudo o que acontece na sua academia, em um só lugar. Cuide da gestão
            para focar no que realmente importa: as pessoas.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {["MO", "LF", "BS", "PH"].map((initials, index) => (
                <span
                  key={initials}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#173a2b] text-[10px] font-bold text-slate-800 ${
                    ["bg-rose-200", "bg-sky-200", "bg-amber-200", "bg-violet-200"][index]
                  }`}
                >
                  {initials}
                </span>
              ))}
            </div>
            <div>
              <div className="text-sm font-semibold">Feito para quem cuida</div>
              <div className="mt-0.5 text-xs text-emerald-50/60">
                Simples para a equipe, completo para você
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-emerald-50/50">
          <span>© 2026 GestãoFit</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} /> Acesso seguro
          </span>
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:justify-center lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-14 lg:hidden">
            <Brand />
          </div>
          <div className="mb-9">
            <p className="mb-3 text-sm font-semibold text-brand-600">BEM-VINDO DE VOLTA</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Acesse sua conta</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Entre com seus dados para acessar o painel da sua academia.
            </p>
          </div>

          {!isApiMode && (
            <div className="mb-5">
              <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700">
                Acessar como
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value as Role)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              >
                {roleKeys.map((value) => (
                  <option key={value} value={value}>{roles[value].label}</option>
                ))}
              </select>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="voce@academia.com.br"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Senha
                </label>
                <button type="button" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-wait disabled:opacity-70"
            >
              {isLoading ? "Validando acesso..." : "Entrar na plataforma"} {!isLoading && <ArrowRight size={17} />}
            </button>
          </form>

          {!isApiMode && (
            <>
              <div className="my-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-300">
                <span className="h-px flex-1 bg-slate-100" />
                <span>Demonstração</span>
                <span className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {roleKeys.map((value) => {
                  const role = roles[value];
                  const Icon = role.icon;
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={isLoading}
                      onClick={() => onLogin(role.email, "", value)}
                      className="flex min-h-[72px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 px-2 py-3 text-[11px] font-semibold text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-60"
                    >
                      <Icon size={17} />
                      {role.label}
                    </button>
                  );
                })}
              </div>

              <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                Protótipo demonstrativo: o acesso não está conectado a um serviço de autenticação.
              </p>
            </>
          )}
          <p className="mt-8 text-center text-sm text-slate-500">
            Ainda não tem uma conta?{" "}
            <button type="button" className="font-semibold text-brand-600 hover:text-brand-700">
              Fale com a gente
            </button>
          </p>
        </div>
        <div className="mx-auto mt-auto flex w-full max-w-[420px] items-center justify-between pt-10 text-xs text-slate-400 lg:absolute lg:bottom-7 lg:left-1/2 lg:mt-0 lg:w-[calc(50%-8rem)] lg:max-w-[420px] lg:-translate-x-1/2 xl:w-[calc(50%-12rem)]">
          <span>© 2026 GestãoFit</span>
          <button className="flex items-center gap-1.5 hover:text-slate-600">
            <CircleHelp size={14} /> Precisa de ajuda?
          </button>
        </div>
      </section>
    </main>
  );
}
