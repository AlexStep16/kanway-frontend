import type { PageContextClient } from 'vike/types'
import { useAuthStore } from '@/stores/auth'

export { data }

const data = async (pageContext: PageContextClient) => {
  useAuthStore(pageContext.pinia)
}
