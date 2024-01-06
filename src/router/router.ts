import { CustomRequest } from '@/services/CustomRequest';
import { Token } from '@/utils/Token';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      components: {
        // header: ,
        content: () => import('@pages/LoginPage.vue')
      }
    },
    {
      path: '/register',
      name: 'RegisterPage',
      components: {
        // header: ,
        content: () => import('@pages/RegisterPage.vue')
      }
    },
    {
      path: '/analytics',
      name: 'AnalyticPage',
      components: {
        header: () => import('@components/AppHeader.vue'),
        content: () => import('@pages/AnalyticPage.vue')
      }
    }
  ]
})

router.beforeEach(async (to) => {
  try {
    const token = new Token();
    const request = new CustomRequest()

    if ((['/', '/login', '/register'].includes(to.path) && token.isLoggedIn)) {
      router.replace({
        name: 'AnalyticPage'
      })
    }

    if (['/', '/analytics'].includes(to.path)) {
      if (!token.isLoggedIn) {
        router.replace({
          name: 'LoginPage'
        })
      }
      await request.GET('/user/me')
    }
  } catch (error) {
    if (typeof error === 'object' && (error as CustomErrorType).statusCode === 401) {
      localStorage.removeItem('token')
      router.push({
        name: 'LoginPage'
      })
    }
  }
})

export default router
