<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="Ecuador Travel" class="logo" />
        <h1>Crear Cuenta</h1>
        <p>Únete a Ecuador Travel y comienza a planificar tus aventuras</p>
      </div>

      <form @submit.prevent="register" class="register-form">
        <div class="form-group">
          <label for="name">Nombre completo *</label>
          <div class="input-container">
            <span class="input-icon">👤</span>
            <input 
              id="name"
              v-model="form.name" 
              type="text" 
              required
              placeholder="Tu nombre completo"
              :class="{ 'error': errors.name }"
            />
          </div>
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <div class="input-container">
            <span class="input-icon">📧</span>
            <input 
              id="email"
              v-model="form.email" 
              type="email" 
              required
              placeholder="tu@email.com"
              :class="{ 'error': errors.email }"
            />
          </div>
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña *</label>
          <div class="input-container">
            <span class="input-icon">🔒</span>
            <input 
              id="password"
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              required
              placeholder="Mínimo 8 caracteres"
              :class="{ 'error': errors.password }"
            />
            <button 
              type="button" 
              @click="togglePassword" 
              class="password-toggle"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar contraseña *</label>
          <div class="input-container">
            <span class="input-icon">🔒</span>
            <input 
              id="confirmPassword"
              v-model="form.confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              required
              placeholder="Repite tu contraseña"
              :class="{ 'error': errors.confirmPassword }"
            />
            <button 
              type="button" 
              @click="toggleConfirmPassword" 
              class="password-toggle"
            >
              {{ showConfirmPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-group">
          <label for="phone">Teléfono</label>
          <div class="input-container">
            <span class="input-icon">📱</span>
            <input 
              id="phone"
              v-model="form.phone" 
              type="tel" 
              placeholder="+593 99 123 4567"
              :class="{ 'error': errors.phone }"
            />
          </div>
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label for="birthDate">Fecha de nacimiento</label>
          <div class="input-container">
            <span class="input-icon">🎂</span>
            <input 
              id="birthDate"
              v-model="form.birthDate" 
              type="date" 
              :class="{ 'error': errors.birthDate }"
            />
          </div>
          <span v-if="errors.birthDate" class="error-message">{{ errors.birthDate }}</span>
        </div>

        <div class="form-group">
          <label for="country">País</label>
          <div class="input-container">
            <span class="input-icon">🌍</span>
            <select 
              id="country"
              v-model="form.country" 
              :class="{ 'error': errors.country }"
            >
              <option value="">Selecciona tu país</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Colombia">Colombia</option>
              <option value="Perú">Perú</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="España">España</option>
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="México">México</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <span v-if="errors.country" class="error-message">{{ errors.country }}</span>
        </div>

        <div class="form-group">
          <label for="city">Ciudad</label>
          <div class="input-container">
            <span class="input-icon">🏙️</span>
            <input 
              id="city"
              v-model="form.city" 
              type="text" 
              placeholder="Tu ciudad"
              :class="{ 'error': errors.city }"
            />
          </div>
          <span v-if="errors.city" class="error-message">{{ errors.city }}</span>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-container">
            <input 
              type="checkbox" 
              v-model="form.acceptTerms" 
              required
              :class="{ 'error': errors.acceptTerms }"
            />
            <span class="checkmark"></span>
            Acepto los <a href="#" @click.prevent="showTerms">términos y condiciones</a> y la <a href="#" @click.prevent="showPrivacy">política de privacidad</a>
          </label>
          <span v-if="errors.acceptTerms" class="error-message">{{ errors.acceptTerms }}</span>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-container">
            <input 
              type="checkbox" 
              v-model="form.newsletter" 
            />
            <span class="checkmark"></span>
            Quiero recibir noticias y ofertas especiales por email
          </label>
        </div>

        <button type="submit" class="btn-register" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>
      </form>

      <div class="register-footer">
        <p>¿Ya tienes una cuenta? <router-link to="/login" class="link">Iniciar sesión</router-link></p>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="register-info">
      <div class="info-card">
        <div class="info-icon">🗺️</div>
        <h3>Explora Ecuador</h3>
        <p>Descubre los cuatro mundos: Sierra, Costa, Amazonía y Galápagos</p>
      </div>
      <div class="info-card">
        <div class="info-icon">🎯</div>
        <h3>Planifica tu Viaje</h3>
        <p>Crea rutas personalizadas y organiza tus actividades</p>
      </div>
      <div class="info-card">
        <div class="info-icon">👥</div>
        <h3>Comunidad</h3>
        <p>Conecta con otros viajeros y comparte experiencias</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

// Estado del formulario
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  birthDate: '',
  country: '',
  city: '',
  acceptTerms: false,
  newsletter: false
})

