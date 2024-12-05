import { localStorageService } from '@/services/localStorage.service'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      component: () => import('@/views/Layout/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: 'home',
          name: 'admin-home',
          component: () => import('@/views/Admin/Home.vue'),
          meta: {
            title: 'Inicio'
          }
        },
        {
          path: 'statistics',
          name: 'admin-statistics',
          component: () => import('@/views/Admin/Statistics.vue'),
          meta: {
            title: 'Estadísticas'
          }
        },
        {
          path: 'appointments',
          name: 'admin-appointment',
          component: () => import('@/views/Admin/Appointments/Appointments.vue'),
          meta: {
            title: 'Solicitudes de Citas'
          }
        },
        {
          path: 'calendar',
          name: 'admin-calendar',
          component: () => import('@/views/Admin/Calendar.vue'),
          meta: {
            title: 'Calendario'
          }
        },
        {
          path: 'pets',
          name: 'admin-pets',
          component: () => import('@/views/Admin/Pets.vue'),
          meta: {
            title: 'Mascotas'
          }
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/Admin/Users.vue'),
          meta: {
            title: 'Usuarios'
          }
        },
        {
          path: 'cages',
          name: 'admin-cages',
          component: () => import('@/views/Admin/Cages.vue'),
          meta: {
            title: 'Jaulas'
          }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta && to.meta.title ? (to.meta.title as string) + ' - VetCare' : 'Inicio'
  // const publicPages = ['/login', '/'] // Rutas públicas
  const authRequired = to.matched.some((record) => record.meta.requiresAuth)
  const adminRequired = to.matched.some((record) => record.meta.requiresAdmin)
  const loggedIn = !!localStorageService.token
  const userData = localStorageService.user

  console.log(localStorageService.token)

  console.log(authRequired, !loggedIn)
  if (authRequired && !loggedIn) {
    console.log('Usuario no autenticado')
    return next({ name: 'login' })
  }

  console.log(adminRequired, userData?.user.role_id)
  if (adminRequired && userData?.user.role_id !== 1) {
    console.log('Usuario no autorizado')
    return next({ name: 'login' })
  }

  next()
})

// router.beforeEach((to, from, next) => {
//   window.document.title = to.meta && to.meta.title ? (to.meta.title as string) + ' - VetCare' : 'Inicio'
//   const publicPages = ['/']

//   const authRequired = !publicPages.includes(to.path)
//   const loggedIn = Boolean(localStorageService.token)
// })

export default router
