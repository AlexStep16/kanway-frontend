import { plugin as VueInputAutowidth } from 'vue-input-autowidth'
import { mask } from 'vue-the-mask'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueInputAutowidth)
  nuxtApp.vueApp.directive('mask', mask as any)
})
