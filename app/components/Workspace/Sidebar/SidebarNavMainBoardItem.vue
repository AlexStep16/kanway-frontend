<script setup lang="ts">
import { ChevronRight, MoreHorizontal, Plus, Star } from 'lucide-vue-next'
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

watch(createBoardDropdownOpen, (newVal) => {
  if (newVal) {
    console.log(newVal)
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
  boardStore.selectBoard(board, true)

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
    <SidebarMenuItem>
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
        <DropdownMenu v-model:open="createBoardDropdownOpen">
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon-xs"
              class="text-muted-foreground md:opacity-0 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 data-[state=open]:text-sidebar-accent-foreground data-[state=open]:bg-accent focus-within:opacity-100"
              @click.stop
            >
              <Plus
                class="size-3.5"
                stroke-width="2.5"
              />
              <span class="sr-only">Создать доску</span>
            </Button>
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
      <CollapsibleContent>
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

              <DropdownMenu v-model:open="openOptions[board.id]">
                <DropdownMenuTrigger as-child>
                  <SidebarMenuSubAction
                    class="bg-sidebar-accent"
                    show-on-hover
                    @autofocus.prevent
                  >
                    <MoreHorizontal />
                    <span class="sr-only">Больше</span>
                  </SidebarMenuSubAction>
                </DropdownMenuTrigger>
                <BoardOptions
                  :board="board"
                  :is-mobile="isMobile"
                  @close="openOptions[board.id] = false"
                />
              </DropdownMenu>
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
    </SidebarMenuItem>
  </Collapsible>
</template>
