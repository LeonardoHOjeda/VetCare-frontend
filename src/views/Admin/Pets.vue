<template>
  <div class="users-table p-6 bg-gray-100 min-h-screen">
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <!-- Encabezado -->
    <header class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Mascotas</h1>
      <button class="flex justify-between px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        <Icon icon="gridicons:add" class="size-6 mr-2" />
        <span class="hidden md:block">Agregar Mascota</span>
      </button>
    </header>

    <!-- Tabla de usuarios -->
    <template v-if="isLoading">
      <div class="card flex justify-center">
        <ProgressSpinner style="width: 50px; height: 50px" stroke-width="8" fill="transparent" animation-duration=".5s" aria-label="Custom ProgressSpinner" />
      </div>
    </template>
    <template v-else>
      <DataTable
        :value="pets"
        :paginator="true"
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        :filters="filters"
        :filter-display="'menu'"
        :global-filter-fields="['name', 'breed.name', 'sterilized', 'owner.name', 'breed.specie.name']"
        responsive-layout="scroll"
        class="shadow-lg rounded-lg border border-gray-200"
        paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        paginator-class="bg-gray-50 border-t text-sm text-gray-600 py-2 px-4"
        current-page-report-template="Mostrando {first} a {last} de {totalRecords} mascotas"
        current-page-report-class="text-sm text-gray-500"
      >
        <template #header>
          <div class="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-t-lg border-b">
            <div class="relative w-full max-w-md">
              <input
                v-model="filters['global'].value"
                type="text"
                placeholder="Buscar..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon icon="mdi:magnify" class="text-gray-400 size-5" />
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <label for="sterilized-filter" class="text-sm font-medium text-gray-700">Mostrar No Esterilizados</label>
              <input
                id="sterilized-filter"
                v-model="showNotSterilized"
                type="checkbox"
                class="toggle-checkbox h-6 w-11 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </template>
        <template #empty> No se encontraron mascotas </template>
        <template #loading> Cargando mascotas. Por favor espere </template>
        <!-- Encabezados de columnas -->
        <Column field="name" header="Nombre" sortable filter filter-placeholder="Buscar por nombre"></Column>
        <Column field="breed.specie.name" header="Especie" sortable filter filter-placeholder="Buscar por nombre"></Column>
        <Column field="breed.name" header="Raza" sortable filter filter-placeholder="Buscar por nombre"></Column>
        <Column field="sterilized" header="Esterilizado" sortable>
          <template #body="slotProps">
            <span
              class="px-2 py-1 rounded-full text-sm"
              :class="{
                'bg-green-100 text-green-700': slotProps.data.sterilized,
                'bg-red-100 text-red-700': !slotProps.data.sterilized
              }"
            >
              {{ slotProps.data.sterilized ? 'Esterilizado' : 'No Esterilizado' }}
            </span>
          </template>
        </Column>
        <Column header="Fecha de Nacimiento">
          <template #body="slotProps">
            <div>
              <p>{{ formatBirthDate(slotProps.data.birth_date) }}</p>
              <p class="text-gray-500 text-sm">({{ calculateAge(slotProps.data.birth_date) }})</p>
            </div>
          </template>
        </Column>
        <Column field="owner.name" header="Propietario" sortable filter filter-placeholder="Buscar por nombre"></Column>
        <Column header="Acciones" style="width: 20%">
          <template #body="slotProps">
            <div class="flex space-x-2">
              <button class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Editar</button>
              <button class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600" @click="deletePet(slotProps.data.id)">Eliminar</button>
            </div>
          </template>
        </Column>
      </DataTable>
    </template>

    <!-- Modal para agregar/editar usuario -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-md w-[400px] p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingUser ? 'Editar Usuario' : 'Agregar Usuario' }}</h2>
        <form @submit.prevent="savePet">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2">Nombre</label>
            <input id="name" v-model="petForm!.name" type="text" class="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-bold mb-2">Correo</label>
            <input id="email" v-model="petForm.email" type="email" class="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div class="mb-4">
            <label for="role" class="block text-gray-700 font-bold mb-2">Rol</label>
            <select id="role" v-model="petForm.role" class="w-full border border-gray-300 rounded-md p-2" required>
              <option value="">Seleccionar</option>
              <option value="Admin">Admin</option>
              <option value="Veterinarian">Veterinario</option>
              <option value="Assistant">Asistente</option>
              <option value="Client">Cliente</option>
            </select>
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
import { onMounted, ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ConfirmDialog, ProgressSpinner, Toast, useToast } from 'primevue'
import { FilterMatchMode } from '@primevue/core/api'
import { useConfirm } from 'primevue/useconfirm'
import { petsService } from '@/services/pets.service'
import { addMonths, addYears, differenceInDays, differenceInMonths, differenceInYears, format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Pet } from '@/interfaces/Pet.interface'

const pets = ref<Pet[]>([])
const isLoading = ref(false)
const showNotSterilized = ref(false)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  sterilized: { value: null as boolean | null, matchMode: FilterMatchMode.EQUALS }
})

watch(showNotSterilized, (newValue) => {
  filters.value.sterilized.value = newValue ? false : null // Filtrar solo no esterilizados o todos
})

// Prime Vue
const confirm = useConfirm()
const toast = useToast()

// Modal y formulario
const showModal = ref(false)
const editingUser = ref(false)
const petForm = ref<{ id: string | null; name: string; email: string; role: string }>({ id: null, name: '', email: '', role: '' })

// Funciones
// Función para formatear la fecha en formato legible
const formatBirthDate = (birthDate: string) => {
  return format(new Date(birthDate), 'dd/MMMM/yyyy', { locale: es })
}

// Función para calcular la edad en años, meses y días
const calculateAge = (birthDate: string) => {
  const now = new Date()
  const birth = new Date(birthDate)

  const years = differenceInYears(now, birth)
  const months = differenceInMonths(now, addYears(birth, years))
  const days = differenceInDays(now, addYears(addMonths(birth, months), years))

  return `${years} años, ${months} meses, ${days} días`
}

// Eliminar mascota
const deletePet = (id: string) => {
  confirm.require({
    message: '¿Estás seguro de que deseas eliminar esta mascota?',
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    acceptClass: 'bg-red-500 border-none text-white hover:bg-red-600',
    accept: () => {
      pets.value = pets.value.filter((pet) => pet.id !== id)
      // TODO: Llamar a la API para eliminar la mascota
      toast.add({ severity: 'success', summary: 'Confirmación', detail: 'Mascota eliminada exitosamente', life: 3000 })
    }
  })
}

// Cerrar modal
const closeModal = () => {
  showModal.value = false
  petForm.value = { id: null, name: '', email: '', role: '' }
}

// Guardar mascota
const savePet = () => {
  // TODO: Implementar lógica para guardar la mascota
  console.log('Mascota guardada')
  closeModal()
}

onMounted(() => {
  isLoading.value = true
  petsService
    .fetchPets()
    .then((response) => {
      pets.value = response
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      console.log('Petición de mascotas completada')
      isLoading.value = false
    })
})
</script>

<style scoped></style>
