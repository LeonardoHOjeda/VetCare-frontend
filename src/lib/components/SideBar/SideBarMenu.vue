<template>
  <router-link v-if="!onClick" :to="{ name: route, params: params }">
    <div class="p-2 flex items-center" :class="customClass">
      <Icon :icon="icon" class="text-[#2B313F] size-7" />
      <span class="ml-3 text-[#2B313F]"> {{ name }} - </span>
    </div>
  </router-link>
  <button v-else class="w-full text-left" @click="onClick">
    <div class="p-2 flex items-center" :class="customClass">
      <Icon :icon="icon" class="text-[#2B313F] size-7" />
      <!-- #FEAE05 -->
      <span class="ml-3 text-[#2B313F]"> {{ name }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  customClass?: string
  icon: string
  route?: string
  name: string
  params?: Record<string, string>
  onClick?: () => void
}>()
</script>

<style scoped>
.router-link-active {
  background-color: green !important;
}
.router-link-exact-active {
  background-color: red !important;
}
</style>
