<template>
  <header class="flex justify-between h-12 sm:h-16 shrink-0 items-center gap-2 px-4">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1" />
      <Separator
        orientation="vertical"
        class="mr-0 data-[orientation=vertical]:h-4"
      />
      <div class="flex items-center gap-2 text-secondary-foreground">
        <Settings class="size-4 shrink-0" />
        <span class="truncate whitespace-nowrap text-sm font-medium"> Настройки </span>
      </div>
    </div>
  </header>

  <Separator />

  <div
    class="w-full flex flex-col sm:flex-row justify-center gap-4 sm:gap-2 sm:px-6 px-3 md:px-10 py-3 sm:py-4 md:py-5 overflow-hidden"
  >
    <!-- Sidebar skeleton (desktop) -->
    <div class="hidden sm:flex flex-col gap-y-4 w-50 shrink-0">
      <div
        v-for="section in skeletonSections"
        :key="section.labelWidth"
        class="flex flex-col gap-y-2"
      >
        <div
          class="h-3 rounded-md bg-zinc-200 animate-pulse"
          :style="{ width: section.labelWidth }"
        />
        <div class="flex flex-col gap-y-1">
          <div
            v-for="item in section.items"
            :key="item"
            class="h-9 rounded-lg bg-zinc-100 animate-pulse"
          />
        </div>
      </div>
    </div>

    <!-- Inline sidebar skeleton (mobile) -->
    <div class="flex sm:hidden w-full border-b border-gray-200 pb-2 gap-x-2">
      <div
        v-for="i in 5"
        :key="i"
        class="h-9 w-24 shrink-0 rounded-lg bg-zinc-100 animate-pulse"
      />
    </div>

    <!-- Content skeleton -->
    <div class="max-w-2xl w-full grow flex flex-col gap-y-6 px-2">
      <div class="h-6 bg-zinc-200/80 w-1/3 rounded-lg animate-pulse" />

      <div class="space-y-4 pt-2">
        <div
          v-for="i in 3"
          :key="i"
          class="space-y-2"
        >
          <div class="h-4 bg-zinc-200/60 w-24 rounded-md animate-pulse" />
          <div class="h-9 bg-zinc-100 w-full max-w-80 rounded-xl animate-pulse" />
        </div>
      </div>

      <div class="h-9 bg-zinc-200/80 w-28 rounded-lg animate-pulse" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings } from '@lucide/vue'

const skeletonSections = [
  { labelWidth: '60px', items: 2 },
  { labelWidth: '80px', items: 1 },
  { labelWidth: '96px', items: 2 },
]
</script>
