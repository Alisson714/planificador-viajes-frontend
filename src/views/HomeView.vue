<template>
  <!-- Header Navigation -->
  <header class="header-nav">
    <nav class="nav-container">
      <div class="nav-logo">
        <img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="Ecuador Travel" class="logo-img" />
        <span class="logo-text">Ecuador Travel</span>
      </div>
      <div class="nav-links">
        <a href="#destinos">Destinos</a>
        <a href="#sobre-ecuador">Sobre Ecuador</a>
        <a href="#contacto">Contacto</a>
      </div>
    </nav>
  </header>

  <!-- Hero Banner -->
  <section class="hero-banner">
    <div class="hero-content">
      <h1 class="hero-title">Viaja por Ecuador</h1>
      <p class="hero-subtitle">No he recorrido todo Ecuador, pero pienso hacerlo</p>
      <div class="hero-actions">
        <button class="btn-primary" @click="$router.push('/register')">Registrarse</button>
        <button class="btn-secondary" @click="$router.push('/login')">Iniciar sesión</button>
      </div>
    </div>
    <div class="hero-image" style="display:flex;align-items:center;justify-content:center;min-height:400px;">
      <video 
        src="/1197-143842677_small.mp4"
        autoplay
        loop
        muted
        playsinline
        style="width:100%;max-width:900px;border-radius:18px;box-shadow:0 8px 32px rgba(0,0,0,0.25);background:#111;object-fit:cover;aspect-ratio:16/9;"
      ></video>
    </div>
  </section>

  <!-- Destinos Populares -->
  <section class="destinos-section" id="destinos">
    <div class="container">
      <h2 class="section-title">Destinos Populares</h2>
      <div class="destinos-grid">
        <DestinoCard 
          v-for="destino in destinos" 
          :key="destino.id" 
          :destino="destino" 
          @ver-mas="verDestino"
        />
      </div>
    </div>
  </section>

  <!-- Sobre Ecuador -->
  <section class="sobre-ecuador" id="sobre-ecuador">
    <div class="container">
      <div class="sobre-content">
        <div class="sobre-text">
          <h2>Descubre los Cuatro Mundos</h2>
          <p>Ecuador es un país único que ofrece cuatro regiones distintas: la Costa del Pacífico, la Sierra Andina, la Amazonía y las Islas Galápagos. Cada región tiene su propia cultura, gastronomía y paisajes impresionantes.</p>
          <div class="regiones-grid">
            <div class="region-item" @click="seleccionarRegion('Sierra')">
              <span class="region-icon">🏔️</span>
              <span class="region-name">Sierra</span>
            </div>
            <div class="region-item" @click="seleccionarRegion('Costa')">
              <span class="region-icon">🏖️</span>
              <span class="region-name">Costa</span>
            </div>
            <div class="region-item" @click="seleccionarRegion('Amazonía')">
              <span class="region-icon">🌴</span>
              <span class="region-name">Amazonía</span>
            </div>
            <div class="region-item" @click="seleccionarRegion('Galápagos')">
              <span class="region-icon">🐢</span>
              <span class="region-name">Galápagos</span>
            </div>
          </div>
        </div>
        <div class="sobre-image">
          <img :src="regionImages[selectedRegion]" alt="Ecuador" />
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer" id="contacto">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Ecuador Travel</h3>
          <p>Tu compañero perfecto para explorar Ecuador</p>
        </div>
        <div class="footer-section">
          <h4>Enlaces</h4>
          <a href="#destinos">Destinos</a>
          <a href="#sobre-ecuador">Sobre Ecuador</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div class="footer-section">
          <h4>Síguenos</h4>
          <div class="social-links">
            <a href="#" class="social-link">📘</a>
            <a href="#" class="social-link">📷</a>
            <a href="#" class="social-link">🐦</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Ecuador Travel. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DestinoCard from '@/components/DestinoCard.vue'

const router = useRouter()

const regionImages = {
  Sierra: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', // Cotopaxi
  Costa: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', // Playa de Ecuador
  Amazonía: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80', // Selva
  Galápagos: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' // Tortuga Galápagos
}

const selectedRegion = ref('Sierra')

const destinos = ref([
  { 
    id: 1, 
    nombre: 'Islas Galápagos', 
    categoria: 'Naturaleza',
    provincia: 'Galápagos',
    rating: 4.9,
    imagen: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', 
    descripcion: 'Un paraíso natural único en el mundo, hogar de especies endémicas y paisajes impresionantes.' 
  },
  { 
    id: 2, 
    nombre: 'Quito', 
    categoria: 'Cultura',
    provincia: 'Pichincha',
    rating: 4.7,
    imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', 
    descripcion: 'La capital más alta del mundo, con un centro histórico declarado Patrimonio de la Humanidad.' 
  },
  { 
    id: 3, 
    nombre: 'Baños de Agua Santa', 
    categoria: 'Aventura',
    provincia: 'Tungurahua',
    rating: 4.8,
    imagen: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80', 
    descripcion: 'Destino de aventura y naturaleza, famoso por sus cascadas y deportes extremos.' 
  },
  { 
    id: 4, 
    nombre: 'Cuenca', 
    categoria: 'Cultura',
    provincia: 'Azuay',
    rating: 4.6,
    imagen: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80', 
    descripcion: 'Ciudad colonial con arquitectura impresionante y rica vida cultural.' 
  }
])

function seleccionarRegion(region) {
  selectedRegion.value = region
}

function verDestino(destino) {
  router.push({
    name: 'detalle-viaje',
    params: { destino: encodeURIComponent(JSON.stringify(destino)) }
  })
}
</script>

<style scoped>
/* Header Navigation */
.header-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(67, 233, 123, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-img {
  width: 40px;
  height: 40px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primario);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--color-texto);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--color-primario);
}

/* Hero Banner */
.hero-banner {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--color-azul) 0%, var(--color-acento) 50%, var(--color-acento2) 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  padding: 0 4rem;
  color: white;
  z-index: 2;
}

.hero-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: white;
  color: var(--color-primario);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: var(--color-primario);
}

.hero-image {
  flex: 1;
  position: relative;
}

.hero-image img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  opacity: 0.8;
}

/* Destinos Section */
.destinos-section {
  padding: 5rem 0;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--color-primario);
}

.destinos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

/* Los estilos del destino-card ahora están en el componente DestinoCard.vue */

/* Sobre Ecuador */
.sobre-ecuador {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f6d36522 0%, #43e97b22 100%);
}

.sobre-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.sobre-text h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-primario);
}

.sobre-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: var(--color-texto);
}

.regiones-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.region-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.region-icon {
  font-size: 1.5rem;
}

.region-name {
  font-weight: bold;
  color: var(--color-texto);
}

.sobre-image img {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Footer */
.footer {
  background: var(--color-texto);
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3, .footer-section h4 {
  margin-bottom: 1rem;
  color: var(--color-primario);
}

.footer-section a {
  display: block;
  color: #ccc;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
}

.footer-section a:hover {
  color: var(--color-primario);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.2s;
}

.social-link:hover {
  background: var(--color-primario);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #333;
  color: #ccc;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    padding: 0 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .sobre-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .nav-links {
    display: none;
  }
}
</style> 