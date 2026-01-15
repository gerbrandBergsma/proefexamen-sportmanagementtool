<template>
  <header class="app-header">
    <h1 class="logo">SportConnect</h1>

    <!-- Desktop nav -->
    <nav class="nav d-none d-lg-flex">
      <a v-for="link in navLinks" :key="link.name" @click="navigate(link.path)">
        {{ link.name }}
      </a>
    </nav>

    <!-- Mobile hamburger -->
    <div class="mobile-menu d-flex d-lg-none">
      <button class="hamburger" @click="toggleMenu">☰</button>
      <div v-if="menuOpen" class="mobile-dropdown">
        <a
          v-for="link in navLinks"
          :key="link.name"
          @click="navigate(link.path)"
        >
          {{ link.name }}
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const menuOpen = ref(false);

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Spelers", path: "/PlayersPage" },
  { name: "Statistieken", path: "/StatisticsPage" },
  { name: "Teams", path: "/TeamsPage" },
  { name: "Training", path: "/TrainingPage" },
  { name: "Wedstrijden", path: "/Wedstrijden" },
];

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function navigate(path: string) {
  router.push(path);
  menuOpen.value = false;
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #111827;
  color: white;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  margin-right: 2rem;
}

/* Desktop nav: links even verdelen naast logo */
.nav {
  display: flex;
  flex: 1;
  justify-content: space-between;
}

.nav a {
  flex: 1;
  text-align: center;
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 500;
}

.nav a:hover {
  color: white;
}

/* Mobile hamburger */
.mobile-menu {
  position: relative;
}

.hamburger {
  font-size: 1.5rem;
  background: none;
  border: none;
  color: #e5e7eb;
  cursor: pointer;
}

/* Dropdown menu */
.mobile-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: #111827;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  width: 200px;
}

.mobile-dropdown a {
  padding: 0.75rem 1rem;
  color: #e5e7eb;
  text-decoration: none;
}

.mobile-dropdown a:hover {
  color: white;
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

/* Breakpoint verhogen naar 680px */
@media (max-width: 680px) {
  .d-lg-flex {
    display: none !important;
  }
  .d-lg-none {
    display: flex !important;
  }
}
</style>
