<template>
  <div class="destino-card" @click="$emit('click', destino)">
    <div class="card-image">
      <img :src="destino.imagen" :alt="destino.nombre" />
      <div class="card-overlay">
        <div class="rating">
          <span class="stars">★★★★★</span>
          <span class="rating-number">{{ destino.rating }}</span>
        </div>
        <div class="category-badge">{{ destino.categoria }}</div>
      </div>
    </div>
    <div class="card-content">
      <h3 class="destino-title">{{ destino.nombre }}</h3>
      <p class="destino-provincia">{{ destino.provincia }}</p>
      <p class="destino-descripcion">{{ destino.descripcion }}</p>
      <div class="card-actions">
        <button class="btn-ver-mas" @click.stop="$emit('ver-mas', destino)">Ver más</button>
        <button class="btn-favorito" @click.stop="toggleFavorito">
          <span v-if="isFavorito">❤️</span>
          <span v-else>🤍</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'DestinoCard',
  props: {
    destino: {
      type: Object,
      required: true
    }
  },
  emits: ['click', 'ver-mas'],
  setup(props) {
    const isFavorito = ref(false)

    const toggleFavorito = () => {
      isFavorito.value = !isFavorito.value
    }

    return {
      isFavorito,
      toggleFavorito
    }
  }
}
</script>

<style scoped>
.destino-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.destino-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.destino-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.stars {
  color: #FFD700;
  font-size: 14px;
}

.rating-number {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.category-badge {
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-content {
  padding: 20px;
}

.destino-title {
  font-size: 18px;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.destino-provincia {
  font-size: 14px;
  color: #7F8C8D;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.destino-descripcion {
  font-size: 14px;
  color: #5D6D7E;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-ver-mas {
  background: linear-gradient(135deg, #3498DB, #2980B9);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  margin-right: 12px;
}

.btn-ver-mas:hover {
  background: linear-gradient(135deg, #2980B9, #1F618D);
  transform: translateY(-2px);
}

.btn-favorito {
  background: white;
  border: 2px solid #E74C3C;
  color: #E74C3C;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.btn-favorito:hover {
  background: #E74C3C;
  color: white;
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .card-image {
    height: 160px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .destino-title {
    font-size: 16px;
  }
  
  .card-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn-ver-mas {
    margin-right: 0;
    width: 100%;
  }
}
</style> 