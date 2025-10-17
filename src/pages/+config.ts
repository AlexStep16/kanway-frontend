import vikeVue from 'vike-vue/config'
import vikeVuePinia from 'vike-vue-pinia/config'
import type { Config } from 'vike/types'
import User from '../Interfaces/User'

export default {
  ssr: false,
  prerender: false,
  extends: [vikeVue, vikeVuePinia],
  hooksTimeout: false,
  bodyAttributes: { class: 'bg-gray-100 hs-overlay-body-open' },
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {
      // Type of pageContext.user
      user?: User | null
      hasErrorFetchingUser?: boolean
      isSkipWorkspaceCheck?: boolean
      isHydration?: boolean
      shouldSkipLoader?: boolean
      workspaceId?: string
      boardId?: string
      token?: string
      checkStatus?: number
      abortReason?: string | { notAdmin: true }
    }
  }
}
