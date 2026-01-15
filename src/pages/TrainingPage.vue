<template>
  <v-app theme="light">
    <AppHeader />

    <v-main>
      <v-container>
        <h2 class="mb-4">Training Dashboard</h2>

        <!-- Loading -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="mb-4"
        />

        <!-- Nieuwe training -->
        <v-card class="mb-5" outlined>
          <v-card-title>Nieuwe training</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="createTraining" style="max-width: 500px">
              <v-text-field v-model="form.title" label="Titel" required />
              <v-select
                v-model="form.team_id"
                :items="teams"
                item-title="naam"
                item-value="id"
                label="Team"
                required
              />
              <v-text-field
                v-model="form.training_date"
                type="date"
                label="Datum"
                required
              />
              <v-text-field
                v-model="form.start_time"
                type="time"
                label="Starttijd"
                required
              />
              <v-text-field
                v-model="form.end_time"
                type="time"
                label="Eindtijd"
                required
              />
              <v-text-field v-model="form.location" label="Locatie" />
              <v-textarea v-model="form.notes" label="Notities" rows="2" />

              <v-btn type="submit" color="primary" block>
                Training aanmaken
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Trainingslijst -->
        <v-card
          v-for="training in trainings"
          :key="training.id"
          class="mb-4"
          outlined
        >
          <v-card-title>
            {{ training.title }} –
            {{ training.team?.naam ?? "Onbekend team" }}
            ({{ training.training_date }} {{ training.start_time }}–{{
              training.end_time
            }})

            <v-spacer />

            <v-btn small color="primary" @click="openEditModal(training)">
              Bewerk
            </v-btn>

            <v-btn small color="error" @click="deleteTraining(training.id)">
              Verwijder
            </v-btn>
          </v-card-title>

          <!-- Attendance -->
          <v-card-text>
            <v-form
              @submit.prevent="saveAttendance(training.id, training.attendance)"
            >
              <div
                v-for="att in training.attendance"
                :key="att.player_id"
                class="mb-3"
              >
                <strong>{{ att.player_name }}</strong>
                <v-select
                  v-model="att.status"
                  :items="['present', 'absent', 'late', 'unknown']"
                  dense
                  outlined
                  class="ml-2"
                />
              </div>

              <v-btn
                v-if="training.attendance.length"
                type="submit"
                small
                color="primary"
              >
                Aanwezigheid opslaan
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- EDIT MODAL -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title>Training bewerken</v-card-title>

        <v-card-text>
          <v-form @submit.prevent="updateTraining">
            <v-text-field v-model="editForm.title" label="Titel" required />
            <v-select
              v-model="editForm.team_id"
              :items="teams"
              item-title="naam"
              item-value="id"
              label="Team"
              required
            />
            <v-text-field
              v-model="editForm.training_date"
              type="date"
              label="Datum"
              required
            />
            <v-text-field
              v-model="editForm.start_time"
              type="time"
              label="Starttijd"
              required
            />
            <v-text-field
              v-model="editForm.end_time"
              type="time"
              label="Eindtijd"
              required
            />
            <v-text-field v-model="editForm.location" label="Locatie" />
            <v-textarea v-model="editForm.notes" label="Notities" rows="2" />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeEditModal">Annuleren</v-btn>
          <v-btn color="primary" @click="updateTraining">Opslaan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { TrainingsService } from "@/services/trainings.service";
import { TeamsService } from "@/services/teams.service";

/* state */
const trainings = ref([]);
const teams = ref([]);
const loading = ref(false);

/* create form */
const form = ref({
  title: "",
  team_id: null,
  training_date: "",
  start_time: "",
  end_time: "",
  location: "",
  notes: "",
});

/* edit modal */
const editDialog = ref(false);
const editForm = ref({
  id: null,
  title: "",
  team_id: null,
  training_date: "",
  start_time: "",
  end_time: "",
  location: "",
  notes: "",
});

/* lifecycle */
onMounted(async () => {
  await Promise.all([loadTrainings(), loadTeams()]);
});

/* loaders */
async function loadTrainings() {
  loading.value = true;
  const res = await TrainingsService.getAll();
  trainings.value = res.data.map((t) => ({
    ...t,
    attendance:
      t.players?.map((p) => ({
        player_id: p.id,
        player_name: p.name,
        status: p.pivot?.status ?? "unknown",
      })) ?? [],
  }));
  loading.value = false;
}

async function loadTeams() {
  const res = await TeamsService.getAll();
  teams.value = res.data;
}

/* CRUD */
async function createTraining() {
  await TrainingsService.create(form.value);
  await loadTrainings();
  resetCreateForm();
}

async function updateTraining() {
  await TrainingsService.update(editForm.value.id, editForm.value);
  closeEditModal();
  await loadTrainings();
}

async function deleteTraining(id) {
  if (!confirm("Training verwijderen?")) return;
  await TrainingsService.delete(id);
  await loadTrainings();
}

/* edit modal helpers */
function openEditModal(training) {
  editForm.value = {
    id: training.id,
    title: training.title,
    team_id: training.team_id,
    training_date: training.training_date,
    start_time: training.start_time,
    end_time: training.end_time,
    location: training.location,
    notes: training.notes,
  };
  editDialog.value = true;
}

function closeEditModal() {
  editDialog.value = false;
}

/* attendance */
async function saveAttendance(trainingId, attendance) {
  await TrainingsService.saveAttendance(trainingId, attendance);
  await loadTrainings();
}

/* helpers */
function resetCreateForm() {
  form.value = {
    title: "",
    team_id: null,
    training_date: "",
    start_time: "",
    end_time: "",
    location: "",
    notes: "",
  };
}
</script>
