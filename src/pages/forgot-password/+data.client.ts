import type { PageContextClient } from 'vike/types'
import { useAuthStore } from '@/stores/auth'
import { getMe } from '@services/auth'
import { redirect } from 'vike/abort'
import { signErrorRedirect } from '@/helpers/signErrorRedirect'
import { userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const user = await getMe()

    queryClient.setQueryData(userKeys.me, user)

    throw redirect('/workspace')
  } catch (e) {
    signErrorRedirect(pageContext, e)
  }
}
