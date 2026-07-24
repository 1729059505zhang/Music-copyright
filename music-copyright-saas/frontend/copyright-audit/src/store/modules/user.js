import { defineStore } from 'pinia'
import request from '@/api/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('audit_token') || '',
    userInfo: null
  }),
  actions: {
    async login(loginForm) {
      const res = await request.post('/auth/login', loginForm)
      this.token = res.token
      localStorage.setItem('audit_token', res.token)
      return res
    },
    async fetchUserInfo() {
      const res = await request.get('/auth/info')
      this.userInfo = res.user
      return res
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('audit_token')
    }
  }
})
