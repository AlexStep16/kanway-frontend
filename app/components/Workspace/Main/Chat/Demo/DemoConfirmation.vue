<script setup lang="ts">
import { AgentsEnum } from '~/enums/AgentsEnum.js'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage.js'
import { StatusStatesEnum } from '~/enums/StatusStatesEnum.js'
import { SquareArrowOutUpRight, MessageCircle } from 'lucide-vue-next'
import type { AIInput } from '#components'
import Title from '~/components/Workspace/Header/Title.vue'

const aiInputRef = ref<InstanceType<typeof AIInput> | null>(null)
const aiInputMessage = ref<string>('')
const chatContainerRef = ref<HTMLDivElement | null>(null)
const isRunning = ref(false)

const assistantMessage: Ref<IChatMessage> = ref({
  role: 'assistant',
  content: '',
  iterationId: '17bbf0b0-ecba-4480-8519-c2e8891c78da',
  chatId: '6a281a33c0b5b8a1d747225a',
  userId: '69e735c8bea70b6721b5afe0',
  threadId: '6a281a33c0b5b8a1d7472256',
  id: '6a281a5c3f40917aee1eabfe',
  createdAt: new Date(),
  updatedAt: new Date(),
})

const log = ref({
  id: '6a281a5a3f40917aee1eabf5',
  type: 'tool',
  state: StatusStatesEnum.AWAITING_CONFIRMATION,
  content: {
    id: 'call_s4VLnxkdxPq6IFU6WfJOvM7K',
    name: 'delete_archive_tasks',
    content: {
      filters: [
        {
          text: 'Срок выполнения до',
          value: 'Завтра в 12:20',
        },
      ],
      count: 10,
      logId: '6c381a5a3f40917aee1eabf4',
      isSoftDelete: true,
    },
  },
})

const statusMessage: Ref<IChatMessage> = ref({
  role: 'status',
  content: {
    statusText: 'Ожидаю подтверждения',
    currentAgent: AgentsEnum.TASK_MANAGER,
    state: StatusStatesEnum.AWAITING_CONFIRMATION,
    logs: [log.value],
    error: '',
  },
  iterationId: '17bbf0b0-ecba-4480-8519-c2e8891c78da',
  chatId: '6a281a33c0b5b8a1d747225a',
  userId: '69e735c8bea70b6721b5afe0',
  threadId: '6a281a33c0b5b8a1d7472256',
  id: '6a281a54c0b5b8a1d74722b7',
  createdAt: new Date(),
  updatedAt: new Date(),
  creditsUsed: 2,
})

const userMessage: Ref<IChatMessage> = ref({
  role: 'user',
  content: 'Архивируй задачи с дедлайном до завтра 12:20',
  iterationId: '09ae0d8f-4a13-4d68-a1f0-932d77e75158',
  chatId: '6a281a33c0b5b8a1d747225a',
  userId: '69e735c8bea70b6721b5afe0',
  threadId: '6a281a33c0b5b8a1d7472256',
  id: '6a281a33c0b5b8a1d747225f',
  createdAt: new Date(),
  updatedAt: new Date(),
})

const mockMessages = ref<IChatMessage[]>([
  userMessage.value,
  statusMessage.value,
  assistantMessage.value,
])

async function startMockToolCallingInStatus() {
  statusMessage.value.content.statusText = 'Работаю с задачами'
  statusMessage.value.content.state = StatusStatesEnum.IN_PROGRESS
  statusMessage.value.content.currentAgent = AgentsEnum.COLUMN_MANAGER
  log.value.state = StatusStatesEnum.IN_PROGRESS

  await new Promise((resolve) => setTimeout(resolve, 2000))

  log.value.state = StatusStatesEnum.COMPLETED

  await new Promise((resolve) => setTimeout(resolve, 1000))

  statusMessage.value.content.statusText = 'Обрабатываю результат'
  statusMessage.value.content.currentAgent = AgentsEnum.ORCHESTRATOR

  await new Promise((resolve) => setTimeout(resolve, 1000))

  statusMessage.value.content.statusText = 'Выполнение завершено'
  statusMessage.value.content.state = StatusStatesEnum.COMPLETED

  mockAssistantStream()
}

function mockAssistantStream() {
  let index = 0
  const fullContent = `Архивировал 10 задач с дедлайном раньше завтра 12:20.

Если хотите, я могу ещё:
- проверить, остались ли просроченные задачи;
- собрать список задач, которые скоро станут просроченными;
- перенести такие задачи в отдельную колонку для контроля.`
  const interval = setInterval(() => {
    if (index < fullContent.length) {
      assistantMessage.value.content = fullContent.slice(0, index + 1)
      index++
    } else {
      clearInterval(interval)
      isRunning.value = false
    }
  }, 3)
}

const reversedMessages = computed(() => {
  return [...mockMessages.value].reverse()
})

const observer = ref<ResizeObserver | null>(null)

onMounted(async () => {
  observer.value = new ResizeObserver(() => {
    if (aiInputRef.value) {
      aiInputRef.value.updateTextarea()
    }
  })
  observer.value.observe(chatContainerRef.value!)

  startMockToolCallingInStatus()
})
</script>

<template>
  <div
    class="w-full flex flex-col overflow-y-auto overflow-x-hidden bg-white"
    ref="chatContainerRef"
  >
    <header class="w-full p-4 pb-2 flex flex-col gap-1 border-b border-zinc-200/70 bg-white">
      <div class="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          class="border border-zinc-200/80 bg-white/80 text-zinc-600 shadow-sm"
          aria-label="Open"
        >
          <SquareArrowOutUpRight class="size-4" />
        </Button>
        <Title
          :initialName="'План запуска мобильного приложения'"
          :isLoading="false"
          :isStatic="true"
        >
          <MessageCircle class="size-4 text-zinc-500 dark:text-zinc-400" />
        </Title>
        <div class="size-8"></div>
      </div>
    </header>

    <ChatMain
      :isMainChat="false"
      :isSending="false"
      :aiInputRef="aiInputRef"
      :reversedMessages="reversedMessages"
      :areMessagesLoading="false"
      :is-demo="true"
    />

    <footer
      class="w-full flex justify-center p-4 sm:p-5 border-t border-zinc-200/70 bg-white/70 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70"
    >
      <div class="w-full max-w-4xl">
        <DemoAIInput
          ref="aiInputRef"
          v-model:aiInputMessage="aiInputMessage"
          :is-running="isRunning"
        />
      </div>
    </footer>
  </div>
</template>
