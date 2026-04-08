import { userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { getMe } from '@/services/auth'
import type { PageContextClient } from 'vike/types'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const user = await getMe()

    queryClient.setQueryData(userKeys.me, user)
  } catch {
    return
  }
}
