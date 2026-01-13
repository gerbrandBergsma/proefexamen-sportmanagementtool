import { api } from "@/api/api";

export const MatchesService = {
  getAll() {
    return api.get("/wedstrijden");
  },

  getById(id) {
    return api.get(`/wedstrijden/${id}`);
  },

  create(data) {
    return api.post("/wedstrijden", data);
  },

  update(id, data) {
    return api.put(`/wedstrijden/${id}`, data);
  },

  delete(id) {
    return api.delete(`/wedstrijden/${id}`);
  },
};
