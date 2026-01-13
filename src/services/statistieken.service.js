import { api } from "@/api/api";

export const StatistiekenService = {
  get() {
    return api.get("/statistieken");
  },
};
