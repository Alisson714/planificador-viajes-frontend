<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
onMounted(() => {
  auth.checkAuth()
})
// Aquí se pueden importar layouts o componentes globales si es necesario
</script>

<template>
  <div>
    <nav class="navbar">
      <div class="navbar-logo">
        <PhHouse size="28" />
        <span>Viajes Ecuador</span>
      </div>
      <div class="navbar-links">
        <router-link to="/">Inicio</router-link>
        <router-link to="/dashboard">Mis viajes</router-link>
        <router-link to="/planificador/nuevo">Planificador</router-link>
        <router-link to="/perfil">Perfil</router-link>
      </div>
    </nav>
    <main class="fade-in">
      <router-view />
    </main>
    <footer class="footer">
      <div>
        <PhMapPin size="20" /> Ecuador &nbsp;|&nbsp; <PhUser size="20" /> Tu Asistente de Viajes
      </div>
      <div style="font-size:0.9em; color:#888; margin-top:0.5rem;">© 2024 Viajes Ecuador. Todos los derechos reservados.</div>
    </footer>
  </div>
</template>

<style scoped>
/* Estilos globales o de layout base */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

main {
  min-height: 80vh;
  padding-bottom: 2rem;
}
</style>
