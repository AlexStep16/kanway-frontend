import type { PageContextClient } from 'vike/types'
import { useAuthStore } from '@/stores/auth'
import { getMe } from '@services/auth'
import { redirect } from 'vike/abort'
import { signErrorRedirect } from '@/helpers/signErrorRedirect'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const authStore = useAuthStore(pageContext.pinia)

    if (authStore.isAuthenticated) {
      if (!authStore.user!.isConfirmed) throw redirect('/confirmation')

      throw redirect('/workspace')
    }

    const user = await getMe()

    authStore.setUser(user)

    throw redirect('/workspace')
  } catch (e) {
    signErrorRedirect(pageContext, e)
  }
}
