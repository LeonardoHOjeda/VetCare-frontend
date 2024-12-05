<template>
  <main class="bg-gray-100 flex justify-center items-center min-h-screen">
    <section class="bg-white shadow-lg flex h-[80%] w-[80%] rounded-xl">
      <!-- Left Side -->
      <div class="bg-image rounded-l-xl p-6 hidden lg:block lg:w-[60%]" role="presentation" aria-hidden="true"></div>

      <!-- Right Side -->
      <div class="p-8 flex flex-col justify-center items-center w-full lg:w-[40%]">
        <figure class="mb-4">
          <img src="@/assets/images/login-image.jpg" alt="VetCare Logo" class="w-32" />
        </figure>
        <header class="text-center mb-6">
          <h1 class="text-4xl font-semibold">Inicia Sesión</h1>
          <p class="text-gray-500">Bienvenido a VetCare, inicia sesión para continuar.</p>
        </header>

        <form class="w-full" @submit.prevent="handleLogin">
          <div class="mb-6">
            <label for="email" class="block mb-2">Correo Electrónico {{ email }}</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
              placeholder="Correo Electrónico"
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block mb-2">Contraseña</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
              placeholder="Contraseña"
            />
          </div>

          <div class="flex justify-between items-center mb-4">
            <label class="flex items-center text-sm font-medium text-gray-900">
              <input type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
              <span class="ml-2">Recordar mi cuenta</span>
            </label>
            <a href="#" class="text-blue-600 text-sm hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          <button
            type="submit"
            class="bg-purple-500 text-white py-2 px-4 w-full rounded-3xl hover:bg-primary-600 transition duration-300 flex justify-center items-center font-bold"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { authService } from '../services/auth.service'
import { localStorageService } from '../services/localStorage.service'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    const user = await authService.login(email.value, password.value)
    localStorageService.user = user
    localStorageService.token = user.token
    router.replace('/admin/home')
  } catch (error: any) {
    console.error('Error:', error)
    error.value = error.message
  }
}

onMounted(() => {
  if (error.value) {
    toast.error('Error al iniciar sesión')
  }
})
</script>

<style scoped>
.bg-image {
  background-image: url('@/assets/images/login-image.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
