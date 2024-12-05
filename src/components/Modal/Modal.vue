<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg w-1/3">
      <header class="p-4 border-b">
        <slot name="header"></slot>
      </header>
      <div class="p-4">
        <slot name="body"></slot>
      </div>
      <footer class="p-4 border-t text-right">
        <button class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600" @click="$emit('close')">Cerrar</button>
      </footer>
    </div>
  </div>
</template>
