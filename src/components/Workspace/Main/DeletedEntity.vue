<template>
  <div
    class="flex flex-col relative gap-y-2 border border-gray-200 p-3 rounded-md min-w-60 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none"
  >
    <div class="flex items-center min-w-0 pr-14 pointer-fine:pr-0">
      <span class="text-red-400 text-sm overflow-hidden shrink-1 break-words truncate"
        >Удалено</span
      >
    </div>
    <slot />
  </div>
</template>
