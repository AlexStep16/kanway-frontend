<template>
  <div class="relative bg-background p-6 sm:p-8">
    <div class="text-center mb-8 flex flex-col items-center gap-y-2">
      <div class="h-8 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      <div class="h-4 w-1/2 rounded-md bg-zinc-200/70 dark:bg-zinc-800/70 animate-pulse" />
    </div>

    <div class="space-y-4">
      <!-- name, email, theme fields -->
      <div
        v-for="i in 3"
        :key="i"
        class="space-y-1.5"
      >
        <div class="h-4 w-16 rounded-md bg-zinc-200/80 dark:bg-zinc-800 animate-pulse" />
        <div class="h-9 w-full rounded-md bg-zinc-100 dark:bg-zinc-900/60 animate-pulse" />
      </div>

      <!-- textarea field -->
      <div class="space-y-1.5">
        <div class="h-4 w-24 rounded-md bg-zinc-200/80 dark:bg-zinc-800 animate-pulse" />
        <div class="h-24 w-full rounded-md bg-zinc-100 dark:bg-zinc-900/60 animate-pulse" />
      </div>

      <div class="pt-2 space-y-3">
        <div class="h-9 w-full rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        <div
          class="h-3 w-2/3 mx-auto rounded-md bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse"
        />
      </div>
    </div>
  </div>
</template>
