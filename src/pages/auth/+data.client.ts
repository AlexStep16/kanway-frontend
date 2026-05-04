import type { PageContextClient } from 'vike/types'
import { requireGuest } from '../guards'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'
import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'
import { redirect } from 'vike/abort'
import z from 'zod'
import { checkFinishSignupToken } from '@/services/auth'

export { data }

const data = async (pageContext: PageContextClient) => {
  const searchAll = pageContext.urlParsed.searchAll
  const token = searchAll.token?.[0]
  const step = searchAll.step?.[0]
  const payload = searchAll.payload?.[0]

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

  if (step && payload) {
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
  } else if (step && !payload) {
    if (
      [AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE, AllowedAuthStepsEnum.FINISH_SIGN_UP].includes(
        step as AllowedAuthStepsEnum,
      )
    ) {
      return {
        step: step as AllowedAuthStepsEnum,
        token,
      }
    } else {
      throw redirect('/auth')
    }
  } else if (!step && !payload) {
    try {
      await requireGuest()
    } catch (error) {
      dataErrorHandler(pageContext, error)
    }
  }

  return {
    step: step as AllowedAuthStepsEnum,
    token,
  }
}
