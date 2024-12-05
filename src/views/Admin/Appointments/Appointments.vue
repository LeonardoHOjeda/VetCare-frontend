<template>
  <div class="appointment-requests p-6 bg-gray-100 min-h-screen">
    <!-- Encabezado -->
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Administrador de Citas</h1>
      <p class="text-gray-600">Administra las solicitudes enviadas por los clientes</p>
    </header>

    <!-- Filtro de búsqueda -->
    <section class="mb-6">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre de mascota o propietario" class="w-full px-4 py-2 border rounded-lg" @input="filterRequests" />
    </section>

    <!-- Lista de solicitudes pendientes -->
    <!-- <PendingRequests :requests="filteredRequests" @approve="approveRequest" @reject="rejectRequest" @details="showDetails" /> -->

    <!-- Lista de citas de hoy -->
    <TodayAppointments :appointments="appointments" />

    <!-- Modal de detalles -->
    <Modal v-if="selectedRequest" @close="selectedRequest = undefined">
      <template #header>
        <h3 class="text-lg font-bold">Detalles de la Solicitud</h3>
      </template>
      <template #body>
        <p><strong>Mascota:</strong> {{ selectedRequest.name }}</p>
        <p><strong>Propietario:</strong> {{ selectedRequest.owner.name }}</p>
        <p><strong>Fecha:</strong> {{ formatDate(selectedRequest.birth_date.toString()) }}</p>
        <p><strong>Notas:</strong> {{ 'Sin notas adicionales' }}</p>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { saveAs } from 'file-saver'
import TodayAppointments from './TodayAppointments.vue'
import Modal from '@/components/Modal/Modal.vue'
import type { Pet } from '@/interfaces/Pet.interface'
import type { Appointment } from '@/interfaces/Appointment.interface'
import { appointmentService } from '@/services/appointment.service'

// Datos simulados
const appointments = ref<Appointment[]>([])
const isLoading = ref(false)
const appointmentRequests = ref([
  { id: 1, name: 'Max', owner: { name: 'Juan Perez' }, reason: 'Consulta general', birth_date: '2024-11-24T10:00:00', status: 'pending', urgency: 'high' },
  { id: 2, name: 'Luna', ownerName: 'Ana Gómez', reason: 'Vacunación', birth_date: '2024-11-24T14:00:00', status: 'pending', urgency: 'medium' }
])

// Filtro de búsqueda
const searchQuery = ref('')
const filteredRequests = ref([...appointmentRequests.value])

const filterRequests = () => {
  filteredRequests.value = appointmentRequests.value.filter(
    (req) => req.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || req.owner?.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

// Funciones
const selectedRequest = ref<Pet>()

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(date).toLocaleDateString('es-ES', options)
}

onMounted(() => {
  isLoading.value = true
  appointmentService
    .fetchAppointments()
    .then((response) => {
      appointments.value = response
    })
    .catch((error) => console.error(error))
    .finally(() => (isLoading.value = false))
})
</script>
