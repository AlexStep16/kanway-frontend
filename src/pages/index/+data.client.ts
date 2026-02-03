import { getMe } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import type { PageContextClient } from 'vike/types'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const AUTH_STORE = useAuthStore(pageContext.pinia)

    const user = await getMe()

    AUTH_STORE.setUser(user)
  } catch {
    return
  }
}
