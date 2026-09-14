<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'
import { LayoutTemplate, PlugZap, Clock3, ArrowLeft } from '@lucide/vue'
import TrelloLogo from '~/assets/trello.svg?skipsvgo'
import { Checkbox } from '~/components/ui/checkbox'
import type { ITrelloBoard } from '~/interfaces/domain/ITrelloBoard'

const props = defineProps<{
  workspaceId: string
}>()

const emit = defineEmits<{
  finish: []
}>()

type Step = 'options' | 'trello'
type TrelloPhase = 'connect' | 'manual' | 'boards'

const TRELLO_AUTH_MESSAGE_SOURCE = 'kanway-trello-auth'

const step = ref<Step>('options')
const trelloPhase = ref<TrelloPhase>('connect')

const trelloToken = ref<string | null>(null)
const boards = ref<ITrelloBoard[]>([])
const selectedBoardIds = ref<Set<string>>(new Set())

let authPopup: Window | null = null
let popupWatcher: ReturnType<typeof setInterval> | undefined

const manualSchema = toTypedSchema(
  z.object({
    token: z.string().min(1, 'Введите токен Trello'),
  }),
)

const {
  handleSubmit: handleManualSubmit,
  defineField,
  resetForm: resetManualForm,
} = useForm({
  validationSchema: manualSchema,
  initialValues: { token: '' },
})

const [manualToken, manualTokenAttrs] = defineField('token')

const { mutateAsync: getTrelloConfig, isPending: isLoadingConfig } = useTrelloConfig()
const { mutateAsync: getTrelloBoards, isPending: isLoadingBoards } = useTrelloBoards()
const { mutate: importTrello, isPending: isImporting } = useTrelloImport()

const isConnecting = computed(() => isLoadingConfig.value || isLoadingBoards.value)
const allBoardsSelected = computed(
  () => boards.value.length > 0 && selectedBoardIds.value.size === boards.value.length,
)

function openTrelloStep() {
  step.value = 'trello'
  trelloPhase.value = 'connect'
}

function stopWatchingPopup() {
  if (popupWatcher) {
    clearInterval(popupWatcher)
    popupWatcher = undefined
  }
  authPopup = null
}

function resetTrelloState() {
  trelloPhase.value = 'connect'
  trelloToken.value = null
  boards.value = []
  selectedBoardIds.value = new Set()
  resetManualForm()
  stopWatchingPopup()
}

function backToOptions() {
  step.value = 'options'
  resetTrelloState()
}

async function loadBoards(token: string) {
  try {
    const fetchedBoards = await getTrelloBoards(token)

    trelloToken.value = token
    boards.value = fetchedBoards
    selectedBoardIds.value = new Set(fetchedBoards.map((board) => board.id))
    trelloPhase.value = 'boards'
  } catch {
    toast.error('Не удалось получить доски Trello. Проверьте токен и попробуйте снова')
  }
}

async function handleAuthMessage(event: MessageEvent) {
  if (event.origin !== window.location.origin) return
  if (event.data?.source !== TRELLO_AUTH_MESSAGE_SOURCE) return

  stopWatchingPopup()

  const receivedToken = event.data.token as string | undefined

  if (!receivedToken) {
    toast.error('Не удалось получить токен Trello. Попробуйте ввести его вручную')
    return
  }

  await loadBoards(receivedToken)
}

async function connectTrello() {
  try {
    const { apiKey } = await getTrelloConfig()

    const params = new URLSearchParams({
      expiration: 'never',
      name: 'Kanway',
      scope: 'read',
      response_type: 'token',
      key: apiKey,
      return_url: `${window.location.origin}/trello/callback`,
      callback_method: 'fragment',
    })

    stopWatchingPopup()
    authPopup = window.open(
      `https://trello.com/1/authorize?${params.toString()}`,
      'trello-auth',
      'width=520,height=720',
    )

    popupWatcher = setInterval(() => {
      if (authPopup?.closed) stopWatchingPopup()
    }, 500)
  } catch {
    toast.error('Не удалось подключиться к Trello')
  }
}

function showManualEntry() {
  trelloPhase.value = 'manual'
}

const onManualSubmit = handleManualSubmit(async (values) => {
  await loadBoards(values.token)
})

function toggleBoard(boardId: string) {
  const nextSelected = new Set(selectedBoardIds.value)

  if (nextSelected.has(boardId)) {
    nextSelected.delete(boardId)
  } else {
    nextSelected.add(boardId)
  }

  selectedBoardIds.value = nextSelected
}

function toggleAllBoards() {
  selectedBoardIds.value = allBoardsSelected.value
    ? new Set()
    : new Set(boards.value.map((board) => board.id))
}

function submitImport() {
  if (!trelloToken.value || selectedBoardIds.value.size === 0) return

  importTrello(
    {
      token: trelloToken.value,
      workspaceId: props.workspaceId,
      boardIds: Array.from(selectedBoardIds.value),
    },
    {
      onSuccess: (importedBoards) => {
        toast.success(`Импортировано досок: ${importedBoards.length}`)
        emit('finish')
      },
      onError: () => {
        toast.error('Не удалось импортировать выбранные доски')
      },
    },
  )
}

