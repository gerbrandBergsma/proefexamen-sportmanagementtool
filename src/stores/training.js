import { defineStore } from "pinia";
import { TrainingsService } from "@/services/trainings.service";
import { TeamsService } from "@/services/teams.service";

export const useTrainingStore = defineStore("training", {
  state: () => ({
    trainings: [],
    teams: [],
    loading: false,
  }),

  getters: {
    getTeamName: (state) => (teamId) => {
      const team = state.teams.find((t) => t.id === teamId);
      return team ? team.naam : "Geen team";
    },
  },

  actions: {
    async loadData() {
      if (this.trainings.length > 0 && this.teams.length > 0) {
        // Data is al geladen, skip
        return;
      }

      this.loading = true;
      try {
        const [trainingsRes, teamsRes] = await Promise.all([
          TrainingsService.getAll(),
          TeamsService.getAll(),
        ]);

        this.teams = teamsRes.data;

        this.trainings = trainingsRes.data.map((t) => ({
          ...t,
          attendance:
            t.players?.map((p) => ({
              player_id: p.id,
              player_name: p.naam,
              status: p.pivot?.status ?? "unknown",
            })) || [],
        }));
      } finally {
        this.loading = false;
      }
    },

    async createTraining(newTraining) {
      const { data } = await TrainingsService.create(newTraining);

      // Haal volledige training op met spelers
      const { data: fullTraining } = await TrainingsService.getAll();
      const createdTraining = fullTraining.find((t) => t.id === data.id);

      if (createdTraining) {
        this.trainings.push({
          ...createdTraining,
          attendance:
            createdTraining.players?.map((p) => ({
              player_id: p.id,
              player_name: p.naam,
              status: p.pivot?.status ?? "unknown",
            })) || [],
        });
      }
    },

    async deleteTraining(id) {
      await TrainingsService.delete(id);
      this.trainings = this.trainings.filter((t) => t.id !== id);
    },

    async saveAttendance(trainingId, attendance) {
      await TrainingsService.saveAttendance(trainingId, { attendance });
    },
  },
});
