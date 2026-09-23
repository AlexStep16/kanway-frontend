<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import Button from '~/components/ui/button/Button.vue'
import { PaymentItemIdEnum } from '~/enums/PaymentItemIdEnum'

const { mutate: buyCredits, isPending: isBuyingCredits } = useBuyCredits()

const { isPending: isSubscriptionsLoading } = useSubscriptions()
</script>

<template>
  <div class="grid gap-2 grid-cols-1 md:grid-cols-2 grid-flow-row auto-rows-max w-full">
    <template v-if="isSubscriptionsLoading">
      <div class="rounded-2xl bg-gray-300 grow animate-pulse h-58"></div>
      <div class="rounded-2xl bg-gray-300 grow animate-pulse h-58"></div>
      <div class="rounded-2xl bg-gray-300 grow animate-pulse h-58"></div>
    </template>
    <template v-else>
      <div class="rounded-2xl bg-white border border-gray-200">
        <div class="flex items-start justify-between p-4 size-full">
          <div class="flex items-center justify-between size-full gap-1">
            <div class="flex flex-col gap-y-1">
              <span class="text-sm text-gray-700">3000 кредитов</span>
              <span class="sm:text-lg text-gray-800 font-bold">₽299</span>
            </div>

            <Button
              variant="default"
              class="text-xs"
              size="sm"
              :disabled="isBuyingCredits"
              @click="buyCredits({ itemId: PaymentItemIdEnum.CREDIT_PACK_SMALL })"
            >
              Купить
              <ArrowRight class="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-white border border-gray-200">
        <div class="flex items-start justify-between p-4 size-full">
          <div class="flex items-center justify-between size-full gap-1">
            <div class="flex flex-col gap-y-1">
              <span class="text-sm text-gray-700">7000 кредитов</span>
              <span class="sm:text-lg text-gray-800 font-bold">₽699</span>
            </div>

            <Button
              variant="default"
              class="text-xs"
              size="sm"
              :disabled="isBuyingCredits"
              @click="buyCredits({ itemId: PaymentItemIdEnum.CREDIT_PACK_MEDIUM })"
            >
              Купить
              <ArrowRight class="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-white border border-gray-200">
        <div class="flex items-start justify-between p-4 size-full">
          <div class="flex items-center justify-between size-full gap-1">
            <div class="flex flex-col gap-y-1">
              <span class="text-sm text-gray-700">20000 кредитов</span>
              <span class="sm:text-lg text-gray-800 font-bold">₽1999</span>
            </div>

            <Button
              variant="default"
              class="text-xs"
              size="sm"
              :disabled="isBuyingCredits"
              @click="buyCredits({ itemId: PaymentItemIdEnum.CREDIT_PACK_LARGE })"
            >
              Купить
              <ArrowRight class="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
