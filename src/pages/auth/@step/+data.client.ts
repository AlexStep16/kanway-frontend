import type { PageContextClient } from 'vike/types'
import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'
import { redirect } from 'vike/abort'
import { checkFinishSignupToken } from '@/services/auth'

export { data }

const data = async (pageContext: PageContextClient) => {
  const { step } = pageContext.routeParams
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

  if (
    [AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE, AllowedAuthStepsEnum.FINISH_SIGN_UP].includes(
      step as AllowedAuthStepsEnum,
    )
  ) {
    console.log(1)
    return {
      step: step as AllowedAuthStepsEnum,
      token,
    }
  } else {
    throw redirect('/auth')
  }
}
