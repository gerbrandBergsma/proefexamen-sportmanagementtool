<template>
  <v-app theme="light">
    <AppHeader />

    <v-main>
      <v-container>
        <h2 class="mb-4">Training Dashboard</h2>

        <!-- Loading state -->
        <v-progress-linear
          v-if="store.loading"
          indeterminate
          color="primary"
          class="mb-4"
        />

        <!-- Trainings aanmaken -->
        <v-card class="mb-5" outlined>
          <v-card-title>Nieuwe Training</v-card-title>
          <v-card-text>
            <v-form
              @submit.prevent="handleCreateTraining"
              style="max-width: 500px"
            >
              <v-text-field
                v-model="newTraining.title"
                label="Titel"
                required
                class="mb-3"
              />
              <v-select
                v-model="newTraining.team_id"
                :items="store.teams"
                item-title="naam"
                item-value="id"
                label="Selecteer team"
                required
                class="mb-3"
              />
              <v-text-field
                v-model="newTraining.training_date"
                label="Datum"
                type="date"
                required
                class="mb-3"
              />
              <v-text-field
                v-model="newTraining.start_time"
                label="Starttijd"
                type="time"
                required
                class="mb-3"
              />
              <v-text-field
                v-model="newTraining.end_time"
                label="Eindtijd"
                type="time"
                required
                class="mb-3"
              />
              <v-text-field
                v-model="newTraining.location"
                label="Locatie"
                class="mb-3"
              />
              <v-textarea
                v-model="newTraining.notes"
                label="Notities"
                rows="2"
                class="mb-3"
              />
              <v-btn type="submit" color="primary" block>Maak Training</v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Trainingslijst -->
        <v-card
          v-for="training in store.trainings"
          :key="training.id"
          class="mb-4"
          outlined
        >
          <v-card-title>
            {{ training.title }} - {{ store.getTeamName(training.team_id) }} ({{
              training.training_date
            }}
            {{ training.start_time }}-{{ training.end_time }})
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              small
              @click="handleDeleteTraining(training.id)"
              >Verwijder</v-btn
            >
          </v-card-title>

          <!-- Aanwezigheid spelers -->
          <v-card-text>
            <v-form
              @submit.prevent="
                handleSaveAttendance(training.id, training.attendance)
              "
            >
              <div
                v-for="att in training.attendance"
                :key="att.player_id"
                class="mb-3"
              >
                <span>{{ att.player_name }}</span>
                <v-select
                  v-model="att.status"
                  :items="['present', 'absent', 'late', 'unknown']"
                  label="Status"
                  dense
                  outlined
                  class="ml-2"
                />
              </div>
              <v-btn
                v-if="training.attendance.length > 0"
                type="submit"
                color="primary"
                small
              >
                Opslaan Aanwezigheid
              </v-btn>
              <p v-else class="text-grey">
                Geen spelers beschikbaar voor dit team
              </p>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTrainingStore } from "@/stores/training";

const store = useTrainingStore();

const newTraining = ref({
  title: "",
  team_id: null,
  training_date: "",
  start_time: "",
  end_time: "",
  location: "",
  notes: "",
});

// Load data alleen bij eerste mount, niet bij HMR
onMounted(() => {
  if (!import.meta.hot) {
    store.loadData();
  } else {
    // Bij HMR: alleen laden als store leeg is
    if (store.trainings.length === 0) {
      store.loadData();
    }
  }
});

async function handleCreateTraining() {
  await store.createTraining(newTraining.value);

  // Reset form
  newTraining.value = {
    title: "",
    team_id: null,
    training_date: "",
    start_time: "",
    end_time: "",
    location: "",
    notes: "",
  };
}

async function handleDeleteTraining(id) {
  if (confirm("Weet je zeker dat je deze training wilt verwijderen?")) {
    await store.deleteTraining(id);
  }
}

async function handleSaveAttendance(trainingId, attendance) {
  await store.saveAttendance(trainingId, attendance);
  alert("Aanwezigheid opgeslagen!");
}
</script>
