import StudentOverview from "./StudentOverview.jsx";
import { studentModules } from "./data/modules.js";
import RoleDataScreen from "../shared/RoleDataScreen.jsx";

export function getStudentModuleDescription(section) {
  return studentModules[section]?.description;
}

export default function StudentFeature({ section }) {
  if (section === "Meu painel") return <StudentOverview />;

  return (
    <RoleDataScreen
      role="aluno"
      section={section}
      content={studentModules[section]}
    />
  );
}
