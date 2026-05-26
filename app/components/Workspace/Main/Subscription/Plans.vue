<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
import PlanCards from './PlanCards.vue'

const uiStore = useUIStore()
</script>

<template>
  <Dialog v-model:open="uiStore.isPlansModalOpen">
    <DialogContent
      class="max-h-[95svh] md:min-w-170 lg:min-w-220 p-2 overflow-hidden border-none shadow-2xl rounded-sm flex flex-col md:rounded-xl"
    >
      <div class="bg-background pt-6 px-4 md:px-8 pb-4 text-center space-y-2 flex-none">
        <DialogTitle class="text-2xl md:text-3xl font-bold text-foreground">
          Доступные планы
        </DialogTitle>
        <DialogDescription class="text-muted-foreground text-sm md:text-base">
          Выберите подходящий план для ваших нужд.
        </DialogDescription>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto px-2 md:px-10 pb-8 custom-scrollbar">
        <div class="w-full">
          <PlanCards
            class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            :isHeightIncreased="true"
          />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
