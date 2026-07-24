import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/components/Layout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '运营仪表盘', icon: 'DataLine' }
      },
      {
        path: 'user',
        name: 'UserManage',
        redirect: '/user/list',
        meta: { title: '用户管理', icon: 'User' },
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: () => import('@/views/user/list.vue'),
            meta: { title: '用户列表' }
          },
          {
            path: 'creator',
            name: 'CreatorList',
            component: () => import('@/views/user/creator.vue'),
            meta: { title: '创作者审核' }
          }
        ]
      },
      {
        path: 'work',
        name: 'WorkManage',
        redirect: '/work/list',
        meta: { title: '作品管理', icon: 'Document' },
        children: [
          {
            path: 'list',
            name: 'WorkList',
            component: () => import('@/views/work/list.vue'),
            meta: { title: '词曲作品' }
          },
          {
            path: 'category',
            name: 'CategoryManage',
            component: () => import('@/views/work/category.vue'),
            meta: { title: '曲风分类' }
          }
        ]
      },
      {
        path: 'order',
        name: 'OrderManage',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '交易订单', icon: 'ShoppingCart' }
      },
      {
        path: 'copyright',
        name: 'CopyrightManage',
        redirect: '/copyright/apply',
        meta: { title: '版权审核', icon: 'CircleCheck' },
        children: [
          {
            path: 'apply',
            name: 'CopyrightApply',
            component: () => import('@/views/copyright/apply.vue'),
            meta: { title: '登记申请审核' }
          },
          {
            path: 'certificate',
            name: 'CopyrightCertificate',
            component: () => import('@/views/copyright/certificate.vue'),
            meta: { title: '版权证书管理' }
          },
          {
            path: 'work-audit',
            name: 'WorkAudit',
            component: () => import('@/views/copyright/work-audit.vue'),
            meta: { title: '作品内容审核' }
          }
        ]
      },
      {
        path: 'finance',
        name: 'FinanceManage',
        redirect: '/finance/withdrawal',
        meta: { title: '财务管理', icon: 'Money' },
        children: [
          {
            path: 'withdrawal',
            name: 'WithdrawalManage',
            component: () => import('@/views/finance/withdrawal.vue'),
            meta: { title: '提现审核' }
          },
          {
            path: 'settlement',
            name: 'SettlementRecord',
            component: () => import('@/views/finance/settlement.vue'),
            meta: { title: '分账记录' }
          },
          {
            path: 'flow',
            name: 'FinancialFlow',
            component: () => import('@/views/finance/flow.vue'),
            meta: { title: '资金流水' }
          }
        ]
      },
      {
        path: 'tenant',
        name: 'TenantManage',
        component: () => import('@/views/tenant/index.vue'),
        meta: { title: 'SaaS租户', icon: 'OfficeBuilding' }
      },
      {
        path: 'system',
        name: 'SystemManage',
        redirect: '/system/admin',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
          {
            path: 'admin',
            name: 'AdminManage',
            component: () => import('@/views/system/admin.vue'),
            meta: { title: '管理员管理' }
          },
          {
            path: 'role',
            name: 'RoleManage',
            component: () => import('@/views/system/role.vue'),
            meta: { title: '角色权限' }
          },
          {
            path: 'config',
            name: 'SystemConfig',
            component: () => import('@/views/system/config.vue'),
            meta: { title: '系统配置' }
          },
          {
            path: 'third-api',
            name: 'ThirdApi',
            component: () => import('@/views/system/third-api.vue'),
            meta: { title: '第三方API' }
          },
          {
            path: 'logs',
            name: 'OperationLogs',
            component: () => import('@/views/system/logs.vue'),
            meta: { title: '操作日志' }
          }
        ]
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
      await userStore.fetchMenus()
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
  document.title = to.meta.title ? `${to.meta.title} - 音乐版权SaaS` : '音乐版权SaaS管理后台'
})

export default router
