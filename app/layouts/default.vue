<script setup lang="ts">
const uiStore = useUIStore()
</script>

<template>
  <Dialog v-model:open="uiStore.isSupportModalOpen">
    <DialogContent
      class="sm:max-w-125 max-h-[95svh] p-0 overflow-hidden border-none shadow-2xl rounded-xl"
    >
      <Suspense>
        <template #default>
          <LazySupport />
        </template>

        <template #fallback>
          <SupportSkeleton />
        </template>
      </Suspense>
    </DialogContent>
  </Dialog>

  <slot />
</template>
