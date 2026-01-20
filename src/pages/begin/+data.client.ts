import type { PageContextClient } from 'vike/types'
import { useAuthStore } from '@/stores/auth'
import { useMe } from '@/composables/auth/useMe'
import { workspacesErrorRedirect } from '@/helpers/workspacesErrorRedirect'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const { data: user, isSuccess, error } = useMe()

    if (isSuccess.value) {
      const AUTH_STORE = useAuthStore(pageContext.pinia)

      AUTH_STORE.setUser(user.value!)

      return {
        user,
      }
    } else {
      workspacesErrorRedirect(pageContext, error.value!)
    }
  } catch (e) {
    console.error('Error fetching user data:', e)
  }
}
