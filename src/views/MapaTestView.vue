<template>
  <div style="padding: 2rem;">
    <h2>Prueba de MapaSelectorDestino fuera del modal</h2>
    <MapaSelectorDestino :visible="true" @seleccion="onSeleccionDestino" />
    <div v-if="destino">
      <p><b>Destino seleccionado:</b> {{ destino.nombre }} ({{ destino.ciudad }}, {{ destino.provincia }})</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MapaSelectorDestino from '../components/MapaSelectorDestino.vue'

const destino = ref(null)
function onSeleccionDestino(lugar) {
  destino.value = lugar
}
</script>

<style scoped>
.mapa-test-bg {
  min-height: 100vh;
  background: #f4f8fb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mapa-test-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  text-align: center;
}
#map-test {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(79,209,197,0.13);
  background: #e6f7fa;
  margin-bottom: 1.5rem;
}
.btn-agregar {
  background: #43e97b;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.7rem 1.5rem;
  font-weight: bold;
  font-size: 1.05em;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}
.btn-agregar:hover {
  background: #fda085;
  transform: scale(1.04);
}
</style> 