import { apiRequest } from "../../lib/api/client.js";

export interface StudentQuery {
  search?: string;
  status?: string;
  page?: string;
  limit?: string;
}

export interface NewStudent {
  name: string;
  email: string;
  plan: string;
}

export interface AcademySettings {
  [key: string]: string | number | boolean;
}

function serializeQuery(options: StudentQuery): string {
  const query = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, value);
  });
  return query.toString();
}

export const adminService = {
  getDashboard: () => apiRequest("/admin/dashboard"),
  listStudents: (options: StudentQuery = {}) => {
    const query = serializeQuery(options);
    return apiRequest(`/admin/students${query ? `?${query}` : ""}`);
  },
  createStudent: (student: NewStudent) => apiRequest("/admin/students", {
    method: "POST",
    body: student,
  }),
  getFinance: () => apiRequest("/admin/finance"),
  getAttendance: () => apiRequest("/admin/attendance"),
  getEquipment: () => apiRequest("/admin/equipment"),
  getSettings: () => apiRequest("/admin/settings"),
  updateSettings: (settings: AcademySettings) => apiRequest("/admin/settings", {
    method: "PUT",
    body: settings,
  }),
};
