import {
  Activity,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  CreditCard,
  Dumbbell,
  GraduationCap,
  Home,
  ShieldCheck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

export const navigation = [
  { label: "Visão geral", icon: Home },
  { label: "Alunos", icon: Users, count: "248" },
  { label: "Financeiro", icon: Wallet },
  { label: "Frequência", icon: CalendarDays },
  { label: "Equipamentos", icon: Wrench, dot: true },
];

export const roles = {
  admin: { label: "Administrador", icon: ShieldCheck, email: "admin@gestaofit.com.br" },
  professor: { label: "Professor", icon: GraduationCap, email: "carlos.mendes@gestaofit.com.br" },
  aluno: { label: "Aluno", icon: Dumbbell, email: "mariana.oliveira@gestaofit.com.br" },
};

export const roleNavigation = {
  admin: navigation,
  professor: [
    { label: "Visão geral", icon: Home },
    { label: "Minhas aulas", icon: CalendarDays },
    { label: "Alunos", icon: Users },
    { label: "Frequência", icon: ClipboardCheck },
    { label: "Agenda", icon: Clock3 },
  ],
  aluno: [
    { label: "Meu painel", icon: Home },
    { label: "Meu treino", icon: Dumbbell },
    { label: "Minha frequência", icon: Activity },
    { label: "Meu plano", icon: CreditCard },
    { label: "Agenda", icon: CalendarDays },
  ],
};

export const students = [
  { name: "Mariana Oliveira", initials: "MO", plan: "Plano anual", time: "08:42", color: "bg-rose-100 text-rose-700" },
  { name: "Lucas Ferreira", initials: "LF", plan: "Plano mensal", time: "08:35", color: "bg-sky-100 text-sky-700" },
  { name: "Beatriz Santos", initials: "BS", plan: "Plano trimestral", time: "08:21", color: "bg-amber-100 text-amber-700" },
  { name: "Pedro Henrique", initials: "PH", plan: "Plano anual", time: "08:04", color: "bg-violet-100 text-violet-700" },
];
