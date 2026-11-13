import { AdminAttendanceScreen } from "./attendance/AttendanceScreen.jsx";
import AdminDashboardHome from "./overview/AdminDashboardHome.jsx";
import { AdminEquipmentScreen } from "./equipment/EquipmentScreen.jsx";
import { AdminFinanceScreen } from "./finance/FinanceScreen.jsx";
import AdminSettingsScreen from "./settings/SettingsScreen.jsx";
import { AdminStudentsScreen } from "./students/StudentsScreen.jsx";

const adminModuleDescriptions = {
  Alunos: "Consulte os cadastros e acompanhe a situação dos alunos da academia.",
  Financeiro: "Acompanhe receitas, pagamentos e mensalidades em aberto.",
  Frequência: "Veja os registros de entrada e a frequência dos alunos.",
  Equipamentos: "Consulte os equipamentos e acompanhe as próximas manutenções.",
  Configurações: "Preferências administrativas e informações da academia.",
};

export function getAdminModuleDescription(section) {
  return adminModuleDescriptions[section];
}

export default function AdminFeature({ section }) {
  if (section === "Visão geral") return <AdminDashboardHome />;
  if (section === "Alunos") return <AdminStudentsScreen />;
  if (section === "Financeiro") return <AdminFinanceScreen />;
  if (section === "Frequência") return <AdminAttendanceScreen />;
  if (section === "Equipamentos") return <AdminEquipmentScreen />;
  if (section === "Configurações") return <AdminSettingsScreen />;

  return null;
}
