<template>
  <el-dialog :model-value="visible" @close="$emit('close')" width="500px" :title="destino?.nombre">
    <img v-if="destino" :src="destino.imagen" :alt="destino.nombre" class="modal-img" />
    <p style="margin:1rem 0;">{{ destino?.descripcion }}</p>
    <el-button type="info" :href="destino?.maps" target="_blank">Ver en Google Maps</el-button>
  </el-dialog>
</template>

<script setup>
defineProps({
  visible: Boolean,
  destino: Object
})
</script>

<style scoped>
.modal-img {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 1rem;
  object-fit: cover;
  max-height: 250px;
}
</style> 