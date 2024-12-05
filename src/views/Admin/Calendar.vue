<template>
  <div class="calendar-page p-6 bg-gray-100 min-h-screen">
    <!-- Encabezado -->
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Calendario de Citas</h1>
      <div class="flex items-center space-x-4">
        <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" @click="prevMonth">Anterior</button>
        <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" @click="nextMonth">Siguiente</button>
      </div>
    </header>

    <!-- Calendario -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">{{ currentMonthName }} {{ currentYear }}</h2>
      </div>

      <!-- Días de la semana -->
      <div class="grid grid-cols-7 text-center font-bold text-gray-600">
        <div v-for="day in weekDays" :key="day" class="py-2">
          {{ day }}
        </div>
      </div>

      <!-- Días del mes -->
      <div class="grid grid-cols-7 text-center">
        <div v-for="emptyDay in emptyDays" :key="emptyDay" class="py-4 border border-gray-200 bg-gray-100"></div>
        <div v-for="day in daysInMonth" :key="day" class="relative py-4 border border-gray-200 hover:bg-blue-50 cursor-pointer" @click="selectDate(day)">
          <!-- Día del mes -->
          <span class="absolute top-1 left-2 text-sm font-bold text-gray-700">
            {{ day }}
          </span>

          <!-- Citas en bloques de color -->
          <div
            v-for="appointment in appointmentsForDay(day)"
            :key="appointment.id"
            class="mt-6 px-2 py-1 text-xs rounded-md text-white cursor-pointer"
            :class="appointmentColor(appointment)"
            @click.stop="selectAppointment(appointment)"
          >
            {{ appointment.title }}
          </div>
        </div>
      </div>
    </div>

    <!-- Detalles de la cita seleccionada -->
    <div v-if="selectedAppointment" class="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 class="text-xl font-bold mb-4">Detalles de la Cita</h3>
      <p class="text-gray-600">Título: {{ selectedAppointment.title }}</p>
      <p class="text-gray-600">Fecha: {{ formatDate(selectedAppointment.date) }}</p>
      <div class="flex space-x-4 mt-4">
        <button class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" @click="editAppointment(selectedAppointment)">Editar</button>
        <button class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" @click="deleteAppointment(selectedAppointment.id)">Cancelar</button>
      </div>
    </div>

    <!-- Modal para agregar o editar citas -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-md w-[400px] p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingAppointment ? 'Editar Cita' : 'Agregar Cita' }}</h2>
        <form @submit.prevent="saveAppointment">
          <div class="mb-4">
            <label for="title" class="block text-gray-700 font-bold mb-2">Título</label>
            <input id="title" v-model="appointmentForm.title" type="text" class="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div class="mb-4">
            <label for="date" class="block text-gray-700 font-bold mb-2">Fecha y Hora</label>
            <input id="date" v-model="appointmentForm.date" type="datetime-local" class="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" @click="closeModal">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { addMonths, subMonths, startOfMonth, endOfMonth, getDay, eachDayOfInterval, format } from 'date-fns'

// Configuración inicial
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const selectedAppointment = ref<any | null>(null)
const showModal = ref(false)
const editingAppointment = ref(false)
const appointmentForm = ref({ id: null, title: '', date: '', type: 'vacuna' })

// Días de la semana
const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Datos simulados de citas
const appointments = ref([
  { id: 1, title: 'Vacunación de Max', date: '2024-11-18T10:00:00', type: 'vacuna' },
  { id: 2, title: 'Vacunación de Max', date: '2024-11-19T10:00:00', type: 'vacuna' },
  { id: 2, title: 'Vacunación de Max', date: '2024-11-21T10:00:00', type: 'vacuna' },
  { id: 2, title: 'Vacunación de Max', date: '2024-11-23T10:00:00', type: 'vacuna' },
  { id: 2, title: 'Vacunación de Max', date: '2024-11-28T10:00:00', type: 'vacuna' },
  { id: 2, title: 'Vacunación de Max', date: '2024-11-25T10:00:00', type: 'vacuna' },
  { id: 2, title: 'Consulta de Luna', date: '2024-11-26T14:00:00', type: 'consulta' }
])

// Obtener mes y días
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonthName = computed(() => currentDate.value.toLocaleString('es-ES', { month: 'long' }).toUpperCase())
const emptyDays = computed<number[]>(() => {
  const firstDay = startOfMonth(currentDate.value)
  return Array.from({ length: getDay(firstDay) })
})
const daysInMonth = computed(() => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)
  return eachDayOfInterval({ start, end }).map((date) => date.getDate())
})

// Navegación entre meses
const nextMonth = () => (currentDate.value = addMonths(currentDate.value, 1))
const prevMonth = () => (currentDate.value = subMonths(currentDate.value, 1))

// Selección de días y citas
const selectDate = (day: number) => {
  selectedDate.value = new Date(currentYear.value, currentDate.value.getMonth(), day)
  selectedAppointment.value = null
}
const selectAppointment = (appointment: any) => (selectedAppointment.value = appointment)
const appointmentsForDay = (day: number) =>
  appointments.value.filter((appointment) => new Date(appointment.date).toDateString() === new Date(currentYear.value, currentDate.value.getMonth(), day).toDateString())

const editAppointment = (appointment: any) => {
  appointmentForm.value = { ...appointment }
  editingAppointment.value = true
  showModal.value = true
}
const saveAppointment = () => {
  const newAppointment = { ...appointmentForm.value, id: Date.now() }
  appointments.value.push(newAppointment)
  closeModal()
}
const deleteAppointment = (id: number) => {
  appointments.value = appointments.value.filter((appointment) => appointment.id !== id)
  selectedAppointment.value = null
}
const closeModal = () => (showModal.value = false)

// Formato de fechas
const formatDate = (date: string) => format(new Date(date), "EEEE, d 'de' MMMM 'de' yyyy, h:mm a")
const isToday = (day: number) => new Date().toDateString() === new Date(currentYear.value, currentDate.value.getMonth(), day).toDateString()
const isSelected = (day: number) => selectedDate.value?.toDateString() === new Date(currentYear.value, currentDate.value.getMonth(), day).toDateString()

// Colores de citas
const appointmentColor = (appointment: any) => {
  switch (appointment.type) {
    case 'vacuna':
      return 'bg-green-500'
    case 'consulta':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}
</script>
