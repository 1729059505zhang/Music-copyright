import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/views/layout/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: { title: '审核概览', icon: 'DataAnalysis' }
      },
      {
        path: 'work',
        name: 'WorkAudit',
        redirect: '/work/lyric',
        meta: { title: '作品审核', icon: 'DocumentChecked' },
        children: [
          {
            path: 'lyric',
            name: 'LyricAudit',
            component: () => import('@/views/work/LyricAudit.vue'),
            meta: { title: '词曲作品审核' }
          },
          {
            path: 'release',
            name: 'ReleaseAudit',
            component: () => import('@/views/work/ReleaseAudit.vue'),
            meta: { title: '发行作品审核' }
          }
        ]
      },
      {
        path: 'copyright',
        name: 'CopyrightManage',
        redirect: '/copyright/apply',
        meta: { title: '版权登记', icon: 'Medal' },
        children: [
          {
            path: 'apply',
            name: 'ApplyAudit',
            component: () => import('@/views/copyright/ApplyAudit.vue'),
            meta: { title: '登记申请审核' }
          },
          {
            path: 'registration',
            name: 'Registration',
            component: () => import('@/views/copyright/Registration.vue'),
            meta: { title: '版权存证登记' }
          }
        ]
      },
      {
        path: 'certificate',
        name: 'Certificate',
        component: () => import('@/views/certificate/List.vue'),
        meta: { title: '证书管理', icon: 'Postcard' }
      },
      {
        path: 'risk',
        name: 'RiskScreen',
        component: () => import('@/views/risk/List.vue'),
        meta: { title: '风险筛查', icon: 'Warning' }
      },
      {
        path: 'archive',
        name: 'CopyrightArchive',
        component: () => import('@/views/archive/Search.vue'),
        meta: { title: '版权档案', icon: 'Files' }
      },
      {
        path: 'settings/password',
        name: 'PasswordSettings',
        component: () => import('@/views/settings/Password.vue'),
        meta: { title: '修改密码', icon: 'Lock' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  if (to.meta.requiresAuth === false) {
    next()
    return
  }

  if (!token) {
    next('/login')
    return
  }

  if (!userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
      next()
    } catch (error) {
      userStore.logout()
      next('/login')
    }
    return
  }

  next()
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 版权审核平台` : '版权审核平台'
})

export default router
