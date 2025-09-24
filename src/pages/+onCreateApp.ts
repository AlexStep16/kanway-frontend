export { onCreateApp }

import type { PageContext } from 'vike/types'
import VueTheMask from 'vue-the-mask'

function onCreateApp(pageContext: PageContext) {
  if (pageContext.isRenderingHead) {
    // Don't add the plugin when rendering <head> (see Lifecycle)
    return
  }
  const app = pageContext.app!

  VueTheMask(app)
}
