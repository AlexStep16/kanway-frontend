<script setup lang="ts">
defineProps<{
  pluralizedTitle: string
}>()
</script>

<template>
  <Accordion
    type="single"
    collapsible
    class="min-w-0"
  >
    <AccordionItem
      value="search-completed"
      class="border-none"
    >
      <AccordionTrigger
        v-bind="$attrs"
        class="flex items-center text-xs font-normal justify-start gap-x-1 p-0 transition-all duration-300 select-none min-w-0 hover:no-underline"
      >
        <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
          <slot name="icon" />
          <span class="shrink-0 truncate">
            {{ pluralizedTitle }}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent class="max-h-100 overflow-y-auto p-3">
        <slot />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
