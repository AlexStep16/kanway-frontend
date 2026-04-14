import type { PageContextClient } from 'vike/types'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'
import { requireGuest } from '../guards'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    await requireGuest()
  } catch (e) {
    dataErrorHandler(pageContext, e)
  }
}
