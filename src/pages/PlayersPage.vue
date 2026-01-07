<template>
  <v-app theme="light">
    <AppHeader />

    <v-main>
      <v-container>
        <h2 class="mb-4">Spelers</h2>

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

        <ul>
          <li v-for="player in players" :key="player.id" class="player-item">
            {{ player.naam }} ({{ player.leeftijd }} jaar) - Team:
            {{ getTeamName(player.team_id) }}

            <v-btn
              color="error"
              small
              class="ml-2 mt-1"
              @click="deletePlayer(player.id)"
            >
              Verwijder
            </v-btn>
          </li>
        </ul>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      players: [],
      teams: [],
      newPlayer: { naam: "", leeftijd: null, team_id: null },
    };
  },
  mounted() {
    this.fetchTeams();
    this.fetchPlayers();
  },
  methods: {
    async fetchTeams() {
      const res = await fetch("http://127.0.0.1:8000/api/teams", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      this.teams = await res.json();
    },
    async fetchPlayers() {
      const res = await fetch("http://127.0.0.1:8000/api/players", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      this.players = await res.json();
    },
    async createPlayer() {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const res = await fetch("http://127.0.0.1:8000/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(this.newPlayer),
      });

      if (res.ok) {
        const player = await res.json();
        this.players.push(player);
        this.newPlayer = { naam: "", leeftijd: null, team_id: null };
      }
    },
    async deletePlayer(id) {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const res = await fetch(`http://127.0.0.1:8000/api/players/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        this.players = this.players.filter((p) => p.id !== id);
      }
    },
    getTeamName(teamId) {
      const team = this.teams.find((t) => t.id === teamId);
      return team ? team.naam : "Geen team";
    },
  },
};
</script>
<style>
.player-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* space between each player row */
}

.player-item v-btn {
  margin-left: 12px; /* space between text and button */
}
</style>
