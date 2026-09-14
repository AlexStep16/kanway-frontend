<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'
import { LayoutTemplate, PlugZap, Clock3, ArrowLeft, UploadCloud } from '@lucide/vue'
import TrelloLogo from '~/assets/trello.svg?skipsvgo'
import { Checkbox } from '~/components/ui/checkbox'
import type { ITrelloBoard } from '~/interfaces/domain/ITrelloBoard'

interface BoardTemplate {
  id: string
  name: string
  description: string
  columns: string[]
}

const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: 'kanban',
    name: 'Классический канбан',
    description: 'Бэклог → В работе → Проверка → Готово',
    columns: ['Бэклог', 'В работе', 'Проверка', 'Готово'],
  },
  {
    id: 'simple',
    name: 'Простой список дел',
    description: 'Сделать → В процессе → Готово',
    columns: ['Сделать', 'В процессе', 'Готово'],
  },
  {
    id: 'sprint',
    name: 'Спринт разработки',
    description: 'Бэклог → В разработке → Тестирование → Релиз',
    columns: ['Бэклог', 'В разработке', 'Тестирование', 'Релиз'],
  },
]

const props = defineProps<{
  workspaceId: string
}>()

const emit = defineEmits<{
  finish: []
}>()

type Step = 'options' | 'templates' | 'services' | 'trello' | 'trello-json'
type TrelloPhase = 'connect' | 'manual' | 'boards'

const TRELLO_AUTH_MESSAGE_SOURCE = 'kanway-trello-auth'

const step = ref<Step>('options')
const trelloPhase = ref<TrelloPhase>('connect')

const selectedTemplateId = ref<string | null>(null)
const isCreatingTemplateBoard = ref(false)

const trelloToken = ref<string | null>(null)
const boards = ref<ITrelloBoard[]>([])
const selectedBoardIds = ref<Set<string>>(new Set())

const jsonDropZoneRef = ref<HTMLDivElement | null>(null)

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
const { mutate: importTrelloJson, isPending: isImportingJson } = useTrelloImportJson()
const { mutateAsync: createBoardAsync } = useCreateBoard()
const { mutateAsync: createColumnAsync } = useCreateColumn()

const { data: user } = useUser()
const { data: subscriptionsData } = useSubscriptions()
const { data: existingBoardsCountData } = useBoardsCount(computed(() => props.workspaceId))

const currentSubscription = computed(() => {
  if (!user.value) return null

  return (
    (subscriptionsData.value || []).find(
      (subscription) => subscription.subscriptionId === user.value?.subscriptionId,
    ) || null
  )
})

const maxBoards = computed(() => currentSubscription.value?.limitBoards ?? 0)
const existingBoardsCount = computed(() => existingBoardsCountData.value ?? 0)
const remainingBoardsLimit = computed(() => {
  if (maxBoards.value === -1) return Infinity

  return Math.max(maxBoards.value - existingBoardsCount.value, 0)
})

const isConnecting = computed(() => isLoadingConfig.value || isLoadingBoards.value)
const selectableBoardsCount = computed(() =>
  Math.min(boards.value.length, remainingBoardsLimit.value),
)
const allBoardsSelected = computed(
  () =>
    selectableBoardsCount.value > 0 && selectedBoardIds.value.size === selectableBoardsCount.value,
)

function openTemplatesStep() {
  step.value = 'templates'
  selectedTemplateId.value = BOARD_TEMPLATES[0]?.id ?? null
}

function backToOptionsFromTemplates() {
  step.value = 'options'
  selectedTemplateId.value = null
}

async function createTemplateBoard() {
  const template = BOARD_TEMPLATES.find((t) => t.id === selectedTemplateId.value)

  if (!template) return

  isCreatingTemplateBoard.value = true

  try {
    const boardResult = await createBoardAsync({
      payload: { name: template.name, workspaceId: props.workspaceId },
    })
    const createdBoard = boardResult.data[0]

    if (!createdBoard) {
      throw new Error('Board creation returned no data')
    }

    for (const columnName of template.columns) {
      await createColumnAsync({ payload: { name: columnName, boardId: createdBoard.id } })
    }

    emit('finish')
  } catch {
    toast.error('Не удалось создать доску по шаблону')
  } finally {
    isCreatingTemplateBoard.value = false
  }
}

function openTrelloStep() {
  step.value = 'trello'
  trelloPhase.value = 'connect'
}

function openServicesStep() {
  step.value = 'services'
}

