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
    meta: { title: '企业注册', requiresAuth: false }
  },
  {
    path: '/certify',
    name: 'Certify',
    component: () => import('@/views/auth/Certify.vue'),
    meta: { title: '企业资质认证', requiresAuth: true }
  },
  {
    path: '/',
    component: () => import('@/views/layout/MainLayout.vue'),
    redirect: '/market',
    meta: { requiresAuth: false },
    children: [
      {
        path: 'market',
        name: 'MarketList',
        component: () => import('@/views/market/List.vue'),
        meta: { title: '词曲交易集市' }
      },
      {
        path: 'market/:id',
        name: 'MarketDetail',
        component: () => import('@/views/market/Detail.vue'),
        meta: { title: '作品详情' }
      }
    ]
  },
  {
    path: '/user',
    component: () => import('@/views/user/Layout.vue'),
    redirect: '/user/orders',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'orders',
        name: 'UserOrders',
        component: () => import('@/views/user/Orders.vue'),
        meta: { title: '我的订单' }
      },
      {
        path: 'purchased',
        name: 'UserPurchased',
        component: () => import('@/views/user/Purchased.vue'),
        meta: { title: '已采购词曲' }
      },
      {
        path: 'certificates',
        name: 'UserCertificates',
        component: () => import('@/views/user/Certificates.vue'),
        meta: { title: '授权凭证' }
      },
      {
        path: 'favorites',
        name: 'UserFavorites',
        component: () => import('@/views/user/Favorites.vue'),
        meta: { title: '我的收藏' }
      },
      {
        path: 'inquiries',
        name: 'UserInquiries',
        component: () => import('@/views/user/Inquiries.vue'),
        meta: { title: '询价记录' }
      },
      {
        path: 'balance',
        name: 'UserBalance',
        component: () => import('@/views/user/Balance.vue'),
        meta: { title: '账户余额' }
      },
      {
        path: 'invoices',
        name: 'UserInvoices',
        component: () => import('@/views/user/Invoices.vue'),
        meta: { title: '发票申请' }
      },
      {
        path: 'messages',
        name: 'UserMessages',
        component: () => import('@/views/user/Messages.vue'),
        meta: { title: '消息通知' }
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { title: '企业信息' }
      },
      {
        path: 'password',
        name: 'UserPassword',
        component: () => import('@/views/user/Password.vue'),
        meta: { title: '修改密码' }
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
  document.title = to.meta.title ? `${to.meta.title} - 音乐版权采购平台` : '音乐版权采购平台'
})

export default router
