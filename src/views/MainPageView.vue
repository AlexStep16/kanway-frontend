<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  X,
  Check,
  Annoyed,
  Layers,
  Brain,
  MessageCircleQuestionMark,
  Pencil,
  Map,
  MessageCircleIcon,
  Undo,
} from 'lucide-vue-next'

import AIBubble from '@/components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import UserBubble from '@/components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import Confirmation from '@/components/Workspace/Main/Chat/Bubbles/Confirmation.vue'
import Assistant from '@/components/Workspace/Main/Chat/Bubbles/Assistant.vue'
import AIInput from '@/components/Workspace/Main/Chat/AIInput.vue'
import Task from '@/components/Workspace/Main/Task/Task.vue'
import Status from '@/components/Workspace/Main/Chat/Bubbles/Status.vue'
import AOS from 'aos'
import Blow from '@assets/blow.svg?component'

const activeTab = ref('plan')

const tasks = ref([
  { id: 1, name: 'Провести ревью кода PR #452', is_completed: false, tags: ['работа'] },
  {
    id: 2,
    name: 'Настроить автоматическое развертывание',
    tags: ['работа'],
    color: '#FFEEAA',
    is_completed: false,
  },
  {
    id: 3,
    name: 'Подготовить документацию по новому API',
    color: '#EEAABB',
    due_date: '2025-09-15T14:14:00',
    is_completed: false,
    tags: ['работа'],
  },
  {
    id: 4,
    name: 'Обсудить метрики с командой маркетинга',
    due_date: '2025-09-16T14:14:00',
    is_completed: false,
    tags: ['работа'],
  },
])

const taskColumns = computed(() => {
  const numCols = 2
  const result: any = Array.from({ length: numCols }, () => [])
  tasks.value.forEach((task, index) => {
    result[index % numCols].push(task)
  })
  return result
})

function updateCircle() {
  const circle = document.getElementById('blue-circle')
  const textOverlay = document.getElementById('white-text-overlay')
  if (!circle || !textOverlay) return

  const textRect = textOverlay.getBoundingClientRect()
  const textLeftX = textRect.left

  circle.style.left = `${textLeftX}px`
}

function updateClip() {
  const textOverlay = document.getElementById('white-text-overlay')
  const hOverlay = document.getElementById('white-h-overlay')
  const circle = document.getElementById('blue-circle')

  if (!textOverlay || !circle || !hOverlay) return

  const textRect = textOverlay.getBoundingClientRect()
  const hRect = hOverlay.getBoundingClientRect()
  const circleRect = circle.getBoundingClientRect()

  const circleCenterX = circleRect.left + circleRect.width / 2
  const circleCenterY = circleRect.top + circleRect.height / 2
  const circleRadius = circleRect.width / 2

  const relativeTextX = circleCenterX - textRect.left
  const relativeTextY = circleCenterY - textRect.top

  const relativeHOverlayX = circleCenterX - hRect.left
  const relativeHOverlayY = circleCenterY - hRect.top

  const clipPathHValue = `circle(${circleRadius}px at ${relativeHOverlayX}px ${relativeHOverlayY}px)`
  const clipPathValue = `circle(${circleRadius}px at ${relativeTextX}px ${relativeTextY}px)`

  textOverlay.style.clipPath = clipPathValue
  hOverlay.style.clipPath = clipPathHValue
  ;(textOverlay.style as any).webkitClipPath = clipPathValue
  ;(hOverlay.style as any).webkitClipPath = clipPathHValue
}

onMounted(() => {
  window.HSStaticMethods.autoInit()

  AOS.init()

  updateCircle()
  updateClip()

  window.addEventListener('scroll', updateClip)
  window.addEventListener('scroll', updateCircle)
  window.addEventListener('resize', updateClip)
  window.addEventListener('resize', updateCircle)
})
</script>

