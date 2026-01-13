<template>
  <v-app theme="light">
    <AppHeader />

    <v-main>
      <v-container>
        <h2 class="mb-4">Spelers</h2>

        <!-- Speler aanmaken -->
        <v-form @submit.prevent="createPlayer" style="max-width: 400px">
          <v-text-field
            v-model="newPlayer.naam"
            label="Naam"
            required
            class="mb-3"
          />
          <v-text-field
            v-model="newPlayer.leeftijd"
            label="Leeftijd"
            type="number"
            required
            class="mb-3"
          />
          <v-select
            v-model="newPlayer.team_id"
            :items="teams"
            item-title="naam"
            item-value="id"
            label="Selecteer een team"
            required
            class="mb-3"
          />
          <v-btn type="submit" color="primary" class="mb-3" block>
            Maak Speler
          </v-btn>
        </v-form>

        <!-- Lijst spelers -->
        <ul>
          <li v-for="player in players" :key="player.id" class="player-item">
            {{ player.naam }} ({{ player.leeftijd }} jaar) - Team:
            {{ getTeamName(player.team_id) }}
            <span v-if="player.blessure" class="ml-2" style="color: red">
              ⚠ {{ player.blessure }}
            </span>

            <v-btn
              color="error"
              small
              class="ml-2 mt-1"
              @click="deletePlayer(player.id)"
            >
              Verwijder
            </v-btn>

            <v-btn
              color="primary"
              small
              class="ml-2 mt-1"
              @click="openBlessureDialog(player)"
            >
              Bewerk Blessure
            </v-btn>
          </li>
        </ul>

        <!-- Modal voor blessure bewerken -->
        <v-dialog v-model="blessureDialog" max-width="500">
          <v-card>
            <v-card-title> Bewerk blessure </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="selectedPlayer.blessure"
                label="Blessure"
                placeholder="Bijv. Knieblessure"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="blessureDialog = false">Annuleer</v-btn>
              <v-btn color="primary" @click="updateBlessure">Opslaan</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script>
import { PlayersService } from "@/services/players.service";
import { TeamsService } from "@/services/teams.service";

export default {
  data() {
    return {
      players: [],
      teams: [],

      newPlayer: {
        naam: "",
        leeftijd: null,
        team_id: null,
      },

      blessureDialog: false,
      selectedPlayer: {},
    };
  },

  async mounted() {
    await this.loadData();
  },

  methods: {
    async loadData() {
      const [playersRes, teamsRes] = await Promise.all([
        PlayersService.getAll(),
        TeamsService.getAll(),
      ]);

      this.players = playersRes.data;
      this.teams = teamsRes.data;
    },

    // ===== PLAYERS =====
    async createPlayer() {
      const { data } = await PlayersService.create(this.newPlayer);
      this.players.push(data);

      this.newPlayer = { naam: "", leeftijd: null, team_id: null };
    },

    async deletePlayer(id) {
      await PlayersService.delete(id);
      this.players = this.players.filter((p) => p.id !== id);
    },

    async updateBlessure() {
      const payload = { blessure: this.selectedPlayer.blessure };

      await PlayersService.update(this.selectedPlayer.id, payload);

      const index = this.players.findIndex(
        (p) => p.id === this.selectedPlayer.id
      );

      if (index !== -1) {
        this.players[index].blessure = this.selectedPlayer.blessure;
      }

      this.blessureDialog = false;
    },

    // ===== UI HELPERS =====
    getTeamName(teamId) {
      const team = this.teams.find((t) => t.id === teamId);
      return team ? team.naam : "Geen team";
    },

    openBlessureDialog(player) {
      this.selectedPlayer = { ...player };
      this.blessureDialog = true;
    },
  },
};
</script>
