import type { PageContextClient } from 'vike/types'
import { useAuthStore } from '@stores/auth'
import { getMe } from '@services/auth'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const user = await getMe()

    const AUTH_STORE = useAuthStore(pageContext.pinia)

    AUTH_STORE.setUser(user)

    return {
      user,
    }
  } catch (e) {
    console.warn(e)
  }
}
