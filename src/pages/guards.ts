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
    } else if (e.code === 404) {
      return null
    }
    throw e
  }
}

export const requireGuest = async () => {
  try {
    const user = await meApi()

    if (user) {
      throw redirect('/workspace')
    }
  } catch (e: any) {
    if (e.status === 401 || e.response?.status === 401) {
      return null
    } else if (e.code === 404) {
      return null
    }
    throw e
  }
}
