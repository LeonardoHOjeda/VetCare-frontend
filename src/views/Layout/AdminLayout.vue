<template>
  <div class="flex">
    <SideBar :is-open="isDrawerOpen" @toggle-drawer="toggleDrawer">
      <div class="mt-3">
        <div class="flex items-center justify-center mx-5 relative">
          <div>
            <img :src="adminPhoto" :alt="adminName" class="w-20 mx-auto rounded-full" />
            <div class="text-center">
              <p class="font-bold text-xl mt-1">{{ adminName }}</p>
              <p class="text-md text-gray-700">Administrador</p>
            </div>
          </div>
          <button v-if="isDrawerOpen" class="absolute top-4 right-4" @click="toggleDrawer">
            <Icon icon="material-symbols:menu" />
          </button>
        </div>
        <hr class="my-3" />
        <div class="mx-5">
          <p class="font-bold mt-5 hidden md:block">Menu</p>
          <div v-for="menu in userMenus" :key="menu.name" class="hidden md:block items-center rounded-lg hover:cursor-pointer hover:bg-primary-100 duration-500 py-0">
            <SideBarMenu :icon="menu.icon" :route="menu.route" :name="menu.name" :on-click="menu.onClick" />
          </div>
          <div class="items-center rounded-lg hover:cursor-pointer hover:bg-primary-100 duration-500 py-0 absolute bottom-0 mb-4 w-[260px]">
            <div class="p-2 flex items-center">
              <SideBarMenu custom-class="text-center justify-center" icon="mdi:power" name="Cerrar Sesión" @click="logout" />
            </div>
          </div>
        </div>
      </div>
    </SideBar>

    <div class="flex-grow max-w-full min-h-screen bg-[#F0F2F5] md:max-h-screen overflow-auto">
      <Topbar>
        <button @click="toggleDrawer">
          <IconBars />
        </button>
        <button @click="toggleModalSearch">
          <IconSearch class="w-6 h-6" path-class-name="fill-gray-700" />
        </button>
      </Topbar>

      <div class="md:flex md:mt-0">
        <div class="flex-grow">
          <!--<div class="sticky top-0 z-50 bg-gray-50 w-full h-14 hidden md:flex items-center justify-end pr-6">
              
          </div>-->

          <div class="px-4 md:px-0">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>

  <SearchModal :visible="isModalSearchOpen" @close="toggleModalSearch"></SearchModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SideBar, SideBarMenu } from '@/lib/components'
import { localStorageService } from '@/services/localStorage.service'

const isDrawerOpen = ref(false)
const isModalSearchOpen = ref(false)

const adminName = ref<any>('')
const adminPhoto = ref<any>('https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png')

const router = useRouter()

onMounted(() => {
  const userValue = localStorageService.user?.user
  adminName.value = userValue?.name
  adminPhoto.value = userValue?.avatar
})

const userMenus: any = [
  {
    name: 'Inicio',
    icon: 'mingcute:grid-line',
    route: 'admin-home'
  },
  {
    name: 'Administrador de Citas',
    icon: 'material-symbols:pending-actions',
    route: 'admin-appointment'
  },
  {
    name: 'Estadísticas',
    icon: 'mdi:chart-line',
    route: 'admin-statistics'
  },
  {
    name: 'Calendario',
    icon: 'mdi:calendar',
    route: 'admin-calendar'
  },
  {
    name: 'Mascotas',
    icon: 'ic:outline-pets',
    route: 'admin-pets'
  },
  {
    name: 'Usuarios',
    icon: 'mdi:users',
    route: 'admin-users'
  },
  {
    name: 'Jaulas',
    icon: 'game-icons:bird-cage',
    route: 'admin-cages'
  }
  // {
  //   name: 'Citas',
  //   icon: 'line-md:calendar'
  // },
  // {
  //   name: 'Cirugías',
  //   icon: 'carbon:scalpel'
  // },
  // {
  //   name: 'Configuración',
  //   icon: 'ic:round-settings',
  //   class: 'md:hidden'
  // }
]

const logout = async () => {
  localStorageService.clear()
  router.replace({ name: 'login' })
}
const toggleDrawer = () => (isDrawerOpen.value = !isDrawerOpen.value)
const toggleModalSearch = () => {
  isModalSearchOpen.value = !isModalSearchOpen.value
}
</script>
