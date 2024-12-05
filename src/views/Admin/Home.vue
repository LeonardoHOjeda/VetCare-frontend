<template>
  <div class="admin-home p-6 bg-gray-100 min-h-screen">
    <!-- Encabezado -->
    <header class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">¡Bienvenido, {user}!</h1>
        <p class="text-gray-600">Aquí tienes un resumen de la clínica {nombre}</p>
      </div>
      <div class="flex items-center space-x-4">
        <button class="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <Icon icon="mdi:bell" class="w-6 h-6 text-gray-600" />
        </button>
        <button class="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <Icon icon="mdi:account-circle" class="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>

    <!-- Resumen de estadísticas -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white shadow-md rounded-lg p-4">
        <p class="text-gray-500">Citas Hoy</p>
        <h2 class="text-3xl font-bold">{{ stats.appointmentsToday }}</h2>
      </div>
      <div class="bg-white shadow-md rounded-lg p-4">
        <p class="text-gray-500">Mascotas Registradas</p>
        <h2 class="text-3xl font-bold">{{ stats.registeredPets }}</h2>
      </div>
      <div class="bg-white shadow-md rounded-lg p-4">
        <p class="text-gray-500">Cirugías Pendientes</p>
        <h2 class="text-3xl font-bold">{{ stats.pendingSurgeries }}</h2>
      </div>
    </section>

    <!-- Mini calendario de citas -->
    <section class="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 class="text-xl font-bold mb-4">Citas Programadas Hoy</h2>
      <ul class="space-y-3">
        <li v-for="appointment in appointments" :key="appointment.id" class="flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm">
          <div>
            <p class="font-bold">{{ appointment.time }}</p>
            <p class="text-gray-600">{{ appointment.petName }} - {{ appointment.owner }}</p>
          </div>
          <span
            class="px-2 py-1 text-sm rounded-full"
            :class="{
              'bg-green-100 text-green-700': appointment.type === 'Consulta',
              'bg-blue-100 text-blue-700': appointment.type === 'Vacuna',
              'bg-yellow-100 text-yellow-700': appointment.type === 'Revisión'
            }"
          >
            {{ appointment.type }}
          </span>
        </li>
      </ul>
    </section>

    <!-- Notificaciones importantes -->
    <section class="bg-white shadow-md rounded-lg p-4">
      <h2 class="text-xl font-bold mb-4">Notificaciones</h2>
      <ul class="space-y-3">
        <li v-for="notification in notifications" :key="notification.id" class="p-3 bg-red-50 text-red-700 rounded-md shadow-sm">
          {{ notification.message }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Datos simulados
const stats = ref({
  appointmentsToday: 8,
  registeredPets: 350,
  pendingSurgeries: 2
})

const appointments = ref([
  { id: 1, time: '10:00 AM', petName: 'Max', owner: 'Juan Pérez', type: 'Consulta' },
  { id: 2, time: '11:30 AM', petName: 'Luna', owner: 'Ana Gómez', type: 'Vacuna' },
  { id: 3, time: '2:00 PM', petName: 'Rocky', owner: 'Carlos Díaz', type: 'Revisión' }
])

const notifications = ref([
  { id: 1, message: 'Max tiene una vacuna programada para mañana.' },
  { id: 2, message: 'El inventario de Rabia está por agotarse.' }
])
</script>

<style scoped>
/* .bg-green-100 {
  background-color: #d4edda;
}
.text-green-700 {
  color: #155724;
}
.bg-blue-100 {
  background-color: #cce5ff;
}
.text-blue-700 {
  color: #004085;
}
.bg-yellow-100 {
  background-color: #fff3cd;
}
.text-yellow-700 {
  color: #856404;
}
.bg-red-50 {
  background-color: #f8d7da;
}
.text-red-700 {
  color: #721c24;
} */
</style>
