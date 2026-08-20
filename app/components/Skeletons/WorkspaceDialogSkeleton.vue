<template>
  <div class="flex flex-col gap-4">
    <div class="h-5 w-44 bg-zinc-200/80 rounded-md animate-pulse" />

    <div class="flex flex-col gap-1">
      <div class="h-4 w-16 bg-zinc-200/60 rounded-md animate-pulse" />
      <div class="h-9 w-full bg-zinc-100 rounded-md animate-pulse" />
    </div>

    <div class="flex flex-col gap-1">
      <div class="h-4 w-10 bg-zinc-200/60 rounded-md animate-pulse" />
      <div class="flex gap-2 flex-wrap">
        <div
          v-for="i in 8"
          :key="i"
          class="size-7 rounded-full bg-zinc-200 animate-pulse"
        />
      </div>
    </div>
  </div>

  <Separator />

  <div class="flex justify-end gap-2">
    <div class="h-8 w-18 bg-zinc-100 rounded-md animate-pulse" />
    <div class="h-8 w-18 bg-zinc-200 rounded-md animate-pulse" />
  </div>
</template>