onMounted(() => {
  window.addEventListener('message', handleAuthMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleAuthMessage)
  stopWatchingPopup()
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full max-w-100">
    <h2 class="text-center text-2xl text-gray-700 font-bold">Как хотите начать?</h2>
    <div class="bg-white rounded-md border border-gray-200 p-4 w-full">
      <Transition
        name="fade-slide"
        mode="out-in"
      >
        <div
          v-if="step === 'options'"
          key="options"
          class="flex flex-col gap-y-2"
        >
          <button
            type="button"
            class="flex items-center gap-3 p-3 rounded-lg border border-muted bg-muted hover:border-gray-200 hover:bg-white transition-colors text-left"
            @click="emit('finish')"
          >
            <LayoutTemplate class="size-5 text-gray-500 shrink-0" />
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-700">Пустой шаблон</span>
              <span class="text-xs text-gray-400">Начать с чистой доски</span>
            </div>
          </button>

          <button
            type="button"
            class="flex items-center gap-3 p-3 rounded-lg border border-muted bg-muted hover:border-gray-200 hover:bg-white transition-colors text-left"
            @click="openTrelloStep"
          >
            <PlugZap class="size-5 text-gray-500 shrink-0" />
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-700">Импорт из других сервисов</span>
              <span class="text-xs text-gray-400">Перенести доски из Trello</span>
            </div>
          </button>

          <button
            type="button"
            class="flex items-center gap-3 p-3 rounded-lg border border-muted bg-muted hover:border-gray-200 hover:bg-white transition-colors text-left"
            @click="emit('finish')"
          >
            <Clock3 class="size-5 text-gray-500 shrink-0" />
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-700">Настрою позже</span>
              <span class="text-xs text-gray-400">Пропустить этот шаг</span>
            </div>
          </button>
        </div>

        <div
          v-else
          key="trello"
          class="flex flex-col gap-y-3"
        >
          <button
            type="button"
            class="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 w-fit"
            @click="backToOptions"
          >
            <ArrowLeft class="size-3.5" />
            Назад
          </button>

          <div class="flex items-center gap-2">
            <TrelloLogo class="size-6" />
            <span class="text-sm font-medium text-gray-700">Импорт из Trello</span>
          </div>

          <div
            v-if="trelloPhase === 'connect'"
            class="flex flex-col gap-y-3"
          >
            <p class="text-xs text-gray-400">
              Подключите свой аккаунт Trello, чтобы выбрать доски для импорта со всеми списками и
              карточками.
            </p>

            <Button
              type="button"
              variant="default"
              size="default"
              class="text-xs"
              :disabled="isConnecting"
              @click="connectTrello"
            >
              <Spinner
                class="size-4 absolute"
                v-if="isConnecting"
              />
              <span :class="{ 'opacity-0': isConnecting }"
                >Подключить Trello <span class="text-gray-300">(Нужен VPN)</span></span
              >
            </Button>

            <button
              type="button"
              class="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 w-fit mx-auto"
              @click="showManualEntry"
            >
              Ввести токен вручную
            </button>
          </div>

          <form
            v-else-if="trelloPhase === 'manual'"
            @submit.prevent="onManualSubmit"
            novalidate
          >
            <div class="flex flex-col gap-y-3">
              <p class="text-xs text-gray-400">
                Вставьте свой Trello токен, чтобы получить список доступных досок.
              </p>

              <div class="flex flex-col gap-y-2">
                <span class="text-sm font-medium text-gray-700">Токен Trello</span>
                <input
                  type="text"
                  id="trelloToken"
                  name="trelloToken"
                  class="py-2.5 px-4 text-sm block w-full placeholder:text-gray-400 border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  v-model="manualToken"
                  v-bind="manualTokenAttrs"
                  placeholder="Токен"
                />
              </div>

              <Button
                variant="default"
                size="default"
                class="text-xs"
                :disabled="isLoadingBoards"
              >
                <Spinner
                  class="size-4 absolute"
                  v-if="isLoadingBoards"
                />
                <span :class="{ 'opacity-0': isLoadingBoards }">Продолжить</span>
              </Button>
            </div>
          </form>

          <div
            v-else
            class="flex flex-col gap-y-3"
          >
            <p class="text-xs text-gray-400">Выберите доски, которые нужно импортировать.</p>

            <div class="flex flex-col gap-y-2 max-h-64 overflow-y-auto pr-1">
              <label
                v-if="boards.length > 1"
                class="flex items-center gap-x-2 text-xs font-medium text-gray-500 cursor-pointer select-none pb-1 border-b border-muted"
              >
                <Checkbox
                  :model-value="allBoardsSelected"
                  @update:model-value="toggleAllBoards"
                />
                Выбрать все
              </label>

              <p
                v-if="boards.length === 0"
                class="text-xs text-gray-400"
              >
                На аккаунте Trello не найдено доступных досок
              </p>

              <label
                v-for="board in boards"
                :key="board.id"
                class="flex items-center gap-x-2 text-sm text-gray-700 cursor-pointer select-none"
              >
                <Checkbox
                  :model-value="selectedBoardIds.has(board.id)"
                  @update:model-value="toggleBoard(board.id)"
                />
                {{ board.name }}
              </label>
            </div>

            <Button
              type="button"
              variant="default"
              size="default"
              class="text-xs"
              :disabled="isImporting || selectedBoardIds.size === 0"
              @click="submitImport"
            >
              <Spinner
                class="size-4 absolute"
                v-if="isImporting"
              />
              <span :class="{ 'opacity-0': isImporting }">Импортировать выбранные</span>
            </Button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
