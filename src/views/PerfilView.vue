<template>
  <div class="perfil-container">
    <!-- Header del Perfil -->
    <header class="perfil-header">
      <div class="header-content">
        <div class="perfil-avatar-section">
          <div class="avatar-container">
            <img :src="getAvatarUrl(usuario.avatar)" alt="Avatar" class="avatar" />
            <button @click="triggerFileInput" class="avatar-edit">📷</button>
            <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onAvatarChange" />
          </div>
          <div class="perfil-info">
            <h1>{{ usuario.name }}</h1>
            <p>{{ usuario.email }}</p>
            <span class="member-since">Miembro desde {{ formatDate(usuario.createdAt) }}</span>
          </div>
        </div>
        <div class="perfil-stats">
          <div class="stat-item">
            <span class="stat-number">{{ stats.totalTrips }}</span>
            <span class="stat-label">Viajes</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats.completedTrips }}</span>
            <span class="stat-label">Completados</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats.totalDays }}</span>
            <span class="stat-label">Días</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <div class="perfil-content">
      <!-- Columna Izquierda -->
      <div class="content-left">
        <!-- Información Personal -->
        <section class="section-card">
          <div class="section-header">
            <h2>Información Personal</h2>
            <button @click="editarInfo" class="btn-secondary">✏️ Editar</button>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>Nombre completo</label>
              <span>{{ usuario.name }}</span>
            </div>
            <div class="info-item">
              <label>Email</label>
              <span>{{ usuario.email }}</span>
            </div>
            <div class="info-item">
              <label>Teléfono</label>
              <span>{{ usuario.phone || 'No especificado' }}</span>
            </div>
            <div class="info-item">
              <label>Fecha de nacimiento</label>
              <span>{{ usuario.birthDate ? formatDate(usuario.birthDate) : 'No especificada' }}</span>
            </div>
            <div class="info-item">
              <label>País</label>
              <span>{{ usuario.country || 'No especificado' }}</span>
            </div>
            <div class="info-item">
              <label>Ciudad</label>
              <span>{{ usuario.city || 'No especificada' }}</span>
            </div>
          </div>
        </section>

        <!-- Preferencias de Viaje -->
        <section class="section-card">
          <div class="section-header">
            <h2>Preferencias de Viaje</h2>
            <button @click="editarPreferencias" class="btn-secondary">✏️ Editar</button>
          </div>
          <div class="preferences-grid">
            <div class="preference-item">
              <label>Regiones favoritas</label>
              <div class="tags">
                <span v-for="region in usuario.value?.preferences?.regions || []" :key="region" class="tag">
                  {{ getRegionText(region) }}
                </span>
              </div>
            </div>
            <div class="preference-item">
              <label>Tipo de viaje</label>
              <div class="tags">
                <span v-for="type in usuario.value?.preferences?.travelTypes || []" :key="type" class="tag">
                  {{ getTravelTypeText(type) }}
                </span>
              </div>
            </div>
            <div class="preference-item">
              <label>Presupuesto promedio</label>
              <span class="budget-range">
                ${{ usuario.value?.preferences?.budgetRange?.min ?? 'N/A' }} - ${{ usuario.value?.preferences?.budgetRange?.max ?? 'N/A' }}
              </span>
            </div>
            <div class="preference-item">
              <label>Duración preferida</label>
              <span>{{ usuario.value?.preferences?.duration ?? 'N/A' }} días</span>
            </div>
          </div>
        </section>

        <!-- Actividad Reciente -->
        <section class="section-card">
          <div class="section-header">
            <h2>Actividad Reciente</h2>
            <router-link to="/dashboard" class="btn-secondary">Ver Todo</router-link>
          </div>
          <div class="activity-timeline">
            <div v-for="actividad in actividadReciente" :key="actividad.id" class="timeline-item">
              <div class="timeline-icon" :class="actividad.type">
                {{ getActivityIcon(actividad.type) }}
              </div>
              <div class="timeline-content">
                <h4>{{ actividad.title }}</h4>
                <p>{{ actividad.description }}</p>
                <span class="timeline-date">{{ formatDate(actividad.date) }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Columna Derecha -->
      <div class="content-right">
        <!-- Destinos Favoritos -->
        <section class="section-card">
          <div class="section-header">
            <h2>Destinos Favoritos</h2>
            <button @click="agregarFavorito" class="btn-primary">+ Agregar</button>
          </div>
          <div class="favorites-list">
            <div v-for="destino in destinosFavoritos" :key="destino.id" class="favorite-item">
              <img :src="destino.imageUrl" :alt="destino.name" class="favorite-image" />
              <div class="favorite-info">
                <h4>{{ destino.name }}</h4>
                <p>{{ destino.city }}, {{ destino.province }}</p>
                <div class="favorite-meta">
                  <span class="favorite-rating">⭐ {{ destino.rating }}</span>
                  <span class="favorite-visits">{{ destino.visits }} visitas</span>
                </div>
              </div>
              <button @click="eliminarFavorito(destino.id)" class="btn-remove">×</button>
            </div>
          </div>
        </section>

        <!-- Logros -->
        <section class="section-card">
          <div class="section-header">
            <h2>Logros</h2>
          </div>
          <div class="achievements-grid">
            <div v-for="logro in logros" :key="logro.id" class="achievement-item" :class="{ unlocked: logro.unlocked }">
              <div class="achievement-icon">{{ logro.icon }}</div>
              <div class="achievement-info">
                <h4>{{ logro.name }}</h4>
                <p>{{ logro.description }}</p>
                <div class="achievement-progress" v-if="!logro.unlocked">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: logro.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ logro.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Configuración de Cuenta -->
        <section class="section-card">
          <div class="section-header">
            <h2>Configuración</h2>
          </div>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <h4>Notificaciones por email</h4>
                <p>Recibe actualizaciones sobre tus viajes</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="configuracion.emailNotifications" />
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Notificaciones push</h4>
                <p>Recibe alertas en tiempo real</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="configuracion.pushNotifications" />
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Modo oscuro</h4>
                <p>Cambiar el tema de la aplicación</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="configuracion.darkMode" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- Acciones de Cuenta -->
        <section class="section-card">
          <div class="section-header">
            <h2>Acciones de Cuenta</h2>
          </div>
          <div class="account-actions">
            <button @click="cambiarPassword" class="btn-action">
              🔒 Cambiar contraseña
            </button>
            <button @click="exportarDatos" class="btn-action">
              📤 Exportar mis datos
            </button>
            <button @click="eliminarCuenta" class="btn-action danger">
              🗑️ Eliminar cuenta
            </button>
          </div>
        </section>
      </div>
    </div>

    <!-- Modales -->
    <!-- Modal de Edición de Información -->
    <div v-if="mostrarModalInfo" class="modal-overlay" @click="cerrarModalInfo">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Editar Información Personal</h2>
          <button @click="cerrarModalInfo" class="btn-close">×</button>
        </div>
        <form @submit.prevent="guardarInfo" class="edit-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Nombre completo *</label>
              <input id="name" v-model="formularioInfo.name" type="text" required />
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input id="email" v-model="formularioInfo.email" type="email" required />
            </div>
            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input id="phone" v-model="formularioInfo.phone" type="tel" />
            </div>
            <div class="form-group">
              <label for="birthDate">Fecha de nacimiento</label>
              <input id="birthDate" v-model="formularioInfo.birthDate" type="date" />
            </div>
            <div class="form-group">
              <label for="country">País</label>
              <input id="country" v-model="formularioInfo.country" type="text" />
            </div>
            <div class="form-group">
              <label for="city">Ciudad</label>
              <input id="city" v-model="formularioInfo.city" type="text" />
            </div>
          </div>
          <div class="form-actions">
            <button type="button" @click="cerrarModalInfo" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

// Estado del componente
const mostrarModalInfo = ref(false)

// Datos del usuario (ahora dinámico)
const usuario = user

// Estadísticas
const stats = ref({
  totalTrips: 12,
  completedTrips: 8,
  totalDays: 45
})

// Actividad reciente
const actividadReciente = ref([
  {
    id: 1,
    type: 'ruta',
    title: 'Creaste una nueva ruta',
    description: 'Aventura en Galápagos',
    date: '2024-03-15'
  },
  {
    id: 2,
    type: 'actividad',
    title: 'Agregaste una actividad',
    description: 'Snorkeling en Los Túneles',
    date: '2024-03-14'
  },
  {
    id: 3,
    type: 'lugar',
    title: 'Visitaste un lugar',
    description: 'Centro Histórico de Quito',
    date: '2024-03-10'
  }
])

// Destinos favoritos
const destinosFavoritos = ref([
  {
    id: 1,
    name: 'Islas Galápagos',
    city: 'Puerto Ayora',
    province: 'Galápagos',
    rating: 4.9,
    visits: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 2,
    name: 'Baños de Agua Santa',
    city: 'Baños',
    province: 'Tungurahua',
    rating: 4.8,
    visits: 2,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
])

// Logros
const logros = ref([
  {
    id: 1,
    name: 'Primer Viaje',
    description: 'Completa tu primer viaje',
    icon: '🎒',
    unlocked: true
  },
  {
    id: 2,
    name: 'Explorador',
    description: 'Visita 5 destinos diferentes',
    icon: '🗺️',
    unlocked: true
  },
  {
    id: 3,
    name: 'Aventurero',
    description: 'Completa 10 viajes',
    icon: '🏔️',
    unlocked: false,
    progress: 80
  },
  {
    id: 4,
    name: 'Viajero Experto',
    description: 'Visita todas las regiones de Ecuador',
    icon: '🏆',
    unlocked: false,
    progress: 50
  }
])

// Configuración
const configuracion = ref({
  emailNotifications: true,
  pushNotifications: false,
  darkMode: false
})

// Formulario de edición
const formularioInfo = ref({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  country: '',
  city: ''
})

const fileInput = ref(null)

function triggerFileInput() {
  fileInput.value && fileInput.value.click()
}

async function onAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('avatar', file)
  try {
    const userId = usuario.value.id || usuario.value._id
    await axios.put(
      `http://localhost:3000/users/${userId}/avatar`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    // Ahora vuelve a pedir el usuario actualizado
    const response = await axios.get(`http://localhost:3000/users/${userId}`)
    usuario.value = response.data
    authStore.user = response.data
    localStorage.setItem('user', JSON.stringify(response.data))
  } catch (err) {
    alert('Error al subir la imagen de perfil')
  }
}

// Funciones
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  })
}

