import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/components/Layout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/Home.vue'), meta: { title: '首页' } },
      { path: 'service/copyright-trade', name: 'ServiceTrade', component: () => import('@/views/ServiceTrade.vue'), meta: { title: '词曲授权交易' } },
      { path: 'service/release', name: 'ServiceRelease', component: () => import('@/views/ServiceRelease.vue'), meta: { title: '音乐发行服务' } },
      { path: 'service/registration', name: 'ServiceRegistration', component: () => import('@/views/ServiceRegistration.vue'), meta: { title: '版权登记服务' } },
      { path: 'license', name: 'License', component: () => import('@/views/License.vue'), meta: { title: '授权方案' } },
      { path: 'agency', name: 'Agency', component: () => import('@/views/Agency.vue'), meta: { title: '机构入驻' } },
      { path: 'help', name: 'Help', component: () => import('@/views/Help.vue'), meta: { title: '帮助中心' } },
      { path: 'about', name: 'About', component: () => import('@/views/About.vue'), meta: { title: '关于我们' } },
      { path: 'agreement', name: 'Agreement', component: () => import('@/views/Agreement.vue'), meta: { title: '用户协议' } },
      { path: 'privacy', name: 'Privacy', component: () => import('@/views/Privacy.vue'), meta: { title: '隐私政策' } },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - MusicCopyright` : 'MusicCopyright 音乐版权SaaS平台'
})

export default router
