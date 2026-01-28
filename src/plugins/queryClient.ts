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
    onSettled: (_data, _error, _variables, _context, mutation) => {
      const mutationMeta = mutation.options.meta

      if (mutationMeta) {
        const keysToInvalidate: Array<string[]> =
          (mutationMeta.keysToInvalidate as Array<string[]> | undefined) || []

        for (const key of keysToInvalidate) {
          queryClient.invalidateQueries({
            queryKey: key,
          })
        }
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