function getRegionText(region) {
  const regionMap = {
    sierra: 'Sierra',
    costa: 'Costa',
    amazonia: 'Amazonía',
    galapagos: 'Galápagos'
  }
  return regionMap[region] || region
}

function getTravelTypeText(type) {
  const typeMap = {
    aventura: 'Aventura',
    cultura: 'Cultura',
    naturaleza: 'Naturaleza',
    relax: 'Relax',
    gastronomia: 'Gastronomía'
  }
  return typeMap[type] || type
}

function getActivityIcon(type) {
  const iconMap = {
    ruta: '🗺️',
    actividad: '🎯',
    lugar: '📍',
    nota: '📝'
  }
  return iconMap[type] || '📋'
}

function getAvatarUrl(avatar) {
  if (!avatar) return 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'
  if (avatar.startsWith('http')) return avatar
  return 'http://localhost:3000' + avatar
}

// Acciones del perfil
function cambiarAvatar() {
  // Implementar cambio de avatar
  console.log('Cambiar avatar')
}

function editarInfo() {
  formularioInfo.value = { ...usuario.value }
  mostrarModalInfo.value = true
}

function guardarInfo() {
  usuario.value = { ...usuario.value, ...formularioInfo.value }
  cerrarModalInfo()
}

function cerrarModalInfo() {
  mostrarModalInfo.value = false
}

