<script setup lang="ts">
import { reactive, ref } from 'vue';
import rules from '@utils/rules'
import { LoginRequestDto } from '@/dtos/LoginRequestDto';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()

const data = reactive(new LoginRequestDto())
const form = ref<boolean>(false)
const loading = ref<boolean>(false)
const passwordType = ref<'password' | 'text'>('password')

async function onSubmit() {
  if (!form.value) return

  try {
    loading.value = true;
    await authStore.login(data)
    router.push({ name: 'AnalyticPage' })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function togglePasswordType() {
  if (passwordType.value === 'password') {
    passwordType.value = 'text'
    return
  }
  if (passwordType.value === 'text') {
    passwordType.value = 'password'
  }
}
</script>

<template>
  <section class="wrapper">
    <v-card max-width="344" min-width="320" variant="tonal">
      <v-card-text style="padding: 0; padding-bottom: 28px;">
        <v-form
        v-model="form"
        @submit.prevent="onSubmit"
        class="d-flex flex-column justify-start" style="gap: 12px"
      >
        <v-container>
          <v-col>
            <v-text-field
              v-model="data.username"
              :readonly="loading"
              :rules="[rules.required]"
              class="mb-2"
              label="Username"
              variant="outlined"
            />

            <v-text-field
              v-model="data.password"
              :readonly="loading"
              :rules="[rules.required]"
              label="Password"
              variant="outlined"
              autocomplete="on"
              :append-inner-icon="passwordType === 'password' ? 'mdi-eye' : 'mdi-eye-off'"
              :type="passwordType"
              @click:append-inner="togglePasswordType"
            />

            <v-btn
              :loading="loading"
              block
              color="primary"
              size="large"
              type="submit"
              flat
            >
              Masuk
            </v-btn>
          </v-col>
        </v-container>
      </v-form>

        <p class="mt-2 text-center">Belum memiliki akun? <RouterLink to="/register">Daftar</RouterLink></p>
      </v-card-text>
    </v-card>
  </section>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  min-height: 100dvh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 64px 0;
}

.wrapper p a {
  color: #2196F3;
}

:deep(.v-text-field) {
  input {
      color: #eeeeee;
  }

  .v-text-field__prefix {
    color: #eeeeee;
  }

  .v-messages__message, .v-field--error:not(.v-field--disabled) .v-label.v-field-label {
    color: #ef5350;
  }
}
</style>
