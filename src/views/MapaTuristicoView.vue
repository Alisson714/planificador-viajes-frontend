<template>
  <div class="mapa-turistico-container">
    <h1>Mapa Turístico de Ecuador</h1>
    <div id="map" class="map"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import lugares from '../data/lugares-turisticos-ecuador.js'

onMounted(() => {
  const map = L.map('map').setView([-1.8312, -78.1834], 6)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  lugares.forEach(lugar => {
    const marker = L.marker([lugar.lat, lugar.lng]).addTo(map)
    marker.bindPopup(`
      <div style='min-width:200px'>
        <img src="${lugar.imagen}" alt="${lugar.nombre}" style="width:100%;border-radius:8px;max-height:100px;object-fit:cover;" />
        <h3 style='margin:8px 0 4px 0;'>${lugar.nombre}</h3>
        <p style='margin:0;font-size:0.95em;'>${lugar.ciudad}, ${lugar.provincia}</p>
        <p style='margin:0;font-size:0.9em;color:#666;'>${lugar.categoria}</p>
        <p style='margin:8px 0 0 0;font-size:0.95em;'>${lugar.descripcion}</p>
      </div>
    `)
  })
})
</script>

<style scoped>
.mapa-turistico-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6d36522 0%, #43e97b22 100%);
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-primario);
}

.map {
  width: 100%;
  height: 70vh;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
  margin: 0 auto;
}
</style> 