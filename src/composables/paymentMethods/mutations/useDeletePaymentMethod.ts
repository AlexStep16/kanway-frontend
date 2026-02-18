import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { paymentMethodKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { deletePaymentMethod } from '@/services/setting'
import { IPaymentMethod } from '@/interfaces/domain/IPaymentMethod'

export interface DeletePaymentMethodVars {
  id: string
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...paymentMethodKeys.all, 'delete'],
    mutationFn: ({ id }: DeletePaymentMethodVars) =>
      requestQueueService.enqueue(id, () => deletePaymentMethod(id)),

    onMutate: async ({ id }) => {
      const paymentMethodKey = paymentMethodKeys.all

      await queryClient.cancelQueries({ queryKey: paymentMethodKey })

      const previousPaymentMethods = queryClient.getQueryData<IPaymentMethod[]>(paymentMethodKey)

      if (previousPaymentMethods) {
        queryClient.setQueryData<IPaymentMethod[]>(paymentMethodKey, (oldPaymentMethods) =>
          oldPaymentMethods ? oldPaymentMethods.filter((t) => t.id !== id) : [],
        )
      }

      return { previousPaymentMethods, paymentMethodKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousPaymentMethods) {
        const paymentMethodToRestore = context.previousPaymentMethods.find((c) => c.id === vars.id)

        if (paymentMethodToRestore) {
          queryClient.setQueryData<IPaymentMethod[]>(context.paymentMethodKey, (current) => {
            if (current?.some((c) => c.id === vars.id)) return current

            return [paymentMethodToRestore, ...(current || [])]
          })
        }
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all })
    },

    onSuccess: () => {
      toast.success('Способ оплаты успешно удален')
    },
  })
}
