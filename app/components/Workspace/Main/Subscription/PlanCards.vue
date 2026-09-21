<script setup lang="ts">
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { Check, X } from '@lucide/vue'
import SubscriptionPlanButton from '~/components/Subscription/SubscriptionPlanButton.vue'
import { AI_MODEL_OPTIONS } from '~/constants/AI_MODEL_OPTIONS'

defineProps<{
  isHeightIncreased?: boolean
}>()

const { isPending: isSubscriptionsLoading } = useSubscriptions()

const baseModels = AI_MODEL_OPTIONS.filter((model) => !model.isPro)
const proModels = AI_MODEL_OPTIONS.filter((model) => model.isPro)
const baseModelsLabel = baseModels.map((model) => model.label).join(', ')
</script>

<template>
  <div class="grid gap-2 grid-flow-row auto-rows-max w-full">
    <template v-if="isSubscriptionsLoading">
      <div class="rounded-md bg-gray-300 grow animate-pulse h-58 w-40"></div>
      <div class="rounded-md bg-gray-300 grow animate-pulse h-58 w-40"></div>
      <div class="rounded-md bg-gray-300 grow animate-pulse h-58 w-40"></div>
    </template>
    <template v-else>
      <div
        class="rounded-md bg-white border border-gray-200"
        :class="{ 'min-h-65': isHeightIncreased }"
      >
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col size-full gap-y-1">
            <span class="text-sm font-medium text-gray-800">Базовый</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold"
              >0<span class="text-sm font-medium">₽/месяц</span></span
            >
            <ul class="space-y-2 text-xs text-left grow">
              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 1 пространство </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 5 досок </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 200 кредитов </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500">
                  Базовые модели:
                  <span class="font-medium">{{ baseModelsLabel }}</span>
                </span>
              </li>

              <li class="flex items-center gap-x-1">
                <X class="size-3.5 text-gray-500 shrink-0" />
                <span class="text-gray-500"> Приоритетная поддержка </span>
              </li>

              <li class="flex items-center gap-x-1">
                <X class="size-3.5 text-gray-500 shrink-0" />
                <span class="text-gray-500">
                  Доступ к моделям
                  <TooltipProvider :disableHoverableContent="true">
                    <Tooltip :delayDuration="300">
                      <TooltipTrigger as-child>
                        <span
                          class="ml-0.5 inline-flex cursor-default items-center rounded bg-linear-to-r from-blue-500 to-violet-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white align-middle"
                        >
                          PRO
                        </span>
                      </TooltipTrigger>
                      <TooltipContent class="text-left">
                        <ul class="space-y-0.5">
                          <li
                            v-for="model in proModels"
                            :key="model.value"
                          >
                            {{ model.label }}
                          </li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </li>

              <li class="flex items-center gap-x-1">
                <X class="size-3.5 text-gray-500 shrink-0" />
                <span class="text-gray-500"> Приоритетная очередь генерации </span>
              </li>
            </ul>

            <SubscriptionPlanButton :plan="SubscriptionPlanEnum.Basic" />
          </div>
        </div>
      </div>

      <div
        class="rounded-md bg-white border border-gray-200"
        :class="{ 'min-h-65': isHeightIncreased }"
      >
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col size-full gap-y-1">
            <span class="text-sm font-medium text-gray-800">Премиум</span>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold"
                >999<span class="text-sm font-medium">₽/месяц</span></span
              >
            </span>
            <ul class="space-y-2 text-xs text-left grow">
              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 5 пространств </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 20 досок </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 10 000 кредитов </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500">
                  Базовые модели:
                  <span class="font-medium">{{ baseModelsLabel }}</span>
                </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Приоритетная поддержка </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500">
                  Доступ к моделям
                  <TooltipProvider :disableHoverableContent="true">
                    <Tooltip :delayDuration="300">
                      <TooltipTrigger as-child>
                        <span
                          class="ml-0.5 inline-flex cursor-default items-center rounded bg-linear-to-r from-blue-500 to-violet-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white align-middle"
                        >
                          PRO
                        </span>
                      </TooltipTrigger>
                      <TooltipContent class="text-left">
                        <ul class="space-y-0.5">
                          <li
                            v-for="model in proModels"
                            :key="model.value"
                          >
                            {{ model.label }}
                          </li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </li>

              <li class="flex items-center gap-x-1">
                <X class="size-3.5 text-gray-500 shrink-0" />
                <span class="text-gray-500"> Приоритетная очередь генерации </span>
              </li>
            </ul>

            <SubscriptionPlanButton :plan="SubscriptionPlanEnum.Premium" />
          </div>
        </div>
      </div>

      <div
        class="rounded-md bg-white border border-gray-200"
        :class="{ 'min-h-65': isHeightIncreased }"
      >
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col gap-y-1 size-full">
            <span class="text-sm font-medium text-gray-800">Архитектор</span>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold"
                >2499<span class="text-sm font-medium">₽/месяц</span></span
              >
            </span>
            <ul class="space-y-2 text-xs text-left grow">
              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Неограниченно пространств </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Неограниченно досок </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 25 000 кредитов </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500">
                  Базовые модели:
                  <span class="font-medium">{{ baseModelsLabel }}</span>
                </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Приоритетная поддержка </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500">
                  Доступ к моделям
                  <TooltipProvider :disableHoverableContent="true">
                    <Tooltip :delayDuration="300">
                      <TooltipTrigger as-child>
                        <span
                          class="ml-0.5 inline-flex cursor-default items-center rounded bg-linear-to-r from-blue-500 to-violet-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white align-middle"
                        >
                          PRO
                        </span>
                      </TooltipTrigger>
                      <TooltipContent class="text-left">
                        <ul class="space-y-0.5">
                          <li
                            v-for="model in proModels"
                            :key="model.value"
                          >
                            {{ model.label }}
                          </li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Приоритетная очередь генерации </span>
              </li>
            </ul>

            <SubscriptionPlanButton :plan="SubscriptionPlanEnum.Architector" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
