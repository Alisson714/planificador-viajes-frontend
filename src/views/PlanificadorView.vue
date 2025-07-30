<template>
  <div class="planificador-container">
    <!-- Header -->
    <header class="planificador-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Gestionar Rutas de Viaje</h1>
          <p>Planifica y organiza tus aventuras por Ecuador</p>
        </div>
        <button class="btn-primary" @click="abrirModal">
          <span>+</span> Nueva Ruta
        </button>
      </div>
    </header>

    <!-- Filtros y Búsqueda -->
    <section class="filters-section">
      <div class="filters-content">
        <div class="search-box">
          <input 
            v-model="filtros.busqueda" 
            type="text" 
            placeholder="Buscar rutas..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        <div class="filter-options">
          <select v-model="filtros.estado" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="planning">Planificando</option>
            <option value="active">Activa</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
          <select v-model="filtros.region" class="filter-select">
            <option value="">Todas las regiones</option>
            <option value="sierra">Sierra</option>
            <option value="costa">Costa</option>
            <option value="amazonia">Amazonía</option>
            <option value="galapagos">Galápagos</option>
          </select>
          <button @click="limpiarFiltros" class="btn-clear">Limpiar</button>
        </div>
      </div>
    </section>

    <!-- Lista de Rutas -->
    <section class="routes-section">
      <div class="routes-grid">
        <div 
          v-for="ruta in rutasFiltradas" 
          :key="ruta.id" 
          class="route-card"
          :class="ruta.status"
        >
          <div class="route-header">
            <div class="route-title">
              <h3>{{ ruta.name }}</h3>
              <span class="route-status" :class="ruta.status">
                {{ getStatusText(ruta.status) }}
              </span>
            </div>
            <div class="route-actions">
              <button @click="editarRuta(ruta)" class="btn-icon">✏️</button>
              <button @click="duplicarRuta(ruta)" class="btn-icon">📋</button>
              <button @click="eliminarRuta(ruta.id)" class="btn-icon delete">🗑️</button>
            </div>
          </div>
          
          <div class="route-content">
            <p class="route-description">{{ ruta.description }}</p>
            
            <div class="route-details">
              <div class="detail-item">
                <span class="detail-icon">📅</span>
                <span>{{ formatDate(ruta.startDate) }} - {{ formatDate(ruta.endDate) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">📍</span>
                <span>{{ ruta.region }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">👥</span>
                <span>{{ ruta.participants }} personas</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">💰</span>
                <span>${{ ruta.budget }}</span>
              </div>
            </div>

            <div class="route-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: ruta.progress + '%' }"
                  :class="ruta.status"
                ></div>
              </div>
              <span class="progress-text">{{ ruta.progress }}% completado</span>
            </div>
          </div>

          <div class="route-footer">
            <router-link :to="`/ruta/${ruta.id}`" class="btn-view">
              Ver Detalles
            </router-link>
            <div class="route-stats">
              <span class="stat">🎯 {{ ruta.activitiesCount }} actividades</span>
              <span class="stat">📝 {{ ruta.notesCount }} notas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="rutasFiltradas.length === 0" class="empty-state">
        <div class="empty-icon">🗺️</div>
        <h3>No hay rutas encontradas</h3>
        <p>{{ filtros.busqueda || filtros.estado || filtros.region ? 'Intenta ajustar los filtros' : 'Crea tu primera ruta de viaje' }}</p>
        <button v-if="!filtros.busqueda && !filtros.estado && !filtros.region" @click="abrirModal" class="btn-primary">
          Crear Primera Ruta
        </button>
      </div>
    </section>

    <!-- Modal de Formulario -->
    <div v-if="mostrarFormulario" class="modal-overlay" @mousedown.self="cerrarModal">
      <div class="modal-content" @mousedown.stop>
        <div class="modal-header">
          <h2>{{ rutaEditando ? 'Editar Ruta' : 'Nueva Ruta' }}</h2>
          <button @click="cerrarModal" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-col mapa-col">
            <MapaSelectorDestino v-if="mostrarFormulario" :key="mapaKey" :visible="mostrarFormulario" @seleccion="onSeleccionDestino" />
            <div v-if="destinoSeleccionado">
              <p><b>Destino seleccionado:</b> {{ destinoSeleccionado.nombre }} ({{ destinoSeleccionado.ciudad }}, {{ destinoSeleccionado.provincia }})</p>
            </div>
          </div>
          <div class="modal-col form-col">
            <form @submit.prevent="guardarRuta" class="route-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="name">Nombre de la Ruta *</label>
                  <input id="name" v-model="formulario.name" required placeholder="Nombre de la ruta" />
                </div>
                <div class="form-group">
                  <label for="description">Descripción</label>
                  <textarea id="description" v-model="formulario.description" placeholder="Describe tu ruta de viaje..."></textarea>
                </div>
                <div class="form-group">
                  <label for="startDate">Fecha de Inicio *</label>
                  <input id="startDate" v-model="formulario.startDate" type="date" required />
                </div>
                <div class="form-group">
                  <label for="endDate">Fecha de Fin *</label>
                  <input id="endDate" v-model="formulario.endDate" type="date" required />
                </div>
                <div class="form-group">
                  <label for="region">Región *</label>
                  <select id="region" v-model="formulario.region" required>
                    <option value="">Selecciona una región</option>
                    <option value="sierra">Sierra</option>
                    <option value="costa">Costa</option>
                    <option value="amazonia">Amazonía</option>
                    <option value="galapagos">Galápagos</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="participants">Número de Participantes</label>
                  <input id="participants" v-model="formulario.participants" type="number" min="1" placeholder="1" />
                </div>
                <div class="form-group">
                  <label for="budget">Presupuesto Estimado ($)</label>
                  <input id="budget" v-model="formulario.budget" type="number" min="0" placeholder="0" />
                </div>
                <div class="form-group">
                  <label for="status">Estado</label>
                  <select id="status" v-model="formulario.status">
                    <option value="planning">Planificando</option>
                    <option value="active">Activa</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>
              <div class="form-actions">
                <button type="button" @click="cerrarModal" class="btn-secondary">Cancelar</button>
                <button type="submit" class="btn-primary">{{ rutaEditando ? 'Actualizar' : 'Crear' }} Ruta</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRoutes, createRoute, updateRoute, deleteRoute } from '../services/routesService'
import MapaSelectorDestino from '../components/MapaSelectorDestino.vue'

const router = useRouter()

// Estado del componente
const mostrarFormulario = ref(false)
const rutaEditando = ref(null)
const rutas = ref([])
const destinoSeleccionado = ref(null)
const mapaKey = ref(0)

function abrirModal() {
  mostrarFormulario.value = true
  mapaKey.value++
}

function onSeleccionDestino(lugar) {
  destinoSeleccionado.value = lugar
  formulario.value.name = lugar.nombre
  formulario.value.region = lugar.provincia
}

// Filtros
const filtros = ref({
  busqueda: '',
  estado: '',
  region: ''
})

// Formulario
const formulario = ref({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  region: '',
  participants: 1,
  budget: 0,
  status: 'planning'
})

// Computed
const rutasFiltradas = computed(() => {
  return rutas.value.filter(ruta => {
    const cumpleBusqueda = !filtros.value.busqueda || 
      ruta.name.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      ruta.description.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    
    const cumpleEstado = !filtros.value.estado || ruta.status === filtros.value.estado
    const cumpleRegion = !filtros.value.region || ruta.region === filtros.value.region
    
    return cumpleBusqueda && cumpleEstado && cumpleRegion
  })
})

// Funciones
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short'
  })
}

