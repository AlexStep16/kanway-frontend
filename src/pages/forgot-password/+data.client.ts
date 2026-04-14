import type { PageContextClient } from 'vike/types'
import { requireGuest } from '../guards'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    await requireGuest()
  } catch (e) {
    dataErrorHandler(pageContext, e)
  }
}