// Estado de la UI
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Errores de validación
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  birthDate: '',
  country: '',
  city: '',
  acceptTerms: ''
})

// Funciones
function togglePassword() {
  showPassword.value = !showPassword.value
}

function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value
}

function validateForm() {
  // Limpiar errores previos
  Object.keys(errors).forEach(key => errors[key] = '')

  let isValid = true

  // Validar nombre
  if (form.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres'
    isValid = false
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = 'Ingresa un email válido'
    isValid = false
  }

  // Validar contraseña
  if (form.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  }

  // Validar confirmación de contraseña
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  // Validar teléfono (opcional pero si se ingresa debe ser válido)
  if (form.phone && !/^\+?[\d\s\-\(\)]+$/.test(form.phone)) {
    errors.phone = 'Ingresa un número de teléfono válido'
    isValid = false
  }

  // Validar términos y condiciones
  if (!form.acceptTerms) {
    errors.acceptTerms = 'Debes aceptar los términos y condiciones'
    isValid = false
  }

  return isValid
}

async function register() {
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    await auth.register(
      form.name,
      form.email,
      form.password,
      {
        phone: form.phone,
        birthDate: form.birthDate,
        country: form.country,
        city: form.city
      }
    )
    // Después de registrar, redirigir al login o loguear automáticamente
    router.push('/login')
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      errors.email = 'El usuario ya existe.'
    } else {
      errors.email = 'No se pudo registrar. Intenta de nuevo.'
    }
  } finally {
    loading.value = false
  }
}

function showTerms() {
  // Implementar modal de términos y condiciones
  alert('Términos y condiciones de Ecuador Travel')
}

function showPrivacy() {
  // Implementar modal de política de privacidad
  alert('Política de privacidad de Ecuador Travel')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-azul) 0%, var(--color-acento) 50%, var(--color-acento2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 3rem;
}

.register-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}

.register-header h1 {
  font-size: 2rem;
  color: var(--color-primario);
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #666;
  font-size: 1.1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: var(--color-texto);
  font-size: 0.9rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  color: #999;
  z-index: 1;
}

.input-container input,
.input-container select {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
}

.input-container input:focus,
.input-container select:focus {
  outline: none;
  border-color: var(--color-primario);
  box-shadow: 0 0 0 3px rgba(67, 233, 123, 0.1);
}

.input-container input.error,
.input-container select.error {
  border-color: #e74c3c;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: var(--color-primario);
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

/* Checkbox personalizado */
.checkbox-group {
  margin-top: 1rem;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.checkbox-container input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #f0f0f0;
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  margin-top: 0.1rem;
  transition: all 0.2s;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark {
  background: var(--color-primario);
  border-color: var(--color-primario);
}

.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

.checkbox-container input[type="checkbox"].error + .checkmark {
  border-color: #e74c3c;
}

.checkbox-container a {
  color: var(--color-primario);
  text-decoration: none;
  font-weight: bold;
}

.checkbox-container a:hover {
  text-decoration: underline;
}

.btn-register {
  background: linear-gradient(135deg, var(--color-primario), var(--color-acento));
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 233, 123, 0.3);
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.register-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f0f0f0;
}

.register-footer p {
  color: #666;
  font-size: 1rem;
}

.link {
  color: var(--color-primario);
  text-decoration: none;
  font-weight: bold;
}

.link:hover {
  text-decoration: underline;
}

/* Información adicional */
.register-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
}

.info-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.info-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  font-weight: bold;
}

.info-card p {
  font-size: 1rem;
  line-height: 1.5;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 1024px) {
  .register-container {
    flex-direction: column;
    gap: 2rem;
  }
  
  .register-info {
    flex-direction: row;
    max-width: 100%;
  }
  
  .info-card {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-card {
    padding: 2rem;
  }
  
  .register-info {
    flex-direction: column;
  }
  
  .info-card {
    padding: 1.5rem;
  }
  
  .info-icon {
    font-size: 2rem;
  }
  
  .info-card h3 {
    font-size: 1.1rem;
  }
  
  .info-card p {
    font-size: 0.9rem;
  }
}
</style> 