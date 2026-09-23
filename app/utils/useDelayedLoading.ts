import { MIN_SKELETON_DISPLAY_TIME_MS } from '~/constants/MIN_SKELETON_DISPLAY_TIME_MS'

export function useDelayedLoading(
  isLoadingRef: Ref<boolean>,
  minDisplayTime = MIN_SKELETON_DISPLAY_TIME_MS,
): Ref<boolean> {
  const showLoader = ref(false)
  let startTime = 0
  let timeoutId: any = null

  watch(
    isLoadingRef,
    (loading) => {
      if (loading) {
        showLoader.value = true
        startTime = Date.now()

        if (timeoutId) clearTimeout(timeoutId)
      } else {
        const elapsedTime = Date.now() - startTime
        const remainingTime = minDisplayTime - elapsedTime

        if (remainingTime > 0) {
          timeoutId = setTimeout(() => {
            showLoader.value = false
          }, remainingTime)
        } else {
          showLoader.value = false
        }
      }
    },
    { immediate: true },
  )

  return showLoader
}
