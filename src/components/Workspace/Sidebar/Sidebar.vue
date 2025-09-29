<script setup lang="ts">
import ButtonCreate from '@components/Buttons/ButtonCreate.vue'
import SidebarItem from '@components/Workspace/Sidebar/SidebarItem.vue'
import {
  MessagesSquare,
  Star,
  Settings,
  SquareKanban,
  Trash,
  LogOut,
  MessageCircleQuestionMark,
  Gem,
  ChevronDown,
  ChevronUp,
} from 'lucide-vue-next'
import NumberBadge from '@components/Badges/NumberBadge.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import CreateDropdown from '@components/Dropdowns/Create/CreateDropdown.vue'
import { onMounted, ref } from 'vue'
import { HSDropdown } from 'preline'

const WORKSPACE_STORE = useWorkspaceStore()

const workspaceDropdown = ref<HTMLElement | null>(null)

const getBoardCreateModalWidth = () => {
  if (WORKSPACE_STORE.createBoardButtonRef) {
    const rect = WORKSPACE_STORE.createBoardButtonRef.getBoundingClientRect()
    return rect.width
  }
  return 0
}

onMounted(() => {
  if (workspaceDropdown.value && workspaceDropdown.value instanceof HTMLElement) {
    const dropdownInstance = HSDropdown.getInstance(workspaceDropdown.value) as HSDropdown | null

    if (dropdownInstance) {
      document.addEventListener('click', (e: any) => {
        if (
          dropdownInstance &&
          workspaceDropdown.value &&
          !workspaceDropdown.value.contains(e.target)
        ) {
          if (dropdownInstance) {
            dropdownInstance.close()
          }
        }
      })
    }
  }
})
</script>

