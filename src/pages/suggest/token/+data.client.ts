import type { PageContextClient } from 'vike/types'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    window.onload = function () {
      ;(window as any).YaSendSuggestToken('https://kanway.ru')
    }
  } catch (e) {
    dataErrorHandler(pageContext, e)
  }
}
