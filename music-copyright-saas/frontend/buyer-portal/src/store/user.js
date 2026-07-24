import { defineStore } from 'pinia'
import request from '@/api/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('buyer_token') || '',
    userInfo: null,
    companyInfo: null
  }),
  actions: {
    async login(loginForm) {
      const res = await request.post('/auth/login', loginForm)
      this.token = res.token
      localStorage.setItem('buyer_token', res.token)
      return res
    },
    async register(registerForm) {
      const res = await request.post('/auth/register', registerForm)
      return res
    },
    async fetchUserInfo() {
      const res = await request.get('/user/info')
      this.userInfo = res.user
      this.companyInfo = res.company
      return res
    },
    logout() {
      this.token = ''
      this.userInfo = null
      this.companyInfo = null
      localStorage.removeItem('buyer_token')
    }
  }
})
