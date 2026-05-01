import vikeVue from 'vike-vue/config'
import type { Config } from 'vike/types'
import UserModel from '@/models/UserModel'
import { Pinia } from 'pinia'
import { Nullable } from '@/types/utils'

export default {
  ssr: false,
  prerender: {
    partial: true,
  },
  extends: [vikeVue],
  hooksTimeout: false,
  bodyAttributes: { class: 'bg-slate-100' },
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