function backToOptionsFromServices() {
  step.value = 'options'
}

function openTrelloJsonStep() {
  step.value = 'trello-json'
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
  step.value = 'services'
  resetTrelloState()
}

function backToServicesFromJson() {
  step.value = 'services'
}

async function handleJsonFile(file: File) {
  if (remainingBoardsLimit.value < 1) {
    toast.error(`По вашему тарифу достигнут лимит досок - ${maxBoards.value}`)
    return
  }

  if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
    toast.error('Выберите файл экспорта Trello в формате JSON')
    return
  }

  let board: unknown

  try {
    board = JSON.parse(await file.text())
  } catch {
    toast.error('Файл повреждён или имеет неверный формат JSON')
    return
  }

  importTrelloJson(
    { board, workspaceId: props.workspaceId },
    {
      onSuccess: () => {
        toast.success('Доска успешно импортирована из файла Trello')
        emit('finish')
      },
      onError: () => {
        toast.error('Не удалось импортировать доску из файла')
      },
    },
  )
}

const { open: openJsonFileDialog, onChange: onJsonFileDialogChange } = useFileDialog({
  accept: 'application/json,.json',
  multiple: false,
})

onJsonFileDialogChange((files) => {
  const file = files?.[0]

  if (file) handleJsonFile(file)
})

function pickJsonFile() {
  openJsonFileDialog()
}

const { isOverDropZone: isOverJsonDropZone } = useDropZone(jsonDropZoneRef, {
  onDrop: (files) => {
    const file = files?.[0]

    if (file) handleJsonFile(file)
  },
  dataTypes: ['application/json'],
})

async function loadBoards(token: string) {
  try {
    const fetchedBoards = await getTrelloBoards(token)

    trelloToken.value = token
    boards.value = fetchedBoards
    selectedBoardIds.value = new Set(
      fetchedBoards.slice(0, remainingBoardsLimit.value).map((board) => board.id),
    )
    trelloPhase.value = 'boards'

    if (remainingBoardsLimit.value < fetchedBoards.length) {
      toast.info(`По вашему тарифу доступно к импорту не более ${remainingBoardsLimit.value} досок`)
    }
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
    if (nextSelected.size >= remainingBoardsLimit.value) {
      toast.error(
        `По вашему тарифу можно импортировать не более ${remainingBoardsLimit.value} досок`,
      )
      return
    }

    nextSelected.add(boardId)
  }

  selectedBoardIds.value = nextSelected
}

