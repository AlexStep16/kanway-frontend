<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import { X, MessagesSquare, Check } from 'lucide-vue-next'
import UserBubble from '@components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import Confirmation from '@components/Workspace/Main/Chat/Bubbles/Confirmation.vue'
import AIInput from '@components/Workspace/Main/Chat/AIInput.vue'
import Assistant from '@components/Workspace/Main/Chat/Bubbles/Assistant.vue'
import Status from '@components/Workspace/Main/Chat/Bubbles/Status.vue'
import { ref } from 'vue'
import Task from '@components/Workspace/Main/Task/Task.vue'
import EntityCard from '@/components/Workspace/Main/EntityCard.vue'
import { useChatStore } from '@/stores/chat'
import { useChatMessageStore } from '@/stores/chatMessages'
import ColumnsView from '@/components/Workspace/Main/ColumnsView.vue'
import { useAgentStatusStore } from '@stores/agentStatus'
import Spinner from '@components/Loader/Spinner.vue'
import dayjs from 'dayjs'

const UI_STORE = useUIStore()
const CHAT_STORE = useChatStore()
const CHAT_MESSAGE_STORE = useChatMessageStore()
const AGENT_STATUS_STORE = useAgentStatusStore()

const chatRef = ref<HTMLElement | null>(null)
const messagesContainerRefMap = ref<Record<string, HTMLElement | null>>({})

function send(message: string) {
  CHAT_STORE.sendMessage(message)
}

function isToolCallApproved(toolCall: any) {
  return toolCall.isConfirmed || toolCall.isCancelled
}

function getListTitle(listType: string) {
  switch (listType) {
    case 'task':
      return 'задачи'
    case 'category':
      return 'категории'
    case 'board':
      return 'доски'
    case 'workspace':
      return 'пространства'
    default:
      return 'элементы'
  }
}

const getFormattedDate = (date: Date) => {
  return dayjs(date).calendar() + ' в ' + dayjs(date).format('HH:mm')
}
</script>

