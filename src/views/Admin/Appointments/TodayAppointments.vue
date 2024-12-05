<template>
  <section class="bg-white shadow-md rounded-lg p-4">
    <h2 class="text-lg font-bold mb-4">Citas</h2>

    <ul class="space-y-3">
      <li v-for="appointment in appointments" :key="appointment.id" class="md:flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm">
        <div>
          <p class="font-bold">{{ appointment.pet.owner.name }} ({{ appointment.pet.name }} - {{ appointment.pet.breed.name }})</p>
          <p class="text-gray-600">Razón: {{ appointment.reason }}</p>
          <p class="text-gray-500 text-sm">Programada para: {{ formatDate(appointment.date) }}</p>
        </div>
      </li>
    </ul>

    <p v-if="appointments.length === 0" class="text-gray-500 text-center">No hay citas programadas para hoy.</p>
  </section>
</template>

<script setup lang="ts">
import type { Appointment } from '@/interfaces/Appointment.interface'
import type { PropType } from 'vue'

const props = defineProps({
  appointments: {
    type: Array as PropType<Appointment[]>,
    required: true
  }
})

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleDateString('es-ES', options)
}
</script>
