import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UserView from '../views/UserView.vue'
import AdminView from '../views/AdminView.vue'
import TransactionHistoryView from '../views/TransactionHistoryView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      alias: '/login',
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
    },
    {
      path: '/user',
      name: 'user-dashboard',
      component: UserView,
      meta: { requiresRole: 'user' }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminView,
      meta: { requiresRole: 'admin' }
    },
    {
      path: '/admin/transactions',
      name: 'admin-transactions',
      component: TransactionHistoryView,
      meta: { requiresRole: 'admin' }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('user-role')

  if (to.meta.requiresRole) {
    if (!userRole) {
      next('/login')
    } else if (to.meta.requiresRole !== userRole) {
      next(userRole === 'admin' ? '/admin' : '/user')
    } else {
      next()
    }
  } else {
    if ((to.path === '/' || to.path === '/login' || to.path === '/forgot-password') && userRole) {
      next(userRole === 'admin' ? '/admin' : '/user')
    } else {
      next()
    }
  }
})

export default router
