<script setup lang="ts">
import Task from '~/components/Workspace/Main/Task/Task.vue'
import RecoverButtons from '~/components/Workspace/Main/Archive/RecoverButtons.vue'

import { Archive } from 'lucide-vue-next'

import ColumnsView from '../ColumnsView.vue'
import TitleWithBadge from '../TitleWithBadge.vue'
import TaskSkeleton from '../EntityCardSkeleton.vue'
import ColumnCard from '../Column/ColumnCard.vue'
import BoardCard from '../Board/BoardCard.vue'
import WorkspaceCard from '../../WorkspaceCard.vue'

const { data: tasksData, isPending: isTasksLoading } = useArchivedTasks()
const { data: columnsData, isPending: isColumnsLoading } = useArchivedColumns()
const { data: boardsData, isPending: isBoardsLoading } = useArchivedBoards()
const { data: workspacesData, isPending: isWorkspacesLoading } = useArchivedWorkspaces()

const { mutate: recoverTask } = useRecoverTask()
const { mutate: deleteTask } = useDeleteTask()

const { mutate: recoverColumn } = useRecoverColumn()
const { mutate: deleteColumn } = useDeleteColumn()

const { mutate: recoverBoard } = useRecoverBoard()
const { mutate: deleteBoard } = useDeleteBoard()

const { mutate: recoverWorkspace } = useRecoverWorkspace()
const { mutate: deleteWorkspace } = useDeleteWorkspace()

const tasksContainerRef = ref<HTMLElement | null>(null)
const columnContainerRef = ref<HTMLElement | null>(null)
const boardContainerRef = ref<HTMLElement | null>(null)
const workspaceContainerRef = ref<HTMLElement | null>(null)

const isSomeLoading = computed(
  () =>
    isTasksLoading.value ||
    isColumnsLoading.value ||
    isBoardsLoading.value ||
    isWorkspacesLoading.value,
)

const isArchiveEmpty = computed(() => {
  return (
    tasks.value?.length === 0 &&
    columns.value?.length === 0 &&
    boards.value?.length === 0 &&
    workspaces.value?.length === 0
  )
})

