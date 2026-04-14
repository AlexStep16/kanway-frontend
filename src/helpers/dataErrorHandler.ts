import { redirect, render } from 'vike/abort'
import { BackendError, HttpError } from '@utils/errors'
import { PageContextClient } from 'vike/types'

export function dataErrorHandler(_pageContext: PageContextClient, e: any) {
  if (e instanceof Error && e.message.includes('AbortRender')) {
    throw e
  }

  if (e instanceof HttpError) {
    if (e.status === 403) {
      throw redirect('/confirmation')
    }
  }

  if (e instanceof BackendError || e instanceof HttpError) {
    throw render(500)
  }

  throw e
}