function getStatusText(status) {
  const statusMap = {
    planning: 'Planificando',
    active: 'Activa',
    completed: 'Completada',
    cancelled: 'Cancelada'
  }
  return statusMap[status] || status
}

function limpiarFiltros() {
  filtros.value.busqueda = ''
  filtros.value.estado = ''
  filtros.value.region = ''
}

function editarRuta(ruta) {
  rutaEditando.value = ruta
  formulario.value = { ...ruta }
  mostrarFormulario.value = true
}

function duplicarRuta(ruta) {
  const nuevaRuta = {
    ...ruta,
    id: Date.now(),
    name: `${ruta.name} (Copia)`,
    status: 'planning',
    progress: 0
  }
  rutas.value.unshift(nuevaRuta)
}

async function eliminarRuta(id) {
  if (confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
    await deleteRoute(id)
    rutas.value = rutas.value.filter(r => r.id !== id)
  }
}

async function guardarRuta() {
  if (rutaEditando.value) {
    // Actualizar ruta existente
    const updated = await updateRoute(rutaEditando.value.id, formulario.value)
    const index = rutas.value.findIndex(r => r.id === rutaEditando.value.id)
    if (index !== -1) {
      rutas.value[index] = updated
    }
  } else {
    // Crear nueva ruta
    const nuevaRuta = await createRoute(formulario.value)
    rutas.value.unshift(nuevaRuta)
  }
  
  cerrarModal()
}

