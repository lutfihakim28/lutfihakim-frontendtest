import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

type SnackbarColor = 'success' | 'warning' | 'error'

export const useAppStore = defineStore('app', () => {
  const snackBarState = reactive<{
    visibility: boolean,
    message: string | undefined,
    color: SnackbarColor
  }>({
    visibility: false,
    message: undefined,
    color: 'success'
  })

  function showSnackbar(message: string, color?: SnackbarColor) {
    snackBarState.visibility = true;
    snackBarState.message = message;
    snackBarState.color = color || 'success';
  }

  return {
    snackBarState,
    showSnackbar,
  }
})
