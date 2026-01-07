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
  mounted() {
    this.fetchTeams();
    this.fetchTrainings();
  },
  methods: {
    async fetchTeams() {
      const res = await fetch("http://127.0.0.1:8000/api/teams", {
        headers: { Accept: "application/json" },
      });
      this.teams = await res.json();
    },
    async fetchTrainings() {
      const res = await fetch("http://127.0.0.1:8000/api/trainings", {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();

      // Voeg attendance array toe voor elk training object
      this.trainings = await Promise.all(
        data.map(async (t) => {
          const att = t.players.map((p) => ({
            player_id: p.id,
            player_name: p.naam,
            status: p.pivot ? p.pivot.status : "unknown",
          }));
          t.attendance = att;
          return t;
        })
      );
    },
    async createTraining() {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const res = await fetch("http://127.0.0.1:8000/api/trainings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(this.newTraining),
      });

      if (res.ok) {
        const training = await res.json();
        training.attendance = [];
        this.trainings.push(training);
        this.newTraining = {
          title: "",
          team_id: null,
          training_date: "",
          start_time: "",
          end_time: "",
          location: "",
          notes: "",
        };
      }
    },
    async deleteTraining(id) {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const res = await fetch(`http://127.0.0.1:8000/api/trainings/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        this.trainings = this.trainings.filter((t) => t.id !== id);
      }
    },
    async saveAttendance(trainingId) {
      const training = this.trainings.find((t) => t.id === trainingId);
      if (!training) return;

      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      await fetch(
        `http://127.0.0.1:8000/api/trainings/${trainingId}/attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ attendance: training.attendance }),
        }
      );

      alert("Aanwezigheid opgeslagen!");
    },
    getTeamName(teamId) {
      const team = this.teams.find((t) => t.id === teamId);
      return team ? team.naam : "Geen team";
    },
  },
};
</script>

<style></style>
