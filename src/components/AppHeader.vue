<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()

async function logout() {
  try {
    await authStore.logout()
    router.push({ name: 'LoginPage' })
    localStorage.removeItem('token')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <v-app-bar color="#424242" title="Analytic">
    <template #append>
      <v-btn icon="mdi-logout" title="Logout" @click="logout"></v-btn>
    </template>
  </v-app-bar>
</template>
