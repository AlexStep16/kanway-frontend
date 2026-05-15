<script setup lang="ts">
import _ from 'lodash'

import AIBubble from '~/components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import AssistantBubble from '~/components/Workspace/Main/Chat/Bubbles/AssistantBubble.vue'
import { OperationLogStatusesEnum } from '~/enums/OperationLogStatusesEnum'
import { OperationTypesEnum } from '~/enums/OperationTypesEnum'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import ChatTasksView from './Tasks/ChatTasksView.vue'
import ChatTasksEditView from './Tasks/ChatTasksEditView.vue'
import ChatCategoriesView from './Categories/ChatCategoriesView.vue'
import ChatBoardsView from './Boards/ChatBoardsView.vue'
import ChatWorkspacesView from './Workspaces/ChatWorkspacesView.vue'
import ChatCategoriesEditView from './Categories/ChatCategoriesEditView.vue'
import ChatBoardsEditView from './Boards/ChatBoardsEditView.vue'
import ChatWorkspacesEditView from './Workspaces/ChatWorkspacesEditView.vue'
import { Check } from 'lucide-vue-next'
import { transformTask } from '@/services/task'
import { transformCategory } from '@/services/category'
import { transformBoard } from '@/services/board'
import { transformWorkspace } from '@/services/workspace'
import type { IOperationLog } from '~/interfaces/domain/IOperationLog'

const props = defineProps<{
  message: IChatMessage
}>()

/**
 * Data
 */
const { data: log, isPending: isLogLoading } = useLog(props.message.content)

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const activeBoardId = computed(() => boardStore.activeBoardId)
const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)

const { mutate: approveLog, isPending: isLogApproving } = useApproveLog()
const { mutate: cancelLog, isPending: isLogCancelling } = useApproveLog()

const logCopy = ref<IOperationLog | null>(null)
const selectedIds = ref<string[]>([])

/**
 * Constants / config
 */
const ENTITY_CONFIG = {
  tasks: {
    component: markRaw(ChatTasksView),
    componentUpdate: markRaw(ChatTasksEditView),
    labels: { nom: 'задачи', gen: 'задач' },
    transformFn: transformTask,
  },
  categories: {
    component: markRaw(ChatCategoriesView),
    componentUpdate: markRaw(ChatCategoriesEditView),
    labels: { nom: 'категории', gen: 'категорий' },
    transformFn: transformCategory,
  },
  boards: {
    component: markRaw(ChatBoardsView),
    componentUpdate: markRaw(ChatBoardsEditView),
    labels: { nom: 'доски', gen: 'досок' },
    transformFn: transformBoard,
  },
  workspaces: {
    component: markRaw(ChatWorkspacesView),
    componentUpdate: markRaw(ChatWorkspacesEditView),
    labels: { nom: 'пространства', gen: 'пространств' },
    transformFn: transformWorkspace,
  },
} as const

const OPERATION_VERBS: Record<string, string> = {
  ARCHIVE: 'архивированы',
  RECOVER: 'восстановлены',
  DELETE: 'удалены',
  UPDATE: 'обновлены',
  CREATE: 'созданы',
  CLONE: 'скопированы',
}

const SELECTS_FROM_AFTER = new Set([
  OperationTypesEnum.CREATE,
  OperationTypesEnum.UPDATE,
  OperationTypesEnum.ARCHIVE,
  OperationTypesEnum.RECOVER,
  OperationTypesEnum.CLONE,
])

/**
 * Derived state
 */
const isPending = computed(() => logCopy.value?.status === OperationLogStatusesEnum.PENDING)
const isApproved = computed(() => logCopy.value?.status === OperationLogStatusesEnum.APPROVED)
const isSuccess = computed(() => logCopy.value?.status === OperationLogStatusesEnum.SUCCESS)

const logEntities = computed<any[]>(() => {
  if (!logCopy.value) return []

  if (SELECTS_FROM_AFTER.has(logCopy.value.operationType)) return logCopy.value.entitiesAfter ?? []
  if (logCopy.value.operationType === OperationTypesEnum.DELETE)
    return logCopy.value.entitiesBefore ?? []

  return []
})

const headerTitle = computed(() => {
  if (!logCopy.value) return ''

  const config = ENTITY_CONFIG[logCopy.value.collectionName as keyof typeof ENTITY_CONFIG]
  if (!config) return ''

  const verb = OPERATION_VERBS[logCopy.value.operationType] || ''
  const prefix =
    logCopy.value.status === OperationLogStatusesEnum.PENDING
      ? 'Будут'
      : logCopy.value.status === OperationLogStatusesEnum.SUCCESS
        ? 'Были'
        : ''

  return prefix ? `${prefix} ${verb} следующие ${config.labels.nom}:` : ''
})

type RenderBlock = {
  id: string
  title: string
  items?: any[]
  before?: any[]
  after?: any[]
  isTemp?: boolean
  component: any
}

