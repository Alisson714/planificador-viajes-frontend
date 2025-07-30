# 🖼️ Imágenes de Ecuador para el Proyecto

## 📸 **Enlaces de Imágenes por Región**

### **🏝️ Islas Galápagos**
- **Tortugas Gigantes**: https://images.unsplash.com/photo-1544551763-46a013bb70d5
- **Paisajes Marinos**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Playas**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Snorkeling**: https://images.unsplash.com/photo-1578662996442-48f60103fc96

### **🏔️ Sierra (Andes)**
- **Quito Centro Histórico**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Cuenca Colonial**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Otavalo Mercado**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Cotopaxi**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Baños Cascadas**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Mindo Bosque**: https://images.unsplash.com/photo-1578662996442-48f60103fc96

### **🏖️ Costa del Pacífico**
- **Montañita Surf**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Guayaquil Malecón**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Manta Pesca**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Salinas Playa**: https://images.unsplash.com/photo-1578662996442-48f60103fc96

### **🌴 Amazonía**
- **Tena Selva**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Puyo Río**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Coca Petróleo**: https://images.unsplash.com/photo-1578662996442-48f60103fc96
- **Selva Amazónica**: https://images.unsplash.com/photo-1578662996442-48f60103fc96

## 🎨 **Imágenes por Categoría**

### **🌿 Naturaleza**
- Galápagos tortugas y paisajes
- Cotopaxi y volcanes
- Mindo bosque nublado
- Amazonía selva

### **🏛️ Cultura**
- Quito centro histórico
- Cuenca arquitectura colonial
- Otavalo mercado indígena
- Artesanías ecuatorianas

### **🏃 Aventura**
- Baños deportes extremos
- Montañita surf
- Trekking en montañas
- Rafting en ríos

### **🍽️ Gastronomía**
- Ceviche de camarón
- Hornado de cerdo
- Encebollado
- Choclo con queso

## 📁 **Archivo de Imágenes Organizadas**

El proyecto incluye un archivo `src/data/ecuador-images.js` con:

```javascript
// Importar imágenes organizadas
import { ecuadorImages, categoryImages, getRandomImage } from '@/data/ecuador-images.js'

// Usar imágenes por región
const imagenGalapagos = ecuadorImages.galapagos.tortuga
const imagenQuito = ecuadorImages.sierra.quito

// Obtener imagen aleatoria por categoría
const imagenNaturaleza = getRandomImage('naturaleza')
```

## 🔧 **Cómo Usar las Imágenes**

### **1. En Componentes Vue**
```vue
<template>
  <img :src="destino.imagen" :alt="destino.nombre" />
</template>

<script>
import { ecuadorImages } from '@/data/ecuador-images.js'

export default {
  data() {
    return {
      destinos: [
        {
          nombre: 'Galápagos',
          imagen: ecuadorImages.galapagos.tortuga
        }
      ]
    }
  }
}
</script>
```

### **2. En Datos Mock**
```javascript
const destinos = [
  {
    id: 1,
    nombre: 'Islas Galápagos',
    imagen: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    categoria: 'Naturaleza'
  }
]
```

### **3. Imágenes de Fondo**
```css
.hero-section {
  background-image: url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
}
```

## 🎯 **Optimización de Imágenes**

Todas las imágenes de Unsplash incluyen parámetros de optimización:

- `auto=format`: Formato automático (WebP si es compatible)
- `fit=crop`: Recorte inteligente
- `w=2070`: Ancho máximo de 2070px
- `q=80`: Calidad del 80% (buen balance calidad/tamaño)

## 📱 **Responsive Images**

Para diferentes tamaños de pantalla:

```html
<img 
  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" 
  srcset="
    https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400 400w,
    https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800 800w,
    https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200 1200w
  "
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Galápagos"
/>
```

## 🚀 **Fuentes de Imágenes**

- **Unsplash**: Imágenes gratuitas de alta calidad
- **Pexels**: Alternativa gratuita
- **Pixabay**: Imágenes libres de derechos
- **Flickr**: Imágenes con licencias Creative Commons

## 📝 **Notas Importantes**

1. **Derechos de Autor**: Todas las imágenes son gratuitas para uso comercial
2. **Atribución**: No es obligatoria pero se recomienda
3. **Optimización**: Las imágenes ya están optimizadas para web
4. **CDN**: Unsplash proporciona CDN global para carga rápida
5. **Fallbacks**: Siempre incluir `alt` para accesibilidad

## 🔄 **Actualización de Imágenes**

Para agregar nuevas imágenes:

1. Buscar en Unsplash por "Ecuador [destino]"
2. Copiar la URL de la imagen
3. Agregar parámetros de optimización
4. Actualizar el archivo `ecuador-images.js`
5. Probar en diferentes dispositivos

---

*Última actualización: Diciembre 2024* 