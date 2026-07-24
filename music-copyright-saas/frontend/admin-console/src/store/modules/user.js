import { defineStore } from 'pinia'
import { login, getUserInfo, getMenus } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('admin_token') || '',
    userInfo: null,
    menus: [],
    permissions: []
  }),
  actions: {
    async login(loginForm) {
      const res = await login(loginForm)
      this.token = res.token
      localStorage.setItem('admin_token', res.token)
      return res
    },
    async fetchUserInfo() {
      const res = await getUserInfo()
      this.userInfo = res.user
      this.permissions = res.permissions || []
      return res
    },
    async fetchMenus() {
      const res = await getMenus()
      this.menus = res
      return res
    },
    logout() {
      this.token = ''
      this.userInfo = null
      this.menus = []
      this.permissions = []
      localStorage.removeItem('admin_token')
    }
  }
})
