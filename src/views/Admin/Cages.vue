<template>
  <div class="cages-table p-6 bg-gray-100 min-h-screen">
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <!-- Encabezado -->
    <header class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Jaulas</h1>
      <button class="flex justify-between px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" @click="openModal">
        <Icon icon="gridicons:add" class="size-6 mr-2" />
        <span class="hidden md:block">Agregar Jaula</span>
      </button>
    </header>

    <!-- Tabla de jaulas -->
    <template v-if="isLoading">
      <div class="card flex justify-center">
        <ProgressSpinner style="width: 50px; height: 50px" stroke-width="8" fill="transparent" animation-duration=".5s" aria-label="Cargando" />
      </div>
    </template>
    <template v-else>
      <DataTable
        :value="cages"
        :paginator="true"
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        responsive-layout="scroll"
        class="shadow-lg rounded-lg border border-gray-200"
        paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        paginator-class="bg-gray-50 border-t text-sm text-gray-600 py-2 px-4"
        current-page-report-template="Mostrando {first} a {last} de {totalRecords} jaulas"
        current-page-report-class="text-sm text-gray-500"
      >
        <template #header>
          <div class="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-t-lg border-b">
            <div class="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Buscar..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon icon="mdi:magnify" class="text-gray-400 size-5" />
              </div>
            </div>
          </div>
        </template>
        <template #empty> No se encontraron jaulas </template>
        <template #loading> Cargando jaulas. Por favor espere </template>
        <!-- Encabezados de columnas -->
        <Column field="name" header="Nombre" sortable></Column>
        <Column field="food_level" header="Nivel Comida" sortable></Column>
        <Column field="water_level" header="Nivel Agua" sortable></Column>
        <Column field="temperature" header="Temperatura" sortable>
          <template #body="slotProps">
            <span
              class="px-2 py-1 rounded-full text-sm"
              :class="{
                'bg-blue-100 text-blue-700': slotProps.data.temperature < 20,
                'bg-green-100 text-green-700': slotProps.data.temperature >= 20 && slotProps.data.temperature <= 30,
                'bg-yellow-100 text-yellow-700': slotProps.data.temperature > 30
              }"
            >
              {{ slotProps.data.temperature }}°C
            </span>
          </template>
        </Column>
        <Column field="is_ocuppied" header="Estado" sortable>
          <template #body="slotProps">
            <span
              class="px-2 py-1 rounded-full text-sm"
              :class="{
                'bg-green-100 text-green-700': !slotProps.data.is_ocuppied,
                'bg-red-100 text-red-700': slotProps.data.is_ocuppied
              }"
            >
              {{ !slotProps.data.is_ocuppied ? 'Disponible' : 'Ocupada' }}
            </span>
          </template>
        </Column>
        <Column field="is_cleaned" header="Aseo" sortable>
          <template #body="slotProps">
            <span
              class="px-2 py-1 rounded-full text-sm"
              :class="{
                'bg-green-100 text-green-700': slotProps.data.is_cleaned,
                'bg-red-100 text-red-700': !slotProps.data.is_cleaned
              }"
            >
              {{ slotProps.data.is_cleaned ? 'Limpia' : 'Sucia' }}
            </span>
          </template>
        </Column>
        <Column header="Acciones" style="width: 20%">
          <template #body="slotProps">
            <div class="flex space-x-2">
              <button class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600" @click="editCage(slotProps.data)">Editar</button>
              <button class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600" @click="deleteCage(slotProps.data.id)">Eliminar</button>
            </div>
          </template>
        </Column>
      </DataTable>
    </template>

    <!-- Modal para agregar/editar jaula -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-md w-[400px] p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingCage ? 'Editar Jaula' : 'Agregar Jaula' }}</h2>
        <form @submit.prevent="saveCage">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2">Nombre</label>
            <input id="name" v-model="cageForm.name" type="text" class="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2">Estado</label>
            <div class="flex items-center space-x-2">
              <span class="text-sm">{{ cageForm.is_ocuppied ? 'Ocupada' : 'Disponible' }}</span>
              <button
                type="button"
                class="relative inline-flex items-center h-6 w-11 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="cageForm.is_ocuppied ? 'bg-blue-500' : 'bg-gray-300'"
                @click="cageForm.is_ocuppied = !cageForm.is_ocuppied"
              >
                <span class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform" :class="cageForm.is_ocuppied ? 'translate-x-5' : 'translate-x-1'"></span>
              </button>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2">Limpieza</label>
            <div class="flex items-center space-x-2">
              <span class="text-sm">{{ cageForm.is_cleaned ? 'Limpia' : 'Sucia' }}</span>
              <button
                type="button"
                class="relative inline-flex items-center h-6 w-11 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="cageForm.is_cleaned ? 'bg-blue-500' : 'bg-gray-300'"
                @click="cageForm.is_cleaned = !cageForm.is_cleaned"
              >
                <span class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform" :class="cageForm.is_cleaned ? 'translate-x-5' : 'translate-x-1'"></span>
              </button>
            </div>
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
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ConfirmDialog, Toast, useToast } from 'primevue'
import { cagesService } from '@/services/cages.service'
import type { Cage } from '@/interfaces/Cage.interface'

const cages = ref<Cage[]>([])
const isLoading = ref(false)
const showModal = ref(false)
const editingCage = ref(false)
const cageForm = ref<Cage>({ id: 0, name: '', is_cleaned: true, is_ocuppied: false })

const toast = useToast()

const openModal = () => {
  editingCage.value = false
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveCage = async () => {
  if (editingCage.value) {
    try {
      const cageId: number = cageForm.value.id

      const updatedCage = await cagesService.updateCage(cageId, cageForm.value)

      // Actualiza la jaula en el array del frontend
      const index = cages.value.findIndex((cage) => cage.id === cageId)
      if (index !== -1) {
        cages.value[index] = updatedCage
      }
      toast.add({ severity: 'success', summary: 'Actualización', detail: 'Jaula actualizada exitosamente', life: 3000 })
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al actualizar la jaula', life: 3000 })
    }
  } else {
    try {
      await cagesService.storeCage({ ...cageForm.value, food_level: 0, water_level: 0, temperature: 0 })
      cages.value.push({ ...cageForm.value, food_level: 0, water_level: 0, temperature: 0 })
      toast.add({ severity: 'success', summary: 'Creación', detail: 'Jaula agregada exitosamente', life: 3000 })
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al agregar la jaula', life: 3000 })
    }
  }
  closeModal()
}

const editCage = (cage: Cage) => {
  editingCage.value = true
  cageForm.value = { ...cage }
  showModal.value = true
}

const deleteCage = (id: number) => {
  // TODO: Confirmar y eliminar jaula
  toast.add({ severity: 'success', summary: 'Eliminación', detail: 'Jaula eliminada exitosamente', life: 3000 })
}

onMounted(() => {
  isLoading.value = true
  cagesService
    .fetchCages()
    .then((response) => {
      cages.value = response
    })
    .catch((error) => console.error(error))
    .finally(() => (isLoading.value = false))
})
</script>

<style scoped></style>
