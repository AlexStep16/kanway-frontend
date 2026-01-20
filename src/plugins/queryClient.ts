import { HttpError } from '@/utils/errors'
import { QueryClient, QueryCache, MutationCache } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

function handleError(error: Error, queryOrMutation: any) {
  if (queryOrMutation?.meta?.errorMessage === false) return
  if (error instanceof HttpError && error.status === 401) return

  toast.error(error.message)
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const mutationKey = mutation.options.mutationKey

      if (mutationKey) {
        queryClient.invalidateQueries({ queryKey: mutationKey })
      }
    },
    onError: handleError,
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
