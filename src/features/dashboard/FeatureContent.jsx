import AdminFeature from "../admin/AdminFeature.jsx";
import StudentFeature from "../aluno/StudentFeature.jsx";
import ProfessorFeature from "../professor/ProfessorFeature.jsx";

export default function FeatureContent({ role, section }) {
  if (role === "admin") return <AdminFeature section={section} />;
  if (role === "professor") return <ProfessorFeature section={section} />;
  if (role === "aluno") return <StudentFeature section={section} />;

  return null;
}