const renderBlocks = computed<RenderBlock[]>(() => {
  if (!logCopy.value) return []

  const operationType = logCopy.value.operationType
  const status = logCopy.value.status
  const collection = logCopy.value.collectionName
  const config = ENTITY_CONFIG[collection as keyof typeof ENTITY_CONFIG]
  if (!config) return []

  const id = `${props.message.id}-${collection}-${operationType}`
  const title = headerTitle.value

  // UPDATE
  if (operationType === OperationTypesEnum.UPDATE) {
    const before = logCopy.value.entitiesBefore || []
    const after = logCopy.value.entitiesAfter || []

    return [
      {
        id,
        title,
        before: before.map((entity: any) => config.transformFn(entity)),
        after: after.map((entity: any) => config.transformFn(entity)),
        component: config.componentUpdate,
      },
    ]
  }

  // CREATE | DELETE (choose temp view while pending)
  if (operationType === OperationTypesEnum.CREATE) {
    return [
      {
        id,
        title,
        items: logEntities.value.map((entity: any) => config.transformFn(entity)),
        component: config.component,
        isTemp: status === OperationLogStatusesEnum.SUCCESS ? false : true,
      },
    ]
  } else if (operationType === OperationTypesEnum.DELETE) {
    return [
      {
        id,
        title,
        items: logEntities.value.map((entity: any) => config.transformFn(entity)),
        component: config.component,
        isTemp: status === OperationLogStatusesEnum.SUCCESS ? true : false,
      },
    ]
  }

  // Everything else
  return [
    {
      id,
      title,
      items: logEntities.value.map((entity: any) => config.transformFn(entity)),
      component: config.component,
    },
  ]
})

/**
 * Actions
 */
function handleApproveLog(isConfirmed: boolean) {
  const mutate = isConfirmed ? approveLog : cancelLog

  if (!logCopy.value) return

  mutate({
    payload: {
      id: logCopy.value.id,
      selectedIds: selectedIds.value,
      isConfirmed,
    },
    boardId: activeBoardId.value,
    workspaceId: activeWorkspaceId.value,
    message: props.message,
  })
}

/**
 * Sync + selection initialization
 */
watchEffect(() => {
  if (!log.value) return

  logCopy.value = _.cloneDeep(log.value)

  const operationType = logCopy.value?.operationType
  const list: any[] | undefined = SELECTS_FROM_AFTER.has(operationType)
    ? logCopy.value?.entitiesAfter
    : operationType === OperationTypesEnum.DELETE
      ? logCopy.value?.entitiesBefore
      : undefined

  list?.forEach((entity: any) => {
    selectedIds.value.push(entity.id)
  })
})
</script>

<template>
  <AIBubble
    :hideAvatar="true"
    :isContentFullWidth="true"
    v-if="logCopy"
  >
    <template v-if="!isLogLoading">
      <div
        v-for="block in renderBlocks"
        :key="block.id"
        class="mb-4 last:mb-0"
      >
        <AssistantBubble
          class="mb-2"
          :text="block.title"
          v-if="block.title"
        />

        <component
          :is="block.component"
          :message="message"
          :items="block.items"
          :before="block.before"
          :after="block.after"
          :isTemporary="block.isTemp"
          :isSelectable="isPending && !isSuccess"
          v-model:selectedIds="selectedIds"
        />

        <div
          class="max-w-lg mt-3 flex"
          v-if="isPending"
        >
          <div class="flex gap-x-2 bg-muted p-3 rounded-xl">
            <button
              type="button"
              class="flex items-center justify-center text-xs rounded-md text-white py-1.5 px-2.5 bg-blue-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none duration-100 relative"
              @click="handleApproveLog(true)"
            >
              <div
                class="flex items-center justify-center absolute"
                v-if="isLogApproving"
              >
                <Spinner class="size-4" />
              </div>
              <span :class="{ 'opacity-0': isLogApproving }"> Подтвердить </span>
            </button>

            <button
              type="button"
              class="flex items-center justify-center text-xs rounded-md text-red-500 py-1.5 px-2.5 bg-red-100 hover:bg-red-200 transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none relative"
              @click="handleApproveLog(false)"
            >
              <div
                class="flex items-center justify-center absolute"
                v-if="isLogCancelling"
              >
                <Spinner class="size-4" />
              </div>
              <span :class="{ 'opacity-0': isLogCancelling }"> Отменить </span>
            </button>
          </div>
        </div>

        <div
          class="max-w-lg mt-3 flex"
          v-else-if="isApproved"
        >
          <div class="flex gap-x-2 bg-muted p-3 rounded-xl">
            <div class="flex items-center text-xs gap-x-1 text-green-600">
              <Check class="size-4" />
              <span>Подтверждено</span>
            </div>

            <button
              type="button"
              class="flex items-center justify-center text-xs rounded-md text-red-500 py-1.5 px-2.5 bg-red-100 hover:bg-red-200 transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none relative"
              @click="handleApproveLog(false)"
            >
              <div
                class="flex items-center justify-center absolute"
                v-if="isLogCancelling"
              >
                <Spinner class="size-4" />
              </div>
              <span :class="{ 'opacity-0': isLogCancelling }"> Отменить </span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <Skeleton class="h-30 bg-gray-200 rounded-sm w-80"></Skeleton>
    </template>
  </AIBubble>
</template>
