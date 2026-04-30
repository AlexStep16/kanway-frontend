import { createPinia } from 'pinia'
import type { PageContextClient } from 'vike/types'

export async function onCreatePageContext(pageContext: PageContextClient) {
  // The object pageContext was just created
  pageContext.pinia = createPinia()
}
