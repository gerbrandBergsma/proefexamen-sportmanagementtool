import { api } from "@/api/api";

export const TeamsService = {
  getAll() {
    return api.get("/teams");
  },

  create(data) {
    return api.post("/teams", data);
  },

  update(id, data) {
    return api.put(`/teams/${id}`, data);
  },

  delete(id) {
    return api.delete(`/teams/${id}`);
  },
};
