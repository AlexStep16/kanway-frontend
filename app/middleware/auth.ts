import z from "zod"
import { AllowedAuthStepsEnum } from "~/enums/AllowedAuthStepsEnum"

export default defineNuxtRouteMiddleware(async (to) => {
  const step = to.query.step as string
  const payload = to.query.payload as string

  if (step && !Object.values(AllowedAuthStepsEnum).includes(step as any)) {
    return navigateTo('/auth')
  }

  if (step && payload) {
    try {
      const email = atob(decodeURIComponent(payload))
      
      z.email().parse(email)
    } catch {
      return navigateTo('/auth')
    }
  } 

  else if (step && !payload) {
    const validStepsWithoutPayload = [
      AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE, 
      AllowedAuthStepsEnum.FINISH_SIGN_UP
    ]

    if (!validStepsWithoutPayload.includes(step as AllowedAuthStepsEnum)) {
      return navigateTo('/auth')
    }
  }
})