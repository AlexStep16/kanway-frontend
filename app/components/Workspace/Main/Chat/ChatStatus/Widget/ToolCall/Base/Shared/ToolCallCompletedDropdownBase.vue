<script setup lang="ts">
defineProps<{
  pluralizedTitle: string
  accordionItemValue: string
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <Accordion
    type="single"
    collapsible
    class="min-w-0"
  >
    <AccordionItem
      :value="accordionItemValue"
      class="border-none"
    >
      <AccordionTrigger
        v-bind="$attrs"
        class="flex items-center cursor-pointer text-xs font-normal justify-start gap-x-1 p-0 transition-all duration-300 select-none min-w-0 hover:no-underline"
      >
        <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
          <slot name="icon" />
          <span
            class="shrink-0 truncate"
            :class="stateClasses"
          >
            {{ pluralizedTitle }}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent class="pb-0 overflow-hidden py-3">
        <div class="ml-4 max-h-100 custom-scrollbar overflow-y-auto overflow-x-hidden pr-1">
          <slot />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