function cerrarModal() {
  mostrarFormulario.value = false
  rutaEditando.value = null
  formulario.value = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    region: '',
    participants: 1,
    budget: 0,
    status: 'planning'
  }
  destinoSeleccionado.value = null
}

onMounted(async () => {
  rutas.value = await getRoutes()
})
</script>

<style scoped>
.planificador-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6d36522 0%, #43e97b22 100%);
  padding: 2rem;
}

/* Header */
.planificador-header {
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
}

.header-title h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--color-primario);
}

.header-title p {
  color: #666;
  font-size: 1.1rem;
}

/* Filtros */
.filters-section {
  background: white;
  border-radius: 18px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
}

.filters-content {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primario);
}

.search-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.filter-options {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.8rem 1rem;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primario);
}

/* Rutas Grid */
.routes-section {
  margin-bottom: 2rem;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.route-card {
  background: white;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.route-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(67, 233, 123, 0.15);
}

.route-card.active {
  border-color: var(--color-primario);
}

.route-card.planning {
  border-color: var(--color-acento);
}

.route-card.completed {
  border-color: var(--color-azul);
}

.route-card.cancelled {
  border-color: #e74c3c;
  opacity: 0.7;
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.route-title h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: var(--color-texto);
}

.route-status {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.route-card.active .route-status {
  background: var(--color-primario);
  color: white;
}

.route-card.planning .route-status {
  background: var(--color-acento);
  color: white;
}

.route-card.completed .route-status {
  background: var(--color-azul);
  color: white;
}

.route-card.cancelled .route-status {
  background: #e74c3c;
  color: white;
}

.route-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: rgba(67, 233, 123, 0.1);
}

.btn-icon.delete:hover {
  background: rgba(231, 76, 60, 0.1);
}

.route-content {
  margin-bottom: 1.5rem;
}

.route-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.route-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.detail-icon {
  font-size: 1rem;
}

.route-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.route-card.active .progress-fill {
  background: var(--color-primario);
}

.route-card.planning .progress-fill {
  background: var(--color-acento);
}

.route-card.completed .progress-fill {
  background: var(--color-azul);
}

.progress-text {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.route-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.btn-view {
  background: var(--color-primario);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-view:hover {
  background: var(--color-acento);
  transform: translateY(-1px);
}

.route-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  font-size: 0.8rem;
  color: #666;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-texto);
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: auto;
}

.modal-content {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 900px;
  width: 95vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: visible;
  max-height: 90vh;
  min-height: 500px;
  height: auto;
}
@media (max-width: 1000px) {
  .modal-content {
    max-width: 98vw;
    padding: 1.2rem 0.5rem;
  }
}
.modal-body {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  overflow-x: auto;
}
@media (max-width: 900px) {
  .modal-body {
    flex-direction: column;
    gap: 1rem;
  }
  .mapa-col {
    max-width: 100%;
    min-width: 0;
  }
}

/* Formulario */
.route-form {
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

.form-group:nth-child(2) {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--color-texto);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.8rem;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primario);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Botones */
.btn-primary, .btn-secondary, .btn-clear {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-primario);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.btn-clear {
  background: #f0f0f0;
  color: #666;
}

.btn-clear:hover {
  background: #e0e0e0;
}

/* Responsive */
@media (max-width: 768px) {
  .planificador-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .filters-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-options {
    justify-content: center;
  }
  
  .routes-grid {
    grid-template-columns: 1fr;
  }
  
  .route-details {
    grid-template-columns: 1fr;
  }
  
  .route-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style> 