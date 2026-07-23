<script lang="ts" setup>
import { AlertCircle, Check } from '@lucide/vue'
import KLogo from '~/assets/k_letter_logo.svg?component'
import { PaymentStatusesEnum } from '~/enums/PaymentStatusesEnum'

const route = useRoute()

const { data: user } = useUser()
const { data: payment } = usePayment(route.query.paymentId as string)
const { mutate: tryAgain, isPending: isTryingAgain } = useTryAgain()

const isSuccess = ref(false)
const isError = ref(false)
const countdown = ref(3)

async function checkPaymentStatus(serviceId: string) {
  return await getPaymentStatus(serviceId)
}

function handleTryAgain() {
  if (payment.value && payment.value.id) {
    tryAgain({ paymentId: payment.value.id })
  }
}

onMounted(async () => {
  const interval = setInterval(async () => {
    if (payment.value && payment.value.serviceId) {
      const result = await checkPaymentStatus(payment.value.serviceId)

      if (result && result.status === PaymentStatusesEnum.succeeded) {
        clearInterval(interval)

        isSuccess.value = true

        const internalInterval = setInterval(() => {
          countdown.value -= 1

          if (countdown.value === 0) {
            clearInterval(internalInterval)
            navigateTo('/workspace')
          }
        }, 1000)
      } else if (result && result.status === PaymentStatusesEnum.canceled) {
        clearInterval(interval)

        isError.value = true
      }
    }
  }, 2000)
})
</script>

<template>
  <div class="flex flex-col gap-3 items-center justify-center h-screen w-screen">
    <KLogo
      class="loader size-18"
      v-if="!isSuccess && !isError"
    />
    <div
      class="flex items-center justify-center size-18"
      v-if="isSuccess"
    >
      <Check class="text-green-500 size-10" />
    </div>
    <div
      class="flex items-center justify-center size-18"
      v-if="isError"
    >
      <AlertCircle class="text-destructive size-10" />
    </div>
    <div
      class="flex flex-col gap-y-2 font-medium text-center"
      v-if="!isSuccess && !isError"
    >
      <span class="text-sm text-foreground">Платеж обрабатывается...</span>
      <span class="text-xs text-muted-foreground"
        >Это займет не более 10 секунд.<br />
        Пожалуйста, не закрывайте вкладку</span
      >
    </div>

    <div
      class="flex flex-col gap-y-2 font-medium text-center"
      v-if="isSuccess"
    >
      <span class="text-sm text-foreground">Оплата прошла успешно</span>
      <span class="text-xs text-muted-foreground">
        Спасибо за покупку!<br />
        Переход в рабочее пространство через {{ countdown }} секунд
      </span>
    </div>

    <div
      class="flex flex-col gap-y-2 font-medium text-center"
      v-if="isError"
    >
      <span class="text-sm text-foreground">Оплата не прошла</span>
      <span class="text-xs text-muted-foreground">
        Произошла ошибка при обработке платежа.<br />
        Пожалуйста, попробуйте снова
      </span>

      <Button
        variant="default"
        size="sm"
        class="mt-1 text-xs"
        @click="handleTryAgain"
        v-if="user"
      >
        <span
          class="text-xs"
          v-if="!isTryingAgain"
          >Попробовать снова</span
        >
        <Spinner
          class="size-4"
          v-else
        />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.loader {
  -webkit-animation: opacity 2s linear infinite;
  animation: opacity 2s linear infinite;
}

@-webkit-keyframes opacity {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

@keyframes opacity {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
</style>
