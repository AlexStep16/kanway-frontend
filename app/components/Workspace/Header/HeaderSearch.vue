<script setup lang="ts">
const uiStore = useUIStore()
</script>

<template>
  <div class="max-w-70">
    <div class="hidden sm:block">
      <SearchBox variant="dropdown" />
    </div>

    <!-- Mobile Icon -->
    <button
      @click="uiStore.isMobileSearchOpen = !uiStore.isMobileSearchOpen"
      type="button"
      class="flex items-center justify-center text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-200 focus:bg-blue-100 focus:text-blue-500 transition-colors duration-100 rounded-md ms-2 sm:hidden"
    >
      <svg
        class="shrink-0 size-5"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle
          cx="11"
          cy="11"
          r="8"
        ></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
    </button>
  </div>
</template>
