<script setup lang="ts">
import { ChevronRight, MoreHorizontal, Plus } from 'lucide-vue-next'
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
import Button from '@/components/ui/button/Button.vue'
import ChatOptions from '../ChatOptions.vue'

import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '@/stores/workspace'
import { computed, ref } from 'vue'
import { useChats } from '@/composables/chat/queries/useChats'
import { useChatStore } from '@/stores/chat'
import { useUIStore } from '@/stores/ui'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const uiStore = useUIStore()
const chatStore = useChatStore()
const workspaceStore = useWorkspaceStore()

const { activeWorkspaceId } = storeToRefs(workspaceStore)
const { activeChatId } = storeToRefs(chatStore)

const { data: chatsData, isPending: areChatsLoading } = useChats(activeWorkspaceId)

const chats = computed(() => chatsData.value || [])
const open = ref(true)
const openOptions = ref<Record<string, boolean>>({})

function toggle() {
  open.value = !open.value
}

const { isMobile } = useSidebar()

const isChatOpen = computed(() => (id: string) => {
  if (!activeChatId.value) return false

  return id === activeChatId.value && uiStore.isChatOpen
})
</script>

<template>
  <Collapsible as-child :open="open">
    <SidebarMenuItem>
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
        <Button
          variant="ghost"
          size="icon-xs"
          class="text-muted-foreground opacity-0 group-hover/menu-item:opacity-100"
          @click.stop="chatStore.newChat"
        >
          <Plus class="size-3.5" stroke-width="2.5" />
          <span class="sr-only">Создать чат</span>
        </Button>
      </div>
      <CollapsibleContent>
        <SidebarMenuSub class="pr-0 mr-0">
          <template v-if="!areChatsLoading">
            <SidebarMenuSubItem v-if="chats.length === 0">
              <div class="text-xs font-medium text-muted-foreground w-full text-center py-2">
                Нет чатов
              </div>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem v-for="chat in chats" :key="chat.id">
              <SidebarMenuSubButton
                class="cursor-default"
                size="md"
                as-child
                :is-active="isChatOpen(chat.id)"
                @click="chatStore.selectChat(chat)"
              >
                <div>
                  <span class="text-nowrap truncate">{{ chat.name }}</span>
                </div>
              </SidebarMenuSubButton>

              <DropdownMenu v-model:open="openOptions[chat.id]">
                <DropdownMenuTrigger as-child>
                  <SidebarMenuSubAction class="bg-sidebar-accent" show-on-hover @autofocus.prevent>
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
            <SidebarMenuSubItem v-for="n in 3" :key="`skeleton-board-${n}`">
              <Skeleton class="w-full h-8" />
            </SidebarMenuSubItem>
          </template>
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
</template>
