import { apiRequest } from "../../lib/api/client.js";

export interface ProfessorStudentQuery {
  search?: string;
  page?: string;
  limit?: string;
}

function serializeQuery(options: ProfessorStudentQuery): string {
  const query = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, value);
  });
  return query.toString();
}

export const professorService = {
  getDashboard: () => apiRequest("/professor/dashboard"),
  getClasses: () => apiRequest("/professor/classes"),
  getStudents: (options: ProfessorStudentQuery = {}) => {
    const query = serializeQuery(options);
    return apiRequest(`/professor/students${query ? `?${query}` : ""}`);
  },
  getAttendance: () => apiRequest("/professor/attendance"),
  getSchedule: () => apiRequest("/professor/schedule"),
};
