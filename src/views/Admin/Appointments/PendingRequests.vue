<template>
  <section class="bg-white shadow-md rounded-lg p-4 my-4">
    <h2 class="text-lg font-bold mb-4">Solicitudes Pendientes</h2>
    <ul class="space-y-3">
      <li v-for="request in requests" :key="request.id" class="md:flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm">
        <div>
          <p class="font-bold">{{ request.petName }} ({{ request.ownerName }})</p>
          <p class="text-gray-600">Razón: {{ request.reason }}</p>
          <p class="text-gray-500 text-sm">Solicitada para: {{ formatDate(request.date) }}</p>
          <p :class="statusClass(request.status)">Estado: {{ request.status }}</p>
          <p :class="urgencyClass(request.urgency)">Urgencia: {{ request.urgency }}</p>
        </div>
        <div class="flex space-x-2">
          <button class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" @click="$emit('approve', request.id)">Aprobar</button>
          <button class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" @click="$emit('reject', request.id)">Rechazar</button>
          <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" @click="$emit('details', request)">Detalles</button>
        </div>
      </li>
    </ul>
    <p v-if="requests.length === 0" class="text-gray-500 text-center">No hay solicitudes pendientes.</p>
  </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

interface Request {
  id: number
  petName: string
  ownerName: string
  reason: string
  date: string
  status: string
  urgency: string
}

const props = defineProps({
  requests: {
    type: Array as PropType<Request[]>,
    required: true
  }
})

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(date).toLocaleDateString('es-ES', options)
}

const statusClass = (status: string) => {
  return {
    pending: 'text-yellow-500',
    approved: 'text-green-500',
    rejected: 'text-red-500'
  }[status]
}

const urgencyClass = (urgency: string) => {
  return {
    high: 'text-red-500 font-bold',
    medium: 'text-yellow-500 font-bold',
    low: 'text-green-500 font-bold'
  }[urgency]
}
</script>
