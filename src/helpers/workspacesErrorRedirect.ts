import { redirect, render } from 'vike/abort'
import { BackendError, HttpError } from '@utils/errors'
import { PageContextClient } from 'vike/types'

export function workspacesErrorRedirect(pageContext: PageContextClient, e: any) {
  if (e instanceof Error && e.message.includes('AbortRender')) {
    throw e
  }

  if (e instanceof BackendError) {
    throw render(500)
  }

  if (e instanceof HttpError) {
    if (e.status === 401) {
      throw redirect('/sign-in')
    } else if (e.status === 403) {
      throw redirect('/confirmation')
    } else {
      throw render(500)
    }
  }

  throw e
}
