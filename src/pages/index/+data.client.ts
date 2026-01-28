import { getMe } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import type { PageContextClient } from 'vike/types'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const user = await getMe()

    const AUTH_STORE = useAuthStore(pageContext.pinia)

    AUTH_STORE.setUser(user)

    return {
      user,
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}
