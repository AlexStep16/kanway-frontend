<script lang="ts" setup>
import { toast } from 'vue-sonner'
import dayjs from 'dayjs'
import { LayoutTemplate, PlugZap, Clock3, ArrowLeft } from '@lucide/vue'
import ImportBoards from '~/components/Import/ImportBoards.vue'
import { TASK_COLORS_TITLES } from '~/constants/TASK_COLORS'

type TaskColorTitle = (typeof TASK_COLORS_TITLES)[number]
type TaskColorTone = 'light' | 'medium' | 'dark'

interface BoardTemplateTask {
  name: string
  description?: string
  tags?: string[]
  color?: {
    value: TaskColorTitle
    tone: TaskColorTone
  }
  dueInDays?: number
  isCompleted?: boolean
}

interface BoardTemplate {
  id: string
  name: string
  description: string
  columns: string[]
  tasks: Record<string, BoardTemplateTask[]>
}

const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: 'kanban',
    name: 'Классический канбан',
    description: 'Бэклог → В работе → Проверка → Готово',
    columns: ['Бэклог', 'В работе', 'Проверка', 'Готово'],
    tasks: {
      Бэклог: [
        {
          name: 'Нажми микрофон и скажи: «Перенеси синюю задачу из бэклога в работу»',
          tags: ['подсказка'],
          color: { value: 'blue', tone: 'medium' },
        },
        {
          name: 'Надиктуй голосом: «Создай задачу "Созвониться с клиентом" на завтра с высоким приоритетом»',
          tags: ['подсказка'],
          dueInDays: 0,
        },
      ],
      'В работе': [
        {
          name: 'Спроси в чате: «Что у меня сейчас висит в работе?»',
          tags: ['подсказка'],
        },
      ],
      Готово: [
        {
          name: 'Зарегистрироваться в Kanway',
          color: { value: 'blue', tone: 'light' },
          isCompleted: true,
        },
        {
          name: 'Создать первую доску',
          isCompleted: true,
        },
      ],
    },
  },
  {
    id: 'simple',
    name: 'Простой список дел',
    description: 'Сделать → В процессе → Готово',
    columns: ['Сделать', 'В процессе', 'Готово'],
    tasks: {
      Сделать: [
        {
          name: 'Скажи в микрофон: «Перенеси эту задачу в статус "В процессе"»',
          tags: ['подсказка'],
          color: { value: 'blue', tone: 'medium' },
        },
        {
          name: 'Надиктуй голосом: «Добавь три дела: купить кофе, отправить отчет и проверить почту»',
          tags: ['подсказка'],
          dueInDays: 0,
        },
      ],
      'В процессе': [
        {
          name: 'Спроси агента: «Какие дела у меня горят на сегодня?»',
          tags: ['подсказка'],
        },
      ],
      Готово: [
        {
          name: 'Зарегистрироваться в Kanway',
          color: { value: 'blue', tone: 'light' },
          isCompleted: true,
        },
        {
          name: 'Выпить утренний кофе',
          isCompleted: true,
        },
      ],
    },
  },
  {
    id: 'sprint',
    name: 'Спринт разработки',
    description: 'Бэклог → В разработке → Тестирование → Релиз',
    columns: ['Бэклог', 'В разработке', 'Тестирование', 'Релиз'],
    tasks: {
      Бэклог: [
        {
          name: 'Скажи агенту: «Создай критический баг "Ошибка авторизации по OAuth"»',
          tags: ['баг', 'подсказка'],
          color: { value: 'red', tone: 'medium' },
          dueInDays: 0,
        },
        {
          name: 'Надиктуй фичу: «Нужно сделать экспорт доски в CSV к пятнице»',
          tags: ['фича', 'подсказка'],
        },
      ],
      'В разработке': [
        {
          name: 'Нажми микрофон и скажи: «Перенеси эту карточку в Тестирование»',
          tags: ['подсказка'],
          color: { value: 'blue', tone: 'medium' },
        },
      ],
      Релиз: [
        {
          name: 'Инициализировать репозиторий проекта',
          isCompleted: true,
        },
        {
          name: 'Задеплоить MVP на прод',
          isCompleted: true,
        },
      ],
    },
  },
]

const props = defineProps<{
  workspaceId: string
}>()

const emit = defineEmits<{
  finish: []
}>()

type Step = 'options' | 'templates' | 'import'

const step = ref<Step>('options')

const selectedTemplateId = ref<string | null>(null)
const isCreatingTemplateBoard = ref(false)

const { mutateAsync: createBoardAsync } = useCreateBoard()
const { mutateAsync: createColumnAsync } = useCreateColumn()
const { mutateAsync: createTaskAsync } = useCreateTask()

function openTemplatesStep() {
  step.value = 'templates'
  selectedTemplateId.value = BOARD_TEMPLATES[0]?.id ?? null
}

function backToOptionsFromTemplates() {
  step.value = 'options'
  selectedTemplateId.value = null
}

function getDueDate(daysFromNow: number): string {
  return dayjs().add(daysFromNow, 'day').format('YYYY-MM-DD')
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

    const createdColumns: { name: string; id: string }[] = []

    for (const columnName of template.columns) {
      const columnResult = await createColumnAsync({
        payload: { name: columnName, boardId: createdBoard.id },
      })
      const createdColumn = columnResult.data[0]

      if (createdColumn) {
        createdColumns.push({ name: columnName, id: createdColumn.id })
      }
    }

    for (const column of createdColumns) {
      const tasks = template.tasks[column.name]

      if (!tasks?.length) continue

      for (const task of tasks) {
        await createTaskAsync({
          payload: {
            name: task.name,
            columnId: column.id,
            ...(task.description ? { description: task.description } : {}),
            ...(task.tags?.length ? { tags: task.tags } : {}),
            ...(task.color ? { color: task.color } : {}),
            ...(task.isCompleted ? { isCompleted: task.isCompleted } : {}),
            ...(task.dueInDays != null ? { dueDate: getDueDate(task.dueInDays) } : {}),
          },
          boardId: createdBoard.id,
        })
      }
    }

    emit('finish')
  } catch {
    toast.error('Не удалось создать доску по шаблону')
  } finally {
    isCreatingTemplateBoard.value = false
  }
}

function openImportStep() {
  step.value = 'import'
}

function backToOptionsFromImport() {
  step.value = 'options'
}
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
            @click="openImportStep"
          >
            <PlugZap class="size-5 text-gray-500 shrink-0" />
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-700">Импорт из других сервисов</span>
              <span class="text-xs text-gray-400">Перенести доски из Trello, Яндекс Трекера</span>
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

        <ImportBoards
          v-else-if="step === 'import'"
          key="import"
          :workspace-id="props.workspaceId"
          @finish="emit('finish')"
          @back="backToOptionsFromImport"
        />
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