<template>
  <div
    id="hs-chat"
    :ref="
      (el) => {
        if (el) UI_STORE.chatModalRef = el as HTMLElement
      }
    "
    class="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-80 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    aria-labelledby="hs-chat-label"
  >
    <div class="size-full flex items-center justify-center p-2 sm:p-4">
      <div
        class="flex flex-col size-full max-w-4xl max-h-160 bg-white rounded-md pointer-events-auto px-4 py-3 overflow-auto"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 pb-2 border-b border-gray-200">
          <div class="flex items-center justify-center gap-x-2">
            <MessagesSquare class="size-4" />
            <h5 id="hs-task-edit-label" class="text-sm font-medium text-gray-800">
              {{ CHAT_STORE.activeChat?.name }}
            </h5>
          </div>
          <button
            class="transition-colors duration-100 text-gray-400 hover:bg-gray-200 p-1 rounded-full"
            type="button"
            @click="UI_STORE.closeChatModal()"
          >
            <X class="size-5" />
          </button>
        </div>

        <!-- Body -->
        <div
          class="flex flex-col grow-1 gap-2 min-h-0 overflow-y-auto py-2 px-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
          ref="chatRef"
        >
          <template v-for="message in CHAT_MESSAGE_STORE.currentChatMessages" :key="message.id">
            <UserBubble
              v-if="message.role === 'user'"
              :text="message.content"
              :date="getFormattedDate(message.createdAt)"
            />
            <AIBubble
              v-else-if="['assistant', 'error'].includes(message.role)"
              :date="getFormattedDate(message.createdAt)"
              :isError="message.role === 'error'"
              @tryAgain="CHAT_STORE.retryAgent(message)"
            >
              <Assistant :text="message.content" />
            </AIBubble>

            <template v-else-if="message.role === 'list_entities'">
              <AIBubble :hideAvatar="true" :isContentFullWidth="true">
                <Assistant
                  :text="'Вот ' + getListTitle(message.listType || '') + ' по вашему запросу:'"
                />

                <div
                  class="flex gap-2 mt-3 w-full"
                  :ref="
                    (el) => {
                      messagesContainerRefMap[message.id] = el as HTMLElement
                    }
                  "
                >
                  <ColumnsView
                    :items="message.content"
                    :containerRef="messagesContainerRefMap[message.id]"
                    v-if="message.content"
                  >
                    <template v-slot:default="slotProps">
                      <template v-if="message.listType === 'task'">
                        <Task
                          v-for="task in slotProps.data"
                          :key="task.id"
                          :task="task"
                          :hasBorder="true"
                          :showInfo="true"
                          taskClasses="self-start"
                        />
                      </template>

                      <template v-else>
                        <EntityCard
                          v-for="category in slotProps.data"
                          :key="category.id"
                          :name="category.name"
                          :parentName="category.boardName"
                          :showInfo="true"
                        /> </template
                    ></template>
                  </ColumnsView>
                </div>
              </AIBubble>
            </template>

            <template v-else-if="message.role === 'preview'">
              <AIBubble
                v-for="content in message.content"
                :key="content.callId"
                :isContentFullWidth="true"
              >
                <Confirmation :text="content.title" :changes="content.args.changes" />

                <div
                  class="flex gap-2 mt-3 w-full"
                  :ref="
                    (el) => {
                      messagesContainerRefMap[message.id] = el as HTMLElement
                    }
                  "
                >
                  <ColumnsView
                    :items="content.context"
                    :containerRef="messagesContainerRefMap[message.id]"
                    v-if="content.context"
                  >
                    <template v-slot:default="slotProps">
                      <template v-if="content.entityType === 'task'">
                        <Task
                          v-for="task in slotProps.data"
                          :key="task.id"
                          :task="task"
                          :hasBorder="true"
                          :showInfo="true"
                          taskClasses="self-start"
                        />
                      </template>

                      <template v-else>
                        <EntityCard
                          v-for="category in slotProps.data"
                          :key="category.id"
                          :name="category.name"
                          :parentName="category.boardName"
                          :showInfo="true"
                        /> </template
                    ></template>
                  </ColumnsView>
                </div>

                <div
                  class="flex gap-x-2 max-w-lg mt-3 pt-3 border-t border-gray-200"
                  v-if="!isToolCallApproved(content)"
                >
                  <button
                    type="button"
                    class="flex items-center justify-center text-xs rounded-md text-white py-1.5 px-2.5 bg-blue-500 hover:opacity-90 transition-opacity duration-100 relative"
                    @click="CHAT_STORE.approveToolCall(content.callId, message.id, 'confirm')"
                  >
                    <div
                      class="flex items-center justify-center absolute"
                      v-if="CHAT_STORE.isToolCallApproving(content.callId)"
                    >
                      <Spinner class="size-4" />
                    </div>
                    <span :class="{ 'opacity-0': CHAT_STORE.isToolCallApproving(content.callId) }">
                      Подтвердить
                    </span>
                  </button>

                  <button
                    type="button"
                    class="flex items-center justify-center text-xs rounded-md text-red-500 py-1.5 px-2.5 bg-red-100 hover:bg-red-200 transition-colors duration-100 relative"
                    @click="CHAT_STORE.approveToolCall(content.callId, message.id, 'cancel')"
                  >
                    <div
                      class="flex items-center justify-center absolute"
                      v-if="CHAT_STORE.isToolCallApproving(content.callId)"
                    >
                      <Spinner class="size-4" />
                    </div>
                    <span :class="{ 'opacity-0': CHAT_STORE.isToolCallApproving(content.callId) }">
                      Отменить
                    </span>
                  </button>
                </div>

                <div v-if="content.isConfirmed" class="text-green-600 flex items-center gap-x-2">
                  <Check class="size-4" />
                  <span class="text-xs font-medium">Выполнение запланировано.</span>
                </div>
                <div v-else-if="content.isCancelled" class="text-red-500 flex items-center gap-x-2">
                  <Check class="size-4" />
                  <span class="text-xs font-medium">Выполнение отменено.</span>
                </div>
              </AIBubble>
            </template>
          </template>

          <AIBubble
            :hideBackground="true"
            v-if="AGENT_STATUS_STORE.currentActivity && !AGENT_STATUS_STORE.assistantStream"
          >
            <Status :currentToolStatus="AGENT_STATUS_STORE.currentActivity" />
          </AIBubble>

          <AIBubble
            :date="dayjs().calendar()"
            :fastQuestions="[]"
            v-else-if="AGENT_STATUS_STORE.assistantStream"
          >
            <Assistant :text="AGENT_STATUS_STORE.assistantStream" />
          </AIBubble>
        </div>

        <!-- Footer -->
        <AIInput @send="send" :no-input-margin="true" />
      </div>
    </div>
  </div>
</template>
