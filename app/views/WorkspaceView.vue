<script setup lang="ts">
import Tip from '~/components/Tip/Tip.vue'
import WorkspaceDialogSkeleton from '~/components/Skeletons/WorkspaceDialogSkeleton.vue'
import TaskEditSkeleton from '~/components/Skeletons/TaskEditSkeleton.vue'
import MobileSearchSkeleton from '~/components/Skeletons/MobileSearchSkeleton.vue'
import PlansSkeleton from '~/components/Skeletons/PlansSkeleton.vue'

const uiStore = useUIStore()
</script>

<template>
  <Dialog
    class="z-90"
    :open="uiStore.isWorkspaceDialogOpen"
    @update:open="(v) => !v && uiStore.closeWorkspaceDialog()"
  >
    <DialogContent
      class="sm:max-w-106.25 p-4"
      :show-close-button="false"
    >
      <Suspense>
        <template #default>
          <LazyWorkspaceDialog />
        </template>
        <template #fallback>
          <WorkspaceDialogSkeleton />
        </template>
      </Suspense>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="uiStore.isEditTaskModalOpen">
    <DialogContent
      class="p-0 overflow-hidden border-none shadow-2xl rounded-lg focus-within:ring-0 focus-within:outline-none focus-within:ring-offset-0 focus-within:outline-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:outline-0"
      :showCloseButton="false"
    >
      <Suspense>
        <template #default>
          <LazyTaskEdit v-if="uiStore.isEditTaskModalOpen" />
        </template>
        <template #fallback>
          <TaskEditSkeleton />
        </template>
      </Suspense>
    </DialogContent>
  </Dialog>

  <Tip />

  <Dialog v-model:open="uiStore.isMobileSearchOpen">
    <DialogContent
      class="max-h-[95svh] p-0 border-none bg-transparent shadow-none flex flex-col items-start justify-center sm:p-4 translate-y-0! top-[2.5svh]!"
      :show-close-button="false"
    >
      <Suspense>
        <template #default>
          <LazyMobileSearch />
        </template>
        <template #fallback>
          <MobileSearchSkeleton />
        </template>
      </Suspense>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="uiStore.isPlansModalOpen">
    <DialogContent
      class="max-h-[95svh] md:min-w-170 lg:min-w-220 p-2 overflow-hidden border-none shadow-2xl rounded-sm flex flex-col md:rounded-xl"
    >
      <Suspense>
        <template #default>
          <LazyPlans />
        </template>
        <template #fallback>
          <PlansSkeleton />
        </template>
      </Suspense>
    </DialogContent>
  </Dialog>
</template>