function editarPreferencias() {
  // Implementar edición de preferencias
  console.log('Editar preferencias')
}

function agregarFavorito() {
  // Implementar agregar favorito
  console.log('Agregar favorito')
}

function eliminarFavorito(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este destino de favoritos?')) {
    destinosFavoritos.value = destinosFavoritos.value.filter(d => d.id !== id)
  }
}

function cambiarPassword() {
  // Implementar cambio de contraseña
  console.log('Cambiar contraseña')
}

function exportarDatos() {
  // Implementar exportación de datos
  console.log('Exportar datos')
}

function eliminarCuenta() {
  if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
    // Implementar eliminación de cuenta
    console.log('Eliminar cuenta')
  }
}

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login')
  }
  // Si necesitas cargar datos adicionales del usuario, hazlo aquí
})
</script>

<style scoped>
.perfil-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6d36522 0%, #43e97b22 100%);
  padding: 2rem;
}

/* Header del Perfil */
.perfil-header {
  background: white;
  border-radius: 18px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.perfil-avatar-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-primario);
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--color-primario);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.avatar-edit:hover {
  background: var(--color-acento);
  transform: scale(1.1);
}

.perfil-info h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-primario);
}

.perfil-info p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.member-since {
  font-size: 0.9rem;
  color: #999;
}

