<!-- AppFooter.vue -->
<template>
  <v-footer app height="60" class="footer d-flex align-center">
    <v-container>
      <v-row class="justify-end">
        <v-col v-for="link in navLinks" :key="link.name" cols="auto">
          <v-btn text class="footer-link" @click="router.push(link.path)">
            {{ link.name }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const navLinks = [
  { name: "Players", path: "/PlayersPage" },
  { name: "Statistics", path: "/StatisticsPage" },
  { name: "Teams", path: "/TeamsPage" },
  { name: "Training", path: "/TrainingPage" },
  { name: "Wedstrijden", path: "/Wedstrijden" },
];

const router = useRouter();
</script>

<style scoped>
.footer {
  background-color: #111827 !important;
  color: white !important;
}

.footer-link {
  color: #e5e7eb !important;
  background-color: transparent !important;
  text-transform: none;
  font-weight: 500;
  font-size: 16px;
  border: none;
  border-radius: 0;
  padding: 0 12px;
  font-family: Arial, Helvetica, sans-serif;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: white !important;
}

.v-btn--variant-elevated {
  box-shadow: none !important;
}
</style>
