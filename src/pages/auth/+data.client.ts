import type { PageContextClient } from 'vike/types'
import { requireGuest } from '../guards'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'
import { checkFinishSignupToken } from '@/services/auth'
import { redirect } from 'vike/abort'
import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    let isSignUpFinished = true

    try {
      await checkFinishSignupToken()

      isSignUpFinished = false
    } catch {}

    if (!isSignUpFinished) {
      throw redirect(`/auth/${AllowedAuthStepsEnum.FINISH_SIGN_UP}`)
    }

    await requireGuest()
  } catch (error) {
    dataErrorHandler(pageContext, error)
  }
}
