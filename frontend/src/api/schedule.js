import api from "./axiosClient";

export const getSettings = async () => {
  const res = await api.get("/settings");
  return res.data;
};

export const updateSettings = async (payload) => {
  const res = await api.put("/settings", payload);
  return res.data;
};

// Exam API
export const getExams = async () => {
  const res = await api.get("/api/schedule/exams");
  return res.data;
};

export const addExam = async (payload) => {
  const res = await api.post("/api/schedule/exams", payload);
  return res.data;
};

export const updateExam = async (id, payload) => {
  const res = await api.put(`/api/schedule/exams/${id}`, payload);
  return res.data;
};

export const deleteExam = async (id) => {
  const res = await api.delete(`/api/schedule/exams/${id}`);
  return res.data;
};
