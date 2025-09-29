<script setup lang="ts">
import { Camera } from 'lucide-vue-next'
import dayjs from 'dayjs'
import { useRootStore } from '@/stores/root'

const STORE = useRootStore()

function getAllTimezoneOptions(): string[] {
  const timezones = Intl.supportedValuesOf('timeZone')
  const labels: string[] = []

  for (const tz of timezones) {
    const utcOffsetFormatted = dayjs.tz(dayjs(), tz).format('Z')

    labels.push(`${tz} (UTC${utcOffsetFormatted})`)
  }

  return labels
}
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200">
      Основная информация
    </h3>

    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500">Аватар</label>
        <div class="size-15 rounded-full bg-gray-300 relative">
          <img
            class="shrink-0 size-full rounded-full"
            src="https://images.unsplash.com/photo-1734122415415-88cb1d7d5dc0?q=80&w=320&h=320&auto=format&fit=facearea&facepad=3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Avatar"
          />

          <div
            class="size-full flex items-center justify-center absolute cursor-pointer text-white inset-0 rounded-full bg-black outline-2 outline-transparent opacity-0 hover:opacity-70 hover:outline-blue-500 transition-all duration-200"
          >
            <Camera class="size-5" />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500">Имя</label>
        <input
          id="settings-name"
          name="name"
          type="text"
          class="w-full max-w-80 border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введите имя"
          value="Александр Иванов"
        />
      </div>

      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500">E-Mail</label>
        <input
          id="settings-email"
          name="email"
          type="text"
          class="w-full max-w-80 border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введите E-Mail"
          value="alexander.ivanov@example.com"
        />
      </div>
    </div>
  </div>
  <div class="grow-1 flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200 mt-4">Регион</h3>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1 max-w-80">
        <label class="text-custom-sm font-medium text-gray-500">Часовой пояс</label>
        <select
          data-hs-select='{
          "placeholder": "Выберите пояс...",
          "hasSearch": true,
          "searchPlaceholder": "Поиск",
          "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 py-1.5 sm:py-2 px-3",
          "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0 dark:bg-neutral-900",
          "toggleTag": "<button type=\"button\" aria-expanded=\"false\"><span class=\"me-2\" data-icon></span><span class=\"text-gray-800 dark:text-neutral-200 \" data-title></span></button>",
          "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative px-3 py-2 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600",
          "dropdownClasses": "mt-2 max-h-72 pb-1 px-1 space-y-0.5 z-80 w-full bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
          "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
          "optionTemplate": "<div><div class=\"flex items-center\"><div class=\"me-2\" data-icon></div><div class=\"text-gray-800 dark:text-neutral-200 \" data-title></div></div></div>",
          "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>",
          "dropdownScope": "window"
        }'
          class="hidden"
        >
          <option
            v-for="timezone in getAllTimezoneOptions()"
            :key="timezone"
            :value="timezone"
            :selected="timezone.startsWith(STORE.timezone)"
          >
            {{ timezone }}
          </option>
        </select>
      </div>
    </div>
  </div>

  <div class="flex items-center justify-end w-full pt-2 gap-x-2 border-t border-gray-200">
    <button
      type="button"
      class="py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-hidden disabled:opacity-30 disabled:cursor-default disabled:hover:bg-blue-500"
    >
      Сохранить
    </button>
  </div>
</template>
