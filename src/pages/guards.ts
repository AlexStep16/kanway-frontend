import { meApi } from '@/api/auth'
import { userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { redirect } from 'vike/abort'

export const requireAuth = async () => {
  try {
    const user = await meApi()
    queryClient.setQueryData(userKeys.me, user)
    return user
  } catch (e: any) {
    if (e.status === 401 || e.response?.status === 401) {
      throw redirect('/sign-in')
    }
    throw e
  }
}

export const requireGuest = async () => {
  try {
    const user = await meApi()
    console.log(user)
    if (user) {
      throw redirect('/workspace')
    }
  } catch {
    return null
  }
}
