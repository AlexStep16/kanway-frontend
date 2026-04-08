import type { PageContextClient } from 'vike/types'
import { getMe } from '@services/auth'
import { redirect } from 'vike/abort'
import { signErrorRedirect } from '@/helpers/signErrorRedirect'
import { queryClient } from '@/plugins/queryClient'
import { userKeys } from '@/keys'

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
