<template>
  <v-app theme="light">
    <AppHeader />

    <v-main>
      <v-container>
        <h2 class="mb-4">Wedstrijden</h2>

        <!-- Wedstrijd aanmaken -->
        <v-form
          @submit.prevent="createMatch"
          class="mb-6"
          style="max-width: 600px"
        >
          <v-select
            v-model="newMatch.team_thuis_id"
            :items="teams"
            item-title="naam"
            item-value="id"
            label="Thuis team"
            required
            class="mb-3"
          />
          <v-select
            v-model="newMatch.team_uit_id"
            :items="teams"
            item-title="naam"
            item-value="id"
            label="Uit team"
            required
            class="mb-3"
          />
          <v-text-field
            v-model="newMatch.datum"
            label="Datum"
            type="date"
            required
            class="mb-3"
          />
          <v-text-field
            v-model="newMatch.locatie"
            label="Locatie"
            required
            class="mb-3"
          />
          <v-text-field
            v-model="newMatch.uitslag_thuis"
            label="Score Thuis"
            type="number"
            min="0"
            class="mb-3"
          />
          <v-text-field
            v-model="newMatch.uitslag_uit"
            label="Score Uit"
            type="number"
            min="0"
            class="mb-3"
          />
          <v-btn type="submit" color="primary">Maak Wedstrijd</v-btn>
        </v-form>

        <!-- Wedstrijden lijst -->
        <v-list>
          <v-list-item
            v-for="match in matches"
            :key="match.id"
            class="mb-2"
            two-line
          >
            <div>
              <strong>{{ match.team_thuis?.naam || "Onbekend" }}</strong>
              vs
              <strong>{{ match.team_uit?.naam || "Onbekend" }}</strong>
            </div>
            <div>
              {{ match.datum }} — {{ match.locatie }} | Score:
              {{ match.uitslag_thuis ?? "-" }} - {{ match.uitslag_uit ?? "-" }}
            </div>
            <div class="mt-1">
              <v-btn small color="warning" @click="editMatch(match)"
                >Bewerk</v-btn
              >
              <v-btn small color="error" @click="deleteMatch(match.id)"
                >Verwijder</v-btn
              >
            </div>
          </v-list-item>
        </v-list>
        <!-- Dialog: Wedstrijd bewerken -->
        <v-dialog v-model="editDialog" max-width="600px">
          <v-card>
            <v-card-title>Bewerk Wedstrijd</v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedMatch.team_thuis_id"
                :items="teams"
                item-title="naam"
                item-value="id"
                label="Thuis team"
                class="mb-3"
              />
              <v-select
                v-model="selectedMatch.team_uit_id"
                :items="teams"
                item-title="naam"
                item-value="id"
                label="Uit team"
                class="mb-3"
              />
              <v-text-field
                v-model="selectedMatch.datum"
                label="Datum"
                type="date"
                class="mb-3"
              />
              <v-text-field
                v-model="selectedMatch.locatie"
                label="Locatie"
                class="mb-3"
              />
              <v-text-field
                v-model="selectedMatch.uitslag_thuis"
                label="Score Thuis"
                type="number"
                min="0"
                class="mb-3"
              />
              <v-text-field
                v-model="selectedMatch.uitslag_uit"
                label="Score Uit"
                type="number"
                min="0"
                class="mb-3"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="editDialog = false">Annuleer</v-btn>
              <v-btn color="primary" @click="updateMatch">Opslaan</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      teams: [],
      matches: [],
      newMatch: {
        team_thuis_id: null,
        team_uit_id: null,
        datum: "",
        locatie: "",
        uitslag_thuis: null,
        uitslag_uit: null,
      },
      editDialog: false,
      selectedMatch: {},
    };
  },
  mounted() {
    this.fetchTeams();
    this.fetchMatches();
  },
  methods: {
    async fetchTeams() {
      const res = await fetch("http://127.0.0.1:8000/api/teams");
      this.teams = await res.json();
    },

    async fetchMatches() {
      const res = await fetch("http://127.0.0.1:8000/api/wedstrijden");
      this.matches = await res.json();
    },

    async createMatch() {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const res = await fetch("http://127.0.0.1:8000/api/wedstrijden", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(this.newMatch),
      });

      if (res.ok) {
        const matchWithTeams = await res.json();

        // Debug: bekijk wat er binnenkomt
        console.log("Nieuwe wedstrijd:", matchWithTeams);
        console.log("teamThuis:", matchWithTeams.team_thuis);
        console.log("teamUit:", matchWithTeams.team_uit);

        this.matches.push(matchWithTeams);

        // Reset form
        this.newMatch = {
          team_thuis_id: null,
          team_uit_id: null,
          datum: "",
          locatie: "",
          uitslag_thuis: null,
          uitslag_uit: null,
        };
      }
    },

    editMatch(match) {
      this.selectedMatch = { ...match };
      this.editDialog = true;
    },

    async updateMatch() {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const res = await fetch(
        `http://127.0.0.1:8000/api/wedstrijden/${this.selectedMatch.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(this.selectedMatch),
        }
      );
      if (res.ok) {
        const updatedMatch = await res.json();

        // Match opnieuw ophalen met teams
        const res2 = await fetch(
          `http://127.0.0.1:8000/api/wedstrijden/${updatedMatch.id}`
        );
        const matchWithTeams = await res2.json();

        const index = this.matches.findIndex((m) => m.id === matchWithTeams.id);
        this.matches[index] = matchWithTeams;
        this.editDialog = false;
      }
    },

    async deleteMatch(id) {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const res = await fetch(`http://127.0.0.1:8000/api/wedstrijden/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      if (res.ok) this.matches = this.matches.filter((m) => m.id !== id);
    },
  },
};
</script>
