import { api } from "@/api/api";

export const TrainingsService = {
  getAll() {
    return api.get("/trainings");
  },

  create(data) {
    return api.post("/trainings", data);
  },

  update(id, data) {
    return api.put(`/trainings/${id}`, data);
  },

  delete(id) {
    return api.delete(`/trainings/${id}`);
  },

  saveAttendance(trainingId, attendance) {
    return api.post(`/trainings/${trainingId}/attendance`, {
      attendance,
    });
  },
};
