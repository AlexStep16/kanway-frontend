<script setup lang="ts"></script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200">Способ оплаты</h3>

    <div class="grid grid-cols-2 gap-2">
      <div class="bg-blue-50 border border-blue-300 rounded-md">
        <label
          for="payment-method-card-1"
          class="cursor-pointer flex items-center px-4 py-2 gap-x-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-10" viewBox="0 0 400 120">
            <linearGradient id="a" x1="370" x2="290" gradientUnits="userSpaceOnUse">
              <stop stop-color="#1F5CD7" />
              <stop stop-color="#02AEFF" offset="1" />
            </linearGradient>
            <path
              d="m31 13h33c3 0 12-1 16 13 3 9 7 23 13 44h2c6-22 11-37 13-44 4-14 14-13 18-13h31v96h-32v-57h-2l-17 57h-24l-17-57h-3v57h-31m139-96h32v57h3l21-47c4-9 13-10 13-10h30v96h-32v-57h-2l-21 47c-4 9-14 10-14 10h-30m142-29v29h-30v-50h98c-4 12-18 21-34 21"
              fill="#0f754e"
            />
            <path d="m382 53c4-18-8-40-34-40h-68c2 21 20 40 39 40" fill="url(#a)" />
          </svg>

          <div class="flex justify-start items-start flex-col">
            <span class="text-sm font-medium text-gray-800">Мир **** 1234</span>
            <span class="text-xs text-gray-500">Действует до 12/24</span>
            <button type="button" class="text-xs text-red-500 hover:underline mt-1">Удалить</button>
          </div>

          <div class="flex grow-1 justify-end">
            <div class="flex items-center cursor-pointer relative transition-all">
              <input
                type="checkbox"
                class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-600"
                id="payment-method-card-1"
                checked
              />
              <span
                class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
        </label>
      </div>

      <div class="border border-gray-200 rounded-md">
        <label
          for="payment-method-card-2"
          class="cursor-pointer flex items-center px-4 py-2 gap-x-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-10" viewBox="0 0 400 120">
            <linearGradient id="a" x1="370" x2="290" gradientUnits="userSpaceOnUse">
              <stop stop-color="#1F5CD7" />
              <stop stop-color="#02AEFF" offset="1" />
            </linearGradient>
            <path
              d="m31 13h33c3 0 12-1 16 13 3 9 7 23 13 44h2c6-22 11-37 13-44 4-14 14-13 18-13h31v96h-32v-57h-2l-17 57h-24l-17-57h-3v57h-31m139-96h32v57h3l21-47c4-9 13-10 13-10h30v96h-32v-57h-2l-21 47c-4 9-14 10-14 10h-30m142-29v29h-30v-50h98c-4 12-18 21-34 21"
              fill="#0f754e"
            />
            <path d="m382 53c4-18-8-40-34-40h-68c2 21 20 40 39 40" fill="url(#a)" />
          </svg>

          <div class="flex justify-start items-start flex-col">
            <span class="text-sm font-medium text-gray-800">Мир **** 4321</span>
            <span class="text-xs text-gray-500">Действует до 12/24</span>
            <button type="button" class="text-xs text-red-500 hover:underline mt-1">Удалить</button>
          </div>

          <div class="flex grow-1 justify-end">
            <div class="flex items-center cursor-pointer relative transition-all">
              <input
                type="checkbox"
                class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-600"
                id="payment-method-card-2"
              />
              <span
                class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
  <div class="grow-1 flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200 mt-4">
      История платежей
    </h3>

    <div class="flex flex-col">
      <div class="overflow-x-auto">
        <div class="min-w-full inline-block align-middle">
          <div class="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Дата
                  </th>
                  <th
                    scope="col"
                    class="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Описание
                  </th>
                  <th
                    scope="col"
                    class="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Сумма
                  </th>
                  <th
                    scope="col"
                    class="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                  >
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <!-- Пример строки платежа -->
                <tr>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">16 июня 2025</td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">
                    Подписка Pro (ежемесячно)
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">599 ₽</td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm">
                    <span
                      class="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                      >Оплачено</span
                    >
                  </td>
                </tr>
                <!-- Пример строки с ожидающим платежом -->
                <tr>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">16 июля 2025</td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">
                    Подписка Pro (ежемесячно)
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">599 ₽</td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm">
                    <span
                      class="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >В ожидании</span
                    >
                  </td>
                </tr>
                <!-- Пример строки с отмененным платежом -->
                <tr>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">16 июня 2024</td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">
                    Подписка Pro (ежемесячно)
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-800">599 ₽</td>
                  <td class="px-5 py-3 whitespace-nowrap text-sm">
                    <span
                      class="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >Отменен</span
                    >
                  </td>
                </tr>
                <!-- ... другие строки платежей ... -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
