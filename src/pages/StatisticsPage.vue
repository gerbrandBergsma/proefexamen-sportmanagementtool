<template>
  <v-app theme="light">
    <AppHeader />

    <v-main>
      <v-container>
        <!-- TEAMVERGELIJKING -->
        <h1>Teamvergelijking</h1>

        <v-card class="mb-10">
          <v-card-title>Statistieken per team</v-card-title>
          <v-card-text>
            <div style="height: 450px">
              <TeamsLineChart :teams="teams" />
            </div>
          </v-card-text>
        </v-card>

        <!-- TEAMTABEL -->
        <v-card class="mb-10">
          <v-card-title>Teamoverzicht</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Gespeeld</th>
                  <th>Gewonnen</th>
                  <th>Gelijk</th>
                  <th>Verloren</th>
                  <th>Doelpunten +</th>
                  <th>Doelpunten -</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="team in teams" :key="team.team.id">
                  <td>{{ team.team.naam }}</td>
                  <td>{{ team.stats.gespeeld }}</td>
                  <td>{{ team.stats.gewonnen }}</td>
                  <td>{{ team.stats.gelijk }}</td>
                  <td>{{ team.stats.verloren }}</td>
                  <td>{{ team.stats.doelpunten_voor }}</td>
                  <td>{{ team.stats.doelpunten_tegen }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- SPELERTABEL -->
        <h1>Spelersstatistieken</h1>

        <v-card class="mb-10">
          <v-card-title>Overzicht alle spelers</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Blessure</th>
                  <th>Doelpunten</th>
                  <th>Aanwezigheid</th>
                  <th>Gem. aanwezigheid</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="player in players" :key="player.player.id">
                  <td>{{ player.player.naam }}</td>
                  <td>{{ player.blessures || "Geen" }}</td>
                  <td>{{ player.doelpunten }}</td>
                  <td>{{ player.aanwezigheid }}</td>
                  <td>
                    {{ Number(player.gemiddelde_aanwezigheid || 0).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { StatistiekenService } from "@/services/statistieken.service";
import TeamsLineChart from "@/components/TeamsLineChart.vue";

const teams = ref([]);
const players = ref([]);

onMounted(async () => {
  try {
    const { data } = await StatistiekenService.get();
    teams.value = data.teams;
    players.value = data.players;
  } catch (err) {
    console.error("Error fetching statistieken:", err);
  }
});
</script>

<style scoped>
h1 {
  margin-bottom: 1rem;
}
</style>
