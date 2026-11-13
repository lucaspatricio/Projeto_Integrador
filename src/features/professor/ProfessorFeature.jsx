import ProfessorOverview from "./ProfessorOverview.jsx";
import { professorModules } from "./data/modules.js";
import RoleDataScreen from "../shared/RoleDataScreen.jsx";

export function getProfessorModuleDescription(section) {
  return professorModules[section]?.description;
}

export default function ProfessorFeature({ section }) {
  if (section === "Visão geral") return <ProfessorOverview />;

  return (
    <RoleDataScreen
      role="professor"
      section={section}
      content={professorModules[section]}
    />
  );
}
