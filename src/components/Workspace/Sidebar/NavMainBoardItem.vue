<script setup lang="ts">
import { ChevronRight, MoreHorizontal, KanbanSquare, Plus, Star } from 'lucide-vue-next'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubAction,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import BoardOptions from '../BoardOptions.vue'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '@/stores/workspace'
import { computed, nextTick, ref, watch } from 'vue'
import { useBoardStore } from '@/stores/board'
import Button from '@/components/ui/button/Button.vue'
import CreateBoardForm from '@/components/Forms/CreateBoardForm.vue'
import { Nullable } from '@/types/utils'
import { cn } from '@/lib/utils'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const workspaceStore = useWorkspaceStore()
const boardStore = useBoardStore()

const { activeWorkspaceId } = storeToRefs(workspaceStore)
const { activeBoardId } = storeToRefs(boardStore)

const createBoardDropdownOpen = ref(false)

const { data: boardsData, isPending: areBoardsLoading } = useBoards(activeWorkspaceId)

const boards = computed(() => boardsData.value || [])
const open = ref(true)
const openOptions = ref<Record<string, boolean>>({})

const { isMobile } = useSidebar()

const inputRef = ref<Nullable<HTMLInputElement>>(null)

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

  favoriteBoards.sort((a, b) => a.order - b.order)
  otherBoards.sort((a, b) => a.order - b.order)
  return [...favoriteBoards, ...otherBoards]
})
</script>

<template>
  <Collapsible as-child :open="open">
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
              class="text-muted-foreground opacity-0 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 data-[state=open]:text-sidebar-accent-foreground data-[state=open]:bg-accent focus-within:opacity-100"
              @click.stop
            >
              <Plus class="size-3.5" stroke-width="2.5" />
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
              @close="createBoardDropdownOpen = false"
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
            <SidebarMenuSubItem v-for="board in orderedBoards" :key="board.id">
              <SidebarMenuSubButton
                class="cursor-default"
                size="md"
                as-child
                :is-active="board.id === activeBoardId"
                @click="boardStore.selectBoard(board)"
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
                  <SidebarMenuSubAction class="bg-sidebar-accent" show-on-hover @autofocus.prevent>
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
            <SidebarMenuSubItem v-for="n in 3" :key="`skeleton-board-${n}`">
              <Skeleton class="w-full h-8" />
            </SidebarMenuSubItem>
          </template>
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
</template>
