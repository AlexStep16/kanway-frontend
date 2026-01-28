<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { AiConfirmationTypeEnum } from '@/enums/AiConfirmationTypeEnum'
import { HSSelect, HSStaticMethods, ICollectionItem } from 'preline'
import Spinner from '@/components/Loader/Spinner.vue'
import { useSetting } from '@/composables/settings/queries/useSettings'
import { useUpdateSetting } from '@/composables/settings/mutations/useUpdateSetting'

const { data: setting, isPending: isSettingLoading } = useSetting()

const { mutate: updateSetting, isPending: isSettingUpdating } = useUpdateSetting()

const settingModel = ref({ ...setting.value })
const validationErrors = ref({
  aiName: '',
  aiConfirmationType: '',
  aiDefaultCategory: '',
  aiDefaultBoard: '',
})
const selectContainerRef = ref<HTMLElement | null>(null)

const selectTypeRef = ref<HTMLElement | null>(null)

watch(
  setting,
  (newSetting) => {
    if (!newSetting) {
      return
    }

    Object.assign(settingModel.value, newSetting)
    HSStaticMethods.autoInit()

    if (selectTypeRef.value) {
      const { element } = HSSelect.getInstance(
        selectTypeRef.value,
        true,
      ) as ICollectionItem<HSSelect>

      element.setValue(settingModel.value?.aiConfirmationType?.toString() || '')
    }
  },
  { deep: true },
)

watch(isSettingLoading, (newVal) => {
  if (!newVal) {
    const hsSelect = selectContainerRef.value?.querySelector('.hs-select')

    if (hsSelect) {
      hsSelect.classList.remove('hidden')
    }
  }
})

function validateSetting(): boolean {
  if (!settingModel.value) {
    return false
  }

  let isValid = true

  if (settingModel.value.aiName && settingModel.value.aiName.length > 50) {
    validationErrors.value.aiName = 'Имя не должно превышать 50 символов'

    isValid = false
  } else if (!settingModel.value.aiName) {
    validationErrors.value.aiName = 'Имя не может быть пустым'

    isValid = false
  } else {
    validationErrors.value.aiName = ''
  }

  if (settingModel.value.aiDefaultCategory && settingModel.value.aiDefaultCategory.length > 100) {
    validationErrors.value.aiDefaultCategory = 'Имя категории не должно превышать 100 символов'

    isValid = false
  } else {
    validationErrors.value.aiDefaultCategory = ''
  }

  if (settingModel.value.aiDefaultBoard && settingModel.value.aiDefaultBoard.length > 100) {
    validationErrors.value.aiDefaultBoard = 'Имя доски не должно превышать 100 символов'

    isValid = false
  } else {
    validationErrors.value.aiDefaultBoard = ''
  }

  return isValid
}

function handleSaveSetting() {
  if (isSettingUpdating.value || !validateSetting() || !setting.value) {
    return
  }

  updateSetting({
    payload: {
      id: setting.value.id,
      aiName: settingModel.value.aiName,
      aiConfirmationType: settingModel.value.aiConfirmationType,
      aiDefaultCategory: settingModel.value.aiDefaultCategory,
      aiDefaultBoard: settingModel.value.aiDefaultBoard,
    },
  })
}

function resetValidationAiName() {
  validationErrors.value.aiName = ''
}

function resetValidationAiDefaultCategory() {
  validationErrors.value.aiDefaultCategory = ''
}

function resetValidationAiDefaultBoard() {
  validationErrors.value.aiDefaultBoard = ''
}

const hasSomethingChanged = computed(() => {
  if (!setting.value || !settingModel.value) {
    return false
  }

  return (
    settingModel.value.aiName !== setting.value.aiName ||
    settingModel.value.aiConfirmationType !== setting.value.aiConfirmationType ||
    settingModel.value.aiDefaultCategory !== setting.value.aiDefaultCategory ||
    settingModel.value.aiDefaultBoard !== setting.value.aiDefaultBoard
  )
})

const isButtonDisabled = computed(() => {
  return isSettingUpdating.value || !hasSomethingChanged.value
})

