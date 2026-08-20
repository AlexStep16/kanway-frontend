<template>
  <div class="bg-background pt-6 px-4 md:px-8 pb-4 text-center space-y-2 flex-none">
    <div class="h-8 w-48 bg-zinc-200 rounded-lg animate-pulse mx-auto" />
    <div class="h-4 w-64 bg-zinc-100 rounded-md animate-pulse mx-auto" />
  </div>

  <div class="flex-1 min-h-0 overflow-y-auto px-2 md:px-10 pb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
      <div
        v-for="i in 3"
        :key="i"
        class="rounded-md bg-zinc-100 animate-pulse min-h-65"
      />
    </div>
  </div>
</template>
