<template>
  <v-app theme="light">
    <AppHeader />

    <v-main>
      <v-container>
        <h2 class="mb-4">Training Dashboard</h2>

        <!-- Trainings aanmaken -->
        <v-card class="mb-5" outlined>
          <v-card-title>Nieuwe Training</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="createTraining" style="max-width: 500px">
              <v-text-field
                v-model="newTraining.title"
                label="Titel"
                required
                class="mb-3"
              />
              <v-select
                v-model="newTraining.team_id"
                :items="teams"
                item-title="naam"
                item-value="id"
                label="Selecteer team"
                required
                class="mb-3"
              />
              <v-text-field
                v-model="newTraining.training_date"
                label="Datum"
                type="date"
                required
                class="mb-3"
              />
              <v-text-field
                v-model="newTraining.start_time"
                label="Starttijd"
                type="time"
                required
                class="mb-3"
              />
              <v-text-field
                v-model="newTraining.end_time"
                label="Eindtijd"
                type="time"
                required
                class="mb-3"
              />
              <v-text-field
                v-model="newTraining.location"
                label="Locatie"
                class="mb-3"
              />
              <v-textarea
                v-model="newTraining.notes"
                label="Notities"
                rows="2"
                class="mb-3"
              />
              <v-btn type="submit" color="primary" block>Maak Training</v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Trainingslijst -->
        <v-card
          v-for="training in trainings"
          :key="training.id"
          class="mb-4"
          outlined
        >
          <v-card-title>
            {{ training.title }} - {{ getTeamName(training.team_id) }} ({{
              training.training_date
            }}
            {{ training.start_time }}-{{ training.end_time }})
            <v-spacer></v-spacer>
            <v-btn color="error" small @click="deleteTraining(training.id)"
              >Verwijder</v-btn
            >
          </v-card-title>

          <!-- Aanwezigheid spelers -->
          <v-card-text>
            <v-form @submit.prevent="saveAttendance(training.id)">
              <div
                v-for="att in training.attendance"
                :key="att.player_id"
                class="mb-3"
              >
                <span>{{ att.player_name }}</span>
                <v-select
                  v-model="att.status"
                  :items="['present', 'absent', 'late', 'unknown']"
                  label="Status"
                  dense
                  outlined
                  class="ml-2"
                />
              </div>
              <v-btn type="submit" color="primary" small
                >Opslaan Aanwezigheid</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>
<script>
import { TrainingsService } from "@/services/trainings.service";
import { TeamsService } from "@/services/teams.service";

export default {
  data() {
    return {
      trainings: [],
      teams: [],

      newTraining: {
        title: "",
        team_id: null,
        training_date: "",
        start_time: "",
        end_time: "",
        location: "",
        notes: "",
      },
    };
  },

  async mounted() {
    await this.loadData();
  },

  methods: {
    async loadData() {
      const [trainingsRes, teamsRes] = await Promise.all([
        TrainingsService.getAll(),
        TeamsService.getAll(),
      ]);

      this.teams = teamsRes.data;

      this.trainings = trainingsRes.data.map((t) => ({
        ...t,
        attendance: t.players.map((p) => ({
          player_id: p.id,
          player_name: p.naam,
          status: p.pivot?.status ?? "unknown",
        })),
      }));
    },

    // ===== TRAININGS =====
    async createTraining() {
      const { data } = await TrainingsService.create(this.newTraining);

      data.attendance = [];
      this.trainings.push(data);

      this.newTraining = {
        title: "",
        team_id: null,
        training_date: "",
        start_time: "",
        end_time: "",
        location: "",
        notes: "",
      };
    },

    async deleteTraining(id) {
      await TrainingsService.delete(id);
      this.trainings = this.trainings.filter((t) => t.id !== id);
    },

    async saveAttendance(trainingId) {
      const training = this.trainings.find((t) => t.id === trainingId);
      if (!training) return;

      await TrainingsService.saveAttendance(trainingId, {
        attendance: training.attendance,
      });

      alert("Aanwezigheid opgeslagen!");
    },

    // ===== HELPERS =====
    getTeamName(teamId) {
      const team = this.teams.find((t) => t.id === teamId);
      return team ? team.naam : "Geen team";
    },
  },
};
</script>
