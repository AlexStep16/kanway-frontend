import vikeVue from 'vike-vue/config'
import type { Config } from 'vike/types'
import UserModel from '@/models/UserModel'
import { Pinia } from 'pinia'
import { Nullable } from '@/types/utils'

export default {
  ssr: false,
  prerender: false,
  extends: [vikeVue],
  hooksTimeout: false,
  bodyAttributes: { class: 'bg-gray-100 hs-overlay-body-open' },
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {
      // Type of pageContext.user
      user?: Nullable<UserModel>
      isHydration?: boolean
      pinia?: Pinia
      workspaceId?: string
      boardId?: string
      token?: string
      checkStatus?: number
      abortReason?: string | { notAdmin: true }
    }
  }
}
