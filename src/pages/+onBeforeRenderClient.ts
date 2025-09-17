export { onBeforeRenderClient }

import { OnBeforeRenderClientAsync } from 'vike-vue/types'
import { OnPageTransitionEndAsync, PageContextClient } from 'vike/types'

const onBeforeRenderClient: OnBeforeRenderClientAsync = async (
  pageContext: PageContextClient,
): ReturnType<OnPageTransitionEndAsync> => {
  if (pageContext.isHydration) {
  } else {
  }
}
