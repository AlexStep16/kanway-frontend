<script setup lang="ts">
import ButtonCreate from '@components/Buttons/ButtonCreate.vue'
import SidebarItem from '@components/Workspace/Sidebar/SidebarItem.vue'
import {
  MessagesSquare,
  Star,
  Settings,
  SquareKanban,
  Archive,
  LogOut,
  MessageCircleQuestionMark,
  Gem,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
} from 'lucide-vue-next'
import NumberBadge from '@components/Badges/NumberBadge.vue'
import { useUIStore } from '@stores/ui'
import CreateEditWorkspaceDropdown from '@components/Forms/CreateEditWorkspace/Wrapper.vue'
import CreateEditBoardDropdown from '@components/Forms/CreateEditBoard/Wrapper.vue'
import { computed, onMounted, ref, toRef } from 'vue'
import { HSDropdown } from 'preline'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { useBoardDataStore } from '@stores/boardData'
import EditForm from '@components/Options/EditForm.vue'
import WorkspaceEditWrapper from '@components/Forms/CreateEditWorkspace/Wrapper.vue'
import BoardEditWrapper from '@components/Forms/CreateEditBoard/Wrapper.vue'
import BoardsSkeleton from '@components/Workspace/Sidebar/BoardsSkeleton.vue'
import NumberBadgeSkeleton from '@components/Badges/NumberBadgeSkeleton.vue'
import { Nullable } from '@/types/utils'
import AvatarImage from '@components/Workspace/AvatarImage.vue'
import { useAuthStore } from '@stores/auth'
import ActiveWorkspaceAvatar from '@components/Workspace/ActiveWorkspaceAvatar.vue'
import { useChatStore } from '@/stores/chat'

const UI_STORE = useUIStore()
const WORKSPACE_STORE = useWorkspaceDataStore()
const BOARD_STORE = useBoardDataStore()
const AUTH_STORE = useAuthStore()
const CHAT_STORE = useChatStore()

const user = toRef(AUTH_STORE, 'user')

const activeWorkspace = computed(() => WORKSPACE_STORE.getActiveWorkspace)

if (window.innerWidth < 1280) {
  UI_STORE.isSidebarOpen = false
}

const workspaceDropdown = ref<Nullable<HTMLElement>>(null)
const workspaceDropdownInstance = ref<Nullable<HSDropdown>>(null)

const workspaceEditWrapperRef = ref<Nullable<InstanceType<typeof WorkspaceEditWrapper>>>(null)
const boardEditWrapperRef = ref<Nullable<InstanceType<typeof BoardEditWrapper>>>(null)

const getBoardCreateModalWidth = () => {
  if (UI_STORE.createBoardButtonRef) {
    const rect = UI_STORE.createBoardButtonRef.getBoundingClientRect()
    return rect.width
  }
  return 0
}

function resetWorkspaceForm() {
  if (workspaceEditWrapperRef.value && workspaceEditWrapperRef.value.resetForm) {
    workspaceEditWrapperRef.value.resetForm()
  }
}

function resetBoardForm() {
  if (boardEditWrapperRef.value && boardEditWrapperRef.value.resetForm) {
    boardEditWrapperRef.value.resetForm()
  }
}

function selectWorkspace(workspace: any) {
  WORKSPACE_STORE.selectWorkspace(workspace, true)

  if (workspaceDropdownInstance.value) workspaceDropdownInstance.value.close()
}

function closeWorkspacesDropdown() {
  if (workspaceDropdownInstance.value) {
    workspaceDropdownInstance.value.close()
  }
}

onMounted(() => {
  if (workspaceDropdown.value && workspaceDropdown.value instanceof HTMLElement) {
    workspaceDropdownInstance.value = HSDropdown.getInstance(
      workspaceDropdown.value,
    ) as Nullable<HSDropdown>

    if (workspaceDropdownInstance.value) {
      document.addEventListener('click', (e: any) => {
        if (
          workspaceDropdownInstance.value &&
          workspaceDropdown.value &&
          !workspaceDropdown.value.contains(e.target)
        ) {
          closeWorkspacesDropdown()
        }
      })
    }
  }

  if (UI_STORE.createBoardButtonRef) {
    /*TIPS_STORE.addTip({
      title: 'Создание доски',
      description: `Чтобы создать новую доску, нажмите на соответствующую кнопку, которая находится в разделе <b>Доски</b>.`,
      anchorElement: UI_STORE.createBoardButtonRef,
      buttonNextText: 'Понятно',
    })*/
  }
})
</script>