function toggleAllBoards() {
  if (allBoardsSelected.value) {
    selectedBoardIds.value = new Set()
    return
  }

  if (remainingBoardsLimit.value < boards.value.length) {
    toast.info(`По вашему тарифу доступно к импорту не более ${remainingBoardsLimit.value} досок`)
  }

  selectedBoardIds.value = new Set(
    boards.value.slice(0, remainingBoardsLimit.value).map((board) => board.id),
  )
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
            @click="openTemplatesStep"
          >
            <LayoutTemplate class="size-5 text-gray-500 shrink-0" />
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-700">Базовые шаблоны</span>
              <span class="text-xs text-gray-400">Готовая структура колонок для старта</span>
            </div>
          </button>

          <button
            type="button"
            class="flex items-center gap-3 p-3 rounded-lg border border-muted bg-muted hover:border-gray-200 hover:bg-white transition-colors text-left"
            @click="openServicesStep"
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
          v-else-if="step === 'templates'"
          key="templates"
          class="flex flex-col gap-y-3"
        >
          <button
            type="button"
            class="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 w-fit"
            @click="backToOptionsFromTemplates"
          >
            <ArrowLeft class="size-3.5" />
            Назад
          </button>

          <div class="flex items-center gap-2">
            <LayoutTemplate class="size-5 text-gray-500" />
            <span class="text-sm font-medium text-gray-700">Базовые шаблоны</span>
          </div>

          <p class="text-xs text-gray-400">Выберите структуру колонок для новой доски.</p>

          <div class="flex flex-col gap-y-2">
            <label
              v-for="template in BOARD_TEMPLATES"
              :key="template.id"
              class="flex items-start gap-x-2 p-3 rounded-lg border border-muted bg-muted hover:border-gray-200 hover:bg-white transition-colors cursor-pointer select-none"
              :class="
                selectedTemplateId === template.id &&
                'border-blue-500 bg-white ring-1 ring-blue-500'
              "
            >
              <input
                type="radio"
                name="boardTemplate"
                class="mt-0.5 accent-blue-500 ring-0 shadow-0"
                :value="template.id"
                v-model="selectedTemplateId"
              />
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-700">{{ template.name }}</span>
                <span class="text-xs text-gray-400">{{ template.description }}</span>
              </div>
            </label>
          </div>

          <Button
            type="button"
            variant="default"
            size="default"
            class="text-xs"
            :disabled="isCreatingTemplateBoard || !selectedTemplateId"
            @click="createTemplateBoard"
          >
            <Spinner
              class="size-4 absolute"
              v-if="isCreatingTemplateBoard"
            />
            <span :class="{ 'opacity-0': isCreatingTemplateBoard }">Создать доску</span>
          </Button>
        </div>

        <div
          v-else-if="step === 'services'"
          key="services"
          class="flex flex-col gap-y-3"
        >
          <button
            type="button"
            class="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 w-fit"
            @click="backToOptionsFromServices"
          >
            <ArrowLeft class="size-3.5" />
            Назад
          </button>

          <p class="text-xs text-gray-400">Выберите сервис, из которого хотите перенести доски.</p>

          <div class="flex flex-col gap-y-2">
            <button
              type="button"
              class="flex items-center gap-3 p-3 rounded-lg border border-muted bg-muted hover:border-gray-200 hover:bg-white transition-colors text-left"
              @click="openTrelloStep"
            >
              <TrelloLogo class="size-5 shrink-0" />
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-700">Trello</span>
                <span class="text-xs text-gray-400">Подключить аккаунт и выбрать доски</span>
              </div>
            </button>

            <button
              type="button"
              class="flex items-center gap-3 p-3 rounded-lg border border-muted bg-muted hover:border-gray-200 hover:bg-white transition-colors text-left"
              @click="openTrelloJsonStep"
            >
              <TrelloLogo class="size-5 shrink-0" />
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-700">Trello (JSON)</span>
                <span class="text-xs text-gray-400">Загрузить файл экспорта доски</span>
              </div>
            </button>
          </div>
        </div>

        <div
          v-else-if="step === 'trello-json'"
          key="trello-json"
          class="flex flex-col gap-y-3"
        >
          <button
            type="button"
            class="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 w-fit"
            @click="backToServicesFromJson"
          >
            <ArrowLeft class="size-3.5" />
            Назад
          </button>

          <div class="flex items-center gap-2">
            <TrelloLogo class="size-6" />
            <span class="text-sm font-medium text-gray-700">Импорт из файла Trello</span>
          </div>

          <p class="text-xs text-gray-400">
            В Trello откройте доску → Меню → Поделиться → Печать и экспорт → Экспорт в JSON, и
            загрузите полученный файл здесь.
          </p>

          <div
            ref="jsonDropZoneRef"
            class="flex flex-col items-center gap-y-2 p-6 rounded-lg border-2 border-dashed transition-colors cursor-pointer text-center"
            :class="
              isOverJsonDropZone
                ? 'border-blue-500 bg-blue-50'
                : 'border-muted bg-muted hover:border-gray-300'
            "
            @click="pickJsonFile"
          >
            <Spinner
              class="size-6 text-gray-400"
              v-if="isImportingJson"
            />
            <UploadCloud
              v-else
              class="size-6 text-gray-400"
            />
            <span class="text-sm font-medium text-gray-600">
              {{ isImportingJson ? 'Импортируем доску...' : 'Перетащите JSON-файл сюда' }}
            </span>
            <span
              v-if="!isImportingJson"
              class="text-xs text-gray-400"
              >или нажмите, чтобы выбрать файл</span
            >
          </div>
        </div>

        <div
          v-else-if="step === 'trello'"
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

            <p
              v-if="Number.isFinite(remainingBoardsLimit)"
              class="text-xs text-gray-400"
            >
              Доступно к импорту:
              <span class="font-medium text-gray-600"
                >{{ selectedBoardIds.size }} из {{ remainingBoardsLimit }}</span
              >
              по вашему тарифу
            </p>

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
                :class="{
                  'opacity-50 cursor-not-allowed':
                    !selectedBoardIds.has(board.id) &&
                    selectedBoardIds.size >= remainingBoardsLimit,
                }"
              >
                <Checkbox
                  :model-value="selectedBoardIds.has(board.id)"
                  :disabled="
                    !selectedBoardIds.has(board.id) && selectedBoardIds.size >= remainingBoardsLimit
                  "
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
