export { onHydrationEnd }

import type { OnHydrationEndAsync } from 'vike/types'
import { mande } from 'mande'
import { navigate } from 'vike/client/router'

const onHydrationEnd: OnHydrationEndAsync = async (
  pageContext,
): ReturnType<OnHydrationEndAsync> => {}
