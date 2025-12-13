// frontend/src/api/students.js
import api from "./axiosClient"; // earlier file, axios instance

export const fetchStudentProfile = async (studentId) => {
  const res = await api.get(`/students/${studentId}/profile`);
  return res.data;
};

export const fetchMyStudentProfile = async () => {
  const res = await api.get("/students/me/profile");
  return res.data;
}
