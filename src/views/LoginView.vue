<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Entrar</h1>
  
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Usuário</label>
            <input
              v-model="form.username"
              type="text"
              id="username"
              required
              placeholder="usuario"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
  
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
  
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            <span v-if="loading" class="animate-spin mr-2 border-2 border-white rounded-full w-4 h-4 border-t-transparent"></span>
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
  
        <p class="mt-6 text-sm text-center text-gray-600">
          Ainda não tem uma conta?
          <router-link to="/register" class="text-teal-600 hover:underline font-medium">
            Criar conta
          </router-link>
        </p>
      </div>
    </div>
  </template>
  
<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { loginUser } from '@/api/auth.js'
  import { useAuthStore } from '@/stores/auth'
  
  const router = useRouter()
  
  const form = ref({
    username: '',
    password: ''
  })
  const loading = ref(false)
  const authStore = useAuthStore()

  const handleLogin = async () => {
  loading.value = true

  try {
    const payload = {
      username: form.value.username,
      password: form.value.password
    }

    const { access, refresh } = await loginUser(payload)

    // Salva no Pinia
    authStore.login({ access, refresh })

    alert('Login realizado com sucesso!')
    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Usuário ou senha inválidos.')
  } finally {
    loading.value = false
  }
}
</script>
  
  