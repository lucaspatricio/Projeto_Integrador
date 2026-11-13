import { useEffect, useState } from "react";
import StudentOverview from "./StudentOverview.jsx";
import { studentModules } from "./data/modules.js";
import { studentService } from "./student.service.js";
import RoleDataScreen from "../shared/RoleDataScreen.jsx";

export function getStudentModuleDescription(section) {
  return studentModules[section]?.description;
}

const sectionToService = {
  "Meu treino": () => studentService.getWorkouts(),
  "Minha frequência": () => studentService.getAttendance(),
  "Meu plano": () => studentService.getPlan(),
  "Agenda": () => studentService.getSchedule(),
};

export default function StudentFeature({ section }) {
  const [content, setContent] = useState(studentModules[section]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (section === "Visão geral") return;

    const fetcher = sectionToService[section];
    if (!fetcher) {
      setContent(studentModules[section]);
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

  if (section === "Visão geral") return <StudentOverview />;

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
      role="aluno"
      section={section}
      content={content}
    />
  );
}