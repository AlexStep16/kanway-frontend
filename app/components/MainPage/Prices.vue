<script setup lang="ts">
import { Check, X } from '@lucide/vue'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import SubscriptionPlanButton from '~/components/Subscription/SubscriptionPlanButton.vue'
import { AI_MODEL_OPTIONS } from '~/constants/AI_MODEL_OPTIONS'

const baseModels = AI_MODEL_OPTIONS.filter((model) => !model.isPro)
const proModels = AI_MODEL_OPTIONS.filter((model) => model.isPro)
const baseModelsLabel = baseModels.map((model) => model.label).join(', ')
</script>

<template>
  <section class="relative z-1 overflow-hidden bg-white">
    <div class="max-w-340 mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <!-- Title -->
      <div
        data-aos="fade-down"
        data-aos-duration="1000"
        data-aos-once="true"
        class="flex flex-col gap-y-4"
      >
        <div class="max-w-2xl text-center mx-auto">
          <h1 class="block font-bold text-gray-800 text-2xl md:text-3xl lg:text-4xl">
            Выберите свой план
          </h1>
        </div>
        <!-- End Title -->

        <div class="max-w-2xl text-center mx-auto">
          <p class="md:text-lg text-gray-600">
            Начните бесплатно. Перейдите на Премиум, когда будете готовы к большему.
          </p>
        </div>
      </div>
      <!-- Grid -->
      <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">
        <!-- Card -->
        <div
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-once="true"
          class="flex flex-col border border-gray-200 text-center rounded-xl p-8"
        >
          <h4 class="font-medium text-lg text-gray-800">Базовый</h4>
          <div class="mt-4 md:mt-6 gap-x-1">
            <span class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              0₽
            </span>
            <span class="text-base font-medium text-zinc-400">/ навсегда</span>
          </div>
          <p class="mt-2 text-sm text-gray-500">Для знакомства с ИИ-ассистентом</p>

          <ul class="mt-5 md:mt-7 space-y-2.5 text-sm text-left grow">
            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 1 пространство </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 5 досок </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 200 кредитов </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800">
                Базовые модели:
                <span class="font-medium">{{ baseModelsLabel }}</span>
              </span>
            </li>

            <li class="flex items-center gap-x-2">
              <X class="size-4 text-gray-500 shrink-0" />
              <span class="text-gray-800"> Приоритетная поддержка </span>
            </li>

            <li class="flex items-center gap-x-2">
              <X class="size-4 text-gray-500 shrink-0" />
              <span class="text-gray-800">
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

            <li class="flex items-center gap-x-2">
              <X class="size-4 text-gray-500 shrink-0" />
              <span class="text-gray-800"> Приоритетная очередь генерации </span>
            </li>
          </ul>

          <SubscriptionPlanButton
            :plan="SubscriptionPlanEnum.Basic"
            size="lg"
          />
        </div>
        <!-- End Card -->

        <!-- Card -->
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-once="true"
          class="flex flex-col border-2 border-blue-600 text-center shadow-xl rounded-xl p-8"
        >
          <p class="mb-3">
            <span
              class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs uppercase font-semibold bg-blue-100 text-blue-800"
              >Рекомендуем</span
            >
          </p>
          <h4 class="font-medium text-lg text-gray-800">Премиум</h4>
          <div class="mt-4 md:mt-6 gap-x-1">
            <span class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              999₽
            </span>
            <span class="text-base font-medium text-zinc-400">/ месяц</span>
          </div>
          <p class="mt-2 text-sm text-gray-500">Для активной работы и роста проектов</p>

          <ul class="mt-5 md:mt-7 space-y-2.5 text-sm text-left grow">
            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 5 пространств </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 20 досок </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 10 000 кредитов </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800">
                Базовые модели:
                <span class="font-medium">{{ baseModelsLabel }}</span>
              </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Приоритетная поддержка </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800">
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

            <li class="flex items-center gap-x-2">
              <X class="size-4 text-gray-500 shrink-0" />
              <span class="text-gray-800"> Приоритетная очередь генерации </span>
            </li>
          </ul>

          <SubscriptionPlanButton
            :plan="SubscriptionPlanEnum.Premium"
            size="lg"
            highlight
          />
        </div>
        <!-- End Card -->

        <!-- Card -->
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-once="true"
          class="flex flex-col border border-gray-200 text-center rounded-xl p-8"
        >
          <h4 class="font-medium text-lg text-gray-800">Архитектор</h4>
          <div class="mt-4 md:mt-6 gap-x-1">
            <span class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              2499₽
            </span>
            <span class="text-base font-medium text-zinc-400">/ месяц</span>
          </div>
          <p class="mt-2 text-sm text-gray-500">Для проектирования сложных систем и бизнеса</p>

          <ul class="mt-5 md:mt-7 space-y-2.5 text-sm text-left grow">
            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Неограниченно пространств </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Неограниченно досок </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 25 000 кредитов </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800">
                Базовые модели:
                <span class="font-medium">{{ baseModelsLabel }}</span>
              </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Приоритетная поддержка </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800">
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

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Приоритетная очередь генерации </span>
            </li>
          </ul>

          <SubscriptionPlanButton
            :plan="SubscriptionPlanEnum.Architector"
            size="lg"
          />
        </div>
        <!-- End Card -->
      </div>
      <!-- End Grid -->
    </div>
  </section>
</template>
