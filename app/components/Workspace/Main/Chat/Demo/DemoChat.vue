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

const mockMessages = ref<IChatMessage[]>([])

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

const statusMessage: Ref<IChatMessage> = ref({
  role: 'status',
  content: {
    statusText: 'Анализирую запрос',
    currentAgent: AgentsEnum.ORCHESTRATOR,
    state: StatusStatesEnum.IN_PROGRESS,
    logs: [],
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
  content: '',
  iterationId: '09ae0d8f-4a13-4d68-a1f0-932d77e75158',
  chatId: '6a281a33c0b5b8a1d747225a',
  userId: '69e735c8bea70b6721b5afe0',
  threadId: '6a281a33c0b5b8a1d7472256',
  id: '6a281a33c0b5b8a1d747225f',
  createdAt: new Date(),
  updatedAt: new Date(),
})

async function startMockToolCallingInStatus() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  statusMessage.value.content.statusText = 'Работаю с колонками'
  statusMessage.value.content.currentAgent = AgentsEnum.COLUMN_MANAGER

  await new Promise((resolve) => setTimeout(resolve, 1000))

  statusMessage.value.content.logs.push({
    id: '6a281a5a3f40917aee1eabf4',
    type: 'tool',
    state: StatusStatesEnum.IN_PROGRESS,
    content: {
      id: 'call_s4VLnxkdxPq6IFU6WfJOvM7K',
      name: 'create_columns',
      content: {
        count: 4,
        logId: '6a281a5a3f40917aee1eabf4',
      },
    },
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const columnsLog = statusMessage.value.content.logs.find(
    (log: any) => log.id === '6a281a5a3f40917aee1eabf4',
  )
  if (columnsLog) {
    columnsLog.state = StatusStatesEnum.COMPLETED
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))

  statusMessage.value.content.statusText = 'Обрабатываю результат'
  statusMessage.value.content.currentAgent = AgentsEnum.ORCHESTRATOR

  await new Promise((resolve) => setTimeout(resolve, 1000))

  statusMessage.value.content.statusText = 'Работаю с задачами'
  statusMessage.value.content.currentAgent = AgentsEnum.TASK_MANAGER

  await new Promise((resolve) => setTimeout(resolve, 1000))

  statusMessage.value.content.logs.push({
    id: '6a281a5a3f40917aee1eabf5',
    type: 'tool',
    state: StatusStatesEnum.IN_PROGRESS,
    content: {
      id: 'call_s4VLnxkdxPq6IFU6WfJOvM7K',
      name: 'create_tasks',
      content: {
        count: 10,
        logId: '6c381a5a3f40917aee1eabf4',
      },
    },
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const tasksLog = statusMessage.value.content.logs.find(
    (log: any) => log.id === '6a281a5a3f40917aee1eabf5',
  )
  if (tasksLog) {
    tasksLog.state = StatusStatesEnum.COMPLETED
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))

  statusMessage.value.content.statusText = 'Обрабатываю результат'
  statusMessage.value.content.currentAgent = AgentsEnum.ORCHESTRATOR

  await new Promise((resolve) => setTimeout(resolve, 1000))

  statusMessage.value.content.statusText = 'Выполнение завершено'
  statusMessage.value.content.state = StatusStatesEnum.COMPLETED

  mockMessages.value.push(assistantMessage.value as any)

  mockAssistantStream()
}

function mockAssistantStream() {
  let index = 0
  const fullContent = `Готово — я набросал базовый план запуска мобильного приложения для доставки еды и разложил его по понятной последовательности работ.

Что я добавил:
- Исследовать рынок и конкурентов
- Определить MVP и целевую аудиторию
- Сформировать требования к продукту и сценарии пользователей
- Подготовить UX-структуру и прототипы экранов
- Согласовать дизайн и айдентику
- Спланировать архитектуру, стек и инфраструктуру
- Реализовать авторизацию, каталог ресторанов и корзину
- Интегрировать оплату, геолокацию и уведомления
- Протестировать ключевые сценарии
- Подготовить запуск, аналитику и поддержку после релиза

Я специально начал с анализа и планирования, а потом перешел к дизайну, разработке, тестированию и запуску — это хороший каркас для старта проекта без лишнего хаоса.

Если хочешь, следующим сообщением я могу:
- превратить этот план в более подробный roadmap по этапам;
- разбить задачи на подзадачи;
- добавить приоритеты и сроки;
- или сразу сделать план в формате MVP на 2–4 недели.`
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

function mockStream() {
  isRunning.value = true

  mockMessages.value.push(userMessage.value as any)

  setTimeout(() => {
    mockMessages.value.push(statusMessage.value as any)
    startMockToolCallingInStatus()
  }, 1000)
}

function mockUserTyping() {
  let index = 0
  const fullContent =
    'Привет! Я хочу спланировать запуск мобильного приложения для доставки еды. Помоги набросать базовый план работ'
  const interval = setInterval(() => {
    if (index < fullContent.length) {
      aiInputMessage.value = fullContent.slice(0, index + 1)
      index++
    } else {
      clearInterval(interval)
      setTimeout(() => {
        userMessage.value.content = fullContent
        mockStream()
        aiInputMessage.value = ''
      }, 1000)
    }
  }, 30)
}

const reversedMessages = computed(() => {
  return [...mockMessages.value].reverse()
})

const observer = ref<ResizeObserver | null>(null)

onMounted(() => {
  mockUserTyping()

  observer.value = new ResizeObserver(() => {
    if (aiInputRef.value) {
      aiInputRef.value.updateTextarea()
    }
  })
  observer.value.observe(chatContainerRef.value!)
})
</script>

<template>
  <div
    class="w-full flex flex-col overflow-y-auto overflow-x-hidden bg-linear-to-b from-zinc-50/60 via-white to-zinc-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900/80"
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
