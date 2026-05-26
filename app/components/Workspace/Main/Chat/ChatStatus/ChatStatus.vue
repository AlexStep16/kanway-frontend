<script setup lang="ts">
import { Check, X, Square } from 'lucide-vue-next'
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import type { IStatus } from '~/interfaces/Statuses/IStatus'
import { AgentsEnum } from '~/enums/AgentsEnum'
import StatusLog from './StatusLog.vue'

const props = defineProps<{
  status: IStatus
  isContentFullWidth?: boolean
  creditsUsed?: number
}>()

function getAgentName(agent: AgentsEnum) {
  switch (agent) {
    case AgentsEnum.ORCHESTRATOR:
      return 'Оркестратор'
    case AgentsEnum.TASK_MANAGER:
      return 'Задачи'
    default:
      return 'Агент'
  }
}
</script>

<template>
  <div
    v-if="props.status"
    class="w-full flex items-center justify-start"
    :class="{
      'sm:max-w-lg': !isContentFullWidth,
    }"
  >
    <div class="flex flex-col gap-1.5 min-w-0 text-xs">
      <div class="flex items-center gap-1">
        <div class="shrink-0 flex items-center justify-center size-4">
          <Transition name="slide-up">
            <Check
              v-if="props.status.state === 'completed'"
              class="size-3.5 text-emerald-500"
              stroke-width="3"
            />

            <X
              v-else-if="props.status.state === 'failed'"
              class="size-3.5 text-red-500"
              stroke-width="3"
            />

            <Square
              v-else-if="props.status.state === 'cancelled'"
              class="size-2.5 text-muted-foreground"
              fill="currentColor"
            />

            <Spinner
              v-else-if="props.status.state === 'in_progress'"
              class="size-3.5 text-muted-foreground"
            />
          </Transition>
        </div>

        <div class="relative">
          <Transition name="slide-up">
            <div
              class="min-w-0 flex items-center gap-x-1"
              :key="props.status.statusText"
            >
              <Badge
                variant="outline"
                v-if="
                  props.status.currentAgent && props.status.currentAgent !== AgentsEnum.ORCHESTRATOR
                "
              >
                {{ getAgentName(props.status.currentAgent) }}
              </Badge>

              <span
                class="leading-none transition-all duration-300 shrink-0"
                :class="{
                  'text-muted-foreground':
                    props.status.state === StatusStatesEnum.COMPLETED ||
                    props.status.state === StatusStatesEnum.CANCELLED,
                  'text-red-500': props.status.state === StatusStatesEnum.FAILED,
                  'shimmer-text text-foreground':
                    props.status.state === StatusStatesEnum.IN_PROGRESS,
                }"
              >
                {{ props.status.statusText }}
              </span>
            </div>
          </Transition>
        </div>
      </div>

      <div class="grid grid-cols-[16px_1fr] gap-x-1">
        <div class="flex justify-center">
          <div class="w-0.5 bg-gray-300 h-full"></div>
        </div>

        <div
          class="flex flex-col gap-y-1 text-muted-foreground"
          :class="{
            'py-1': props.status.logs.length > 0,
          }"
        >
          <StatusLog
            v-for="log in props.status.logs"
            :key="log.id"
            :log="log"
          />
        </div>
      </div>

      <div
        v-if="props.creditsUsed"
        class="pt-1 text-[11px] text-muted-foreground/70"
      >
        {{ props.creditsUsed }} {{ getCreditsDeclension(props.creditsUsed) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-enter-active,
.step-leave-active {
  transition: all 0.25s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.step-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.step-move {
  transition: transform 0.25s ease;
}

.shimmer-text {
  background: linear-gradient(
    90deg,
    rgba(115, 115, 115, 0.45) 0%,
    rgba(115, 115, 115, 1) 50%,
    rgba(115, 115, 115, 0.45) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s linear infinite;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
