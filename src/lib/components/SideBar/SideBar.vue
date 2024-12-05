<template>
  <div v-if="isOpen" class="fixed bottom-0 top-0 left-0 right-0 blur bg-red-400 z-20" @click="emit('toggleDrawer')" />
  <aside
    class="w-[300px] max-h-screen overflow-auto h-screen bg-[#C6CFD5] transition-all duration-300 fixed top-0 left-0 bottom-0 z-20 md:static min-w-[300px]"
    :class="{ '-ml-[300px] md:ml-0': !isOpen }"
  >
    <slot />
  </aside>
</template>

<script setup lang="ts">
defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ toggleDrawer: [] }>()
</script>

<style scoped></style>
