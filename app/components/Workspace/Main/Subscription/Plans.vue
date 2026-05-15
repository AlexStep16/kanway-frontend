<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
import PlanCards from './PlanCards.vue'

const uiStore = useUIStore()
</script>

<template>
  <Dialog v-model:open="uiStore.isPlansModalOpen">
    <DialogContent
      class="max-h-[95svh] p-0 overflow-hidden border-none shadow-2xl rounded-sm flex flex-col md:rounded-xl"
    >
      <div class="bg-background pt-8 px-6 md:px-10 pb-4 text-center space-y-2 flex-none">
        <DialogTitle class="text-2xl md:text-3xl font-bold text-foreground">
          Доступные планы
        </DialogTitle>
        <DialogDescription class="text-muted-foreground text-sm md:text-base">
          Выберите подходящий план для ваших нужд.
        </DialogDescription>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto px-6 md:px-10 pb-8">
        <div class="w-full">
          <PlanCards
            :isOneRow="true"
            :isHeightIncreased="true"
          />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
