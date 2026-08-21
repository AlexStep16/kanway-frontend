import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import { checkFinishSignupToken, getMe } from '~/services/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const isAuthRequired = to.meta.authOnly
  const isGuestOnly = to.meta.guestOnly

  const { $queryClient } = useNuxtApp()

  if (!isAuthRequired && !isGuestOnly) {
    return
  }

  const user = await $queryClient.fetchQuery({
    queryKey: userKeys.me,
    queryFn: () => getMe(),
    retry: false,
  })

  if (user && user.isConfirmed === false) {
    if (to.query.step !== AllowedAuthStepsEnum.VERIFY_EMAIL) {
      const email64 = getSafeBase64String(user?.email || '')

      return navigateTo({
        path: '/auth',
        query: { ...to.query, step: AllowedAuthStepsEnum.VERIFY_EMAIL, payload: email64 },
      })
    }

    return
  }

  if (isAuthRequired) {
    if (!user) {
      try {
        await checkFinishSignupToken()

        if (to.query.step !== AllowedAuthStepsEnum.FINISH_SIGN_UP) {
          return navigateTo({
            path: '/auth',
            query: { ...to.query, step: AllowedAuthStepsEnum.FINISH_SIGN_UP },
          })
        }
      } catch {
        return navigateTo({
          path: '/auth',
          query: {
            redirect: to.fullPath !== '/' ? to.fullPath : undefined,
          },
        })
      }
    }
  }

  if (isGuestOnly) {
    if (user && user.isConfirmed === true) {
      const redirectUrl = (to.query.redirect as string) || '/workspace'
      console.log('redirectUrl', redirectUrl)
      return navigateTo(redirectUrl)
    }
  }
})
