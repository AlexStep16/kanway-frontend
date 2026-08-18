<script setup lang="ts">
import { ChevronRight, MoreHorizontal, Plus } from '@lucide/vue'
import ChatOptions from '../ChatOptions.vue'
import type { IChat } from '~/interfaces/domain/IChat'
import { useSidebar } from '~/components/ui/sidebar'

const uiStore = useUIStore()
const chatStore = useChatStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const activeChatId = computed(() => chatStore.activeChatId)
const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)

const { data: chatsData, isPending: areChatsPending } = useChats(activeWorkspaceId)

const areChatsLoading = useDelayedLoading(areChatsPending)

const chats = computed(() => chatsData.value || [])
const open = ref(true)
const openOptions = ref<Record<string, boolean>>({})

function toggle() {
  open.value = !open.value
}

const { isMobile, toggleSidebar } = useSidebar()

const isChatOpen = computed(() => (id: string) => {
  if (!activeChatId.value) return false

  return id === activeChatId.value && uiStore.isChatOpen
})

function handleSelectChat(chat: IChat) {
  chatStore.selectChat(chat)

  if (isMobile.value) {
    toggleSidebar()
    boardStore.clearBoard()
  }
}

function handleNewChat() {
  chatStore.newChat()

  if (isMobile.value) {
    toggleSidebar()
    boardStore.clearBoard()
  }
}
</script>

<template>
  <Collapsible
    as-child
    :open="open"
  >
    <SidebarMenuItem class="flex flex-col min-h-0 h-full">
      <div class="flex items-center w-full">
        <SidebarMenuButton
          variant="muted"
          class="cursor-default flex-1"
          tooltip="Чаты"
          @click="toggle"
        >
          <div class="font-medium gap-x-2 flex items-center w-full">
            <span class="text-xs">Чаты</span>
            <ChevronRight
              class="size-3.5! transition-transform duration-200 -rotate-90 relative"
              :class="{ 'rotate-90': open }"
            />
          </div>
        </SidebarMenuButton>
        <TooltipProvider :disableHoverableContent="true">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon-xs"
                class="text-muted-foreground md:opacity-0 group-hover/menu-item:opacity-100"
                @click.stop="handleNewChat"
              >
                <Plus
                  class="size-3.5"
                  stroke-width="2.5"
                />
                <span class="sr-only">Создать чат</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              :sideOffset="-4"
              side="right"
            >
              <p>Создать чат</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <CollapsibleContent class="flex-1 min-h-0 flex flex-col">
        <div class="flex-1 overflow-auto custom-scrollbar pr-1">
          <SidebarMenuSub class="pr-0 mr-0">
            <template v-if="!areChatsLoading">
              <SidebarMenuSubItem v-if="chats.length === 0">
                <div class="text-xs font-medium text-muted-foreground w-full text-center py-2">
                  Нет чатов
                </div>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem
                v-for="chat in chats"
                :key="chat.id"
              >
                <SidebarMenuSubButton
                  class="cursor-default"
                  size="md"
                  as-child
                  :is-active="isChatOpen(chat.id)"
                  @click="handleSelectChat(chat)"
                >
                  <div>
                    <span class="text-nowrap truncate">{{ chat.name }}</span>
                  </div>
                </SidebarMenuSubButton>

                <DropdownMenu
                  v-model:open="openOptions[chat.id]"
                  :modal="false"
                >
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
                  <ChatOptions
                    :is-mobile="isMobile"
                    :chat="chat"
                    @close="openOptions[chat.id] = false"
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
        </div>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
</template>
