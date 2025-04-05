import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    userId: null
  }),

  actions: {
    login({ access, refresh }) {
      this.accessToken = access
      this.refreshToken = refresh
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      try {
        const decoded = jwtDecode(access)
        this.userId = decoded.user_id
      } catch (err) {
        console.error('Erro ao decodificar o token:', err)
      }
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.userId = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }
})
