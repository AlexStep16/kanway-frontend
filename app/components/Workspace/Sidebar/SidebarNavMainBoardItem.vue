<script setup lang="ts">
import { ChevronRight, MoreHorizontal, Plus, Star } from '@lucide/vue'
import BoardOptions from '../BoardOptions.vue'
import CreateBoardForm from '~/components/Forms/CreateBoardForm.vue'
import { cn } from '~/lib/utils'
import type { IBoard } from '~/interfaces/domain/IBoard'
import { useSidebar } from '~/components/ui/sidebar'

const workspaceStore = useWorkspaceStore()
const boardStore = useBoardStore()
const chatStore = useChatStore()

const activeBoardId = computed(() => boardStore.activeBoardId)
const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)

const createBoardDropdownOpen = ref(false)

const { data: boardsData, isPending: areBoardsLoading } = useBoards(activeWorkspaceId)
const { data: user } = useUser()
const { data: subscriptionsData, isPending: isSubscriptionsLoading } = useSubscriptions()
const subscriptions = computed(() => subscriptionsData.value || [])

const currentSubscription = computed(() => {
  if (!user.value) {
    return null
  }

  return (
    subscriptions.value.find(
      (subscription) => subscription.subscriptionId === user.value?.subscriptionId,
    ) || null
  )
})

const maxBoards = computed(() => {
  if (!currentSubscription.value) {
    return 0
  }

  return currentSubscription.value.limitBoards
})

const boards = computed(() => boardsData.value || [])
const open = ref(true)
const openOptions = ref<Record<string, boolean>>({})

const { isMobile, toggleSidebar } = useSidebar()

const inputRef = ref<HTMLInputElement | null>(null)

const connectExposed = (exposed: any) => {
  if (exposed?.inputRef) inputRef.value = exposed.inputRef
}

function toggle() {
  open.value = !open.value
}

const isCreateBoardButtonActive = computed(() => {
  return boards.value.length < maxBoards.value || maxBoards.value === -1
})

watch(createBoardDropdownOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
    })
  }
})

const orderedBoards = computed(() => {
  const { favoriteBoards, otherBoards } = boards.value.reduce(
    (acc, board) => {
      if (board.isFavorite) {
        acc.favoriteBoards.push(board)
      } else {
        acc.otherBoards.push(board)
      }
      return acc
    },
    {
      favoriteBoards: [] as typeof boards.value,
      otherBoards: [] as typeof boards.value,
    },
  )

  favoriteBoards.sort((a, b) => a.rank.localeCompare(b.rank))
  otherBoards.sort((a, b) => a.rank.localeCompare(b.rank))
  return [...favoriteBoards, ...otherBoards]
})

function handleSelectBoard(board: IBoard) {
  boardStore.selectBoard(board.id)

  if (isMobile.value) {
    toggleSidebar()
    chatStore.closeChat()
  }
}

function handleCloseCreateBoard() {
  createBoardDropdownOpen.value = false

  if (isMobile.value) {
    toggleSidebar()
    chatStore.closeChat()
  }
}
</script>

<template>
  <Collapsible
    as-child
    :open="open"
  >
    <SidebarMenuItem class="flex flex-col min-h-0">
      <div class="flex items-center w-full">
        <SidebarMenuButton
          variant="muted"
          class="cursor-default flex-1"
          tooltip="Доски"
          @click="toggle"
        >
          <div class="font-medium gap-x-2 flex items-center w-full">
            <span class="text-xs">Доски</span>
            <ChevronRight
              class="size-3.5! transition-transform duration-200 -rotate-90 relative"
              :class="{ 'rotate-90': open }"
            />
          </div>
        </SidebarMenuButton>
        <DropdownMenu
          v-model:open="createBoardDropdownOpen"
          :modal="false"
        >
          <DropdownMenuTrigger as-child>
            <TooltipProvider
              :disableHoverableContent="true"
              :disabled="isSubscriptionsLoading"
            >
              <Tooltip :delayDuration="300">
                <TooltipTrigger as-child>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    class="text-muted-foreground disabled:pointer-events-auto disabled:opacity-0 disabled:bg-accent disabled:group-hover/menu-item:opacity-50 md:opacity-0 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 data-[state=open]:text-sidebar-accent-foreground data-[state=open]:bg-accent focus-within:opacity-100"
                    v-if="!isSubscriptionsLoading"
                    :disabled="!isCreateBoardButtonActive"
                    @click.stop="createBoardDropdownOpen = !createBoardDropdownOpen"
                  >
                    <Plus
                      class="size-3.5"
                      stroke-width="2.5"
                    />
                    <span class="sr-only">Создать доску</span>
                  </Button>

                  <Spinner
                    class="size-3.5 text-muted-foreground"
                    v-else
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p v-if="isCreateBoardButtonActive">Создать доску</p>
                  <p v-else>Достигнут лимит досок</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-56 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            :align="isMobile ? 'end' : 'start'"
          >
            <CreateBoardForm
              :ref="connectExposed"
              :workspace-id="activeWorkspaceId"
              @close="handleCloseCreateBoard"
              v-if="activeWorkspaceId"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
        <CollapsibleContent class="min-h-0 flex flex-col">
          <SidebarMenuSub class="pr-0 mr-0">
            <template v-if="!areBoardsLoading">
              <SidebarMenuSubItem v-if="orderedBoards.length === 0">
                <div class="text-xs font-medium text-muted-foreground w-full text-center py-2">
                  Нет досок
                </div>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem
                v-for="board in orderedBoards"
                :key="board.id"
              >
                <SidebarMenuSubButton
                  class="cursor-default"
                  size="md"
                  as-child
                  :is-active="board.id === activeBoardId"
                  @click="handleSelectBoard(board)"
                >
                  <div class="flex gap-x-1 items-center">
                    <Star
                      :class="
                        cn(
                          'size-3.5! fill-sidebar-ring text-sidebar-ring!',
                          board.id === activeBoardId && 'fill-primary text-primary!',
                        )
                      "
                      v-if="board.isFavorite"
                    />
                    <span class="text-nowrap">{{ board.name }}</span>
                  </div>
                </SidebarMenuSubButton>

                <TooltipProvider :disableHoverableContent="true">
                  <DropdownMenu
                    v-model:open="openOptions[board.id]"
                    :modal="false"
                  >
                    <DropdownMenuTrigger as-child>
                      <SidebarMenuSubAction
                        class="bg-sidebar-accent"
                        show-on-hover
                        @autofocus.prevent
                      >
                        <Tooltip :delayDuration="300">
                          <TooltipTrigger as-child>
                            <MoreHorizontal class="outline-none size-4" />
                            <span class="sr-only">Больше</span>
                          </TooltipTrigger>

                          <TooltipContent
                            v-if="!openOptions[board.id]"
                            :side-offset="10"
                          >
                            Действия с доской
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuSubAction>
                    </DropdownMenuTrigger>

                    <BoardOptions
                      :board="board"
                      :is-mobile="isMobile"
                      @close="openOptions[board.id] = false"
                    />
                  </DropdownMenu>
                </TooltipProvider>
              </SidebarMenuSubItem>
            </template>
            <template v-else>
              <SidebarMenuSubItem
                v-for="n in 3"
                :key="`skeleton-board-${n}`"
              >
                <Skeleton class="w-full h-8" />
              </SidebarMenuSubItem>
            </template>
          </SidebarMenuSub>
        </CollapsibleContent>
      </div>
    </SidebarMenuItem>
  </Collapsible>
</template>
