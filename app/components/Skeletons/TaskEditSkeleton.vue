<template>
  <div class="flex flex-col bg-background overflow-hidden">
    <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-border">
      <div class="h-7 w-28 bg-zinc-100 rounded-lg animate-pulse" />
      <div class="flex gap-2">
        <div
          v-for="i in 3"
          :key="i"
          class="h-7 w-7 bg-zinc-100 rounded-lg animate-pulse"
        />
      </div>
    </div>

    <div class="p-4 flex flex-col gap-y-2">
      <div class="h-6 w-3/4 bg-zinc-200/80 rounded-md animate-pulse" />
      <div class="h-4 w-full bg-zinc-100 rounded-md animate-pulse mt-1" />
      <div class="h-4 w-2/3 bg-zinc-100 rounded-md animate-pulse" />

      <div class="flex flex-wrap gap-1.5 mt-1">
        <div
          v-for="i in 2"
          :key="i"
          class="h-6 w-16 bg-zinc-100 rounded-sm animate-pulse"
        />
      </div>
    </div>

    <div class="flex flex-wrap gap-2 px-4 py-4 border-t bg-muted/5">
      <div
        v-for="i in 3"
        :key="i"
        class="h-8 w-22 bg-zinc-100 rounded-md animate-pulse"
      />
    </div>
  </div>
</template>
