<template>
  <div class="login-bg">
    <section class="login-card animate-fade-in">
      <div class="login-header">
        <img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="Viaje Planner" class="login-logo" />
        <h2>¡Bienvenido viajero!</h2>
        <p class="login-sub">Inicia sesión para planear tu próxima aventura</p>
      </div>
      <form @submit.prevent="onSubmit">
        <div v-if="warningMsg" class="login-warning">{{ warningMsg }}</div>
        <div class="input-group">
          <span class="input-icon">
            <PhUser size="20" />
          </span>
          <Field name="email" type="email" v-slot="{ field, errors }">
            <input v-bind="field" placeholder="Correo electrónico" autocomplete="username" />
            <span class="error">{{ errors[0] }}</span>
          </Field>
        </div>
        <div class="input-group">
          <span class="input-icon">
            <PhMapPin size="20" />
          </span>
          <Field name="password" type="password" v-slot="{ field, errors }">
            <input :type="showPassword ? 'text' : 'password'" v-bind="field" placeholder="Contraseña" autocomplete="current-password" />
            <span class="toggle-pass" @click="showPassword = !showPassword">
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </span>
            <span class="error">{{ errors[0] }}</span>
          </Field>
        </div>
        <div class="login-links">
          <a href="#" @click.prevent="forgot = true">¿Olvidaste tu contraseña?</a>
          <router-link to="/register">¿No tienes cuenta? Regístrate</router-link>
        </div>
        <button class="btn-login" type="submit" :disabled="loading">
          <span v-if="loading" class="loader"></span>
          <span v-else>Entrar</span>
        </button>
        <div v-if="errorMsg" class="login-error">{{ errorMsg }}</div>
      </form>
      <transition name="fade">
        <div v-if="forgot" class="forgot-modal">
          <div class="forgot-content">
            <h3>Recuperar contraseña</h3>
            <p>Por favor, contacta al soporte para recuperar tu acceso.</p>
            <button @click="forgot = false" class="btn-cerrar">Cerrar</button>
          </div>
        </div>
      </transition>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useForm, Field } from 'vee-validate'
import * as yup from 'yup'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { PhUser, PhMapPin } from '@phosphor-icons/vue'

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Requerido'),
  password: yup.string().required('Requerido')
})

const { handleSubmit } = useForm({
  validationSchema: schema
})

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const forgot = ref(false)
const warningMsg = ref('')

onMounted(() => {
  if (route.query.redirected) {
    warningMsg.value = 'Debes iniciar sesión para acceder a esta sección.'
  }
})

const onSubmit = handleSubmit(async values => {
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login(values.email, values.password)
    router.push('/dashboard')
  } catch (e) {
    if (e && e.response && e.response.status === 401) {
      errorMsg.value = 'Email o contraseña incorrectos.'
    } else {
      errorMsg.value = 'No se pudo iniciar sesión. Verifica tus datos.'
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: linear-gradient(120deg, #4fd1c5 0%, #f6d365 50%, #fda085 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}
.login-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 370px;
  width: 100%;
  position: relative;
  animation: pop-in 0.7s cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes pop-in {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 1s;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.login-logo {
  width: 54px;
  margin-bottom: 0.5rem;
}
.login-sub {
  color: #888;
  font-size: 1.05em;
  margin-bottom: 0.5rem;
}
.input-group {
  display: flex;
  align-items: center;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 1.1rem;
  padding: 0.5rem 0.8rem;
  border: 1.5px solid #e2e8f0;
  transition: border 0.2s;
  position: relative;
}
.input-group:focus-within {
  border: 1.5px solid #4fd1c5;
  background: #e6fffa;
}
.input-icon {
  color: #f6ad55;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
}
input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.08em;
  width: 100%;
  padding: 0.4rem 0;
}
.toggle-pass {
  cursor: pointer;
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1em;
  color: #4fd1c5;
}
.btn-login {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(90deg, #f6d365 0%, #fda085 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 0.7rem;
  box-shadow: 0 2px 8px rgba(253,160,133,0.13);
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-login:hover {
  background: linear-gradient(90deg, #4fd1c5 0%, #43e97b 100%);
  transform: translateY(-2px) scale(1.03);
}
.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #fda085;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.login-links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.97em;
}
.login-links a, .login-links router-link {
  color: #4fd1c5;
  text-decoration: none;
  transition: color 0.2s;
}
.login-links a:hover, .login-links router-link:hover {
  color: #f6ad55;
}
.login-error {
  color: #e74c3c;
  background: #fff0f0;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-top: 0.7rem;
  text-align: center;
  font-size: 1em;
}
.login-warning {
  color: #f6ad55;
  background: #fff0f0;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.7rem;
  text-align: center;
  font-size: 1em;
}
.forgot-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.forgot-content {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  text-align: center;
}
.btn-cerrar {
  margin-top: 1rem;
  background: #4fd1c5;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-cerrar:hover {
  background: #f6ad55;
}
@media (max-width: 500px) {
  .login-card {
    padding: 1.2rem 0.5rem 1.5rem 0.5rem;
    max-width: 98vw;
  }
}
</style> 