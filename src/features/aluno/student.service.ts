import { apiRequest } from "../../lib/api/client.js";

export const studentService = {
  getDashboard: () => apiRequest("/student/dashboard"),
  getWorkouts: () => apiRequest("/student/workouts"),
  getAttendance: () => apiRequest("/student/attendance"),
  getPlan: () => apiRequest("/student/plan"),
  getSchedule: () => apiRequest("/student/schedule"),
};
