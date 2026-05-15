<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      showOnHover?: boolean
      class?: HTMLAttributes['class']
    }
  >(),
  {
    as: 'button',
  },
)
</script>

<template>
  <Primitive
    data-sidebar="menu-sub-action"
    :class="
      cn(
        'absolute right-0 top-0 flex aspect-square size-7 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-sub-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0',
        'after:absolute after:-inset-2 after:md:hidden',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'group-focus-within/menu-sub-item:opacity-100 group-hover/menu-sub-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-sub-button:text-sidebar-accent-foreground md:opacity-0',

        'peer-data-[active=true]/menu-sub-button:bg-primary-muted',
        'peer-data-[active=true]/menu-sub-button:text-primary',
        'peer-data-[active=true]/menu-sub-button:hover:bg-primary-muted-hover',
        'peer-data-[active=true]/menu-sub-button:hover:text-primary',
        'peer-data-[active=true]/menu-sub-button:data-[state=open]:bg-primary-muted-hover',
        props.class,
      )
    "
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </Primitive>
</template>
