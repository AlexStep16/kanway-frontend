import { redirect, render } from 'vike/abort'
import { BackendError, HttpError } from '@utils/errors'
import { PageContextClient } from 'vike/types'
import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'

export function dataErrorHandler(_pageContext: PageContextClient, e: any) {
  if (e instanceof Error && e.message.includes('AbortRender')) {
    throw e
  }

  if (e.code === 403 || e.status === 403) {
    throw redirect('/auth?step=' + AllowedAuthStepsEnum.VERIFY_EMAIL)
  }

  if (e instanceof BackendError || e instanceof HttpError) {
    throw render(500)
  }

  throw e
}
