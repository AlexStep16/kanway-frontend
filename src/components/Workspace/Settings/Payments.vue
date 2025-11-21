<script setup lang="ts">
import { computed, onMounted, toRef } from 'vue'
import { useSettingDataStore } from '@stores/settingData'
import { useAuthStore } from '@stores/auth'
import { PaymentStatusEnum } from '@/enums/PaymentStatusEnum'
import dayjs from 'dayjs'
import Spinner from '@/components/Loader/Spinner.vue'

const SETTING_STORE = useSettingDataStore()
const AUTH_STORE = useAuthStore()

const user = toRef(AUTH_STORE, 'user')
const payments = toRef(SETTING_STORE, 'payments')
const paymentMethods = toRef(SETTING_STORE, 'paymentMethods')
//const isPaymentMethodsLoading = toRef(SETTING_STORE, 'isPaymentMethodsLoading')
const isPaymentMethodDeleting = toRef(SETTING_STORE, 'isPaymentMethodDeleting')
const isUserPaymentMethodUpdating = toRef(AUTH_STORE, 'isUserPaymentMethodUpdating')

SETTING_STORE.loadPayments()
SETTING_STORE.loadPaymentMethods()

function getPaymentStatusName(status: PaymentStatusEnum): string {
  switch (status) {
    case PaymentStatusEnum.COMPLETED:
      return 'Оплачено'
    case PaymentStatusEnum.PENDING:
      return 'В ожидании'
    case PaymentStatusEnum.CANCELLED:
      return 'Отменен'
    case PaymentStatusEnum.FAILED:
      return 'Неудачно'
    default:
      return 'Неизвестно'
  }
}

function getPaymentStatusClasses(status: PaymentStatusEnum): string {
  switch (status) {
    case PaymentStatusEnum.COMPLETED:
      return 'bg-emerald-100 text-emerald-800'
    case PaymentStatusEnum.PENDING:
      return 'bg-yellow-100 text-yellow-800'
    case PaymentStatusEnum.CANCELLED:
    case PaymentStatusEnum.FAILED:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function updatePaymentMethod(id: string) {
  if (isUserPaymentMethodUpdating.value) return

  AUTH_STORE.updateUserPaymentMethod(id)
}

async function deletePaymentMethod(id: string) {
  if (isPaymentMethodDeleting.value(id)) return

  await SETTING_STORE.deletePaymentMethod(id)
}

const isUserPaymentMethod = computed(() => (paymentMethod: any) => {
  return user.value?.paymentMethodId === paymentMethod.id
})

onMounted(() => {
  window.HSStaticMethods.autoInit()
})
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Способ оплаты
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-2" v-if="paymentMethods.length > 0">
      <div
        class="bg-blue-50 border border-gray-200 rounded-md"
        :class="{ 'border-blue-300!': isUserPaymentMethod(paymentMethod) }"
        v-for="paymentMethod in paymentMethods"
        :key="paymentMethod.id"
        @click="updatePaymentMethod(paymentMethod.id)"
      >
        <label
          :for="'payment-method-' + paymentMethod.id"
          class="cursor-pointer flex items-center px-2 sm:px-4 py-2 gap-x-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-10" viewBox="0 0 400 120">
            <linearGradient id="a" x1="370" x2="290" gradientUnits="userSpaceOnUse">
              <stop stop-color="#1F5CD7" />
              <stop stop-color="#02AEFF" offset="1" />
            </linearGradient>
            <path
              d="m31 13h33c3 0 12-1 16 13 3 9 7 23 13 44h2c6-22 11-37 13-44 4-14 14-13 18-13h31v96h-32v-57h-2l-17 57h-24l-17-57h-3v57h-31m139-96h32v57h3l21-47c4-9 13-10 13-10h30v96h-32v-57h-2l-21 47c-4 9-14 10-14 10h-30m142-29v29h-30v-50h98c-4 12-18 21-34 21"
              fill="#0f754e"
            />
            <path d="m382 53c4-18-8-40-34-40h-68c2 21 20 40 39 40" fill="url(#a)" />
          </svg>

          <div class="flex justify-start items-start flex-col">
            <span class="text-sm font-medium text-gray-800"
              >**** {{ paymentMethod.cardLast4 }}</span
            >
            <span class="text-xs text-gray-500"
              >Действует до {{ paymentMethod.expiryMonth }}/{{ paymentMethod.expiryYear }}</span
            >
            <button
              type="button"
              @click.stop="deletePaymentMethod(paymentMethod.id)"
              class="flex items-center gap-x-1 text-xs text-red-500 hover:underline mt-1"
            >
              <Spinner v-if="isPaymentMethodDeleting(paymentMethod.id)" class="size-3" />
              <span>Удалить</span>
            </button>
          </div>

          <div class="flex grow-1 justify-end">
            <div class="flex items-center cursor-pointer relative transition-all">
              <input
                type="checkbox"
                class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-600"
                :id="'payment-method-' + paymentMethod.id"
                disabled
                :checked="isUserPaymentMethod(paymentMethod)"
              />
              <span
                class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
        </label>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500">Методы оплаты не сохранены</div>
  </div>
  <div class="grow-1 flex flex-col gap-y-2">
    <h3
      class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
    >
      История платежей
    </h3>

    <div class="flex flex-col">
      <div class="overflow-x-auto">
        <div class="min-w-full inline-block align-middle">
          <div class="border border-gray-200 rounded-lg overflow-hidden" v-if="payments.length > 0">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Дата
                  </th>
                  <th
                    scope="col"
                    class="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Описание
                  </th>
                  <th
                    scope="col"
                    class="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Сумма
                  </th>
                  <th
                    scope="col"
                    class="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <!-- Пример строки платежа -->
                <tr v-for="payment in payments" :key="payment.id">
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">
                    {{ dayjs(payment.createdAt).format('DD MMMM YYYY') }}
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">
                    {{ payment.description }}
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">
                    {{ payment.amount }} ₽
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm">
                    <span
                      class="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium"
                      :class="getPaymentStatusClasses(payment.status)"
                    >
                      {{ getPaymentStatusName(payment.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="p-4 text-center text-sm text-gray-500">Платежей пока нет</div>
        </div>
      </div>
    </div>
  </div>
</template>