.perfil-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primario);
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

/* Contenido Principal */
.perfil-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.content-left, .content-right {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Tarjetas de Sección */
.section-card {
  background: white;
  border-radius: 18px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: var(--color-primario);
}

/* Información Personal */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: bold;
  color: var(--color-texto);
  font-size: 0.9rem;
}

.info-item span {
  color: #666;
  font-size: 1rem;
}

/* Preferencias */
.preferences-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preference-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preference-item label {
  font-weight: bold;
  color: var(--color-texto);
  font-size: 0.9rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--color-primario);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.budget-range {
  color: var(--color-acento);
  font-weight: bold;
}

/* Actividad Reciente */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.2s;
}

.timeline-item:hover {
  background: rgba(67, 233, 123, 0.05);
}

.timeline-icon {
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: var(--color-primario);
  color: white;
  height: fit-content;
}

.timeline-content h4 {
  font-size: 1rem;
  margin-bottom: 0.3rem;
  color: var(--color-texto);
}

.timeline-content p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.timeline-date {
  font-size: 0.8rem;
  color: #999;
}

/* Destinos Favoritos */
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.favorite-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  transition: all 0.2s;
  position: relative;
}

.favorite-item:hover {
  border-color: var(--color-primario);
  background: rgba(67, 233, 123, 0.05);
}

.favorite-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.favorite-info {
  flex: 1;
}

.favorite-info h4 {
  font-size: 1rem;
  margin-bottom: 0.2rem;
  color: var(--color-texto);
}

.favorite-info p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.favorite-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.favorite-rating {
  color: var(--color-acento);
  font-weight: bold;
}

.favorite-visits {
  color: var(--color-azul);
}

.btn-remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #c0392b;
  transform: scale(1.1);
}

/* Logros */
.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.achievement-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  opacity: 0.6;
  transition: all 0.2s;
}

.achievement-item.unlocked {
  opacity: 1;
  background: rgba(67, 233, 123, 0.05);
  border: 2px solid var(--color-primario);
}

.achievement-icon {
  font-size: 2rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: var(--color-primario);
  color: white;
  height: fit-content;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  font-size: 1rem;
  margin-bottom: 0.3rem;
  color: var(--color-texto);
}

.achievement-info p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primario);
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.8rem;
  color: #666;
  font-weight: bold;
}

/* Configuración */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.2s;
}

.setting-item:hover {
  background: rgba(67, 233, 123, 0.05);
}

.setting-info h4 {
  font-size: 1rem;
  margin-bottom: 0.2rem;
  color: var(--color-texto);
}

.setting-info p {
  color: #666;
  font-size: 0.9rem;
}

/* Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-primario);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Acciones de Cuenta */
.account-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: #f8f9fa;
  color: var(--color-texto);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-action:hover {
  background: rgba(67, 233, 123, 0.1);
  transform: translateX(5px);
}

.btn-action.danger {
  color: #e74c3c;
}

.btn-action.danger:hover {
  background: rgba(231, 76, 60, 0.1);
}

/* Botones */
.btn-primary, .btn-secondary {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--color-primario);
  color: white;
}

.btn-primary:hover {
  background: var(--color-acento);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--color-azul);
  color: white;
}

.btn-secondary:hover {
  background: var(--color-acento2);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 18px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  color: var(--color-primario);
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.btn-close:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

/* Formulario */
.edit-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--color-texto);
}

.form-group input {
  padding: 0.8rem;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primario);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 1024px) {
  .perfil-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .perfil-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .perfil-avatar-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .perfil-stats {
    justify-content: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style> 