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
                  <th>
                    Aanwezigheid
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-icon
                          v-bind="props"
                          size="18"
                          color="primary"
                          class="ml-1"
                          >mdi-information-outline</v-icon
                        >
                      </template>
                      <span>
                        Present = 1 punt<br />
                        Late = 0,5 punt<br />
                        Absent / Unknown = 0 punten
                      </span>
                    </v-tooltip>
                  </th>
                  <th>
                    Gemiddelde aanwezigheid
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-icon
                          v-bind="props"
                          size="18"
                          color="primary"
                          class="ml-1"
                          >mdi-information-outline</v-icon
                        >
                      </template>
                      <span>
                        Totaal aanwezigheidspunten gedeeld door het aantal
                        trainingen
                      </span>
                    </v-tooltip>
                  </th>
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
import axios from "axios";
import TeamsLineChart from "@/components/TeamsLineChart.vue";

const teams = ref([]);
const players = ref([]);

onMounted(async () => {
  const { data } = await axios.get("http://127.0.0.1:8000/api/statistieken");

  teams.value = data.teams;
  players.value = data.players;
});
</script>

<style scoped>
h1 {
  margin-bottom: 1rem;
}
</style>
