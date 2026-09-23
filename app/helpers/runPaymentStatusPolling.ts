import { toast } from 'vue-sonner'
import { PaymentItemIdEnum } from '~/enums/PaymentItemIdEnum'
import { PaymentStatusesEnum } from '~/enums/PaymentStatusesEnum'
import { PaymentTypeEnum } from '~/enums/PaymentTypeEnum'
import { fetchPayment, tryAgain } from '~/services/payment'

const POLL_DELAYS = [1000, 2000, 4000, 7000, 10000]

export const runPaymentStatusPolling = async (paymentId: string) => {
  if (!paymentId) return

  const payment = await fetchPayment(paymentId)

  const { $queryClient } = useNuxtApp()

  if (!payment || !payment.serviceId) {
    console.error('Payment not found or serviceId missing')
    return
  }

  for (const delay of POLL_DELAYS) {
    await new Promise((resolve) => setTimeout(resolve, delay))

    try {
      const res = await getPaymentStatus(payment.serviceId)

      // Как только платеж подтвердился (даже если прошло 15 секунд):
      if (res && res.status === PaymentStatusesEnum.succeeded && res.paid) {
        $queryClient.invalidateQueries({ queryKey: userKeys.me })

        if (payment.column === PaymentTypeEnum.SUBSCRIPTION) {
          if (typeof window !== 'undefined') {
            ;(window as any).ym?.(108746868, 'reachGoal', 'buy_subscription')
          }

          switch (payment.itemId) {
            case PaymentItemIdEnum.PREMIUM:
              toast.success('Подписка оформлена!', {
                description: 'Тариф Премиум активен. Баланс пополнен на 10 000 кредитов',
              })
              break
            case PaymentItemIdEnum.ARCHITECTOR:
              toast.success('Подписка оформлена!', {
                description: 'Тариф Архитектор активен. Баланс пополнен на 25 000 кредитов',
              })
              break
          }
        } else if (payment.column === PaymentTypeEnum.CREDIT_PACK) {
          if (typeof window !== 'undefined') {
            ;(window as any).ym?.(108746868, 'reachGoal', 'buy_credit_pack')
          }

          switch (payment.itemId) {
            case PaymentItemIdEnum.CREDIT_PACK_SMALL:
              toast.success('Кредиты зачислены!', {
                description: 'На ваш счёт добавлено 3 000 кредитов',
              })
              break
            case PaymentItemIdEnum.CREDIT_PACK_MEDIUM:
              toast.success('Кредиты зачислены!', {
                description: 'На ваш счёт добавлено 7 000 кредитов',
              })
              break
            case PaymentItemIdEnum.CREDIT_PACK_LARGE:
              toast.success('Кредиты зачислены!', {
                description: 'На ваш счёт добавлено 20 000 кредитов',
              })
              break
          }
        }

        return
      } else if (res && res.status === PaymentStatusesEnum.canceled) {
        const toastError = getPaymentCancelInfo(res.cancellation_details)

        toast.error(toastError.title, {
          description: toastError.description,
          action: {
            label: 'Попробовать снова',
            onClick: async () => {
              if (payment && payment.id) {
                const result = await tryAgain(paymentId)

                $queryClient.invalidateQueries({ queryKey: paymentKeys.list() })

                if (result.payment) {
                  if (result.payment.confirmation && result.payment.confirmation.confirmation_url) {
                    window.location.href = result.payment.confirmation.confirmation_url
                  }
                }
              }
            },
          },
        })

        return
      }
    } catch {
      // Игнорируем ошибки сети в фоновом режиме
    }
  }
}
