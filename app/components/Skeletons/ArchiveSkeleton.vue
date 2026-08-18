<template>
  <header class="flex justify-between h-12 sm:h-16 shrink-0 items-center gap-2 px-4">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1" />
      <Separator
        orientation="vertical"
        class="mr-0 data-[orientation=vertical]:h-4"
      />
      <div class="flex items-center gap-2 text-secondary-foreground">
        <Archive class="size-4 shrink-0" />
        <span class="truncate whitespace-nowrap text-sm font-medium"> Архив </span>
      </div>
    </div>
  </header>

  <Separator />

  <div class="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-y-auto custom-scrollbar">
    <div class="w-full py-2 my-1 px-0.5 flex flex-col gap-5">
      <div
        v-for="section in sections"
        :key="section"
        class="w-full flex flex-col gap-y-2"
      >
        <!-- TitleWithBadge skeleton -->
        <div class="flex items-center gap-x-2">
          <div class="h-4 w-16 rounded-md bg-skeleton/80 animate-pulse" />
          <div class="h-5 w-6 rounded-full bg-skeleton/80 animate-pulse" />
          <div class="w-full h-[.5px] bg-skeleton/80" />
        </div>

        <!-- Two-column card grid skeleton -->
        <div class="flex gap-2">
          <div
            class="flex flex-col gap-2"
            style="width: 250px"
          >
            <div
              v-for="i in 3"
              :key="i"
              class="rounded-md min-w-60 max-w-75 w-full bg-skeleton animate-pulse h-15"
            />
          </div>
          <div
            class="flex flex-col gap-2"
            style="width: 250px"
          >
            <div
              v-for="i in 2"
              :key="i"
              class="rounded-md min-w-60 max-w-75 w-full bg-skeleton animate-pulse h-15"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Archive } from '@lucide/vue'

const sections = ['tasks', 'columns', 'boards', 'workspaces']
</script>
