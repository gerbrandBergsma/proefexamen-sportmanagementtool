<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

/* Chart.js registraties */
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

/* Props */
const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
});

/* 🔥 Dynamische kleur generator (onbeperkt teams) */
const getColor = (index) => {
  const hue = (index * 47) % 360; // mooie spreiding
  return `hsl(${hue}, 70%, 50%)`;
};

/* Chart data */
const chartData = computed(() => ({
  labels: [
    "Gewonnen",
    "Gelijk",
    "Verloren",
    "Doelpunten voor",
    "Doelpunten tegen",
  ],
  datasets: props.teams.map((team, index) => {
    const color = getColor(index);

    return {
      label: team.team.naam,
      data: [
        team.stats.gewonnen,
        team.stats.gelijk,
        team.stats.verloren,
        team.stats.doelpunten_voor,
        team.stats.doelpunten_tegen,
      ],
      borderColor: color,
      backgroundColor: color.replace("50%", "80%"),
      tension: 0.4,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  }),
}));

/* Chart opties */
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "nearest",
    intersect: false,
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
      },
    },
    title: {
      display: true,
      text: "Teamvergelijking",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>

<style scoped>
canvas {
  max-height: 450px;
}
</style>
