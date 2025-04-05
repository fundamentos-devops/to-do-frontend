<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Criar Conta</h1>
  
        <form @submit.prevent="handleRegister" class="space-y-4">
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
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              required
              placeholder="seu@email.com"
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
            {{ loading ? 'Registrando...' : 'Registrar' }}
          </button>
        </form>
  
        <p class="mt-6 text-sm text-center text-gray-600">
          Já tem uma conta?
          <router-link to="/login" class="text-teal-600 hover:underline font-medium">
            Faça login
          </router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { registerUser } from '@/api/auth' // <- Use isso com API real
  
  const router = useRouter()
  
  const form = ref({
    username: '',
    email: '',
    password: ''
  })
  
  const loading = ref(false)
  
  const handleRegister = async () => {
    loading.value = true
  
    try {
      const payload = {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      }
  
      await registerUser(payload)
      payload
      await new Promise(resolve => setTimeout(resolve, 1200))
  
      alert('Conta criada com sucesso!')
      router.push('/login')
    } catch (err) {
      console.error(err)
      alert('Erro ao registrar. Tente novamente.')
    } finally {
      loading.value = false
    }
  }
  </script>
  