import { useEffect, useState } from "react";
import ProfessorOverview from "./ProfessorOverview.jsx";
import { professorModules } from "./data/modules.js";
import { professorService } from "./professor.service.js";
import RoleDataScreen from "../shared/RoleDataScreen.jsx";

export function getProfessorModuleDescription(section) {
  return professorModules[section]?.description;
}

const sectionToService = {
  "Minhas aulas": () => professorService.getClasses(),
  "Alunos": () => professorService.getStudents(),
  "Frequência": () => professorService.getAttendance(),
  "Agenda": () => professorService.getSchedule(),
};

export default function ProfessorFeature({ section }) {
  const [content, setContent] = useState(professorModules[section]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (section === "Visão geral") return;

    const fetcher = sectionToService[section];
    if (!fetcher) {
      // "Configurações" e outros sem rota: mantém estático
      setContent(professorModules[section]);
      return;
    }

    let cancelado = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetcher();
        if (!cancelado) setContent(data);
      } catch (err) {
        if (!cancelado) setError(err.message || "Erro ao carregar dados.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    })();

    return () => { cancelado = true; };
  }, [section]);

  if (section === "Visão geral") return <ProfessorOverview />;

  if (error) {
    return (
      <section className="mt-7 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mt-7 rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-500">
        Carregando {section}...
      </section>
    );
  }

  return (
    <RoleDataScreen
      role="professor"
      section={section}
      content={content}
    />
  );
}