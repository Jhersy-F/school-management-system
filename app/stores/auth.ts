import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: number; role: string; username?: string; firstname?: string; lastname?: string; email?: string }
  }),
  actions: {
    async fetchUser() {
      const { data } = await useFetch('/api/auth/session')
      if (data.value && data.value.user) {
        this.user = data.value.user
      } else {
        this.user = null
      }
    },
    async login(identifier: string, password: string, role: string) {
      const { data, error } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: { identifier, password, role }
      })
      if (error.value) throw error.value
      if (data.value && data.value.user) {
        this.user = data.value.user
        navigateTo(role === 'admin' ? '/admin/dashboard' : role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard')
      }
    },
    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' })
      this.user = null
      navigateTo('/auth/login')
    }
  }
})
