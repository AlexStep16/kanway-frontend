<script setup lang="ts">
import { Camera } from 'lucide-vue-next'
import dayjs from 'dayjs'
import { useRootStore } from '@/stores/root'
import Avatar from '@/components/Workspace/Settings/Avatar.vue'
import { onMounted } from 'vue'

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

onMounted(() => {
  window.HSStaticMethods.autoInit()
})
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Основная информация
    </h3>

    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500">Аватар</label>
        <Avatar class="size-13 sm:size-15">
          <Camera class="size-5" />
        </Avatar>
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
    <h3
      class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
    >
      Регион
    </h3>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1 max-w-80">
        <label class="text-custom-sm font-medium text-gray-500">Часовой пояс</label>
        <select
          data-hs-select='{
          "placeholder": "Выберите пояс...",
          "hasSearch": true,
          "searchPlaceholder": "Поиск",
          "searchClasses": "block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 py-1.5 sm:py-2 px-3",
          "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0",
          "toggleTag": "<button type=\"button\" aria-expanded=\"false\"><span class=\"me-2\" data-icon></span><span class=\"text-gray-800 \" data-title></span></button>",
          "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative px-3 py-2 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500",
          "dropdownClasses": "mt-2 max-h-72 pb-1 px-1 space-y-0.5 z-80 w-full bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
          "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100",
          "optionTemplate": "<div><div class=\"flex items-center\"><div class=\"me-2\" data-icon></div><div class=\"text-gray-800 \" data-title></div></div></div>",
          "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>",
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
      class="py-2 px-3 bg-blue-500 hover:opacity-90 transition-opacity text-white text-xs font-medium rounded-md duration-100 focus:outline-hidden disabled:opacity-30 disabled:cursor-default disabled:hover:bg-blue-500"
    >
      Сохранить
    </button>
  </div>
</template>
