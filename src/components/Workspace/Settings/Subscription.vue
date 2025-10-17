<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  window.HSStaticMethods.autoInit()
})
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Ваша текущая подписка
    </h3>

    <div class="flex flex-col gap-y-2">
      <div class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70">
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow-1 gap-y-1">
            <span class="text-sm font-medium text-gray-800">Базовая</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">Бесплатно</span>
          </div>
        </div>
      </div>

      <div class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70">
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow-1 gap-y-1">
            <div class="flex items-center justify-between w-full relative">
              <span class="text-sm font-medium text-gray-800">Премиум</span>
              <span
                class="absolute right-0 text-xs text-green-500 py-1.5 px-2.5 bg-green-100 rounded-full"
                >Активна</span
              >
            </div>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold">₽599</span>
              /месяц
            </span>
            <div class="flex flex-col text-gray-400 text-xs items-start">
              <span>Активна до: 01.01.2026</span>
              <span>Следующий платеж: 01.01.2026</span>
              <button
                type="button"
                class="text-xs text-red-500 rounded-md bg-red-100 py-1.5 px-2.5 mt-2 hover:bg-red-200 transition-colors duration-100"
              >
                Отменить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Текущие лимиты
    </h3>

    <div class="flex flex-wrap lg:flex-nowrap gap-2">
      <div class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70">
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow-1 gap-y-1">
            <span class="text-sm text-gray-500">Пространств осталось:</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">1</span>
          </div>
        </div>
      </div>

      <div class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70">
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow-1 gap-y-1">
            <span class="text-sm text-gray-500">Досок осталось:</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">5</span>
          </div>
        </div>
      </div>

      <div class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70">
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow-1 gap-y-1">
            <span class="text-sm text-gray-500">Сообщений осталось:</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">235</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-y-2">
    <h3
      class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
    >
      Доступные планы
    </h3>

    <div class="grid gap-2 grid-cols-1 md:grid-cols-2 grid-flow-row auto-rows-max">
      <div class="rounded-md bg-white border border-gray-200 grow-1">
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col size-full gap-y-1">
            <span class="text-sm font-medium text-gray-800">Базовая</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">Бесплатно</span>
            <div class="flex flex-col mt-1 gap-y-1 grow-1">
              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">1 рабочее пространство</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">5 досок</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">20 сообщений в месяц</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно задач</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Обычная поддержка</span>
              </div>
            </div>

            <button
              type="button"
              class="text-xs text-blue-500 bg-blue-100 border font-medium border-blue-200 rounded-md p-2 w-full mt-3"
            >
              Текущая подписка
            </button>
          </div>
        </div>
      </div>

      <div class="rounded-md bg-white border border-gray-200 grow-1">
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col size-full gap-y-1">
            <span class="text-sm font-medium text-gray-800">Премиум</span>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold">₽599</span>
              /месяц
            </span>
            <div class="flex flex-col mt-1 gap-y-1 grow-1">
              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно пространств</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно досок</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">300 сообщений в месяц</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно задач</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Приоритетная поддержка</span>
              </div>
            </div>

            <button
              type="button"
              class="text-xs text-white p-2 w-full items-center gap-x-2 font-medium rounded-md mt-3 border border-transparent bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)] disabled:opacity-50 disabled:pointer-events-none"
            >
              Повысить до Премиум
            </button>
          </div>
        </div>
      </div>

      <div class="rounded-md bg-white border border-gray-200 grow-1">
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col gap-y-1 size-full">
            <span class="text-sm font-medium text-gray-800">Бизнес</span>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold">₽999</span>
              /месяц
            </span>
            <div class="flex flex-col mt-1 gap-y-1 grow-1">
              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно пространств</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно досок</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно сообщений в месяц</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно задач</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Приоритетная поддержка</span>
              </div>
            </div>

            <button
              type="button"
              class="text-xs text-white p-2 w-full items-center gap-x-2 font-medium rounded-md mt-3 border border-transparent bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)] disabled:opacity-50 disabled:pointer-events-none"
            >
              Повысить до Бизнес
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
