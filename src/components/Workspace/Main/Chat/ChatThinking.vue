<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { computed } from 'vue'
import { Check, X, Square } from 'lucide-vue-next'
import Spinner from '@/components/ui/spinner/Spinner.vue'

const props = defineProps<{
  steps: {
    id: string
    name: string
    state: 'in_progress' | 'completed' | 'failed' | 'cancelled'
  }[]
  isContentFullWidth?: boolean
  isSending?: boolean
}>()

// Берем последний шаг из массива
const activeStep = computed(() => {
  return props.steps.length > 0 ? props.steps.at(-1) : null
})

const isAllStepsCompleted = computed(() => {
  if (props.steps.length === 0) return false

  return !props.steps.some((step) => step.state === 'in_progress')
})
</script>

<template>
  <Accordion
    type="single"
    class="w-full"
    :class="{
      'sm:w-full max-w-[90%]': isContentFullWidth,
      'max-w-[90%] sm:max-w-lg': !isContentFullWidth,
    }"
    collapsible
  >
    <AccordionItem class="border-none" value="item-1">
      <div
        class="w-full border rounded-md overflow-hidden flex flex-col"
        v-if="!isSending && activeStep"
      >
        <div class="p-2 text-sm overflow-hidden relative h-9 flex items-center">
          <Transition name="slide-up">
            <div :key="activeStep.id" class="flex items-center gap-x-2">
              <template v-if="activeStep.state === 'failed'">
                <div class="rounded-full size-4 flex items-center justify-center bg-red-500">
                  <X class="size-2.5 text-white" strokeWidth="4" />
                </div>
                <span>{{ activeStep.name }}</span>
              </template>
              <template v-else-if="activeStep.state === 'cancelled'">
                <div
                  class="rounded-full size-4 flex items-center justify-center bg-muted-foreground"
                >
                  <Square class="size-2 text-white" fill="#FFF" />
                </div>
                <span>{{ activeStep.name }}</span>
              </template>
              <template v-else-if="isAllStepsCompleted">
                <div class="rounded-full size-4 flex items-center justify-center bg-green-600">
                  <Check class="size-2.5 text-white" strokeWidth="4" />
                </div>
                <span class="text-muted-foreground">Все шаги выполнены</span>
              </template>
              <template v-else>
                <span class="shimmer-text">{{ activeStep.name }}...</span>
              </template>
            </div>
          </Transition>
        </div>

        <template v-if="steps.length">
          <AccordionTrigger class="border-t p-2 text-xs text-muted-foreground bg-muted">
            Развернуть шаги выполнения
          </AccordionTrigger>

          <AccordionContent class="flex flex-col gap-1 p-2">
            <div
              class="flex items-center justify-start text-foreground gap-x-2"
              v-for="step in steps"
              :key="step.id"
            >
              <div
                class="rounded-full size-4 flex items-center justify-center bg-green-600"
                v-if="step.state === 'completed'"
              >
                <Check class="size-2.5 text-white" strokeWidth="4" />
              </div>
              <div
                class="rounded-full size-4 flex items-center justify-center bg-red-500"
                v-else-if="step.state === 'failed'"
              >
                <X class="size-2.5 text-white" strokeWidth="4" />
              </div>
              <div
                class="rounded-full size-4 flex items-center justify-center bg-muted-foreground"
                v-else-if="step.state === 'cancelled'"
              >
                <Square class="size-2 text-white" fill="#FFF" />
              </div>
              <Spinner
                class="size-4 text-muted-foreground"
                v-else-if="step.state === 'in_progress'"
              />
              <span class="text-sm text-muted-foreground">{{ step.name }}</span>
            </div>
          </AccordionContent>
        </template>
      </div>

      <div v-else>
        <div class="text-sm overflow-hidden relative">
          <span class="shimmer-text_muted">Устанавливаю связь...</span>
        </div>
      </div>
    </AccordionItem>
  </Accordion>
</template>
