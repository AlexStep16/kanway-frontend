import { HttpError } from '@/utils/errors'
import { QueryClient, QueryCache, MutationCache } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

function handleQueryError(error: Error) {
  if (error instanceof HttpError && error.status === 401) return

  toast.error(error.message)
}

function handleMutationError(
  error: Error,
  _variables: unknown,
  _onMutateResult: unknown,
  mutation: any,
  context: any,
) {
  if (context?.meta?.errorMessage === false) return
  if (error instanceof HttpError && error.status === 401) return

  toast.error(error.message)
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleQueryError,
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
    onError: handleMutationError,
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
