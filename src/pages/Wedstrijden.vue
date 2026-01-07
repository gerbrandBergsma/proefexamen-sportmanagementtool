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

          <v-btn type="submit" color="primary"> Maak Wedstrijd </v-btn>
        </v-form>

        <!-- Wedstrijden lijst -->
        <v-list two-line>
          <v-list-item v-for="match in matches" :key="match.id">
            <v-list-item-content>
              <v-list-item-title>
                <strong>{{ match.team_thuis?.naam }}</strong>
                vs
                <strong>{{ match.team_uit?.naam }}</strong>
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ match.datum }} — {{ match.locatie }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn small color="warning" @click="editMatch(match)">
                Bewerk
              </v-btn>
              <v-btn small color="error" @click="deleteMatch(match.id)">
                Verwijder
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <!-- Dialog: Bewerken -->
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
        const match = await res.json();
        this.matches.push(match);
        this.newMatch = {
          team_thuis_id: null,
          team_uit_id: null,
          datum: "",
          locatie: "",
        };
      }
    },

    editMatch(match) {
      this.selectedMatch = {
        ...match,
        team_thuis_id: match.team_thuis_id,
        team_uit_id: match.team_uit_id,
      };
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
        const index = this.matches.findIndex(
          (m) => m.id === this.selectedMatch.id
        );
        this.matches[index] = { ...this.selectedMatch };
        this.editDialog = false;
      }
    },

    async deleteMatch(id) {
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const res = await fetch(`http://127.0.0.1:8000/api/wedstrijden/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        this.matches = this.matches.filter((m) => m.id !== id);
      }
    },
  },
};
</script>