const tasks = computed(() => tasksData.value || [])
const columns = computed(() => columnsData.value || [])
const boards = computed(() => boardsData.value || [])
const workspaces = computed(() => workspacesData.value || [])
</script>
<template>
  <SidebarInset>
    <header class="flex justify-between h-12 sm:h-16 shrink-0 items-center gap-2 px-4">
      <div class="flex items-center gap-2">
        <SidebarTrigger class="-ml-1" />
        <Separator
          orientation="vertical"
          class="mr-0 data-[orientation=vertical]:h-4"
        />
        <div class="flex items-center gap-2 text-secondary-foreground">
          <Archive class="size-4 shrink-0" />
          <span class="truncate whitespace-nowrap text-sm font-medium"> Архив </span>
        </div>
      </div>
    </header>

    <Separator />
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-y-auto">
      <div
        class="size-full py-3 flex items-center justify-center gap-5 overflow-y-auto"
        v-if="!isSomeLoading && isArchiveEmpty"
      >
        <div class="flex flex-col items-center gap-y-2">
          <div class="text-gray-500"><Archive class="size-10" /></div>
          <div class="text-lg text-gray-500 font-medium">Архив пуст</div>
          <div class="text-sm text-gray-400 max-w-xs text-center">
            Здесь будут храниться все архивированные задачи, колонки, доски и пространства.
          </div>
        </div>
      </div>

      <div
        class="size-full py-2 my-1 px-0.5 flex flex-col gap-5 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
        v-else
      >
        <div
          class="w-full flex flex-col gap-y-2"
          ref="tasksContainerRef"
          v-if="tasks.length > 0 || isTasksLoading"
        >
          <template v-if="!isTasksLoading">
            <TitleWithBadge
              title="Задачи"
              :number="tasks.length"
            >
              <div class="w-full h-[.5px] bg-gray-200"></div>
            </TitleWithBadge>

            <ColumnsView
              :items="tasks"
              :containerRef="tasksContainerRef"
              :initialCountShown="20"
            >
              <template v-slot:default="slotProps">
                <Task
                  v-for="task in slotProps.data"
                  :key="task.id"
                  :task="task"
                  :options="{
                    hasBorder: true,
                    showInfo: true,
                  }"
                  classes="self-start"
                >
                  <RecoverButtons
                    @recover="recoverTask({ task })"
                    @delete="deleteTask({ task })"
                  />
                </Task>
              </template>
            </ColumnsView>
          </template>

          <template v-else>
            <TitleWithBadge
              title="Задачи"
              :number="tasks.length"
              :isLoading="isTasksLoading"
            ></TitleWithBadge>

            <div class="flex gap-2">
              <div
                class="flex flex-col gap-2"
                style="width: 250px"
              >
                <TaskSkeleton
                  v-for="i in 3"
                  :key="`task-skeleton-${i}`"
                ></TaskSkeleton>
              </div>
              <div
                class="flex flex-col gap-2"
                style="width: 250px"
              >
                <TaskSkeleton
                  v-for="i in 2"
                  :key="`task-skeleton-${i}`"
                ></TaskSkeleton>
              </div>
            </div>
          </template>
        </div>

        <div
          class="w-full flex flex-col gap-y-2"
          ref="columnContainerRef"
          v-if="columns.length > 0 || isColumnsLoading"
        >
          <template v-if="!isColumnsLoading">
            <TitleWithBadge
              title="Колонки"
              :number="columns.length"
            >
              <div class="w-full h-[.5px] bg-gray-200"></div>
            </TitleWithBadge>

            <ColumnsView
              :items="columns"
              :containerRef="columnContainerRef"
              :initialCountShown="20"
              v-if="!isColumnsLoading"
            >
              <template v-slot:default="slotProps">
                <ColumnCard
                  v-for="column in slotProps.data"
                  :key="column.id"
                  :column="column"
                  :options="{
                    hasBorder: true,
                    showInfo: true,
                  }"
                  classes="self-start"
                >
                  <RecoverButtons
                    @recover="recoverColumn({ column })"
                    @delete="deleteColumn({ column })"
                  />
                </ColumnCard>
              </template>
            </ColumnsView>
          </template>

          <template v-else>
            <TitleWithBadge
              title="Колонки"
              :number="columns.length"
              :isLoading="isColumnsLoading"
            />

            <div class="flex gap-2">
              <div
                class="flex flex-col gap-2"
                style="width: 250px"
              >
                <TaskSkeleton
                  v-for="i in 3"
                  :key="`column-skeleton-${i}`"
                ></TaskSkeleton>
              </div>
              <div
                class="flex flex-col gap-2"
                style="width: 250px"
              >
                <TaskSkeleton
                  v-for="i in 2"
                  :key="`column-skeleton-${i}`"
                ></TaskSkeleton>
              </div>
            </div>
          </template>
        </div>

        <div
          class="w-full flex flex-col gap-y-2"
          ref="boardContainerRef"
          v-if="boards.length > 0 || isBoardsLoading"
        >
          <template v-if="!isBoardsLoading">
            <TitleWithBadge
              title="Доски"
              :number="boards.length"
            >
              <div class="w-full h-[.5px] bg-gray-200"></div>
            </TitleWithBadge>

            <ColumnsView
              :items="boards"
              :containerRef="boardContainerRef"
              :initialCountShown="20"
            >
              <template v-slot:default="slotProps">
                <BoardCard
                  v-for="board in slotProps.data"
                  :key="board.id"
                  :board="board"
                  :options="{
                    hasBorder: true,
                    showInfo: true,
                  }"
                  classes="self-start"
                >
                  <RecoverButtons
                    @recover="recoverBoard({ board })"
                    @delete="deleteBoard({ board })"
                  />
                </BoardCard>
              </template>
            </ColumnsView>
          </template>

          <template v-else>
            <TitleWithBadge
              title="Доски"
              :number="boards.length"
              :isLoading="isBoardsLoading"
            />

            <div class="flex gap-2">
              <div
                class="flex flex-col gap-2"
                style="width: 250px"
              >
                <TaskSkeleton
                  v-for="i in 3"
                  :key="`board-skeleton-${i}`"
                ></TaskSkeleton>
              </div>
              <div
                class="flex flex-col gap-2"
                style="width: 250px"
              >
                <TaskSkeleton
                  v-for="i in 2"
                  :key="`board-skeleton-${i}`"
                ></TaskSkeleton>
              </div>
            </div>
          </template>
        </div>

        <div
          class="w-full flex flex-col gap-y-2"
          ref="workspaceContainerRef"
          v-if="workspaces.length > 0 || isWorkspacesLoading"
        >
          <template v-if="!isWorkspacesLoading">
            <TitleWithBadge
              title="Пространства"
              :number="workspaces.length"
              v-if="!isWorkspacesLoading"
            >
              <div class="w-full h-[.5px] bg-gray-200"></div>
            </TitleWithBadge>

            <ColumnsView
              :items="workspaces"
              :containerRef="workspaceContainerRef"
              :initialCountShown="20"
              v-if="!isWorkspacesLoading"
            >
              <template v-slot:default="slotProps">
                <WorkspaceCard
                  v-for="workspace in slotProps.data"
                  :key="workspace.id"
                  :workspace="workspace"
                  :options="{
                    hasBorder: true,
                    showInfo: true,
                  }"
                  classes="self-start"
                >
                  <RecoverButtons
                    @recover="recoverWorkspace({ workspace })"
                    @delete="deleteWorkspace({ workspace })"
                  />
                </WorkspaceCard>
              </template>
            </ColumnsView>
          </template>

          <template v-else>
            <TitleWithBadge
              title="Пространства"
              :number="workspaces.length"
              :isLoading="isWorkspacesLoading"
            />

            <div class="flex gap-2">
              <div
                class="flex flex-col gap-2"
                style="width: 250px"
              >
                <TaskSkeleton
                  v-for="i in 3"
                  :key="`workspace-skeleton-${i}`"
                ></TaskSkeleton>
              </div>
              <div
                class="flex flex-col gap-2"
                style="width: 250px"
              >
                <TaskSkeleton
                  v-for="i in 2"
                  :key="`workspace-skeleton-${i}`"
                ></TaskSkeleton>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </SidebarInset>
</template>
