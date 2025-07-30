<template>
  <div class="mapa-selector-destino">
    <div ref="mapaRef" id="mapa-selector" class="mapa"></div>
  </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import { watch, ref, nextTick, onBeforeUnmount, defineProps, onMounted } from 'vue'
import L from 'leaflet'
import lugares from '../data/lugares-turisticos-ecuador.js'

const emit = defineEmits(['seleccion'])
const selectedId = ref(null)
let map = null
let markers = []
const mapaRef = ref(null)

const props = defineProps({ visible: Boolean })

function tryInitMap() {
  if (map || !props.visible) return
  nextTick(() => {
    const el = mapaRef.value
    if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
      map = L.map(el).setView([-1.8312, -78.1834], 6)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)
      markers = lugares.map(lugar => {
        const marker = L.marker([lugar.lat, lugar.lng]).addTo(map)
        marker.on('click', () => {
          selectedId.value = lugar.id
          emit('seleccion', lugar)
          markers.forEach(m => m.setIcon(L.icon({ iconUrl: require('leaflet/dist/images/marker-icon.png'), iconSize: [25, 41], iconAnchor: [12, 41] })))
          marker.setIcon(L.icon({ iconUrl: require('leaflet/dist/images/marker-icon-2x.png'), iconSize: [30, 50], iconAnchor: [15, 50] }))
        })
        marker.bindPopup(`<b>${lugar.nombre}</b><br>${lugar.ciudad}, ${lugar.provincia}`)
        return marker
      })
      setTimeout(() => map.invalidateSize(), 300)
    } else {
      setTimeout(tryInitMap, 100)
    }
  })
}

function destroyMap() {
  if (map) {
    map.remove()
    map = null
    markers = []
  }
}

watch(() => props.visible, (val) => {
  if (val) {
    tryInitMap()
  } else {
    destroyMap()
  }
})

onMounted(() => {
  if (props.visible) tryInitMap()
})

onBeforeUnmount(() => {
  destroyMap()
})
</script>

<style scoped>
.mapa-selector-destino {
  margin: 1rem 0;
  width: 100%;
  min-width: 300px;
  max-width: 100%;
}
.mapa {
  width: 100%;
  min-width: 300px;
  height: 400px;
  min-height: 320px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(67, 233, 123, 0.13);
  margin: 0 auto;
  background: #e6f7fa;
}
</style>

<style>
.leaflet-container {
  width: 100% !important;
  height: 400px !important;
  min-height: 320px;
  z-index: 0;
  border-radius: 12px;
}
</style> 