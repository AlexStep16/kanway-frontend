<script setup lang="ts"></script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200">
      Персонализация ассистента
    </h3>

    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500">Имя ассистента</label>
        <input
          id="settings-ai-name"
          name="name"
          type="text"
          class="w-full max-w-80 border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введите имя"
          value="Kanbar"
        />
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200 mt-4">
      Предпочтения по взаимодействию
    </h3>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col max-w-80 gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500">Режим подтверждения действий</label>
        <select
          data-hs-select='{
          "placeholder": "Выберите действие по умолчанию...",
          "toggleTag": "<button type=\"button\" aria-expanded=\"false\"><span class=\"me-2\" data-icon></span><span class=\"text-gray-800 dark:text-neutral-200 \" data-title></span></button>",
          "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative px-3 py-2 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600",
          "dropdownClasses": "mt-2 z-80 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
          "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
          "optionTemplate": "<div><div class=\"flex items-center\"><div class=\"me-2\" data-icon></div><div class=\"text-gray-800 dark:text-neutral-200 \" data-title></div></div></div>",
          "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>",
          "dropdownScope": "window"
        }'
          class="hidden"
        >
          <option value="0" selected>Всегда подтверждать действия</option>
          <option value="1">Спрашивать только для деструктивных действий (удаление, отмена)</option>
          <option value="2">Никогда не спрашивать</option>
        </select>
      </div>
    </div>
  </div>

  <div class="grow-1 flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200 mt-4">
      Настройки создания и организации задач
    </h3>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500"
          >Категория по умолчанию для новых задач</label
        >
        <input
          id="settings-ai-category-name"
          name="name"
          type="text"
          class="w-full max-w-80 border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введите имя категории"
        />
      </div>

      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500"
          >Доска по умолчанию для новых категорий</label
        >
        <input
          id="settings-ai-board-name"
          name="name"
          type="text"
          class="w-full max-w-80 border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введите имя доски"
        />
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
