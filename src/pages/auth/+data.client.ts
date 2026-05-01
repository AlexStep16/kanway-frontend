import type { PageContextClient } from 'vike/types'
import { requireGuest } from '../guards'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'
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

  try {
    await checkFinishSignupToken()

    if (step !== AllowedAuthStepsEnum.FINISH_SIGN_UP) {
      throw redirect(`/auth/${AllowedAuthStepsEnum.FINISH_SIGN_UP}`)
    }
  } catch {
    if (step === AllowedAuthStepsEnum.FINISH_SIGN_UP) {
      throw redirect('/auth')
    }
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
