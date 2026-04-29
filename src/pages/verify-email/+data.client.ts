import { meApi } from '@/api/auth'
import { redirect } from 'vike/abort'
import type { PageContextClient } from 'vike/types'
import { toast } from 'vue-sonner'

export { data }

const data = async (pageContext: PageContextClient) => {
  const token = pageContext.urlParsed.search.token

  try {
    const user = await meApi()

    if (user.isConfirmed) {
      toast.success('Почта уже подтверждена.')
      throw redirect('/workspace')
    }
  } catch {
    return { token }
  }

  return { token }
}
