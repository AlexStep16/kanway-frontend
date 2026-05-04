import type { PageContextClient } from 'vike/types'
import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'
import { redirect } from 'vike/abort'
import z from 'zod'
import { checkFinishSignupToken } from '@/services/auth'

export { data }

const data = async (pageContext: PageContextClient) => {
  const { step, payload } = pageContext.routeParams
  const token = pageContext.urlParsed.searchAll.token?.[0]

  if (step && !Object.values(AllowedAuthStepsEnum).includes(step as any)) {
    throw redirect('/auth')
  }

  let isSignUpFinished = true

  try {
    await checkFinishSignupToken()

    isSignUpFinished = false
  } catch {
    if (step === AllowedAuthStepsEnum.FINISH_SIGN_UP) {
      throw redirect('/auth')
    }
  }

  if (!isSignUpFinished && step !== AllowedAuthStepsEnum.FINISH_SIGN_UP) {
    throw redirect(`/auth/${AllowedAuthStepsEnum.FINISH_SIGN_UP}`)
  }

  let email: string
  try {
    email = atob(decodeURIComponent(payload))

    z.email().parse(email)
  } catch {
    throw redirect('/auth')
  }

  return {
    email,
    step: step as AllowedAuthStepsEnum,
    token,
  }
}
