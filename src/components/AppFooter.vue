<template>
  <v-footer app height="60" class="app-footer">
    <v-container>
      <v-row class="align-center justify-between" no-gutters>
        <!-- Logo -->
        <v-col cols="auto">
          <h1 class="footer-logo">SportConnect</h1>
        </v-col>

        <!-- Desktop nav: links over volledige breedte, zoals header -->
        <v-col class="d-none d-lg-flex">
          <div class="footer-nav">
            <a
              v-for="link in navLinks"
              :key="link.name"
              @click="router.push(link.path)"
            >
              {{ link.name }}
            </a>
          </div>
        </v-col>

        <!-- Mobile hamburger -->
        <v-col cols="auto" class="d-flex d-lg-none justify-end">
          <v-menu location="top end">
            <template #activator="{ props }">
              <v-btn icon class="footer-hamburger" v-bind="props">
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </template>

            <v-list class="footer-dropdown">
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
.app-footer {
  background-color: #111827 !important;
  color: white !important;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
}

/* Logo */
.footer-logo {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

/* Desktop nav: links over volledige breedte, elk neemt evenveel ruimte */
.footer-nav {
  display: flex;
  flex: 1;
  justify-content: space-between;
}

.footer-nav a {
  flex: 1;
  text-align: center;
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 500;
}

.footer-nav a:hover {
  color: white;
}

/* Hamburger button mobiel */
.footer-hamburger {
  background: transparent !important;
  border: none !important;
  padding: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-hamburger .v-icon {
  font-size: 1.5rem;
  color: white;
}

/* Dropdown menu */
.footer-dropdown {
  background-color: #111827 !important;
  color: white !important;
}

.footer-dropdown .v-list-item {
  color: white !important;
}

.footer-dropdown .v-list-item:hover {
  background-color: #1f2937 !important;
}

/* Responsive helpers */
.d-none {
  display: none !important;
}
.d-lg-flex {
  display: flex !important;
}
.d-lg-none {
  display: none !important;
}

@media (max-width: 680px) {
  .d-lg-flex {
    display: none !important;
  }
  .d-lg-none {
    display: flex !important;
  }
}
</style>
