<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'

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
    :class="
      cn(
        'absolute right-1 flex aspect-square size-7 items-center bg-accent justify-center rounded-md p-0 text-foreground outline-none ring-ring transition-transform hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 group-hover/workspace-item:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0',
        showOnHover &&
          'group-focus-within/workspace-item:opacity-100 group-hover/workspace-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/dropdown-menu-item:text-accent-foreground md:opacity-0',
        'peer-data-[active=true]/dropdown-menu-item:bg-transparent',
        'peer-data-[active=true]/dropdown-menu-item:text-primary',
        'peer-data-[active=true]/dropdown-menu-item:hover:bg-primary/10',
        'peer-data-[active=true]/dropdown-menu-item:hover:text-primary',
        'peer-data-[active=true]/dropdown-menu-item:data-[state=open]:bg-primary/10',
        props.class,
      )
    "
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </Primitive>
</template>
