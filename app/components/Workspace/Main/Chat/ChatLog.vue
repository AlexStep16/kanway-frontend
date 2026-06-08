<script setup lang="ts">
import _ from 'lodash'

import { OperationLogStatusesEnum } from '~/enums/OperationLogStatusesEnum'
import { OperationTypesEnum } from '~/enums/OperationTypesEnum'
import ChatTasksView from './Tasks/ChatTasksView.vue'
import ChatTasksEditView from './Tasks/ChatTasksEditView.vue'
import ChatColumnsView from './Columns/ChatColumnsView.vue'
import ChatBoardsView from './Boards/ChatBoardsView.vue'
import ChatWorkspacesView from './Workspaces/ChatWorkspacesView.vue'
import ChatColumnsEditView from './Columns/ChatColumnsEditView.vue'
import ChatBoardsEditView from './Boards/ChatBoardsEditView.vue'
import ChatWorkspacesEditView from './Workspaces/ChatWorkspacesEditView.vue'
import { transformTask } from '@/services/task'
import { transformColumn } from '@/services/column'
import { transformBoard } from '@/services/board'
import { transformWorkspace } from '@/services/workspace'
import type { IOperationLog } from '~/interfaces/domain/IOperationLog'

const props = defineProps<{
  logId: string
}>()

/**
 * Data
 */
const { data: log, isPending: isLogLoading } = useLog(props.logId)

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
  columns: {
    component: markRaw(ChatColumnsView),
    componentUpdate: markRaw(ChatColumnsEditView),
    labels: { nom: 'категории', gen: 'категорий' },
    transformFn: transformColumn,
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
const isSuccess = computed(() => logCopy.value?.status === OperationLogStatusesEnum.SUCCESS)

const logEntities = computed<any[]>(() => {
  if (!logCopy.value) return []

  if (SELECTS_FROM_AFTER.has(logCopy.value.operationType)) return logCopy.value.entitiesAfter ?? []
  if (logCopy.value.operationType === OperationTypesEnum.DELETE)
    return logCopy.value.entitiesBefore ?? []

  return []
})

type RenderBlock = {
  id: string
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

  const id = `${props.logId}-${collection}-${operationType}`

  // UPDATE
  if (operationType === OperationTypesEnum.UPDATE) {
    const before = logCopy.value.entitiesBefore || []
    const after = logCopy.value.entitiesAfter || []

    return [
      {
        id,
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
        items: logEntities.value.map((entity: any) => config.transformFn(entity)),
        component: config.component,
        isTemp: status === OperationLogStatusesEnum.SUCCESS ? false : true,
      },
    ]
  } else if (operationType === OperationTypesEnum.DELETE) {
    return [
      {
        id,
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
      items: logEntities.value.map((entity: any) => config.transformFn(entity)),
      component: config.component,
    },
  ]
})

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
  <template v-if="!isLogLoading && logCopy">
    <div
      v-for="block in renderBlocks"
      :key="block.id"
    >
      <component
        :is="block.component"
        :items="block.items"
        :before="block.before"
        :after="block.after"
        :isTemporary="block.isTemp"
        :isSelectable="isPending && !isSuccess"
        v-model:selectedIds="selectedIds"
      />
    </div>
  </template>

  <template v-else>
    <Skeleton class="h-30 bg-gray-200 rounded-sm w-80"></Skeleton>
  </template>
</template>