<template>
  <!-- Sidebar -->
  <div
    class="end-auto bg-gray-100 bottom-0 w-70 px-3 transition-all duration-300 transform h-full fixed top-0 start-0 z-60 block"
    :class="{
      '-translate-x-full': !UI_STORE.isSidebarOpen,
      'translate-x-0': UI_STORE.isSidebarOpen,
    }"
    :ref="
      (el: any) => {
        UI_STORE.sidebarRef = el as HTMLElement
      }
    "
    role="dialog"
    tabindex="-1"
    aria-label="Sidebar"
  >
    <div class="relative flex flex-col h-full max-h-full">
      <!-- Header -->
      <header class="py-3 border-b border-gray-200 flex items-center gap-x-1">
        <!-- Workspace Dropdown -->
        <div
          class="hs-dropdown [--strategy:absolute] [--auto-close:false] relative w-full inline-flex flex-1 min-w-0"
          ref="workspaceDropdown"
        >
          <button
            id="hs-sidebar-workspace"
            type="button"
            class="w-full inline-flex shrink-0 items-center gap-x-2 px-2 h-11.5 text-start text-sm text-gray-800 bg-gray-50 border border-gray-200 shadow-2xs rounded-md hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden focus:bg-gray-200"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Dropdown"
          >
            <ActiveWorkspaceAvatar />
            <div class="flex flex-col truncate">
              <span class="text-sm truncate" :title="activeWorkspace?.name">{{
                activeWorkspace?.name
              }}</span>
            </div>
            <svg
              class="shrink-0 size-3.5 ms-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          </button>
          <!-- Workspaces Dropdown -->
          <div
            class="hs-dropdown-menu w-full min-w-70 hs-dropdown-open:opacity-100 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white border border-gray-200 rounded-lg shadow-lg"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="hs-sidebar-workspace"
          >
            <span class="block p-2 text-xs text-gray-500 font-medium">Пространства</span>

            <ul class="p-1 space-y-1">
              <SidebarItem
                v-for="workspace in WORKSPACE_STORE.getWorkspaces"
                :key="workspace.id"
                :item="workspace"
                :selected="workspace.id === activeWorkspace?.id ? true : false"
                :resetForm="resetWorkspaceForm"
                @select="selectWorkspace(workspace)"
                type="workspace"
              >
                <template v-slot:link>
                  <div
                    class="shrink-0 size-5 me-2.5 rounded-sm text-xs flex items-center justify-center font-semibold text-white"
                    :style="{ backgroundColor: workspace.color || '#3B82F6' }"
                  >
                    {{ WORKSPACE_STORE.getFirstLetterOfWorkspace(workspace) }}
                  </div>
                </template>

                <template #edit-content="{ closeDropdown, getWorkspaceItem, closeEdit }">
                  <EditForm @closeEdit="closeEdit" title="Редактирование пространства">
                    <WorkspaceEditWrapper
                      @workspaceCreated="closeDropdown"
                      @workspaceEdited="closeDropdown"
                      mode="edit"
                      :item="getWorkspaceItem"
                      ref="workspaceEditWrapperRef"
                    />
                  </EditForm>
                </template>
              </SidebarItem>

              <CreateEditWorkspaceDropdown
                @workspaceCreated="closeWorkspacesDropdown"
                mode="create"
                :isDropdown="true"
              >
                <ButtonCreate id="hs-sidebar-workspace-create" />
              </CreateEditWorkspaceDropdown>
            </ul>
          </div>
          <!-- End Workspaces Dropdown -->
        </div>
        <!-- End Workspace Dropdown -->

        <button
          type="button"
          class="inline-flex p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-100"
          @click="UI_STORE.closeSidebar()"
        >
          <PanelLeftClose class="size-4" />
        </button>
      </header>
      <!-- End Header -->

      <!-- Body -->
      <nav class="overflow-y-auto flex-1 py-3 flex flex-col">
        <div
          class="hs-accordion-group min-h-0 grow-1 w-full flex flex-col justify-between"
          data-hs-accordion-always-open
        >
          <ul
            class="pe-1 flex flex-col gap-y-1 w-full min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-300"
          >
            <li class="hs-accordion active" id="boards-accordion">
              <button
                type="button"
                class="hs-accordion-toggle w-full text-start flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden"
                aria-expanded="true"
                aria-controls="boards-accordion-sub-1-collapse-1"
              >
                <SquareKanban class="size-4" />
                Доски
                <NumberBadgeSkeleton
                  v-if="BOARD_STORE.areBoardsLoading(activeWorkspace?.id || '')"
                />
                <NumberBadge :number="BOARD_STORE.getActiveWorkspaceBoards.length" v-else />

                <ChevronDown
                  class="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
                />
                <ChevronUp
                  class="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
                />
              </button>

              <div
                id="boards-accordion-sub-1-collapse-1"
                class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                role="region"
                aria-labelledby="boards-accordion"
              >
                <BoardsSkeleton v-if="BOARD_STORE.areBoardsLoading(activeWorkspace?.id || '')" />
                <ul
                  class="my-1 relative ps-2.5 ms-4.5 space-y-1 before:content-[''] before:block before:absolute before:top-0 before:-left-[1px] before:border-l-2 before:h-full before:border-gray-200"
                  v-else
                >
                  <SidebarItem
                    v-for="board in BOARD_STORE.getActiveWorkspaceBoards"
                    :key="board.id"
                    :item="board"
                    :selected="board === BOARD_STORE.activeBoard"
                    @select="BOARD_STORE.selectBoard(board, true)"
                    :resetForm="resetBoardForm"
                    type="board"
                  >
                    <template #edit-content="{ closeDropdown, getBoardItem, closeEdit }">
                      <EditForm @closeEdit="closeEdit" title="Редактирование доски">
                        <BoardEditWrapper
                          @boardCreated="closeDropdown"
                          @boardEdited="closeDropdown"
                          mode="edit"
                          :item="getBoardItem"
                          ref="boardEditWrapperRef"
                        />
                      </EditForm>
                    </template>
                  </SidebarItem>

                  <CreateEditBoardDropdown
                    mode="create"
                    :isDropdown="true"
                    :dropdownClasses="'[--scope:window]'"
                    :dropdownMenuWidth="getBoardCreateModalWidth()"
                  >
                    <ButtonCreate
                      id="hs-sidebar-board-create"
                      @refEvent="UI_STORE.createBoardButtonRef = $event"
                    />
                  </CreateEditBoardDropdown>
                </ul>
              </div>
            </li>

            <li class="hs-accordion active" id="boards-accordion">
              <button
                type="button"
                class="hs-accordion-toggle w-full text-start flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden"
                aria-expanded="true"
                aria-controls="boards-accordion-sub-1-collapse-1"
              >
                <MessagesSquare class="size-4" />
                Чаты
                <NumberBadge :number="CHAT_STORE.chats.length" />

                <ChevronDown
                  class="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
                />
                <ChevronUp
                  class="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
                />
              </button>

              <div
                id="chats-accordion-sub-1-collapse-1"
                class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                role="region"
                aria-labelledby="chats-accordion"
              >
                <ul
                  class="my-1 relative ps-2.5 ms-4.5 space-y-1 before:content-[''] before:block before:absolute before:top-0 before:-left-[1px] before:border-l-2 before:h-full before:border-gray-200"
                >
                  <SidebarItem
                    v-for="chat in CHAT_STORE.chats"
                    :key="chat.id"
                    :item="chat"
                    @select="CHAT_STORE.selectChat(chat, true)"
                    :selected="chat.id === CHAT_STORE.activeChatId"
                    type="chat"
                  />
                </ul>
              </div>
            </li>

            <li class="hs-accordion" id="users-accordion">
              <button
                type="button"
                class="hs-accordion-toggle w-full text-start flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden"
                aria-expanded="true"
                aria-controls="users-accordion-collapse-1"
              >
                <Star class="size-4" />
                Избранное

                <ChevronDown
                  class="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
                />
                <ChevronUp
                  class="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
                />
              </button>

              <div
                id="users-accordion-collapse-1"
                class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                role="region"
                aria-labelledby="users-accordion"
              >
                <ul
                  class="hs-accordion-group my-1 ps-2.5 ms-4.5 relative space-y-1 before:content-[''] before:block before:absolute before:top-0 before:-left-[1px] before:border-l-2 before:h-full before:border-gray-200"
                >
                  <li class="hs-accordion" id="users-accordion-sub-1">
                    <button
                      type="button"
                      class="hs-accordion-toggle w-full text-start flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden"
                      aria-expanded="true"
                      aria-controls="users-accordion-sub-1-collapse-1"
                    >
                      Пространства
                      <NumberBadge :number="WORKSPACE_STORE.getFavoriteWorkspaces.length" />

                      <ChevronDown
                        class="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
                        v-if="WORKSPACE_STORE.getFavoriteWorkspaces.length"
                      />
                      <ChevronUp
                        class="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
                        v-if="WORKSPACE_STORE.getFavoriteWorkspaces.length"
                      />
                    </button>

                    <div
                      id="users-accordion-sub-1-collapse-1"
                      class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                      role="region"
                      aria-labelledby="users-accordion-sub-1"
                    >
                      <ul
                        class="pt-1 ps-2 space-y-1"
                        v-if="WORKSPACE_STORE.getFavoriteWorkspaces.length"
                      >
                        <SidebarItem
                          v-for="workspace in WORKSPACE_STORE.getFavoriteWorkspaces"
                          :key="workspace.id"
                          :item="workspace"
                          :selected="workspace.id === activeWorkspace?.id ? true : false"
                          :resetForm="resetWorkspaceForm"
                          type="workspace"
                        >
                          <template v-slot:link>
                            <div
                              class="size-5 me-2.5 rounded-sm text-xs flex items-center justify-center font-semibold text-white"
                              :style="{ backgroundColor: workspace.color || '#3B82F6' }"
                            >
                              {{ WORKSPACE_STORE.getFirstLetterOfWorkspace(workspace) }}
                            </div>
                          </template>

                          <template #edit-content="{ closeDropdown, getWorkspaceItem, closeEdit }">
                            <EditForm @closeEdit="closeEdit" title="Редактирование пространства">
                              <WorkspaceEditWrapper
                                @workspaceCreated="closeDropdown"
                                @workspaceEdited="closeDropdown"
                                mode="edit"
                                :item="getWorkspaceItem"
                                ref="workspaceEditWrapperRef"
                              />
                            </EditForm>
                          </template>
                        </SidebarItem>
                      </ul>
                    </div>
                  </li>

                  <li class="hs-accordion" id="users-accordion-sub-2">
                    <button
                      type="button"
                      class="hs-accordion-toggle w-full text-start flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden"
                      aria-expanded="true"
                      aria-controls="users-accordion-sub-2-collapse-1"
                    >
                      Доски
                      <NumberBadgeSkeleton
                        v-if="BOARD_STORE.areBoardsLoading(activeWorkspace?.id || '')"
                      />
                      <NumberBadge
                        :number="BOARD_STORE.getActiveWorkspaceFavoriteBoards.length"
                        v-else
                      />

                      <ChevronDown
                        class="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
                        v-if="BOARD_STORE.getActiveWorkspaceFavoriteBoards.length"
                      />
                      <ChevronUp
                        class="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
                        v-if="BOARD_STORE.getActiveWorkspaceFavoriteBoards.length"
                      />
                    </button>

                    <div
                      id="users-accordion-sub-2-collapse-1"
                      class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                      role="region"
                      aria-labelledby="users-accordion-sub-2"
                    >
                      <BoardsSkeleton
                        v-if="BOARD_STORE.areBoardsLoading(activeWorkspace?.id || '')"
                      />
                      <ul
                        class="pt-1 ps-2 space-y-1"
                        v-else-if="BOARD_STORE.getActiveWorkspaceFavoriteBoards.length"
                      >
                        <SidebarItem
                          v-for="board in BOARD_STORE.getActiveWorkspaceFavoriteBoards"
                          :key="board.id"
                          :item="board"
                          :selected="board === BOARD_STORE.activeBoard"
                          :resetForm="resetBoardForm"
                          type="board"
                        >
                          <template #edit-content="{ closeDropdown, getBoardItem, closeEdit }">
                            <EditForm @closeEdit="closeEdit" title="Редактирование доски">
                              <BoardEditWrapper
                                @boardCreated="closeDropdown"
                                @boardEdited="closeDropdown"
                                mode="edit"
                                :item="getBoardItem"
                                ref="boardEditWrapperRef"
                              />
                            </EditForm>
                          </template>
                        </SidebarItem>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          <ul class="pe-1 mt-1 flex flex-col gap-y-1 mb-3">
            <li>
              <button
                type="button"
                class="w-full flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden"
                @click="UI_STORE.openSettingsModal()"
              >
                <Settings class="size-4" />
                Настройки
              </button>
            </li>
            <li>
              <button
                type="button"
                class="w-full flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden"
                @click="UI_STORE.selectArchive"
              >
                <Archive class="size-4" />

                Архив
              </button>
            </li>
          </ul>
        </div>

        <div class="flex flex-col p-3 bg-gray-50 border border-gray-200 shadow-2xs rounded-md">
          <div class="flex flex-auto flex-col justify-center items-center">
            <h3 class="flex items-center gap-x-2 font-semibold text-gray-800">
              <Gem class="size-4" />
              Улучшить аккаунт
            </h3>
            <p class="text-xs text-center mt-2 text-gray-700">
              Расширьте возможности с помощью премиум подписки
            </p>
            <button
              type="button"
              class="text-xs text-white py-2 mt-2 px-3 w-full items-center gap-x-2 font-medium rounded-md bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)] disabled:opacity-50 disabled:pointer-events-none"
            >
              Повысить до Премиум
            </button>
          </div>
        </div>
      </nav>
      <!-- End Body -->

      <!-- Footer -->
      <footer class="mt-auto pt-0 pb-3 border-t border-gray-200">
        <!-- Account Dropdown -->
        <div
          class="hs-dropdown [--strategy:absolute] [--auto-close:inside] pt-3 relative w-full inline-flex"
        >
          <button
            id="hs-sidebar-footer"
            type="button"
            class="w-full inline-flex shrink-0 items-center gap-x-2 p-2 text-start text-sm text-gray-800 bg-gray-50 border border-gray-200 shadow-2xs rounded-md hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden focus:bg-gray-200"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Dropdown"
          >
            <div class="shrink-0 size-9 rounded-full">
              <AvatarImage imageClasses="text-lg sm:text-xl" />
            </div>
            <div class="flex flex-col truncate">
              <span class="text-sm truncate">{{ user?.username }}</span>
              <span class="text-xs truncate text-gray-500">{{ user?.email }}</span>
            </div>
            <svg
              class="shrink-0 size-3.5 ms-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          </button>

          <!-- Account Dropdown -->
          <div
            class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white border border-gray-200 rounded-lg shadow-lg"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="hs-sidebar-footer"
          >
            <div class="p-1">
              <a
                class="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 transition-colors duration-100 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
                href="#"
              >
                <LogOut class="size-4" />

                Выйти
              </a>
              <a
                class="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 transition-colors duration-100 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
                href="#"
              >
                <MessageCircleQuestionMark class="size-4" />

                Поддержка
              </a>
            </div>
          </div>
          <!-- End Account Dropdown -->
        </div>
        <!-- End Account Dropdown -->
      </footer>
      <!-- End Footer -->
    </div>
  </div>
  <!-- End Sidebar -->

  <!-- Backdrop mobile -->
  <div
    class="fixed inset-0 transition duration bg-gray-900/50 lg:hidden z-50"
    :class="{
      'opacity-100 visible': UI_STORE.isSidebarOpen,
      'opacity-0 invisible': !UI_STORE.isSidebarOpen,
    }"
    @click="UI_STORE.closeSidebar()"
  ></div>
</template>
