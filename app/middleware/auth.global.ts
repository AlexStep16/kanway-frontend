import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import { AuthStatus } from '~/enums/AuthStatusesEnum'
import { checkFinishSignupToken } from '~/services/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  const isAuthRequired = to.meta.authOnly
  const isGuestOnly = to.meta.guestOnly

  if (authStore.status === AuthStatus.IDLE) {
    await authStore.initSession()
  }

  if (!isAuthRequired && !isGuestOnly) {
    return
  }

  if (authStore.status === AuthStatus.UNVERIFIED) {
    if (to.query.step !== AllowedAuthStepsEnum.VERIFY_EMAIL) {
      const email64 = getSafeBase64String(authStore.user?.email || '')

      return navigateTo({
        path: '/auth',
        query: { step: AllowedAuthStepsEnum.VERIFY_EMAIL, payload: email64 },
      })
    }

    return
  }

  if (isAuthRequired) {
    if (authStore.status === AuthStatus.GUEST) {
      try {
        await checkFinishSignupToken()

        if (to.query.step !== AllowedAuthStepsEnum.FINISH_SIGN_UP) {
          return navigateTo({
            path: '/auth',
            query: { step: AllowedAuthStepsEnum.FINISH_SIGN_UP },
          })
        }
      } catch {
        return navigateTo('/auth')
      }
    }
  }

  if (isGuestOnly) {
    if (authStore.status === AuthStatus.AUTHENTICATED && !to.query.step) {
      return navigateTo('/workspace')
    }
  }
})