<template>
  <!-- Sidebar -->
  <div
    id="hs-sidebar-collapsible-group"
    class="hs-overlay block end-auto bottom-0 w-70 px-3 transition-all duration-300 transform h-full fixed top-0 start-0 z-60"
    :class="{
      'translate-x-0': WORKSPACE_STORE.isSidebarOpen,
      '-translate-x-full': !WORKSPACE_STORE.isSidebarOpen,
    }"
    role="dialog"
    tabindex="-1"
    aria-label="Sidebar"
  >
    <div class="relative flex flex-col h-full max-h-full">
      <!-- Header -->
      <header class="py-3 border-b border-gray-200">
        <div
          class="hs-dropdown [--strategy:absolute] [--auto-close:false] relative w-full inline-flex"
          ref="workspaceDropdown"
        >
          <button
            id="hs-sidebar-workspace"
            type="button"
            class="w-full inline-flex shrink-0 items-center gap-x-2 px-2 h-11.5 text-start text-sm text-gray-800 bg-gray-50 border border-gray-200 shadow-2xs rounded-md hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Dropdown"
          >
            <div
              class="size-7 bg-blue-500 rounded-md flex items-center justify-center font-semibold text-white"
            >
              W
            </div>
            <div class="flex flex-col truncate">
              <span class="text-sm truncate">Личное пространство</span>
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
            class="hs-dropdown-menu w-full hs-dropdown-open:opacity-100 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white border border-gray-200 rounded-lg shadow-lg"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="hs-sidebar-workspace"
          >
            <span class="block p-2 text-xs text-gray-500 font-medium">Пространства</span>

            <ul class="p-1 space-y-1">
              <SidebarItem :item="{ id: 1, name: 'Личное пространство' }" type="workspace">
                <template v-slot:link>
                  <div
                    class="size-5 bg-blue-500 me-2.5 rounded-sm text-xs flex items-center justify-center font-semibold text-white"
                  >
                    W
                  </div>
                </template>
              </SidebarItem>
              <SidebarItem :item="{ id: 11, name: 'Работа' }" type="workspace">
                <template v-slot:link>
                  <div
                    class="size-5 bg-red-500 me-2.5 rounded-sm text-xs flex items-center justify-center font-semibold text-white"
                  >
                    S
                  </div>
                </template>
              </SidebarItem>

              <CreateDropdown :id="'hs-sidebar-workspace-create'">
                <ButtonCreate id="hs-sidebar-workspace-create" />
              </CreateDropdown>
            </ul>
          </div>
          <!-- End Account Dropdown -->
        </div>
        <!-- End Account Dropdown -->
      </header>
      <!-- End Header -->

      <!-- Body -->
      <nav
        class="h-full overflow-y-auto py-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 flex flex-col"
      >
        <div
          class="hs-accordion-group grow-1 w-full flex flex-col flex-wrap justify-between"
          data-hs-accordion-always-open
        >
          <ul class="shrink-0 flex flex-col gap-y-1 w-full">
            <li class="hs-accordion active" id="boards-accordion">
              <button
                type="button"
                class="hs-accordion-toggle w-full text-start flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden"
                aria-expanded="true"
                aria-controls="boards-accordion-sub-1-collapse-1"
              >
                <SquareKanban class="size-4" />
                Доски
                <NumberBadge :number="3" />

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
                <ul
                  class="my-1 relative ps-2.5 ms-4.5 space-y-1 before:content-[''] before:block before:absolute before:top-0 before:-left-[1px] before:border-l-2 before:h-full before:border-gray-200"
                >
                  <SidebarItem :item="{ id: 2, name: 'Спорт' }" type="board" />

                  <CreateDropdown
                    :dropdownClasses="'[--scope:window]'"
                    :dropdownMenuWidth="getBoardCreateModalWidth()"
                    :id="'hs-sidebar-board-create'"
                  >
                    <ButtonCreate
                      id="hs-sidebar-board-create"
                      @refEvent="WORKSPACE_STORE.createBoardButtonRef = $event"
                    />
                  </CreateDropdown>
                </ul>
              </div>
            </li>

            <li class="hs-accordion active" id="boards-accordion">
              <button
                type="button"
                class="hs-accordion-toggle w-full text-start flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden"
                aria-expanded="true"
                aria-controls="boards-accordion-sub-1-collapse-1"
              >
                <MessagesSquare class="size-4" />
                Чаты
                <NumberBadge :number="1" />

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
                <ul
                  class="my-1 relative ps-2.5 ms-4.5 space-y-1 before:content-[''] before:block before:absolute before:top-0 before:-left-[1px] before:border-l-2 before:h-full before:border-gray-200"
                >
                  <SidebarItem
                    :item="{
                      id: 3,
                      name: 'Удали задачу с названием Сделать домашку по математике',
                    }"
                    type="chat"
                  />
                </ul>
              </div>
            </li>

            <li class="hs-accordion" id="users-accordion">
              <button
                type="button"
                class="hs-accordion-toggle w-full text-start flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden"
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
                  data-hs-accordion-always-open
                >
                  <li class="hs-accordion" id="users-accordion-sub-1">
                    <button
                      type="button"
                      class="hs-accordion-toggle w-full text-start flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-200 focus:outline-hidden"
                      aria-expanded="true"
                      aria-controls="users-accordion-sub-1-collapse-1"
                    >
                      Пространства
                      <NumberBadge :number="3" />

                      <ChevronDown
                        class="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
                      />
                      <ChevronUp
                        class="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
                      />
                    </button>

                    <div
                      id="users-accordion-sub-1-collapse-1"
                      class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                      role="region"
                      aria-labelledby="users-accordion-sub-1"
                    >
                      <ul class="pt-1 ps-2 space-y-1">
                        <SidebarItem :item="{ id: 4, name: 'Личное' }" type="workspace" />
                      </ul>
                    </div>
                  </li>

                  <li class="hs-accordion" id="users-accordion-sub-2">
                    <button
                      type="button"
                      class="hs-accordion-toggle w-full text-start flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-200 focus:outline-hidden"
                      aria-expanded="true"
                      aria-controls="users-accordion-sub-2-collapse-1"
                    >
                      Доски
                      <NumberBadge :number="3" />

                      <ChevronDown
                        class="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
                      />
                      <ChevronUp
                        class="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
                      />
                    </button>

                    <div
                      id="users-accordion-sub-2-collapse-1"
                      class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                      role="region"
                      aria-labelledby="users-accordion-sub-2"
                    >
                      <ul class="pt-1 ps-2 space-y-1">
                        <SidebarItem :item="{ id: 5, name: 'Спорт' }" type="board" />
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          <ul class="mt-1 flex flex-col gap-y-1 mb-3">
            <li>
              <button
                type="button"
                class="w-full flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden"
                @click="WORKSPACE_STORE.openSettingsModal()"
              >
                <Settings class="size-4" />
                Настройки
              </button>
            </li>
            <li>
              <button
                type="button"
                class="w-full flex items-center gap-x-2.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden"
              >
                <Trash class="size-4" />

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
          class="hs-dropdown [--strategy:absolute] [--auto-close:true] pt-3 relative w-full inline-flex"
        >
          <button
            id="hs-sidebar-footer"
            type="button"
            class="w-full inline-flex shrink-0 items-center gap-x-2 p-2 text-start text-sm text-gray-800 bg-gray-50 border border-gray-200 shadow-2xs rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-hidden focus:bg-gray-200"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Dropdown"
          >
            <img
              class="shrink-0 size-9 rounded-full"
              src="https://images.unsplash.com/photo-1734122415415-88cb1d7d5dc0?q=80&w=320&h=320&auto=format&fit=facearea&facepad=3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Avatar"
            />
            <div class="flex flex-col truncate">
              <span class="text-sm truncate">Александр Иванов</span>
              <span class="text-xs truncate text-gray-500">alexander.work2020@gmail.com</span>
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
                class="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
                href="#"
              >
                <LogOut class="size-4" />

                Выйти
              </a>
              <a
                class="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
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
</template>
