import { api } from "@/api/api";

export const PlayersService = {
  getAll() {
    return api.get("/players");
  },

  create(data) {
    return api.post("/players", data);
  },

  update(id, data) {
    return api.put(`/players/${id}`, data);
  },

  delete(id) {
    return api.delete(`/players/${id}`);
  },
};
