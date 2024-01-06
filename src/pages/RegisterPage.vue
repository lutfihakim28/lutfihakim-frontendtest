<script setup lang="ts">
import { reactive, ref } from 'vue';
import rules from '@utils/rules';
import { RegisterRequestDto } from '@/dtos/RegisterRequestDto';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';

const authStore = useAuthStore()
const appStore = useAppStore()
const router = useRouter()

const data = reactive(new RegisterRequestDto())
const form = ref<boolean>(false)
const loading = ref<boolean>(false)
const photo = ref<File[]>()
const passwordType = ref<'password' | 'text'>('password')

async function onSubmit () {
  if (!form.value) return
  if (!photo.value) {
    appStore.showSnackbar('Mohon unggah foto', 'error');
  }
  try {
    loading.value = true;
    await authStore.register(data, photo.value![0])
    router.push({ name: 'LoginPage' })
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
    <v-card min-width="328" max-width="600" width="50%" variant="tonal">
      <v-card-text style="padding: 8px; padding-bottom: 20px;">
        <v-form
        v-model="form"
        @submit.prevent="onSubmit"
        style="gap: 12px;"
      >
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data.email"
                :readonly="loading"
                :rules="[rules.required, rules.email]"
                label="Email"
                style="flex-basis: 50%; flex-grow: 0;"
                variant="outlined"
                type="email"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data.name"
                :readonly="loading"
                :rules="[rules.required, rules.minLength(data.name, 3)]"
                label="Nama"
                style="flex-basis: 50%; flex-grow: 0;"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data.phone"
                :readonly="loading"
                :rules="[
                  rules.required,
                  rules.phone,
                  rules.minLength(data.phone, 9),
                  rules.maxLength(data.phone, 12),
                ]"
                label="Nomor HP"
                style="flex-basis: 50%; flex-grow: 0;"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data.password"
                label="Password"
                variant="outlined"
                autocomplete="on"
                style="flex-basis: 50%; flex-grow: 0;"
                :readonly="loading"
                :rules="[rules.required]"
                :append-inner-icon="passwordType === 'password' ? 'mdi-eye' : 'mdi-eye-off'"
                :type="passwordType"
                @click:append-inner="togglePasswordType"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data.age"
                :readonly="loading"
                :rules="[rules.required, rules.min(Number(data.age), 18), rules.max(Number(data.age), 100)]"
                label="Umur"
                type="number"
                style="flex-basis: 50%; flex-grow: 0;"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input
                v-model="photo"
                accept="image/*"
                clearable
                label="Photo"
                variant="outlined"
                style="flex-basis: 50%; flex-grow: 0;"
                prepend-icon=""
                :rules="[rules.photo]"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn
                :loading="loading"
                block
                color="primary"
                size="large"
                type="submit"
                class="flex-1-100"
                flat
              >
                Daftar
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

        <p class="mt-2 text-center">Sudah memiliki akun? <RouterLink to="/login">Masuk</RouterLink></p>
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

:deep(.v-text-field), :deep(.v-file-input) {
  input {
      color: #eeeeee;
  }

  .v-text-field__prefix {
    color: #eeeeee;
  }

  .v-messages__message, .v-field--error:not(.v-field--disabled) .v-label.v-field-label, .v-input-prepend {
    color: #ef5350;
  }
}
</style>
