import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { paymentMethodKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import { deletePaymentMethod } from '@/services/setting'

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

      const previousPaymentMethods = queryClient.getQueryData<ITaskState[]>(paymentMethodKey)

      if (previousPaymentMethods) {
        queryClient.setQueryData<ITaskState[]>(paymentMethodKey, (oldPaymentMethods) =>
          oldPaymentMethods ? oldPaymentMethods.filter((t) => t.id !== id) : [],
        )
      }

      return { previousPaymentMethods, paymentMethodKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousPaymentMethods) {
        queryClient.setQueryData(context.paymentMethodKey, context.previousPaymentMethods)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all })

      toast.success('Способ оплаты успешно удален')
    },
  })
}
