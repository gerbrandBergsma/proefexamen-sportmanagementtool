<template>
  <v-footer app height="60" class="footer d-flex align-center">
    <v-container>
      <v-row class="align-center justify-center" no-gutters>
        <!-- Desktop links: elk 1/6 breed -->
        <v-col
          v-for="link in navLinks"
          :key="link.name"
          cols="2"
          class="d-none d-sm-flex justify-center"
        >
          <v-btn
            variant="text"
            class="footer-link w-100"
            @click="router.push(link.path)"
          >
            {{ link.name }}
          </v-btn>
        </v-col>

        <!-- Mobile hamburger -->
        <v-col cols="auto" class="d-flex d-sm-none justify-center">
          <v-menu location="top end">
            <template #activator="{ props }">
              <v-btn icon v-bind="props">
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="link in navLinks"
                :key="link.name"
                @click="router.push(link.path)"
              >
                <v-list-item-title>
                  {{ link.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

interface NavLink {
  name: string;
  path: string;
}

const navLinks: NavLink[] = [
  { name: "Home", path: "/" },
  { name: "Spelers", path: "/PlayersPage" },
  { name: "Statistieken", path: "/StatisticsPage" },
  { name: "Teams", path: "/TeamsPage" },
  { name: "Training", path: "/TrainingPage" },
  { name: "Wedstrijden", path: "/Wedstrijden" },
];
</script>

<style scoped>
.footer {
  background-color: #111827 !important;
  color: white !important;
}

.footer-link {
  color: #e5e7eb !important;
  text-transform: none;
  font-weight: 500;
  font-size: 16px;
}

.footer-link:hover {
  color: white !important;
}

.v-btn {
  box-shadow: none !important;
}
</style>
