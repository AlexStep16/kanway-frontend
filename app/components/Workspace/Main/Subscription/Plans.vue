<script setup lang="ts">
import PlanCards from './PlanCards.vue'
</script>

<template>
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
</template>
