<template>
  <div class="users-table p-6 bg-gray-100 min-h-screen">
    <!-- Encabezado -->
    <header class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Usuarios</h1>
      <button class="flex justify-between px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" @click="addUser">
        <Icon icon="mdi:users-plus" class="size-6 mr-2" />
        <span class="hidden md:block">Agregar Usuario</span>
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
        :value="users"
        :paginator="true"
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        :filters="filters"
        :filter-display="'menu'"
        :global-filter-fields="['name', 'email', 'role']"
        responsive-layout="scroll"
        class="shadow-lg rounded-lg border border-gray-200"
        paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        paginator-class="bg-gray-50 border-t text-sm text-gray-600 py-2 px-4"
        current-page-report-template="Mostrando {first} a {last} de {totalRecords} usuarios"
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
          </div>
        </template>
        <template #empty> No se encontraron usuarios </template>
        <template #loading> Cargando usuarios. Por favor espere </template>
        <!-- Encabezados de columnas -->
        <Column field="id" header="ID" sortable></Column>
        <Column field="name" header="Nombre" sortable filter filter-placeholder="Buscar por nombre"></Column>
        <Column field="email" header="Correo" sortable filter filter-placeholder="Buscar por correo"></Column>
        <Column field="role.name" header="Rol" sortable filter filter-placeholder="Buscar por rol"></Column>
        <Column header="Acciones" style="width: 20%">
          <template #body="slotProps">
            <button class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2" @click="editUser(slotProps.data)">Editar</button>
            <button class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600" @click="deleteUser(slotProps.data.id)">Eliminar</button>
          </template>
        </Column>
      </DataTable>
    </template>

    <!-- Modal para agregar/editar usuario -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-md w-[400px] p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingUser ? 'Editar Usuario' : 'Agregar Usuario' }}</h2>
        <form @submit.prevent="saveUser">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2">Nombre</label>
            <input id="name" v-model="userForm!.name" type="text" class="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-bold mb-2">Correo</label>
            <input id="email" type="email" class="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div class="mb-4">
            <label for="role" class="block text-gray-700 font-bold mb-2">Rol</label>
            <select id="role" class="w-full border border-gray-300 rounded-md p-2" required>
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
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { usersService } from '@/services/users.service'
import { ProgressSpinner } from 'primevue'
import { FilterMatchMode } from '@primevue/core/api'
import type { User, UserWithoutRole } from '@/interfaces/User.interface'

// Datos simulados de usuarios
const users = ref<User[]>([])
const isLoading = ref(false)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  role_id: { value: null, matchMode: FilterMatchMode.IN }
})

// Modal y formulario
const showModal = ref(false)
const editingUser = ref(false)
const userForm = ref<UserWithoutRole | null>({ id: '', name: '', email: '', password: '', phone: '', avatar: '', email_verified_at: '', role_id: 1 })

// Agregar usuario
const addUser = () => {
  userForm.value = { id: '', name: '', email: '', password: '', phone: '', avatar: '', email_verified_at: '', role_id: 1 }
  editingUser.value = false
  showModal.value = true
}

// Editar usuario
const editUser = (user: User) => {
  userForm.value = { ...user }
  editingUser.value = true
  showModal.value = true
}

// Guardar usuario
const saveUser = () => {
  closeModal()
}

// Eliminar usuario
const deleteUser = (id: string) => {
  users.value = users.value.filter((user) => user.id !== id)
}

// Cerrar modal
const closeModal = () => {
  showModal.value = false
  userForm.value = { id: '', name: '', email: '', password: '', phone: '', avatar: '', email_verified_at: '', role_id: 1 }
}

onMounted(() => {
  isLoading.value = true
  usersService
    .fetchUsers()
    .then((response) => {
      users.value = response
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      console.log('Petición de usuarios completada')
      isLoading.value = false
    })
})
</script>

<style scoped>
/* Personalización opcional */
</style>
