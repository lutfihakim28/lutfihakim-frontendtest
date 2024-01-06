<script setup lang="ts">
import { useAppStore } from '@stores/appStore';
import { computed } from 'vue';

const appStore = useAppStore()

const snackbar = computed(() => appStore.snackBarState)
</script>

<template>
  <v-app>
    <v-main>
      <section class="bg-grey-darken-4" style="width: 100%; min-height: 100dvh;">
        <RouterView name="header" />
        <RouterView name="content" />
      </section>
    </v-main>
  </v-app>

  <v-snackbar
      v-model="snackbar.visibility"
      variant="outlined"
      :color="snackbar.color"
    >
      {{ snackbar.message }}
    </v-snackbar>
</template>
