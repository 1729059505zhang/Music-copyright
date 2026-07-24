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
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { title: '创作者注册', requiresAuth: false }
  },
  {
    path: '/join',
    name: 'Join',
    component: () => import('@/views/auth/Join.vue'),
    meta: { title: '入驻申请', requiresAuth: true }
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
        meta: { title: '工作台概览' }
      },
      {
        path: 'work',
        redirect: '/work/lyric',
        component: () => import('@/views/work/Layout.vue'),
        children: [
          {
            path: 'lyric',
            name: 'WorkLyricList',
            component: () => import('@/views/work/LyricList.vue'),
            meta: { title: '词曲作品' }
          },
          {
            path: 'lyric/create',
            name: 'WorkLyricCreate',
            component: () => import('@/views/work/LyricEdit.vue'),
            meta: { title: '上传词曲作品' }
          },
          {
            path: 'lyric/:id/edit',
            name: 'WorkLyricEdit',
            component: () => import('@/views/work/LyricEdit.vue'),
            meta: { title: '编辑词曲作品' }
          },
          {
            path: 'release',
            name: 'WorkReleaseList',
            component: () => import('@/views/work/ReleaseList.vue'),
            meta: { title: '发行作品' }
          },
          {
            path: 'release/create',
            name: 'WorkReleaseCreate',
            component: () => import('@/views/work/ReleaseEdit.vue'),
            meta: { title: '上传发行作品' }
          },
          {
            path: 'release/:id/edit',
            name: 'WorkReleaseEdit',
            component: () => import('@/views/work/ReleaseEdit.vue'),
            meta: { title: '编辑发行作品' }
          }
        ]
      },
      {
        path: 'orders',
        name: 'OrderList',
        component: () => import('@/views/order/List.vue'),
        meta: { title: '交易台账' }
      },
      {
        path: 'earnings',
        redirect: '/earnings/index',
        children: [
          {
            path: 'index',
            name: 'EarningsIndex',
            component: () => import('@/views/earnings/Index.vue'),
            meta: { title: '收益概览' }
          },
          {
            path: 'flow',
            name: 'EarningsFlow',
            component: () => import('@/views/earnings/Flow.vue'),
            meta: { title: '销售流水' }
          },
          {
            path: 'settlement',
            name: 'EarningsSettlement',
            component: () => import('@/views/earnings/Settlement.vue'),
            meta: { title: '分账明细' }
          },
          {
            path: 'withdraw',
            name: 'EarningsWithdraw',
            component: () => import('@/views/earnings/Withdraw.vue'),
            meta: { title: '提现申请' }
          },
          {
            path: 'account',
            name: 'EarningsAccount',
            component: () => import('@/views/earnings/Account.vue'),
            meta: { title: '收款账户' }
          }
        ]
      },
      {
        path: 'copyright',
        redirect: '/copyright/list',
        children: [
          {
            path: 'apply',
            name: 'CopyrightApply',
            component: () => import('@/views/copyright/Apply.vue'),
            meta: { title: '版权登记申请' }
          },
          {
            path: 'list',
            name: 'CopyrightList',
            component: () => import('@/views/copyright/List.vue'),
            meta: { title: '版权登记记录' }
          }
        ]
      },
      {
        path: 'settings',
        redirect: '/settings/profile',
        children: [
          {
            path: 'profile',
            name: 'SettingsProfile',
            component: () => import('@/views/settings/Profile.vue'),
            meta: { title: '基本资料' }
          },
          {
            path: 'sub-account',
            name: 'SettingsSubAccount',
            component: () => import('@/views/settings/SubAccount.vue'),
            meta: { title: '子账号管理' }
          },
          {
            path: 'password',
            name: 'SettingsPassword',
            component: () => import('@/views/settings/Password.vue'),
            meta: { title: '修改密码' }
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/auth/Login.vue'),
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
  document.title = to.meta.title ? `${to.meta.title} - 创作者工作台` : '创作者工作台'
})

export default router
