<script setup lang="ts">
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

defineProps<{
  title: string
  stateClasses: Record<string, boolean>
  accordionItemValue: string
  items: ITextValue[]
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
            class="shrink-0"
            :class="stateClasses"
          >
            {{ title }}
          </span>
        </div>
      </AccordionTrigger>

      <div class="ml-4 mt-2 flex flex-col gap-y-2">
        <ToolCallFiltersList :items="items" />
        <AccordionContent class="pb-1 overflow-hidden py-3">
          <div class="max-h-100 custom-scrollbar overflow-y-auto overflow-x-hidden pr-1">
            <slot name="log" />
          </div>
        </AccordionContent>
        <slot name="actions" />
      </div>
    </AccordionItem>
  </Accordion>
</template>