onMounted(() => {
  HSStaticMethods.autoInit()

  const hsSelect = selectContainerRef.value?.querySelector('.hs-select')

  if (hsSelect) {
    hsSelect.classList.add('hidden') // Hide until setting is loaded; Note: v-if is not working here due to HSSelect initialization
  }
})
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Персонализация ассистента
    </h3>

    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500">Имя ассистента</label>
        <div
          class="bg-gray-300 animate-pulse w-full max-w-80 rounded-md px-3 py-2 text-sm h-9"
          v-if="isSettingLoading"
        ></div>
        <input
          id="settings-ai-name"
          name="name"
          type="text"
          class="w-full max-w-80 border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'ring-1 ring-red-500 focus:ring-red-500': validationErrors.aiName }"
          maxlength="50"
          @input="resetValidationAiName"
          placeholder="Введите имя"
          v-model="settingModel.aiName"
          v-else
        />

        <div v-if="validationErrors.aiName" class="text-red-500 text-xs">
          {{ validationErrors.aiName }}
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-y-2" ref="selectContainerRef">
    <h3
      class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
    >
      Предпочтения по взаимодействию
    </h3>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col max-w-80 gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500">Режим подтверждения действий</label>
        <div
          class="bg-gray-300 animate-pulse w-full max-w-80 rounded-md px-3 py-2 text-sm h-9"
          v-if="isSettingLoading"
        ></div>
        <select
          data-hs-select='{
          "placeholder": "Выберите действие по умолчанию...",
          "toggleTag": "<button type=\"button\" aria-expanded=\"false\"><span class=\"me-2\" data-icon></span><span class=\"text-gray-800 \" data-title></span></button>",
          "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative px-3 py-2 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500",
          "dropdownClasses": "mt-2 z-80 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
          "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100",
          "optionTemplate": "<div><div class=\"flex items-center\"><div class=\"me-2\" data-icon></div><div class=\"text-gray-800 \" data-title></div></div></div>",
          "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>",
          "dropdownScope": "window"
        }'
          class="hidden"
          v-model="settingModel.aiConfirmationType"
          ref="selectTypeRef"
        >
          <option :value="AiConfirmationTypeEnum.ALWAYS">Всегда подтверждать действия</option>
          <option :value="AiConfirmationTypeEnum.ONLY_FOR_SENSITIVE">
            Спрашивать только для деструктивных действий (удаление, отмена)
          </option>
          <option :value="AiConfirmationTypeEnum.NEVER">Никогда не спрашивать</option>
        </select>
      </div>
    </div>
  </div>

  <div class="grow-1 flex flex-col gap-y-2">
    <h3
      class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
    >
      Настройки создания и организации задач
    </h3>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500"
          >Категория по умолчанию для новых задач</label
        >
        <div
          class="bg-gray-300 animate-pulse w-full max-w-80 rounded-md px-3 py-2 text-sm h-9"
          v-if="isSettingLoading"
        ></div>
        <input
          id="settings-ai-category-name"
          name="name"
          type="text"
          class="w-full max-w-80 border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'ring-1 ring-red-500 focus:ring-red-500': validationErrors.aiDefaultCategory }"
          placeholder="Введите имя категории"
          maxlength="100"
          @input="resetValidationAiDefaultCategory"
          v-model="settingModel.aiDefaultCategory"
          v-else
        />

        <div v-if="validationErrors.aiDefaultCategory" class="text-red-500 text-xs">
          {{ validationErrors.aiDefaultCategory }}
        </div>
      </div>

      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500"
          >Доска по умолчанию для новых категорий</label
        >
        <div
          class="bg-gray-300 animate-pulse w-full max-w-80 rounded-md px-3 py-2 text-sm h-9"
          v-if="isSettingLoading"
        ></div>
        <input
          id="settings-ai-board-name"
          name="name"
          type="text"
          class="w-full max-w-80 border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'ring-1 ring-red-500 focus:ring-red-500': validationErrors.aiDefaultBoard }"
          placeholder="Введите имя доски"
          maxlength="100"
          @input="resetValidationAiDefaultBoard"
          v-model="settingModel.aiDefaultBoard"
          v-else
        />

        <div v-if="validationErrors.aiDefaultBoard" class="text-red-500 text-xs">
          {{ validationErrors.aiDefaultBoard }}
        </div>
      </div>
    </div>
  </div>

  <div class="flex items-center justify-end w-full pt-2 gap-x-2 border-t border-gray-200">
    <button
      type="button"
      class="flex items-center justify-center gap-x-2 py-2 px-3 bg-blue-500 hover:opacity-90 transition-opacity text-white text-xs font-medium rounded-md duration-100 focus:outline-hidden disabled:opacity-30 disabled:cursor-default disabled:hover:bg-blue-500"
      :disabled="isButtonDisabled && !isSettingUpdating"
      @click="handleSaveSetting"
    >
      <Spinner v-if="isSettingUpdating" class="size-3" />
      <span>Сохранить</span>
    </button>
  </div>
</template>
