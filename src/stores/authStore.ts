import { UserMeResponseDto } from '@/dtos/UserMeResponseDto';
import { CustomRequest } from '@/services/CustomRequest';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAppStore } from './appStore';
import { RegisterRequestDto } from '@/dtos/RegisterRequestDto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { LoginRequestDto } from '@/dtos/LoginRequestDto';
import { LoginResponseDto } from '@/dtos/LoginResponseDto';
import { Token } from '@/utils/Token';

export const useAuthStore = defineStore('auth', () => {
  const appStore = useAppStore()
  const photoUid = ref<string>();
  const me = ref<UserMeResponseDto>();
  const request = new CustomRequest();

  async function uploadPhoto(file: File) {
    try {
      const formData = new FormData()
      formData.append('file', file);
      const response = await request.POST('/user/photo/upload', formData)
      photoUid.value = typeof response === 'string' ? response : undefined
      return Promise.resolve()
    } catch (error) {
      if (typeof error === 'string') {
        appStore.showSnackbar(error, 'error')
      }
      appStore.showSnackbar('Terjadi kesalahan', 'error')
      console.error(error)
    }
  }

  async function register(data: RegisterRequestDto, file: File) {
    try {
      await uploadPhoto(file);
      if (!photoUid.value) {
        appStore.showSnackbar('Foto belum diunggah atau belum tersimpan di server', 'error')
        return
      }
      data.photos = [photoUid.value]
      const payload = instanceToPlain(data)
      await request.POST('/user', payload)
      appStore.showSnackbar('Berhasil mendaftar')
      return Promise.resolve()
    } catch (error) {
      if (typeof error === 'string') {
        appStore.showSnackbar(error, 'error')
      }
      appStore.showSnackbar('Terjadi kesalahan', 'error')
      console.error(error)
    }
  }

  async function login(data: LoginRequestDto) {
    try {
      const payload = new FormData()
      payload.append('username', data.username)
      payload.append('password', data.password)
      const response = await request.POST('/login', payload)
      const responseData = plainToInstance(LoginResponseDto, response)

      const token = new Token()
      token.saveToken(responseData.accessToken)
      return Promise.resolve()
    } catch (error) {
      if (typeof error === 'string') {
        appStore.showSnackbar(error, 'error')
      }
      appStore.showSnackbar('Terjadi kesalahan', 'error')
      console.error(error)
    }
  }

  async function logout() {
    try {
      await request.POST('/user/logout/all')
    } catch (error) {
      if (typeof error === 'string') {
        appStore.showSnackbar(error, 'error')
      }
      appStore.showSnackbar('Terjadi kesalahan', 'error')
      console.error(error)
    }
  }

  return {
    register,
    login,
    logout,
  }
})
