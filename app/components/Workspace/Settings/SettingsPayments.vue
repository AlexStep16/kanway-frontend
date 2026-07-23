<script setup lang="ts">
import { PaymentStatusesEnum } from '~/enums/PaymentStatusesEnum'
import dayjs from 'dayjs'
import SettingsPaymentMethod from './SettingsPaymentMethod.vue'

const { data: user } = useUser()

const { data: paymentsData, isPending: isPaymentsLoading } = usePayments()
const { data: paymentMethodsData, isPending: isPaymentMethodsLoading } = usePaymentMethods()

const payments = computed(() => paymentsData.value || [])
const paymentMethods = computed(() => paymentMethodsData.value || [])

function getPaymentStatusName(status: PaymentStatusesEnum): string {
  switch (status) {
    case PaymentStatusesEnum.succeeded:
      return 'Оплачено'
    case PaymentStatusesEnum.pending:
      return 'В ожидании'
    case PaymentStatusesEnum.canceled:
      return 'Отменен'
    default:
      return 'Неизвестно'
  }
}

function getPaymentStatusClasses(status: PaymentStatusesEnum): string {
  switch (status) {
    case PaymentStatusesEnum.succeeded:
      return 'bg-emerald-100 text-emerald-800'
    case PaymentStatusesEnum.pending:
      return 'bg-yellow-100 text-yellow-800'
    case PaymentStatusesEnum.canceled:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="flex flex-col gap-y-2">
      <h3 class="text-lg font-medium text-gray-800 pb-1 sm:pb-2">Платежи</h3>
    </div>

    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Методы оплаты
    </h3>

    <div class="flex flex-col gap-y-2">
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-2"
        v-if="paymentMethods.length > 0 || isPaymentMethodsLoading"
      >
        <div
          class="bg-gray-300 animate-pulse rounded-md h-19"
          v-if="isPaymentMethodsLoading"
        ></div>
        <div
          class="bg-gray-300 animate-pulse rounded-md h-19"
          v-if="isPaymentMethodsLoading"
        ></div>

        <SettingsPaymentMethod
          v-for="paymentMethod in paymentMethods"
          :key="paymentMethod.id"
          :paymentMethod="paymentMethod"
          :user="user"
          v-else
        />
      </div>

      <div
        v-else
        class="text-sm text-gray-500"
      >
        Методы оплаты не сохранены
      </div>
    </div>
  </div>
  <div class="grow flex flex-col gap-y-2">
    <h3
      class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
    >
      История платежей
    </h3>

    <template v-if="isPaymentsLoading">
      <div class="bg-gray-300 animate-pulse w-full h-10 rounded-lg"></div>
      <div class="bg-gray-300 animate-pulse w-full h-10 rounded-lg"></div>
      <div class="bg-gray-300 animate-pulse w-full h-10 rounded-lg"></div>
      <div class="bg-gray-300 animate-pulse w-full h-10 rounded-lg"></div>
      <div class="bg-gray-300 animate-pulse w-full h-10 rounded-lg"></div>
      <div class="bg-gray-300 animate-pulse w-full h-10 rounded-lg"></div>
      <div class="bg-gray-300 animate-pulse w-full h-10 rounded-lg"></div>
    </template>

    <div
      class="flex flex-col"
      v-else
    >
      <div class="overflow-x-auto custom-scrollbar">
        <div class="min-w-full inline-block align-middle">
          <div
            class="border border-gray-200 rounded-lg overflow-hidden"
            v-if="payments.length > 0"
          >
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
                <tr
                  v-for="payment in payments"
                  :key="payment.id"
                >
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

          <div
            v-else
            class="p-4 text-center text-sm text-gray-500"
          >
            Платежей пока нет
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
