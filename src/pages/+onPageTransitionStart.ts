export { onPageTransitionStart }
import type { OnPageTransitionStartAsync } from 'vike/types'

const onPageTransitionStart: OnPageTransitionStartAsync = async (
  pageContext
): ReturnType<OnPageTransitionStartAsync> => {
  const loader = document.getElementById('globalLoader');
  
  if (loader && !pageContext.shouldSkipLoader) loader.classList.add('block-loader_show');
}