<template>
  <section class="notfound">
    <div class="notfound-icon">🧭</div>
    <h1>404</h1>
    <p>Página no encontrada</p>
    <el-button type="primary" @click="$router.push('/')">Volver al inicio</el-button>
  </section>
</template>

<script setup>
// No se requiere lógica especial
</script>

<style scoped>
.notfound {
  text-align: center;
  margin: 4rem auto;
  padding: 2.5rem 1.5rem;
  background: linear-gradient(120deg, #f6d36522 0%, #43e97b22 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px #43e97b33;
  max-width: 400px;
}
.notfound-icon {
  font-size: 4.5rem;
  margin-bottom: 1rem;
}
h1 {
  font-size: 5rem;
  color: #fda085;
  margin-bottom: 1rem;
}
p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
}
</style> 