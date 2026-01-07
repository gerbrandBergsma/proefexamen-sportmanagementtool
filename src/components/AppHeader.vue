<template>
  <header class="app-header">
    <h1 class="logo">Sportmanagementtool</h1>
    <nav class="nav">
      <a href="/">Home</a>
      <a href="PlayersPage">Players</a>
      <a href="StatisticsPage">Statistics</a>
      <a href="TeamsPage">Teams</a>
      <a href="TrainingPage">Training</a>
    </nav>
  </header>
</template>

<script setup>
// no logic needed
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #111827;
  color: white;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
}

.nav a {
  margin-left: 1rem;
  color: #e5e7eb;
  text-decoration: none;
}

.nav a:hover {
  color: white;
}
</style>
