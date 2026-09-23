import z from 'zod'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'

export default defineNuxtRouteMiddleware(async (to) => {
  const step = to.query.step as string
  const payload = to.query.payload as string

  if (step && !Object.values(AllowedAuthStepsEnum).includes(step as any)) {
    return navigateTo(
      {
        path: '/auth',
        query: {
          ...to.query,
        },
      },
      { replace: true },
    )
  }

  if (step && payload) {
    try {
      const email = atob(payload)

      z.email().parse(email)
    } catch {
      return navigateTo(
        {
          path: '/auth',
          query: {
            ...to.query,
          },
        },
        { replace: true },
      )
    }
  } else if (step && !payload) {
    const validStepsWithoutPayload = [
      AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE,
      AllowedAuthStepsEnum.FINISH_SIGN_UP,
      AllowedAuthStepsEnum.SIGN_UP,
    ]

    if (!validStepsWithoutPayload.includes(step as AllowedAuthStepsEnum)) {
      return navigateTo(
        {
          path: '/auth',
          query: {
            ...to.query,
          },
        },
        { replace: true },
      )
    }
  }
})
