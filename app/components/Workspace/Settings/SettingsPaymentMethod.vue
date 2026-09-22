<script setup lang="ts">
import type { IPaymentMethod } from '~/interfaces/domain/IPaymentMethod'
import type { IUser } from '~/interfaces/domain/IUser'
import { toast } from 'vue-sonner'
import DeletePaymentMethodModal from '~/components/Modals/DeletePaymentMethodModal.vue'

const props = defineProps<{
  paymentMethod: IPaymentMethod
  user?: IUser | null
}>()

const { mutate: updatePaymentMethod } = useUpdateUser()
const { mutate: deletePaymentMethod, isPending: isDeleting } = useDeletePaymentMethod()

const isDeleteModalOpen = ref(false)

function handleUpdatePaymentMethod(methodId: string) {
  if (!props.user || props.user?.paymentMethodId === methodId) return

  updatePaymentMethod(
    { id: props.user.id, paymentMethodId: methodId },
    {
      onSuccess: () => {
        toast.success('Способ оплаты успешно обновлен')
      },
    },
  )
}

const isUserPaymentMethod = computed(() => (paymentMethod: IPaymentMethod) => {
  return props.user?.paymentMethodId === paymentMethod.id
})

function handleDeletePaymentMethod(methodId: string) {
  if (!props.user) return

  deletePaymentMethod(
    { id: methodId },
    {
      onSuccess: () => {
        toast.success('Способ оплаты успешно удален')
      },
      onSettled: () => {
        isDeleteModalOpen.value = false
      },
    },
  )
}
</script>

<template>
  <div
    class="bg-blue-50 border border-gray-200 rounded-md"
    :class="{ 'border-blue-300!': isUserPaymentMethod(paymentMethod) }"
    :key="paymentMethod.id"
    @click="handleUpdatePaymentMethod(paymentMethod.id)"
  >
    <label
      :for="'payment-method-' + paymentMethod.id"
      class="cursor-pointer flex items-center px-2 sm:px-4 py-2 gap-x-3"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="shrink-0 size-10"
        viewBox="0 0 400 120"
      >
        <linearGradient
          id="a"
          x1="370"
          x2="290"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#1F5CD7" />
          <stop
            stop-color="#02AEFF"
            offset="1"
          />
        </linearGradient>
        <path
          d="m31 13h33c3 0 12-1 16 13 3 9 7 23 13 44h2c6-22 11-37 13-44 4-14 14-13 18-13h31v96h-32v-57h-2l-17 57h-24l-17-57h-3v57h-31m139-96h32v57h3l21-47c4-9 13-10 13-10h30v96h-32v-57h-2l-21 47c-4 9-14 10-14 10h-30m142-29v29h-30v-50h98c-4 12-18 21-34 21"
          fill="#0f754e"
        />
        <path
          d="m382 53c4-18-8-40-34-40h-68c2 21 20 40 39 40"
          fill="url(#a)"
        />
      </svg>

      <div class="flex justify-start items-start flex-col">
        <span class="text-sm font-medium text-gray-800">**** {{ paymentMethod.cardLast4 }}</span>
        <span class="text-xs text-gray-500"
          >Действует до {{ paymentMethod.cardExpiryMonth }}/{{ paymentMethod.cardExpiryYear }}</span
        >
        <button
          type="button"
          @click.stop="isDeleteModalOpen = true"
          class="flex items-center gap-x-1 text-xs text-red-500 hover:underline mt-1"
        >
          <Spinner
            v-if="isDeleting"
            class="size-3"
          />
          <span>Удалить</span>
        </button>
      </div>

      <div class="flex grow justify-end">
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

  <Teleport to="body">
    <DeletePaymentMethodModal
      v-model:open="isDeleteModalOpen"
      @confirm="handleDeletePaymentMethod(paymentMethod.id)"
    />
  </Teleport>
</template>
