<script setup lang="ts">
import { ChevronsUpDown, Plus, MoreHorizontal, Star } from 'lucide-vue-next'
import WorkspaceOptions from '../WorkspaceOptions.vue'
import ActiveWorkspaceAvatar from '~/components/Workspace/ActiveWorkspaceAvatar.vue'
import { cn } from '~/lib/utils'
import { useSidebar } from '~/components/ui/sidebar'

const isOpen = ref(false)
const { isMobile } = useSidebar()

const { data: workspacesData, isPending: areWorkspacesLoading } = useWorkspaces()
const workspaces = computed(() => workspacesData.value || [])

const openOptions = ref<Record<string, boolean>>({})

const uiStore = useUIStore()
const workspaceStore = useWorkspaceStore()

const { activeWorkspaceId } = storeToRefs(workspaceStore)

const activeWorkspace = useWorkspaceSelector(activeWorkspaceId)

const { data: boardsCountData, isPending: areBoardsCountLoading } =
  useBoardsCount(activeWorkspaceId)

const activeWorkspaceName = computed(() => {
  return activeWorkspace.value?.name ?? ''
})

const getFirstLetterOfWorkspace = computed(() => (workspaceId: string) => {
  const workspace = workspaces.value.find((ws) => ws.id === workspaceId)

  if (workspace) return workspace.name.charAt(0).toUpperCase()

  return ''
})

const orderedWorkspaces = computed(() => {
  const { favoriteWorkspaces, otherWorkspaces } = workspaces.value.reduce(
    (acc, workspace) => {
      if (workspace.isFavorite) {
        acc.favoriteWorkspaces.push(workspace)
      } else {
        acc.otherWorkspaces.push(workspace)
      }
      return acc
    },
    {
      favoriteWorkspaces: [] as typeof workspaces.value,
      otherWorkspaces: [] as typeof workspaces.value,
    },
  )

  favoriteWorkspaces.sort((a, b) => a.rank.localeCompare(b.rank))
  otherWorkspaces.sort((a, b) => a.rank.localeCompare(b.rank))
  return [...favoriteWorkspaces, ...otherWorkspaces]
})

const openWorkspaceDialog = () => {
  uiStore.openWorkspaceDialog()

  isOpen.value = false
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu v-model:open="isOpen">
        <DropdownMenuTrigger
          as-child
          :disabled="areWorkspacesLoading"
        >
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            v-if="!areWorkspacesLoading"
          >
            <ActiveWorkspaceAvatar />
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ activeWorkspaceName }}</span>
              <div
                class="flex items-center gap-x-1 truncate text-xs"
                v-if="!areBoardsCountLoading"
              >
                Досок: <span>{{ boardsCountData }}</span>
              </div>
              <Skeleton
                v-else
                class="h-4 w-14"
              />
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>

          <Skeleton
            v-else
            class="w-full h-12"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Пространства
          </DropdownMenuLabel>

          <div class="flex flex-col gap-1">
            <div
              class="relative flex items-center justify-between group/workspace-item"
              v-for="workspace in orderedWorkspaces"
              :key="workspace.id"
            >
              <DropdownMenuItem
                :item="workspace"
                class="gap-2 p-2 cursor-default w-full max-w-60"
                @click="workspaceStore.selectWorkspace(workspace)"
                :is-active="workspace.id === activeWorkspaceId"
              >
                <div
                  class="size-5 shrink-0 rounded-sm text-xs flex items-center justify-center font-semibold text-white"
                  :style="{ backgroundColor: workspace.color || '#3B82F6' }"
                >
                  {{ getFirstLetterOfWorkspace(workspace.id) }}
                </div>
                <div class="flex gap-x-2 items-center truncate">
                  <span class="text-nowrap truncate">{{ workspace.name }}</span>
                  <Star
                    :class="
                      cn(
                        'size-3.5! fill-sidebar-ring text-sidebar-ring!',
                        workspace.id === activeWorkspaceId && 'fill-primary text-primary!',
                      )
                    "
                    v-if="workspace.isFavorite"
                  />
                </div>
              </DropdownMenuItem>

              <DropdownMenu v-model:open="openOptions[workspace.id]">
                <DropdownMenuTrigger as-child>
                  <DropdownMenuMore
                    show-on-hover
                    :class="cn('translate-x-0', 'opacity-0 transition-opacity')"
                  >
                    <MoreHorizontal class="size-4" />
                    <span class="sr-only">Больше</span>
                  </DropdownMenuMore>
                </DropdownMenuTrigger>

                <WorkspaceOptions
                  :workspace="workspace"
                  :is-mobile="isMobile"
                  @close="openOptions[workspace.id] = false"
                />
              </DropdownMenu>
            </div>
          </div>
          <DropdownMenuSeparator />
          <Button
            variant="secondary"
            size="sm"
            class="flex gap-x-2 px-2 w-full font-normal justify-start"
            @click="openWorkspaceDialog()"
          >
            <div class="size-5 flex items-center justify-center rounded-sm bg-secondary">
              <Plus class="size-4" />
            </div>
            <span class="text-nowrap">Создать</span>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
