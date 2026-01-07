<template>
  <v-app theme="light">
    <AppHeader />

    <v-main>
      <v-container>
        <h2 class="mb-4">Teams</h2>

        <!-- Team aanmaken -->
        <v-form
          @submit.prevent="createTeam"
          class="mb-6"
          style="max-width: 500px"
        >
          <v-text-field
            v-model="newTeam.naam"
            label="Team Naam"
            required
            class="mb-3"
          />
          <v-text-field
            v-model="newTeam.sportsoort"
            label="Sportsoort (bijv. Voetbal)"
            required
            class="mb-3"
          />
          <v-text-field
            v-model="newTeam.categorie"
            label="Categorie (bijv. Senioren)"
            required
            class="mb-3"
          />
          <v-btn type="submit" color="primary">Maak Team</v-btn>
        </v-form>

        <!-- Teams lijst -->
        <v-list two-line>
          <v-list-item v-for="team in teams" :key="team.id">
            <v-list-item-content>
              <v-list-item-title>
                <strong>{{ team.naam }}</strong> - {{ team.sportsoort }} ({{
                  team.categorie
                }})
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn small color="info" @click="openPlayers(team)"
                >Spelers</v-btn
              >
              <v-btn small color="warning" @click="editTeam(team)"
                >Bewerk</v-btn
              >
              <v-btn small color="error" @click="deleteTeam(team.id)"
                >Verwijder</v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-container>

      <!-- Dialog: Team bewerken -->
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-title>Bewerk Team</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="selectedTeam.naam"
              label="Team Naam"
              class="mb-3"
            />
            <v-text-field
              v-model="selectedTeam.sportsoort"
              label="Sportsoort"
              class="mb-3"
            />
            <v-text-field
              v-model="selectedTeam.categorie"
              label="Categorie"
              class="mb-3"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="editDialog = false">Annuleer</v-btn>
            <v-btn color="primary" @click="updateTeam">Opslaan</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: Spelers in team -->
      <v-dialog v-model="playersDialog" max-width="600px">
        <v-card>
          <v-card-title>Spelers in {{ selectedTeam.naam }}</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addPlayer" style="max-width: 400px">
              <v-text-field
                v-model="newPlayer.naam"
                label="Naam"
                class="mb-3"
                required
              />
              <v-text-field
                v-model="newPlayer.leeftijd"
                label="Leeftijd"
                type="number"
                class="mb-3"
                required
              />
              <v-btn type="submit" color="primary" class="mb-3" block
                >Voeg speler toe</v-btn
              >
            </v-form>

            <v-list>
              <v-list-item v-for="player in teamPlayers" :key="player.id">
                <v-list-item-content>
                  {{ player.naam }} ({{ player.leeftijd }} jaar)
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn color="error" small @click="deletePlayer(player.id)"
                    >Verwijder</v-btn
                  >
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="playersDialog = false">Sluit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      teams: [],
      players: [],

      // Nieuw team
      newTeam: { naam: "", sportsoort: "", categorie: "" },

      // Bewerken
      editDialog: false,
      selectedTeam: {},

      // Spelers
      playersDialog: false,
      teamPlayers: [],
      newPlayer: { naam: "", leeftijd: null },
    };
  },
  mounted() {
    this.fetchTeams();
    this.fetchPlayers();
  },
  methods: {
    // Teams ophalen
    async fetchTeams() {
      const res = await fetch("http://127.0.0.1:8000/api/teams", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      this.teams = await res.json();
    },

    // Spelers ophalen
    async fetchPlayers() {
      const res = await fetch("http://127.0.0.1:8000/api/players", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      this.players = await res.json();
    },

    // Team CRUD
    async createTeam() {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const res = await fetch("http://127.0.0.1:8000/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(this.newTeam),
      });
      if (res.ok) {
        const team = await res.json();
        this.teams.push(team);
        this.newTeam = { naam: "", sportsoort: "", categorie: "" };
      }
    },
    editTeam(team) {
      this.selectedTeam = { ...team };
      this.editDialog = true;
    },
    async updateTeam() {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const res = await fetch(
        `http://127.0.0.1:8000/api/teams/${this.selectedTeam.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(this.selectedTeam),
        }
      );
      if (res.ok) {
        const index = this.teams.findIndex(
          (t) => t.id === this.selectedTeam.id
        );
        this.teams[index] = { ...this.selectedTeam };
        this.editDialog = false;
      }
    },
    async deleteTeam(id) {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const res = await fetch(`http://127.0.0.1:8000/api/teams/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (res.ok) this.teams = this.teams.filter((t) => t.id !== id);
    },

    // Spelers per team
    openPlayers(team) {
      this.selectedTeam = { ...team };
      this.teamPlayers = this.players.filter((p) => p.team_id === team.id);
      this.playersDialog = true;
    },
    async addPlayer() {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const payload = { ...this.newPlayer, team_id: this.selectedTeam.id };
      const res = await fetch("http://127.0.0.1:8000/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const player = await res.json();
        this.players.push(player);
        this.teamPlayers.push(player);
        this.newPlayer = { naam: "", leeftijd: null };
      }
    },
    async deletePlayer(playerId) {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const res = await fetch(`http://127.0.0.1:8000/api/players/${playerId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        this.players = this.players.filter((p) => p.id !== playerId);
        this.teamPlayers = this.teamPlayers.filter((p) => p.id !== playerId);
      }
    },
  },
};
</script>
