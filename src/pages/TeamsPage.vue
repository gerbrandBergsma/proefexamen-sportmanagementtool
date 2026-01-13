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
import { TeamsService } from "@/services/teams.service";
import { PlayersService } from "@/services/players.service";

export default {
  data() {
    return {
      teams: [],
      players: [],

      newTeam: {
        naam: "",
        sportsoort: "",
        categorie: "",
      },

      editDialog: false,
      selectedTeam: {},

      playersDialog: false,
      teamPlayers: [],
      newPlayer: {
        naam: "",
        leeftijd: null,
      },
    };
  },

  async mounted() {
    await this.loadData();
  },

  methods: {
    async loadData() {
      const [teamsRes, playersRes] = await Promise.all([
        TeamsService.getAll(),
        PlayersService.getAll(),
      ]);

      this.teams = teamsRes.data;
      this.players = playersRes.data;
    },

    // ===== TEAMS =====
    async createTeam() {
      const { data } = await TeamsService.create(this.newTeam);
      this.teams.push(data);

      this.newTeam = { naam: "", sportsoort: "", categorie: "" };
    },

    editTeam(team) {
      this.selectedTeam = { ...team };
      this.editDialog = true;
    },

    async updateTeam() {
      const { data } = await TeamsService.update(
        this.selectedTeam.id,
        this.selectedTeam
      );

      const index = this.teams.findIndex((t) => t.id === data.id);
      this.teams[index] = data;
      this.editDialog = false;
    },

    async deleteTeam(id) {
      await TeamsService.delete(id);
      this.teams = this.teams.filter((t) => t.id !== id);
    },

    // ===== SPELERS PER TEAM =====
    openPlayers(team) {
      this.selectedTeam = { ...team };
      this.teamPlayers = this.players.filter((p) => p.team_id === team.id);
      this.playersDialog = true;
    },

    async addPlayer() {
      const payload = {
        ...this.newPlayer,
        team_id: this.selectedTeam.id,
      };

      const { data } = await PlayersService.create(payload);
      this.players.push(data);
      this.teamPlayers.push(data);

      this.newPlayer = { naam: "", leeftijd: null };
    },

    async deletePlayer(playerId) {
      await PlayersService.delete(playerId);

      this.players = this.players.filter((p) => p.id !== playerId);
      this.teamPlayers = this.teamPlayers.filter((p) => p.id !== playerId);
    },
  },
};
</script>
