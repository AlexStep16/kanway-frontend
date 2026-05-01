import { meApi } from '@/api/auth'
import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'
import { userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { checkFinishSignupToken } from '@/services/auth'
import { redirect } from 'vike/abort'

export const requireFinishedSignup = async () => {
  try {
    await checkFinishSignupToken()
    throw redirect(`/auth/${AllowedAuthStepsEnum.FINISH_SIGN_UP}`)
  } catch {
    return null
  }
}

export const requireAuth = async () => {
  try {
    const user = await meApi()
    queryClient.setQueryData(userKeys.me, user)
    return user
  } catch (e: any) {
    if (e.status === 401 || e.response?.status === 401) {
      throw redirect('/auth')
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
