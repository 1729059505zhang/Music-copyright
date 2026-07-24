import { defineStore } from 'pinia'
import request from '@/api/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('creator_token') || '',
    userInfo: null,
    creatorInfo: null,
    joinStatus: 'not_submitted'
  }),
  actions: {
    async login(loginForm) {
      const res = await request.post('/creator/auth/login', loginForm)
      this.token = res.token
      localStorage.setItem('creator_token', res.token)
      return res
    },
    async register(registerForm) {
      const res = await request.post('/creator/auth/register', registerForm)
      return res
    },
    async fetchUserInfo() {
      const res = await request.get('/creator/info')
      this.userInfo = res.user
      this.creatorInfo = res.creator
      this.joinStatus = res.creator?.audit_status || 'not_submitted'
      return res
    },
    async submitJoin(formData) {
      const res = await request.post('/creator/join', formData)
      return res
    },
    logout() {
      this.token = ''
      this.userInfo = null
      this.creatorInfo = null
      this.joinStatus = 'not_submitted'
      localStorage.removeItem('creator_token')
    }
  }
})
