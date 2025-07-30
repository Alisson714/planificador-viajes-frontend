import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginService, register as registerService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const token = ref(null)

  async function login(email, password) {
    try {
      const result = await loginService(email, password)
      user.value = result.user // Guardar todos los datos del usuario
      token.value = result.access_token
      isAuthenticated.value = true
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
      localStorage.setItem('isAuthenticated', 'true')
      return true
    } catch (e) {
      isAuthenticated.value = false
      user.value = null
      token.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.setItem('isAuthenticated', 'false')
      throw e
    }
  }

  async function register(nombre, email, password, extraData = {}) {
    // extraData puede incluir phone, country, city, birthDate, etc.
    const result = await registerService(email, password, nombre, extraData)
    user.value = result.user
    token.value = result.access_token
    isAuthenticated.value = true
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('token', token.value)
    localStorage.setItem('isAuthenticated', 'true')
    return true
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.setItem('isAuthenticated', 'false')
  }

  function checkAuth() {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    const storedAuth = localStorage.getItem('isAuthenticated')
    if (storedUser && storedToken && storedAuth === 'true') {
      user.value = JSON.parse(storedUser)
      token.value = storedToken
      isAuthenticated.value = true
    }
  }

  return { user, isAuthenticated, token, login, register, logout, checkAuth }
}) 