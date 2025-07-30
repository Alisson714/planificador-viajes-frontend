import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import ActividadesView from './views/ActividadesView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/RegisterView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/DashboardView.vue')
  },
  // Rutas de gestión de rutas
  {
    path: '/planificador',
    name: 'Planificador',
    component: () => import('./views/PlanificadorView.vue')
  },
  {
    path: '/ruta/nueva',
    name: 'NuevaRuta',
    component: () => import('./views/PlanificadorView.vue')
  },
  {
    path: '/ruta/:id',
    name: 'DetalleRuta',
    component: () => import('./views/DetalleViajeView.vue')
  },
  {
    path: '/ruta/:id/editar',
    name: 'EditarRuta',
    component: () => import('./views/PlanificadorView.vue')
  },
  // Rutas de actividades (comentadas hasta crear las vistas)
  /*
  {
    path: '/actividades',
    name: 'Actividades',
    component: () => import('./views/ActividadesView.vue')
  },
  {
    path: '/actividad/nueva',
    name: 'NuevaActividad',
    component: () => import('./views/ActividadesView.vue')
  },
  {
    path: '/actividad/:id',
    name: 'DetalleActividad',
    component: () => import('./views/ActividadesView.vue')
  },
  */
  { path: '/actividades', component: ActividadesView },
  // Rutas de lugares (comentadas hasta crear las vistas)
  /*
  {
    path: '/lugares',
    name: 'Lugares',
    component: () => import('./views/LugaresView.vue')
  },
  {
    path: '/lugar/:id',
    name: 'DetalleLugar',
    component: () => import('./views/LugaresView.vue')
  },
  */
  // Rutas de notas (comentadas hasta crear las vistas)
  /*
  {
    path: '/notas',
    name: 'Notas',
    component: () => import('./views/NotasView.vue')
  },
  {
    path: '/nota/nueva',
    name: 'NuevaNota',
    component: () => import('./views/NotasView.vue')
  },
  {
    path: '/nota/:id',
    name: 'DetalleNota',
    component: () => import('./views/NotasView.vue')
  },
  */
  // Perfil de usuario
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('./views/PerfilView.vue')
  },
  // Rutas legacy (para compatibilidad)
  {
    path: '/planificador/:id',
    name: 'PlanificadorLegacy',
    component: () => import('./views/PlanificadorView.vue')
  },
  {
    path: '/viaje/:id',
    name: 'DetalleViajeLegacy',
    component: () => import('./views/DetalleViajeView.vue')
  },
  {
    path: '/mapa-test',
    name: 'MapaTest',
    component: () => import('./views/MapaTestView.vue')
  },
  {
    path: '/destino/:destino',
    name: 'detalle-viaje',
    component: () => import('./views/DetalleViajeView.vue')
  },
  {
    path: '/mapa-turistico',
    name: 'MapaTuristico',
    component: () => import('./views/MapaTuristicoView.vue')
  },
  // Página 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global para rutas privadas
router.beforeEach((to, from, next) => {
  const publicRouteNames = ['Login', 'Register', 'NotFound']
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if (!publicRouteNames.includes(to.name) && !isAuthenticated) {
    return next({ name: 'Login', query: { redirected: 'true' } })
  }
  next()
})

export default router 