<template>
  <div class="flex flex-col min-h-screen w-full bg-white">
    <div class="flex flex-col relative h-full overflow-hidden">
      <header
        id="header"
        class="fixed top-0 left-0 flex border-b border-gray-100 py-2 flex-wrap bg-white md:justify-start md:flex-nowrap z-50 w-full"
      >
        <nav
          class="relative max-w-[95rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 p-4 sm:px-6 lg:px-8"
        >
          <div class="flex justify-between items-center gap-x-1">
            <a
              class="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white"
              href="#"
              aria-label="Brand"
            >
              <svg
                data-v-4753b75b=""
                height="33"
                viewBox="0 0 103 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  data-v-4753b75b=""
                  d="M10.272 8.328H15.84L11.16 13.44L15.96 21H10.536L7.872 16.656L6.216 18.264V21H1.44V3.576H6.216V13.176L10.272 8.328ZM23.7118 8.04C25.6478 8.04 27.2238 8.368 28.4398 9.024C29.6558 9.664 30.2638 10.712 30.2638 12.168V17.112C30.2638 17.384 30.3278 17.608 30.4558 17.784C30.5838 17.96 30.7758 18.048 31.0318 18.048H31.8958V20.808C31.8478 20.84 31.7198 20.896 31.5118 20.976C31.3198 21.04 31.0398 21.104 30.6718 21.168C30.3038 21.248 29.8798 21.288 29.3998 21.288C28.4718 21.288 27.7038 21.152 27.0958 20.88C26.5038 20.592 26.0958 20.2 25.8718 19.704C25.2638 20.184 24.5838 20.568 23.8318 20.856C23.0798 21.144 22.1998 21.288 21.1918 21.288C18.2158 21.288 16.7278 20.104 16.7278 17.736C16.7278 16.504 17.0558 15.568 17.7118 14.928C18.3838 14.272 19.3438 13.824 20.5918 13.584C21.8398 13.344 23.4718 13.224 25.4878 13.224V12.6C25.4878 12.104 25.3118 11.728 24.9598 11.472C24.6238 11.216 24.1838 11.088 23.6398 11.088C23.1438 11.088 22.7118 11.176 22.3438 11.352C21.9918 11.528 21.8158 11.808 21.8158 12.192V12.288H17.1118C17.0958 12.208 17.0878 12.096 17.0878 11.952C17.0878 10.752 17.6558 9.8 18.7918 9.096C19.9438 8.392 21.5838 8.04 23.7118 8.04ZM25.4878 15.48C24.1278 15.48 23.1198 15.632 22.4638 15.936C21.8238 16.224 21.5038 16.616 21.5038 17.112C21.5038 17.912 22.0478 18.312 23.1358 18.312C23.7598 18.312 24.3038 18.144 24.7678 17.808C25.2478 17.472 25.4878 17.056 25.4878 16.56V15.48ZM42.1916 8.04C43.6636 8.04 44.7676 8.448 45.5036 9.264C46.2396 10.08 46.6076 11.256 46.6076 12.792V21H41.8316V13.368C41.8316 12.824 41.6876 12.392 41.3996 12.072C41.1276 11.736 40.7356 11.568 40.2236 11.568C39.6316 11.568 39.1516 11.76 38.7836 12.144C38.4156 12.528 38.2316 13 38.2316 13.56V21H33.4556V8.328H37.3676L37.6796 10.248C38.1756 9.576 38.8236 9.04 39.6236 8.64C40.4396 8.24 41.2956 8.04 42.1916 8.04ZM54.2634 9.504C55.1754 8.528 56.3594 8.04 57.8154 8.04C59.5274 8.04 60.8474 8.6 61.7754 9.72C62.7034 10.824 63.1674 12.464 63.1674 14.64C63.1674 16.832 62.7034 18.488 61.7754 19.608C60.8474 20.728 59.5274 21.288 57.8154 21.288C56.0554 21.288 54.7114 20.592 53.7834 19.2L53.3754 21H49.4874V3.6H54.2634V9.504ZM56.3274 11.568C55.6234 11.568 55.0954 11.824 54.7434 12.336C54.3914 12.832 54.2154 13.48 54.2154 14.28V15.072C54.2154 15.872 54.3914 16.52 54.7434 17.016C55.0954 17.512 55.6234 17.76 56.3274 17.76C57.7034 17.76 58.3914 16.944 58.3914 15.312V14.04C58.3914 12.392 57.7034 11.568 56.3274 11.568ZM71.7353 8.04C73.6713 8.04 75.2473 8.368 76.4633 9.024C77.6793 9.664 78.2873 10.712 78.2873 12.168V17.112C78.2873 17.384 78.3513 17.608 78.4793 17.784C78.6073 17.96 78.7993 18.048 79.0553 18.048H79.9193V20.808C79.8713 20.84 79.7433 20.896 79.5353 20.976C79.3433 21.04 79.0633 21.104 78.6953 21.168C78.3273 21.248 77.9033 21.288 77.4233 21.288C76.4953 21.288 75.7273 21.152 75.1193 20.88C74.5273 20.592 74.1193 20.2 73.8953 19.704C73.2873 20.184 72.6073 20.568 71.8553 20.856C71.1033 21.144 70.2233 21.288 69.2153 21.288C66.2393 21.288 64.7513 20.104 64.7513 17.736C64.7513 16.504 65.0793 15.568 65.7353 14.928C66.4073 14.272 67.3673 13.824 68.6153 13.584C69.8633 13.344 71.4953 13.224 73.5113 13.224V12.6C73.5113 12.104 73.3353 11.728 72.9833 11.472C72.6473 11.216 72.2073 11.088 71.6633 11.088C71.1673 11.088 70.7352 11.176 70.3672 11.352C70.0153 11.528 69.8393 11.808 69.8393 12.192V12.288H65.1353C65.1193 12.208 65.1113 12.096 65.1113 11.952C65.1113 10.752 65.6793 9.8 66.8153 9.096C67.9673 8.392 69.6073 8.04 71.7353 8.04ZM73.5113 15.48C72.1513 15.48 71.1433 15.632 70.4873 15.936C69.8473 16.224 69.5273 16.616 69.5273 17.112C69.5273 17.912 70.0713 18.312 71.1593 18.312C71.7833 18.312 72.3273 18.144 72.7913 17.808C73.2713 17.472 73.5113 17.056 73.5113 16.56V15.48ZM89.1831 8.016C89.5511 8.016 89.8791 8.064 90.1671 8.16C90.4551 8.24 90.5991 8.288 90.5991 8.304V12.312H89.0631C88.0711 12.312 87.3511 12.568 86.9031 13.08C86.4711 13.592 86.2551 14.352 86.2551 15.36V21H81.4791V8.328H85.3911L85.7031 10.248C85.9911 9.512 86.4471 8.96 87.0711 8.592C87.6951 8.208 88.3991 8.016 89.1831 8.016Z"
                  fill="#3B82F6"
                ></path>
                <path
                  data-v-4753b75b=""
                  d="M102.861 5.1097L100.613 4.38709L99.8905 2.13884C99.8637 2.05604 99.7869 2.00004 99.6999 2.00004C99.6129 2.00004 99.5361 2.05604 99.5095 2.13884L98.7869 4.38709L96.5389 5.1097C96.4559 5.1363 96.3999 5.2131 96.3999 5.30011C96.3999 5.38711 96.4559 5.46391 96.5387 5.49051L98.7867 6.21312L99.5093 8.46137C99.5361 8.54417 99.6129 8.60017 99.6999 8.60017C99.7869 8.60017 99.8637 8.54417 99.8903 8.46137L100.613 6.21312L102.861 5.49051C102.944 5.46391 103 5.38711 103 5.30011C103 5.2131 102.944 5.1363 102.861 5.1097ZM93.3366 2.58985L94.8918 3.10826L95.4102 4.66349C95.4374 4.74509 95.5137 4.8001 95.5999 4.8001C95.6861 4.8001 95.7625 4.74509 95.7895 4.66329L96.3079 3.10806L97.8631 2.58965C97.9449 2.56265 97.9999 2.48625 97.9999 2.40005C97.9999 2.31385 97.9449 2.23744 97.8631 2.21024L96.3079 1.69183L95.7895 0.136603C95.7625 0.0550011 95.6861 0 95.5999 0C95.5137 0 95.4372 0.0550011 95.4102 0.136803L94.8918 1.69183L93.3366 2.21024C93.2548 2.23764 93.1998 2.31385 93.1998 2.40005C93.1998 2.48625 93.2548 2.56265 93.3366 2.58985ZM96.4631 7.61015L95.3578 7.24174L94.9894 6.13692C94.9624 6.05532 94.886 6.00012 94.7998 6.00012C94.7136 6.00012 94.6372 6.05512 94.6102 6.13692L94.2418 7.24174L93.1368 7.61015C93.0552 7.63735 93 7.71375 93 7.79996C93 7.88616 93.055 7.96256 93.1368 7.98976L94.242 8.35817L94.6102 9.46299C94.6374 9.54439 94.7136 9.59959 94.7998 9.59959C94.886 9.59959 94.9624 9.54459 94.9894 9.46279L95.3578 8.35797L96.4631 7.98956C96.5449 7.96236 96.5999 7.88596 96.5999 7.79996C96.5999 7.71395 96.5449 7.63735 96.4631 7.61015Z"
                  fill="#3B82F6"
                ></path>
              </svg>
            </a>

            <!-- Collapse Button -->
            <button
              type="button"
              class="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center font-medium text-sm rounded-lg border transition-colors duration-200 border-gray-200 text-gray-800 hover:bg-blue-100 hover:text-blue-500 focus:outline-hidden focus:text-blue-500 focus:bg-blue-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              id="hs-header-base-collapse"
              aria-expanded="false"
              aria-controls="hs-header-base"
              aria-label="Toggle navigation"
              data-hs-collapse="#hs-header-base"
            >
              <svg
                class="hs-collapse-open:hidden size-4"
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
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                class="hs-collapse-open:block shrink-0 hidden size-4"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span class="sr-only">Toggle navigation</span>
            </button>
            <!-- End Collapse Button -->
          </div>

          <!-- Collapse -->
          <div
            id="hs-header-base"
            class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block"
            aria-labelledby="hs-header-base-collapse"
          >
            <div
              class="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
            >
              <div class="py-2 md:py-0 flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
                <div class="grow">
                  <div
                    class="flex flex-col md:flex-row md:justify-end md:items-center gap-0.5 md:gap-1"
                  >
                    <a
                      class="p-2 flex items-center text-sm bg-blue-100 text-blue-500 hover:bg-blue-100 hover:text-blue-500 transition-colors duration-200 rounded-lg focus:outline-hidden focus:text-blue-500 focus:bg-blue-100 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      href="#"
                      aria-current="page"
                    >
                      <svg
                        class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path
                          d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                        />
                      </svg>
                      Возможности
                    </a>

                    <a
                      class="p-2 flex items-center text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-500 transition-colors duration-200 rounded-lg focus:outline-hidden focus:text-blue-500 focus:bg-blue-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      href="#"
                    >
                      <svg
                        class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Контроль
                    </a>

                    <a
                      class="p-2 flex items-center text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-500 transition-colors duration-200 rounded-lg focus:outline-hidden focus:text-blue-500 focus:bg-blue-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      href="#"
                    >
                      <svg
                        class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path d="M12 12h.01" />
                        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                        <rect width="20" height="14" x="2" y="6" rx="2" />
                      </svg>
                      Тарифы
                    </a>

                    <a
                      class="p-2 flex items-center text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-500 transition-colors duration-200 rounded-lg focus:outline-hidden focus:text-blue-500 focus:bg-blue-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      href="#"
                    >
                      <svg
                        class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path
                          d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"
                        />
                        <path d="M18 14h-8" />
                        <path d="M15 18h-5" />
                        <path d="M10 6h8v4h-8V6Z" />
                      </svg>
                      Вопросы
                    </a>
                  </div>
                </div>

                <div class="my-2 md:my-0 md:mx-2">
                  <div
                    class="w-full h-px md:w-px md:h-4 bg-gray-100 md:bg-gray-300 dark:bg-neutral-700"
                  ></div>
                </div>

                <!-- Button Group -->
                <div class="flex flex-wrap items-center gap-x-1.5">
                  <a
                    class="py-[7px] px-2.5 inline-flex items-center font-medium text-sm text-gray-800 transition-colors duration-200 hover:text-blue-500 focus:outline-hidden focus:text-blue-500"
                    href="sign-in"
                  >
                    Войти
                  </a>
                  <a
                    class="py-2.5 px-3.5 inline-flex items-center font-medium text-sm rounded-full bg-blue-500 text-white hover:opacity-90 transition-opacity duration-200 focus:outline-hidden focus:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:bg-blue-600"
                    href="sign-up"
                  >
                    Начать бесплатно
                  </a>
                </div>
                <!-- End Button Group -->
              </div>
            </div>
          </div>
          <!-- End Collapse -->
        </nav>
      </header>
      <!-- ========== END HEADER ========== -->

      <!-- Hero -->
      <div class="relative pt-[84px] z-3 overflow-hidden">
        <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <!-- Announcement Banner -->
          <div class="flex justify-center">
            <a
              class="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-500 p-1 px-3 rounded-full transition hover:border-gray-300 focus:outline-hidden focus:border-gray-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-600 dark:focus:border-neutral-600"
              href="#"
            >
              Первый в России ИИ-ассистент для управления задачами
            </a>
          </div>
          <!-- End Announcement Banner -->

          <!-- Title -->
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
            class="max-w-2xl text-center mx-auto"
          >
            <h1
              class="block font-bold text-gray-800 text-3xl md:text-4xl lg:text-5xl dark:text-neutral-200"
            >
              Забудьте о кликах. Мы дали вашим задачам
              <span
                class="bg-clip-text bg-linear-to-tl from-blue-600 to-violet-600 text-transparent"
                >интеллект.</span
              >
            </h1>
          </div>
          <!-- End Title -->

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="1000"
            data-aos-once="true"
            class="mt-5 max-w-3xl text-center mx-auto"
          >
            <p class="text-lg text-gray-600 dark:text-neutral-400">
              Управляйте задачами без единого клика. Система, которая понимает ваши намерения и
              мгновенно выполняет комплексные команды.
            </p>
          </div>

          <!-- Buttons -->
          <div
            data-aos="fade-up"
            data-aos-delay="150"
            data-aos-duration="1000"
            data-aos-once="true"
            class="mt-8 gap-3 flex justify-center"
          >
            <a
              class="inline-flex justify-center items-center gap-x-3 text-center bg-linear-to-tl from-blue-500 to-violet-500 hover:from-violet-500 hover:to-blue-500 border border-transparent text-white text-sm font-medium rounded-md focus:outline-hidden focus:from-violet-600 focus:to-blue-600 py-3 px-4"
              href="#"
            >
              Начать бесплатно
              <svg
                class="shrink-0 size-4"
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <!-- End Hero -->

      <!-- Photo -->
      <div
        data-aos="zoom-out"
        data-aos-duration="1400"
        class="my-10 mx-auto max-w-4xl z-1 p-8 bg-white/30 rounded-2xl relative"
      >
        <div class="border relative z-2 border-gray-100 rounded-2xl overflow-hidden">
          <img
            class="w-full h-auto rounded-lg shadow-lg"
            src="@/assets/chat.png"
            alt="Hero Image"
          />
        </div>
        <div class="size-full absolute z-1 -top-60 left-0 opacity-60">
          <Blow class="scale-[2.5]" />
        </div>
      </div>
      <!-- End Photo -->

      <div
        class="w-full min-h-260 absolute z-0 bottom-0 bg-[linear-gradient(180deg,rgba(122,90,248,0)0%,#5a8bf8_100%)]"
      ></div>
    </div>

    <!-- Problem Section -->
    <section
      class="relative z-1 overflow-hidden bg-[linear-gradient(89deg,var(--color-gray-300),var(--color-gray-100),#ffffff)]"
    >
      <div
        class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10"
        data-aos="fade"
        data-aos-duration="1000"
        data-aos-once="true"
      >
        <!-- Title -->
        <div class="max-w-2xl text-center mx-auto relative z-10">
          <!-- Контейнер для двух слоев текста -->
          <div class="relative inline-block">
            <!-- 1. НИЖНИЙ СЛОЙ: Серый текст (Виден по умолчанию) -->
            <h1
              class="block font-bold text-gray-800 text-2xl md:text-3xl lg:text-4xl whitespace-nowrap opacity-100"
            >
              Устали от рутины?
            </h1>

            <!-- 2. ВЕРХНИЙ СЛОЙ: Белый текст (Нам нужно, чтобы его обрезал круг) -->
            <h1
              id="white-h-overlay"
              class="block font-bold text-white text-2xl md:text-3xl lg:text-4xl whitespace-nowrap absolute top-0 left-0"
            >
              Устали от рутины?
            </h1>
          </div>
        </div>
        <!-- End Title -->

        <div class="mt-4 max-w-2xl text-center mx-auto">
          <div class="relative inline-block">
            <p class="text-lg text-gray-600">
              Средний таск-менеджер требует ~20 кликов, чтобы перенести 20 задач.<br />
              Мы сокращаем это до одной фразы.
            </p>
            <p id="white-text-overlay" class="text-lg text-white absolute top-0 left-0">
              Средний таск-менеджер требует ~20 кликов, чтобы перенести 20 задач.<br />
              Мы сокращаем это до одной фразы.
            </p>
          </div>
        </div>
      </div>

      <div id="problem-solution" class="pb-24 pt-8">
        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <!-- ===== БЛОК 1: ПРОБЛЕМА (До) ===== -->
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-once="true"
              class="flex flex-col gap-y-3 bg-white shadow-[0px_5px_7px_0px_#80808026] rounded-xl p-6"
            >
              <div class="flex items-center">
                <Annoyed class="size-7 text-red-500 mr-2" />
                <h3 class="text-xl font-semibold text-gray-700">Обычный таск-менеджер</h3>
              </div>

              <p class="text-gray-500 leading-relaxed grow-1">
                Ваш текущий таск-менеджер — это просто цифровой список. Чтобы выполнить комплексное
                действие, например, перенести 20 просроченных задач, нужно выполнить ~20
                утомительных кликов.
              </p>

              <ul class="space-y-2">
                <li class="flex items-center gap-x-2">
                  <span class="text-red-500 font-bold"><X class="size-6" /></span>
                  <span class="text-gray-700 font-medium"
                    >Долгое перетаскивание задач по доскам.</span
                  >
                </li>
                <li class="flex items-center gap-x-2">
                  <span class="text-red-500 font-bold"><X class="size-6" /></span>
                  <span class="text-gray-700 font-medium">Сложная настройка фильтров И/ИЛИ.</span>
                </li>
                <li class="flex items-center gap-x-2">
                  <span class="text-red-500 font-bold"><X class="size-6" /></span>
                  <span class="text-gray-700 font-medium">
                    Риск ошибок из-за человеческого фактора.
                  </span>
                </li>
              </ul>
            </div>

            <!-- ===== БЛОК 2: РЕШЕНИЕ (После) ===== -->
            <div
              data-aos="fade-left"
              data-aos-delay="500"
              data-aos-duration="1000"
              data-aos-once="true"
              class="flex flex-col gap-y-3 bg-white shadow-[0px_0px_8px_4px_#ffffff2b] rounded-xl p-6"
            >
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0,0,256,256"
                  class="size-7 text-blue-500 mr-2"
                >
                  <g
                    fill="#3b82f6"
                    fill-rule="nonzero"
                    stroke="none"
                    stroke-width="1"
                    stroke-linecap="butt"
                    stroke-linejoin="miter"
                    stroke-miterlimit="10"
                    stroke-dasharray=""
                    stroke-dashoffset="0"
                    font-family="none"
                    font-weight="none"
                    font-size="none"
                    text-anchor="none"
                    style="mix-blend-mode: normal"
                  >
                    <g transform="scale(5.12,5.12)">
                      <path
                        d="M49.306,26.548l-11.24,-3.613l-3.613,-11.241c-0.134,-0.414 -0.518,-0.694 -0.953,-0.694c-0.435,0 -0.819,0.28 -0.952,0.694l-3.613,11.241l-11.24,3.613c-0.415,0.133 -0.695,0.517 -0.695,0.952c0,0.435 0.28,0.819 0.694,0.952l11.24,3.613l3.613,11.241c0.134,0.414 0.518,0.694 0.953,0.694c0.435,0 0.819,-0.28 0.952,-0.694l3.613,-11.241l11.24,-3.613c0.415,-0.133 0.695,-0.517 0.695,-0.952c0,-0.435 -0.28,-0.819 -0.694,-0.952zM1.684,13.949l7.776,2.592l2.592,7.776c0.136,0.408 0.517,0.683 0.948,0.683c0.431,0 0.813,-0.275 0.948,-0.684l2.592,-7.776l7.776,-2.592c0.409,-0.135 0.684,-0.517 0.684,-0.948c0,-0.431 -0.275,-0.813 -0.684,-0.949l-7.776,-2.592l-2.592,-7.776c-0.135,-0.408 -0.517,-0.683 -0.948,-0.683c-0.431,0 -0.813,0.275 -0.948,0.684l-2.592,7.775l-7.776,2.592c-0.409,0.137 -0.684,0.518 -0.684,0.949c0,0.431 0.275,0.813 0.684,0.949zM17.316,39.05l-5.526,-1.842l-1.842,-5.524c-0.135,-0.408 -0.517,-0.684 -0.948,-0.684c-0.431,0 -0.813,0.275 -0.948,0.684l-1.842,5.524l-5.525,1.842c-0.408,0.136 -0.684,0.518 -0.684,0.949c0,0.431 0.275,0.813 0.684,0.949l5.526,1.842l1.841,5.524c0.136,0.407 0.517,0.683 0.948,0.683c0.431,0 0.813,-0.275 0.948,-0.684l1.842,-5.524l5.526,-1.842c0.409,-0.136 0.684,-0.518 0.684,-0.948c0,-0.43 -0.275,-0.813 -0.684,-0.949z"
                      ></path>
                    </g>
                  </g>
                </svg>
                <h3 class="text-xl font-semibold text-blue-500">Kanbar</h3>
              </div>

              <p class="text-gray-500 leading-relaxed grow-1">
                Просто скажите, что вам нужно. Наш AI-агент понимает контекст и мгновенно выполняет
                многошаговые команды, освобождая ваше время для самого важного. Это очень просто!
              </p>

              <ul class="space-y-2">
                <li class="flex items-center gap-x-2">
                  <span class="text-green-500 font-bold"><Check class="size-6" /></span>
                  <span class="text-gray-700 font-medium">
                    "<b>Перенеси</b> всё просроченное в Срочное."
                  </span>
                </li>
                <li class="flex items-center gap-x-2">
                  <span class="text-green-500 font-bold"><Check class="size-6" /></span>
                  <span class="text-gray-700 font-medium">
                    "<b>Покажи</b> задачи с #баг ИЛИ от Маши."
                  </span>
                </li>
                <li class="flex items-center gap-x-2">
                  <span class="text-green-500 font-bold"><Check class="size-6" /></span>
                  <span class="text-gray-700 font-medium">
                    Точное выполнение сложных команд за секунды.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        id="blue-circle"
        class="size-450 absolute -right-120 -top-10 bg-[linear-gradient(0deg,rgb(238,124,255)_0%,_#5a8bf8_100%)] rounded-full -z-1"
      ></div>
    </section>

    <section class="relative z-1 overflow-hidden bg-white">
      <div
        data-aos="fade-down"
        data-aos-duration="1000"
        data-aos-anchor=".command-text"
        data-aos-once="true"
        class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10"
      >
        <!-- Title -->
        <div class="max-w-2xl text-center mx-auto">
          <h1 class="block font-bold text-gray-800 text-2xl md:text-3xl lg:text-4xl">
            Это не просто чат. Это ваш командный центр.
          </h1>
        </div>
        <!-- End Title -->

        <div class="mt-4 max-w-2xl text-center mx-auto command-text">
          <p class="text-lg text-gray-600 dark:text-neutral-400">
            Наш AI-агент не просто создает задачи — он понимает многошаговые команды, уточняет
            детали и работает с целыми проектами одновременно.
          </p>
        </div>
      </div>

      <div
        class="max-w-[85rem] px-4 pt-10 pb-24 sm:px-6 lg:px-8 lg:pt-14 lg:pb-24 mx-auto icon-grid-block"
      >
        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Icon Block -->
          <div
            data-aos="fade"
            data-aos-delay="300"
            data-aos-duration="1000"
            data-aos-anchor=".icon-grid-block"
            data-aos-once="true"
            class="h-50 sm:h-70 flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5 dark:border-neutral-700"
          >
            <!-- Icon -->
            <div
              class="flex justify-center items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
            >
              <Layers class="size-6 text-white" />
            </div>
            <!-- End Icon -->

            <div class="mt-3">
              <h3 class="text-sm sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
                Пакетные действия
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Управляйте десятками задач одной командой.<br /><br />
                <span class="text-gray-800">
                  "<b>Архивируй</b> все выполненные задачи в проекте Релиз Q3."
                </span>
              </p>
            </div>
          </div>
          <!-- End Icon Block -->

          <!-- Icon Block -->
          <div
            data-aos="fade"
            data-aos-delay="600"
            data-aos-duration="1000"
            data-aos-anchor=".icon-grid-block"
            data-aos-once="true"
            class="h-50 sm:h-70 flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5 dark:border-neutral-700"
          >
            <!-- Icon -->
            <div
              class="flex justify-center items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
            >
              <Brain class="size-6 text-white" />
            </div>
            <!-- End Icon -->

            <div class="mt-3">
              <h3 class="text-sm sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
                Сложные фильтры без усилий
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Используйте логические операторы "И"/"ИЛИ" на естественном языке, не задумываясь о
                синтаксисе.<br /><br />
                <span class="text-gray-800">
                  "<b>Покажи</b> задачи на завтра, которые <b>ТАКЖЕ</b> имеют тег #срочно."
                </span>
              </p>
            </div>
          </div>
          <!-- End Icon Block -->

          <!-- Icon Block -->
          <div
            data-aos="fade"
            data-aos-delay="900"
            data-aos-duration="1000"
            data-aos-anchor=".icon-grid-block"
            data-aos-once="true"
            class="h-50 sm:h-70 flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5 dark:border-neutral-700"
          >
            <!-- Icon -->
            <div
              class="flex justify-center items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
            >
              <MessageCircleQuestionMark class="size-6 text-white" />
            </div>
            <!-- End Icon -->

            <div class="mt-3">
              <h3 class="text-sm sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
                Умное Уточнение
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Если команда неоднозначна, ассистент не ошибется, а задаст уточняющий вопрос.<br /><br />
                <span class="text-gray-800">
                  — "<b>Удали</b> задачу 'Отчет'."<br />
                  — "<b>Найдено</b> две: 'Недельный отчет' и 'Годовой отчет'. Какую удалить?"
                </span>
              </p>
            </div>
          </div>
          <!-- End Icon Block -->

          <!-- Icon Block -->
          <div
            data-aos="fade"
            data-aos-delay="1200"
            data-aos-duration="1000"
            data-aos-anchor=".icon-grid-block"
            data-aos-once="true"
            class="h-50 sm:h-70 flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5 dark:border-neutral-700"
          >
            <!-- Icon -->
            <div
              class="flex justify-center items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
            >
              <Pencil class="size-6 text-white" />
            </div>
            <!-- End Icon -->

            <div class="mt-3">
              <h3 class="text-sm sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
                Точное Редактирование
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Не просто изменяйте, а добавляйте, удаляйте или заменяйте части текста в названиях
                задач.<br /><br />
                <span class="text-gray-800">
                  "В начале всех просроченных задач <b>добавь</b> [ПРОСРОЧЕНО]: ."
                </span>
              </p>
            </div>
          </div>
          <!-- End Icon Block -->

          <!-- Icon Block -->
          <div
            data-aos="fade"
            data-aos-delay="1500"
            data-aos-duration="1000"
            data-aos-anchor=".icon-grid-block"
            data-aos-once="true"
            class="h-50 sm:h-70 flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5 dark:border-neutral-700"
          >
            <!-- Icon -->
            <div
              class="flex justify-center items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
            >
              <Map class="size-6 text-white" />
            </div>
            <!-- End Icon -->

            <div class="mt-3">
              <h3 class="text-sm sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
                Понимание Контекста
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Ассистент знает, на какой доске вы находитесь. Не нужно каждый раз уточнять
                проект.<br /><br />
                <span class="text-gray-800">
                  (Находясь на доске 'Маркетинг') > "<b>Создай</b> задачу 'Подготовить
                  презентацию'."
                </span>
              </p>
            </div>
          </div>
          <!-- End Icon Block -->

          <!-- Icon Block -->
          <div
            data-aos="fade"
            data-aos-delay="1800"
            data-aos-duration="1000"
            data-aos-anchor=".icon-grid-block"
            data-aos-once="true"
            class="h-50 sm:h-70 flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5 dark:border-neutral-700"
          >
            <!-- Icon -->
            <div
              class="flex justify-center items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
            >
              <MessageCircleIcon class="size-6 text-white" />
            </div>
            <!-- End Icon -->

            <div class="mt-3">
              <h3 class="text-sm sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
                Память Диалога
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Ссылайтесь на предыдущие результаты. AI помнит, о чем вы говорили несколько шагов
                назад.<br /><br />
                <span class="text-gray-800">
                  — "<b>Найди</b> все задачи с тегом #баг."<br />
                  — "<b>Найдено</b> 5 задач."<br />
                  — "Отлично, <b>перемести их</b> в архив."
                </span>
              </p>
            </div>
          </div>
          <!-- End Icon Block -->
        </div>
        <!-- End Grid -->
      </div>
    </section>

    <section class="relative z-1 overflow-hidden bg-gray-900 pb-24">
      <div
        data-aos="fade-down"
        data-aos-duration="1000"
        data-aos-once="true"
        class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10"
      >
        <!-- Title -->
        <div class="max-w-2xl text-center mx-auto">
          <h1 class="block font-bold text-gray-100 text-2xl md:text-3xl lg:text-4xl">
            Вы всегда за рулем.
          </h1>
        </div>
        <!-- End Title -->

        <div class="mt-4 max-w-2xl text-center mx-auto">
          <p class="text-lg text-gray-300 dark:text-neutral-400">
            Мощный AI требует полного контроля. Мы создали систему, в которой вы всегда имеете
            последнее слово. Никаких сюрпризов.
          </p>
        </div>
      </div>

      <div
        data-aos="fade"
        data-aos-delay="300"
        data-aos-duration="1000"
        data-aos-once="true"
        class="flex flex-wrap sm:justify-center mx-auto gap-2 p-1 w-full mb-8 dark:bg-white/[0.05] bg-white/10 rounded-2xl lg:rounded-full max-w-fit"
      >
        <button
          @click="activeTab = 'plan'"
          :class="{
            'bg-white dark:text-white/90 dark:bg-white/10 text-gray-800': activeTab === 'plan',
            'text-gray-400 dark:text-gray-400 bg-transparent': activeTab !== 'plan',
          }"
          class="flex items-center h-12 gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-full"
        >
          <Map class="size-5" />
          Планирование
        </button>

        <button
          @click="activeTab = 'confirmation'"
          :class="{
            'bg-white dark:text-white/90 dark:bg-white/10 text-gray-800':
              activeTab === 'confirmation',
            'text-gray-400 dark:text-gray-400 bg-transparent': activeTab !== 'confirmation',
          }"
          class="flex items-center h-12 gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-full"
        >
          <Check class="size-5" />
          Подтверждение
        </button>

        <button
          @click="activeTab = 'cancellation'"
          :class="{
            'bg-white dark:text-white/90 dark:bg-white/10 text-gray-800':
              activeTab === 'cancellation',
            'text-gray-400 dark:text-gray-400 bg-transparent': activeTab !== 'cancellation',
          }"
          class="flex items-center h-12 gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-full"
        >
          <Undo class="size-5" />
          Отмена
        </button>
      </div>

      <!-- Tab Content -->
      <div
        data-aos="fade"
        data-aos-duration="1000"
        data-aos-once="true"
        class="p-5 bg-white/10 mx-auto max-w-[45rem] rounded-2xl"
      >
        <div class="rounded-2xl bg-white p-4">
          <Transition name="fade" mode="out-in">
            <div
              class="flex flex-col grow-1 gap-2 h-160 overflow-y-auto py-2 px-1"
              v-if="activeTab === 'plan'"
            >
              <UserBubble
                text="Поменяй цвет всех задач с #работа на синий и перенеси их в категорию 'Срочное'."
              />

              <AIBubble date="18 ноября в 15:00">
                <Confirmation text="Следующим задачам будут присвоены значения:" />

                <div class="flex gap-2 mt-3">
                  <div
                    v-for="(columnTasks, colIndex) in taskColumns"
                    :key="colIndex"
                    class="flex flex-col gap-2"
                  >
                    <Task
                      v-for="task in columnTasks"
                      :key="task.id"
                      :task="task"
                      :hasBorder="true"
                      :hasCheckbox="true"
                      :isEditable="true"
                      :showInfo="true"
                      taskClasses="self-start"
                    ></Task>
                  </div>
                </div>

                <div class="flex gap-x-2 max-w-lg mt-3 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    class="text-xs rounded-md text-white py-1.5 px-2.5 bg-blue-500 hover:opacity-90 transition-opacity duration-100"
                  >
                    Подтвердить
                  </button>

                  <button
                    type="button"
                    class="text-xs rounded-md text-red-500 py-1.5 px-2.5 bg-red-100 hover:bg-red-200 transition-colors duration-100"
                  >
                    Отклонить
                  </button>
                </div>
              </AIBubble>

              <div class="grow-1"></div>

              <!-- Footer -->
              <AIInput :no-input-margin="true" />
            </div>

            <div
              class="flex flex-col grow-1 gap-2 h-160 overflow-y-auto py-2 px-1"
              v-else-if="activeTab === 'confirmation'"
            >
              <UserBubble
                text="Поменяй цвет всех задач с #работа на синий и перенеси их в категорию 'Срочное'."
              />

              <AIBubble date="18 ноября в 15:00">
                <Status currentToolStatus="Вношу изменения..." />
              </AIBubble>

              <AIBubble
                date="18 ноября в 15:00"
                :fastQuestions="['Отмени', 'Удали эти задачи', 'Перенеси задачи на завтра']"
              >
                <Assistant
                  text="Я успешно обновил задачи. Если тебе нужно что-то еще, просто скажи!"
                />
              </AIBubble>

              <div class="grow-1"></div>

              <!-- Footer -->
              <AIInput :no-input-margin="true" />
            </div>

            <div
              class="flex flex-col grow-1 gap-2 h-160 overflow-y-auto py-2 px-1"
              v-else-if="activeTab === 'cancellation'"
            >
              <UserBubble
                text="Поменяй цвет всех задач с #работа на синий и перенеси их в категорию 'Срочное'."
              />

              <AIBubble date="18 ноября в 15:00">
                <Assistant
                  text="Я успешно обновил задачи. Если тебе нужно что-то еще, просто скажи!"
                />
              </AIBubble>

              <UserBubble text="Я передумал, верни всё как было." />

              <AIBubble date="18 ноября в 15:00">
                <Status currentToolStatus="Отмена изменений..." />
              </AIBubble>

              <AIBubble date="18 ноября в 15:00">
                <Assistant text="Изменения отменены. Я вернул задачам исходный цвет и категорию!" />
              </AIBubble>

              <div class="grow-1"></div>

              <!-- Footer -->
              <AIInput :no-input-margin="true" />
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <section class="relative z-1 overflow-hidden bg-white">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <!-- Title -->
        <div
          data-aos="fade-down"
          data-aos-duration="1000"
          data-aos-once="true"
          class="flex flex-col gap-y-4"
        >
          <div class="max-w-2xl text-center mx-auto">
            <h1 class="block font-bold text-gray-800 text-2xl md:text-3xl lg:text-4xl">
              Выберите свой план.
            </h1>
          </div>
          <!-- End Title -->

          <div class="max-w-2xl text-center mx-auto">
            <p class="text-lg text-gray-600 dark:text-neutral-400">
              Начните бесплатно. Перейдите на Премиум, когда будете готовы к большему.
            </p>
          </div>
        </div>
        <!-- Grid -->
        <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">
          <!-- Card -->
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-once="true"
            class="flex flex-col border border-gray-200 text-center rounded-xl p-8 dark:border-neutral-800"
          >
            <h4 class="font-medium text-lg text-gray-800 dark:text-neutral-200">Базовый</h4>
            <span class="mt-7 font-bold text-5xl text-gray-800 dark:text-neutral-200">₽0</span>
            <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500">
              Для знакомства с ИИ-ассистентом
            </p>

            <ul class="mt-7 space-y-2.5 text-sm">
              <li class="flex gap-x-2">
                <svg
                  class="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span class="text-gray-800 dark:text-neutral-400"> 1 пространство </span>
              </li>

              <li class="flex gap-x-2">
                <svg
                  class="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span class="text-gray-800 dark:text-neutral-400"> 5 досок </span>
              </li>

              <li class="flex gap-x-2">
                <svg
                  class="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span class="text-gray-800 dark:text-neutral-400"> 20 сообщений в месяц </span>
              </li>
            </ul>

            <a
              class="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              href="#"
            >
              Регистрация
            </a>
          </div>
          <!-- End Card -->

          <!-- Card -->
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
            class="flex flex-col border-2 border-blue-600 text-center shadow-xl rounded-xl p-8 dark:border-blue-700"
          >
            <p class="mb-3">
              <span
                class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs uppercase font-semibold bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white"
                >Рекомендуем</span
              >
            </p>
            <h4 class="font-medium text-lg text-gray-800 dark:text-neutral-200">Премиум</h4>
            <span class="mt-7 font-bold text-5xl text-gray-800 dark:text-neutral-200">₽599</span>
            <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500">
              Для ежедневной продуктивной работы
            </p>

            <ul class="mt-7 space-y-2.5 text-sm">
              <li class="flex gap-x-2">
                <svg
                  class="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span class="text-gray-800 dark:text-neutral-400"> Неограниченно пространств </span>
              </li>

              <li class="flex gap-x-2">
                <svg
                  class="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span class="text-gray-800 dark:text-neutral-400"> Неограниченно досок </span>
              </li>

              <li class="flex gap-x-2">
                <svg
                  class="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span class="text-gray-800 dark:text-neutral-400"> 300 сообщений в месяц </span>
              </li>
            </ul>

            <a
              class="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              href="#"
            >
              Регистрация
            </a>
          </div>
          <!-- End Card -->

          <!-- Card -->
          <div
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-once="true"
            class="flex flex-col border border-gray-200 text-center rounded-xl p-8 dark:border-neutral-800"
          >
            <h4 class="font-medium text-lg text-gray-800 dark:text-neutral-200">Бизнес</h4>
            <span class="mt-7 font-bold text-5xl text-gray-800 dark:text-neutral-200">₽999</span>
            <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500">
              Для тех, кто хотят получить максимум от Kanbar
            </p>

            <ul class="mt-7 space-y-2.5 text-sm">
              <li class="flex gap-x-2">
                <svg
                  class="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span class="text-gray-800 dark:text-neutral-400"> Неограниченно пространств </span>
              </li>

              <li class="flex gap-x-2">
                <svg
                  class="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span class="text-gray-800 dark:text-neutral-400"> Неограниченно досок </span>
              </li>

              <li class="flex gap-x-2">
                <svg
                  class="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500"
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span class="text-gray-800 dark:text-neutral-400"> Неограниченно сообщений </span>
              </li>
            </ul>

            <a
              class="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              href="#"
            >
              Регистрация
            </a>
          </div>
          <!-- End Card -->
        </div>
        <!-- End Grid -->
      </div>
    </section>

    <section class="relative z-1 overflow-hidden bg-gray-50">
      <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <!-- Title -->
        <div
          data-aos="fade"
          data-aos-duration="1000"
          data-aos-once="true"
          class="max-w-2xl mx-auto text-center mb-10 lg:mb-14"
        >
          <h2 class="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
            Остались вопросы? У нас есть ответы.
          </h2>
          <p class="mt-1 text-gray-600 dark:text-neutral-400">
            Ответы на самые часто задаваемые вопросы.
          </p>
        </div>
        <!-- End Title -->

        <div class="max-w-2xl mx-auto">
          <!-- Accordion -->
          <div class="hs-accordion-group faq-group">
            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-once="true"
              class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6 dark:hs-accordion-active:bg-white/10 active"
              id="hs-basic-with-title-and-arrow-stretched-heading-one"
            >
              <button
                class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
                aria-expanded="true"
                aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-one"
              >
                Как именно работает AI? Это просто чат-бот?
                <svg
                  class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <svg
                  class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
              <div
                id="hs-basic-with-title-and-arrow-stretched-collapse-one"
                class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                role="region"
                aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-one"
              >
                <p class="text-gray-800 dark:text-neutral-200">
                  Нет, это гораздо больше. Наш AI-ассистент работает как настоящий помощник: он
                  анализирует вашу команду, составляет пошаговый план действий (например, "найти
                  задачи" -> "изменить цвет" -> "переместить"), а затем выполняет его. Он понимает
                  контекст вашей работы, помнит предыдущие сообщения и даже задает уточняющие
                  вопросы, если команда неоднозначна.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-anchor=".faq-group"
              data-aos-duration="1000"
              data-aos-once="true"
              class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6 dark:hs-accordion-active:bg-white/10"
              id="hs-basic-with-title-and-arrow-stretched-heading-two"
            >
              <button
                class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
                aria-expanded="false"
                aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-two"
              >
                Мои задачи и данные в безопасности? Вы отправляете их в сторонние сервисы?
                <svg
                  class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <svg
                  class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
              <div
                id="hs-basic-with-title-and-arrow-stretched-collapse-two"
                class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                role="region"
                aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-two"
              >
                <p class="text-gray-800 dark:text-neutral-200">
                  Конфиденциальность — наш главный приоритет. Мы используем передовые LLM-модели
                  через защищенные API, но мы НЕ используем ваши данные для обучения моделей. Ваша
                  информация обрабатывается для выполнения команды и ни для чего больше. Все данные
                  хранятся в зашифрованном виде на надежных серверах.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-anchor=".faq-group"
              data-aos-duration="1000"
              data-aos-once="true"
              class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6 dark:hs-accordion-active:bg-white/10"
              id="hs-basic-with-title-and-arrow-stretched-heading-three"
            >
              <button
                class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
                aria-expanded="false"
                aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-three"
              >
                Что считается одним "AI-сообщением" в тарифах?
                <svg
                  class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <svg
                  class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
              <div
                id="hs-basic-with-title-and-arrow-stretched-collapse-three"
                class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                role="region"
                aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-three"
              >
                <p class="text-gray-800 dark:text-neutral-200">
                  Одно AI-сообщение — это любая ваша команда, которая требует от AI выполнения
                  действия или сложного поиска (например, "создай задачу", "найди все просроченное",
                  "переименуй проекты"). Простые диалоги в стиле "Привет, как дела?" не расходуют
                  ваш лимит. Если вы достигнете лимита, AI-ассистент приостановит работу до начала
                  следующего месяца, но вы по-прежнему сможете пользоваться таск-менеджером в ручном
                  режиме.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="900"
              data-aos-anchor=".faq-group"
              data-aos-duration="1000"
              data-aos-once="true"
              class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6 dark:hs-accordion-active:bg-white/10"
              id="hs-basic-with-title-and-arrow-stretched-heading-four"
            >
              <button
                class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
                aria-expanded="false"
                aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-four"
              >
                Чем вы лучше других таск-менеджеров, в которых тоже есть AI?
                <svg
                  class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <svg
                  class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
              <div
                id="hs-basic-with-title-and-arrow-stretched-collapse-four"
                class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                role="region"
                aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-four"
              >
                <p class="text-gray-800 dark:text-neutral-200">
                  Большинство AI-инструментов — это "умное" автодополнение или генерация текста. Наш
                  сервис — это полноценный исполнительный агент. Он не просто предлагает идеи, а
                  выполняет ваши команды, понимая контекст вашей работы. Наш AI-ассистент
                  интегрирован глубоко в таск-менеджер, что позволяет ему эффективно управлять
                  задачами, проектами и командами.
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="1200"
              data-aos-anchor=".faq-group"
              data-aos-duration="1000"
              data-aos-once="true"
              class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6 dark:hs-accordion-active:bg-white/10"
              id="hs-basic-with-title-and-arrow-stretched-heading-five"
            >
              <button
                class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
                aria-expanded="false"
                aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-five"
              >
                Могу ли я использовать сервис со своей командой?
                <svg
                  class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <svg
                  class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
              <div
                id="hs-basic-with-title-and-arrow-stretched-collapse-five"
                class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                role="region"
                aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-five"
              >
                <p class="text-gray-800 dark:text-neutral-200">
                  На данный момент сервис лучше всего подходит для индивидуальной работы и личной
                  продуктивности. Функционал для совместной работы команд — наш главный приоритет, и
                  он появится в ближайших обновлениях для тарифов "Премиум" и "Бизнес".
                </p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="1500"
              data-aos-anchor=".faq-group"
              data-aos-duration="1000"
              data-aos-once="true"
              class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6 dark:hs-accordion-active:bg-white/10"
              id="hs-basic-with-title-and-arrow-stretched-heading-six"
            >
              <button
                class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
                aria-expanded="false"
                aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-six"
              >
                Какова ваша политика возврата?
                <svg
                  class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <svg
                  class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500 dark:text-neutral-400"
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
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
              <div
                id="hs-basic-with-title-and-arrow-stretched-collapse-six"
                class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                role="region"
                aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-six"
              >
                <p class="text-gray-800 dark:text-neutral-200">
                  Мы предлагаем возвраты. Мы стремимся к тому, чтобы сосредоточиться на построении
                  отношений с нашими клиентами и сообществом.
                </p>
              </div>
            </div>
          </div>
          <!-- End Accordion -->
        </div>
      </div>
      <!-- End FAQ -->
    </section>

    <section class="relative z-1 overflow-hidden bg-blue-500">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <!-- Title -->
        <div
          data-aos="zoom-out"
          data-aos-duration="1000"
          data-aos-once="true"
          class="max-w-2xl flex flex-col justify-center items-center text-center gap-y-4 mx-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0,0,256,256"
            class="size-17"
          >
            <g
              fill="#fff"
              fill-rule="nonzero"
              stroke="none"
              stroke-width="1"
              stroke-linecap="butt"
              stroke-linejoin="miter"
              stroke-miterlimit="10"
              stroke-dasharray=""
              stroke-dashoffset="0"
              font-family="none"
              font-weight="none"
              font-size="none"
              text-anchor="none"
              style="mix-blend-mode: normal"
            >
              <g transform="scale(5.12,5.12)">
                <path
                  d="M49.306,26.548l-11.24,-3.613l-3.613,-11.241c-0.134,-0.414 -0.518,-0.694 -0.953,-0.694c-0.435,0 -0.819,0.28 -0.952,0.694l-3.613,11.241l-11.24,3.613c-0.415,0.133 -0.695,0.517 -0.695,0.952c0,0.435 0.28,0.819 0.694,0.952l11.24,3.613l3.613,11.241c0.134,0.414 0.518,0.694 0.953,0.694c0.435,0 0.819,-0.28 0.952,-0.694l3.613,-11.241l11.24,-3.613c0.415,-0.133 0.695,-0.517 0.695,-0.952c0,-0.435 -0.28,-0.819 -0.694,-0.952zM1.684,13.949l7.776,2.592l2.592,7.776c0.136,0.408 0.517,0.683 0.948,0.683c0.431,0 0.813,-0.275 0.948,-0.684l2.592,-7.776l7.776,-2.592c0.409,-0.135 0.684,-0.517 0.684,-0.948c0,-0.431 -0.275,-0.813 -0.684,-0.949l-7.776,-2.592l-2.592,-7.776c-0.135,-0.408 -0.517,-0.683 -0.948,-0.683c-0.431,0 -0.813,0.275 -0.948,0.684l-2.592,7.775l-7.776,2.592c-0.409,0.137 -0.684,0.518 -0.684,0.949c0,0.431 0.275,0.813 0.684,0.949zM17.316,39.05l-5.526,-1.842l-1.842,-5.524c-0.135,-0.408 -0.517,-0.684 -0.948,-0.684c-0.431,0 -0.813,0.275 -0.948,0.684l-1.842,5.524l-5.525,1.842c-0.408,0.136 -0.684,0.518 -0.684,0.949c0,0.431 0.275,0.813 0.684,0.949l5.526,1.842l1.841,5.524c0.136,0.407 0.517,0.683 0.948,0.683c0.431,0 0.813,-0.275 0.948,-0.684l1.842,-5.524l5.526,-1.842c0.409,-0.136 0.684,-0.518 0.684,-0.948c0,-0.43 -0.275,-0.813 -0.684,-0.949z"
                ></path>
              </g>
            </g>
          </svg>
          <h1 class="block font-bold text-white text-2xl md:text-3xl lg:text-4xl">
            Готовы управлять задачами по-новому?
          </h1>
        </div>
        <!-- End Title -->

        <div
          data-aos="fade"
          data-aos-delay="300"
          data-aos-duration="1000"
          data-aos-once="true"
          class="mt-4 max-w-2xl text-center mx-auto"
        >
          <p class="text-lg text-gray-200 dark:text-neutral-400">
            Перестаньте кликать. Начните делегировать.
          </p>
        </div>

        <div
          data-aos="slide-up"
          data-aos-duration="1000"
          data-aos-once="true"
          class="mt-10 text-center"
        >
          <a
            class="inline-flex justify-center items-center gap-x-2 py-3 px-5 font-medium rounded-lg border border-transparent bg-white text-blue-500 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200"
            href="#"
          >
            Начать бесплатно
          </a>
        </div>
      </div>
    </section>

    <!-- ========== FOOTER ========== -->
    <footer class="mt-auto bg-gray-900 w-full dark:bg-neutral-950">
      <div class="mt-auto w-full max-w-[55rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
        <!-- Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <div class="col-span-full lg:col-span-1">
            <a
              class="flex-none text-xl font-semibold text-white focus:outline-hidden focus:opacity-80"
              href="#"
              aria-label="Brand"
              ><svg
                data-v-4753b75b=""
                height="33"
                viewBox="0 0 103 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  data-v-4753b75b=""
                  d="M10.272 8.328H15.84L11.16 13.44L15.96 21H10.536L7.872 16.656L6.216 18.264V21H1.44V3.576H6.216V13.176L10.272 8.328ZM23.7118 8.04C25.6478 8.04 27.2238 8.368 28.4398 9.024C29.6558 9.664 30.2638 10.712 30.2638 12.168V17.112C30.2638 17.384 30.3278 17.608 30.4558 17.784C30.5838 17.96 30.7758 18.048 31.0318 18.048H31.8958V20.808C31.8478 20.84 31.7198 20.896 31.5118 20.976C31.3198 21.04 31.0398 21.104 30.6718 21.168C30.3038 21.248 29.8798 21.288 29.3998 21.288C28.4718 21.288 27.7038 21.152 27.0958 20.88C26.5038 20.592 26.0958 20.2 25.8718 19.704C25.2638 20.184 24.5838 20.568 23.8318 20.856C23.0798 21.144 22.1998 21.288 21.1918 21.288C18.2158 21.288 16.7278 20.104 16.7278 17.736C16.7278 16.504 17.0558 15.568 17.7118 14.928C18.3838 14.272 19.3438 13.824 20.5918 13.584C21.8398 13.344 23.4718 13.224 25.4878 13.224V12.6C25.4878 12.104 25.3118 11.728 24.9598 11.472C24.6238 11.216 24.1838 11.088 23.6398 11.088C23.1438 11.088 22.7118 11.176 22.3438 11.352C21.9918 11.528 21.8158 11.808 21.8158 12.192V12.288H17.1118C17.0958 12.208 17.0878 12.096 17.0878 11.952C17.0878 10.752 17.6558 9.8 18.7918 9.096C19.9438 8.392 21.5838 8.04 23.7118 8.04ZM25.4878 15.48C24.1278 15.48 23.1198 15.632 22.4638 15.936C21.8238 16.224 21.5038 16.616 21.5038 17.112C21.5038 17.912 22.0478 18.312 23.1358 18.312C23.7598 18.312 24.3038 18.144 24.7678 17.808C25.2478 17.472 25.4878 17.056 25.4878 16.56V15.48ZM42.1916 8.04C43.6636 8.04 44.7676 8.448 45.5036 9.264C46.2396 10.08 46.6076 11.256 46.6076 12.792V21H41.8316V13.368C41.8316 12.824 41.6876 12.392 41.3996 12.072C41.1276 11.736 40.7356 11.568 40.2236 11.568C39.6316 11.568 39.1516 11.76 38.7836 12.144C38.4156 12.528 38.2316 13 38.2316 13.56V21H33.4556V8.328H37.3676L37.6796 10.248C38.1756 9.576 38.8236 9.04 39.6236 8.64C40.4396 8.24 41.2956 8.04 42.1916 8.04ZM54.2634 9.504C55.1754 8.528 56.3594 8.04 57.8154 8.04C59.5274 8.04 60.8474 8.6 61.7754 9.72C62.7034 10.824 63.1674 12.464 63.1674 14.64C63.1674 16.832 62.7034 18.488 61.7754 19.608C60.8474 20.728 59.5274 21.288 57.8154 21.288C56.0554 21.288 54.7114 20.592 53.7834 19.2L53.3754 21H49.4874V3.6H54.2634V9.504ZM56.3274 11.568C55.6234 11.568 55.0954 11.824 54.7434 12.336C54.3914 12.832 54.2154 13.48 54.2154 14.28V15.072C54.2154 15.872 54.3914 16.52 54.7434 17.016C55.0954 17.512 55.6234 17.76 56.3274 17.76C57.7034 17.76 58.3914 16.944 58.3914 15.312V14.04C58.3914 12.392 57.7034 11.568 56.3274 11.568ZM71.7353 8.04C73.6713 8.04 75.2473 8.368 76.4633 9.024C77.6793 9.664 78.2873 10.712 78.2873 12.168V17.112C78.2873 17.384 78.3513 17.608 78.4793 17.784C78.6073 17.96 78.7993 18.048 79.0553 18.048H79.9193V20.808C79.8713 20.84 79.7433 20.896 79.5353 20.976C79.3433 21.04 79.0633 21.104 78.6953 21.168C78.3273 21.248 77.9033 21.288 77.4233 21.288C76.4953 21.288 75.7273 21.152 75.1193 20.88C74.5273 20.592 74.1193 20.2 73.8953 19.704C73.2873 20.184 72.6073 20.568 71.8553 20.856C71.1033 21.144 70.2233 21.288 69.2153 21.288C66.2393 21.288 64.7513 20.104 64.7513 17.736C64.7513 16.504 65.0793 15.568 65.7353 14.928C66.4073 14.272 67.3673 13.824 68.6153 13.584C69.8633 13.344 71.4953 13.224 73.5113 13.224V12.6C73.5113 12.104 73.3353 11.728 72.9833 11.472C72.6473 11.216 72.2073 11.088 71.6633 11.088C71.1673 11.088 70.7352 11.176 70.3672 11.352C70.0153 11.528 69.8393 11.808 69.8393 12.192V12.288H65.1353C65.1193 12.208 65.1113 12.096 65.1113 11.952C65.1113 10.752 65.6793 9.8 66.8153 9.096C67.9673 8.392 69.6073 8.04 71.7353 8.04ZM73.5113 15.48C72.1513 15.48 71.1433 15.632 70.4873 15.936C69.8473 16.224 69.5273 16.616 69.5273 17.112C69.5273 17.912 70.0713 18.312 71.1593 18.312C71.7833 18.312 72.3273 18.144 72.7913 17.808C73.2713 17.472 73.5113 17.056 73.5113 16.56V15.48ZM89.1831 8.016C89.5511 8.016 89.8791 8.064 90.1671 8.16C90.4551 8.24 90.5991 8.288 90.5991 8.304V12.312H89.0631C88.0711 12.312 87.3511 12.568 86.9031 13.08C86.4711 13.592 86.2551 14.352 86.2551 15.36V21H81.4791V8.328H85.3911L85.7031 10.248C85.9911 9.512 86.4471 8.96 87.0711 8.592C87.6951 8.208 88.3991 8.016 89.1831 8.016Z"
                  fill="#FFF"
                ></path>
                <path
                  data-v-4753b75b=""
                  d="M102.861 5.1097L100.613 4.38709L99.8905 2.13884C99.8637 2.05604 99.7869 2.00004 99.6999 2.00004C99.6129 2.00004 99.5361 2.05604 99.5095 2.13884L98.7869 4.38709L96.5389 5.1097C96.4559 5.1363 96.3999 5.2131 96.3999 5.30011C96.3999 5.38711 96.4559 5.46391 96.5387 5.49051L98.7867 6.21312L99.5093 8.46137C99.5361 8.54417 99.6129 8.60017 99.6999 8.60017C99.7869 8.60017 99.8637 8.54417 99.8903 8.46137L100.613 6.21312L102.861 5.49051C102.944 5.46391 103 5.38711 103 5.30011C103 5.2131 102.944 5.1363 102.861 5.1097ZM93.3366 2.58985L94.8918 3.10826L95.4102 4.66349C95.4374 4.74509 95.5137 4.8001 95.5999 4.8001C95.6861 4.8001 95.7625 4.74509 95.7895 4.66329L96.3079 3.10806L97.8631 2.58965C97.9449 2.56265 97.9999 2.48625 97.9999 2.40005C97.9999 2.31385 97.9449 2.23744 97.8631 2.21024L96.3079 1.69183L95.7895 0.136603C95.7625 0.0550011 95.6861 0 95.5999 0C95.5137 0 95.4372 0.0550011 95.4102 0.136803L94.8918 1.69183L93.3366 2.21024C93.2548 2.23764 93.1998 2.31385 93.1998 2.40005C93.1998 2.48625 93.2548 2.56265 93.3366 2.58985ZM96.4631 7.61015L95.3578 7.24174L94.9894 6.13692C94.9624 6.05532 94.886 6.00012 94.7998 6.00012C94.7136 6.00012 94.6372 6.05512 94.6102 6.13692L94.2418 7.24174L93.1368 7.61015C93.0552 7.63735 93 7.71375 93 7.79996C93 7.88616 93.055 7.96256 93.1368 7.98976L94.242 8.35817L94.6102 9.46299C94.6374 9.54439 94.7136 9.59959 94.7998 9.59959C94.886 9.59959 94.9624 9.54459 94.9894 9.46279L95.3578 8.35797L96.4631 7.98956C96.5449 7.96236 96.5999 7.88596 96.5999 7.79996C96.5999 7.71395 96.5449 7.63735 96.4631 7.61015Z"
                  fill="#FFF"
                ></path>
              </svg>
            </a>
          </div>
          <!-- End Col -->

          <div class="col-span-1">
            <h4 class="font-semibold text-gray-100">Продукт</h4>

            <div class="mt-3 grid space-y-3">
              <p>
                <a
                  class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                  >Возможности</a
                >
              </p>
              <p>
                <a
                  class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                  >Контроль</a
                >
              </p>
              <p>
                <a
                  class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                  >Тарифы</a
                >
              </p>
              <p>
                <a
                  class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                  >Вопросы</a
                >
              </p>
            </div>
          </div>
          <!-- End Col -->

          <div class="col-span-1">
            <h4 class="font-semibold text-gray-100">Компания</h4>

            <div class="mt-3 grid space-y-3">
              <p>
                <a
                  class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                  >Контакты</a
                >
              </p>
              <p>
                <a
                  class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                  >Политика конфиденциальности</a
                >
              </p>
              <p>
                <a
                  class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                  >Условия использования</a
                >
              </p>
              <p>
                <a
                  class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                  >Политика Cookies</a
                >
              </p>
            </div>
          </div>
          <!-- End Col -->
        </div>
        <!-- End Grid -->

        <div
          class="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center"
        >
          <div class="flex flex-wrap justify-between items-center gap-2">
            <p class="text-sm text-gray-400 dark:text-neutral-400">© 2025 Kanbar.</p>
          </div>
          <!-- End Col -->

          <!-- Social Brands -->

          <!-- End Social Brands -->
        </div>
      </div>
    </footer>
    <!-- ========== END FOOTER ========== -->
  </div>
</template>
