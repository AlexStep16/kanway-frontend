<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { AiConfirmationTypeEnum } from '~/enums/AiConfirmationTypeEnum'

const { data: setting, isPending: isSettingLoading } = useSetting()

const { mutate: updateSetting, isPending: isSettingUpdating } = useUpdateSetting()

const schema = toTypedSchema(
  z.object({
    aiName: z
      .string()
      .min(1, 'Имя не может быть пустым')
      .max(50, 'Имя не должно превышать 50 символов'),
    aiConfirmationType: z.nativeEnum(AiConfirmationTypeEnum, {
      error: () => ({ message: 'Выберите режим подтверждения действий' }),
    }),
    aiDefaultCategory: z
      .string()
      .max(100, 'Имя категории не должно превышать 100 символов'),
    aiDefaultBoard: z.string().max(100, 'Имя доски не должно превышать 100 символов'),
  }),
)

const { errors, handleSubmit, defineField, resetForm, meta, submitCount } = useForm({
  validationSchema: schema,
  initialValues: {
    aiName: '',
    aiConfirmationType: AiConfirmationTypeEnum.ALWAYS,
    aiDefaultCategory: '',
    aiDefaultBoard: '',
  },
})

const [aiName, aiNameAttrs] = defineField('aiName')
const [aiConfirmationType] = defineField('aiConfirmationType')
const [aiDefaultCategory, aiDefaultCategoryAttrs] = defineField('aiDefaultCategory')
const [aiDefaultBoard, aiDefaultBoardAttrs] = defineField('aiDefaultBoard')

watch(
  setting,
  (newSetting) => {
    if (!newSetting) {
      return
    }

    resetForm({
      values: {
        aiName: newSetting.aiName ?? '',
        aiConfirmationType: newSetting.aiConfirmationType,
        aiDefaultCategory: newSetting.aiDefaultCategory ?? '',
        aiDefaultBoard: newSetting.aiDefaultBoard ?? '',
      },
    })
  },
  { deep: true, immediate: true },
)

const aiConfirmationTypeValue = computed({
  get() {
    return aiConfirmationType.value?.toString() ?? ''
  },
  set(value: string) {
    aiConfirmationType.value = Number(value) as AiConfirmationTypeEnum
  },
})

const handleSaveSetting = handleSubmit((values) => {
  if (isSettingUpdating.value || !setting.value || !meta.value.dirty) {
    return
  }

  updateSetting({
    payload: {
      id: setting.value.id,
      aiName: values.aiName,
      aiConfirmationType: values.aiConfirmationType,
      aiDefaultCategory: values.aiDefaultCategory,
      aiDefaultBoard: values.aiDefaultBoard,
    },
  }, {
    onSuccess: () => {
      resetForm({ values })
    },
  })
})

const isButtonDisabled = computed(() => {
  return isSettingUpdating.value || !meta.value.dirty
})
</script>

<template>
  <form class="contents" @submit="handleSaveSetting">
    <div class="flex flex-col gap-y-2">
      <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
        Персонализация ассистента
      </h3>

      <div class="flex flex-col gap-y-3">
        <div class="flex flex-col gap-y-1">
          <label class="text-custom-sm font-medium text-gray-500">Имя ассистента</label>
          <Skeleton v-if="isSettingLoading" class="h-9 w-full max-w-80" />
          <Input
            v-else
            id="settings-ai-name"
            v-model="aiName"
            name="name"
            type="text"
            maxlength="50"
            placeholder="Введите имя"
            class="max-w-80 border-none bg-gray-100 shadow-none"
            :class="{ 'ring-1 ring-red-500 focus-visible:ring-red-500': errors.aiName && submitCount > 0 }"
            :aria-invalid="Boolean(errors.aiName && submitCount > 0)"
            v-bind="aiNameAttrs"
          />

          <div v-if="errors.aiName && submitCount > 0" class="text-red-500 text-xs">
            {{ errors.aiName }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-2">
      <h3
        class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
      >
        Предпочтения по взаимодействию
      </h3>
      <div class="flex flex-col gap-y-3">
        <div class="flex flex-col max-w-80 gap-y-1">
          <label class="text-custom-sm font-medium text-gray-500">Режим подтверждения действий</label>
          <Skeleton v-if="isSettingLoading" class="h-9 w-full max-w-80" />
          <Select v-else v-model="aiConfirmationTypeValue">
            <SelectTrigger
              class="max-w-80 bg-white text-sm shadow-none"
              :class="{ 'ring-1 ring-red-500 focus-visible:ring-red-500': errors.aiConfirmationType && submitCount > 0 }"
            >
              <SelectValue placeholder="Выберите действие по умолчанию..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="AiConfirmationTypeEnum.ALWAYS.toString()">
                Всегда подтверждать действия
              </SelectItem>
              <SelectItem :value="AiConfirmationTypeEnum.ONLY_FOR_SENSITIVE.toString()">
                Спрашивать только для деструктивных действий (удаление, отмена)
              </SelectItem>
              <SelectItem :value="AiConfirmationTypeEnum.NEVER.toString()">
                Никогда не спрашивать
              </SelectItem>
            </SelectContent>
          </Select>

          <div v-if="errors.aiConfirmationType && submitCount > 0" class="text-red-500 text-xs">
            {{ errors.aiConfirmationType }}
          </div>
        </div>
      </div>
    </div>

    <div class="grow flex flex-col gap-y-2">
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
          <Skeleton v-if="isSettingLoading" class="h-9 w-full max-w-80" />
          <Input
            v-else
            id="settings-ai-category-name"
            v-model="aiDefaultCategory"
            name="name"
            type="text"
            maxlength="100"
            placeholder="Введите имя категории"
            class="max-w-80 border-none bg-gray-100 shadow-none"
            :class="{
              'ring-1 ring-red-500 focus-visible:ring-red-500': errors.aiDefaultCategory && submitCount > 0,
            }"
            :aria-invalid="Boolean(errors.aiDefaultCategory && submitCount > 0)"
            v-bind="aiDefaultCategoryAttrs"
          />

          <div v-if="errors.aiDefaultCategory && submitCount > 0" class="text-red-500 text-xs">
            {{ errors.aiDefaultCategory }}
          </div>
        </div>

        <div class="flex flex-col gap-y-1">
          <label class="text-custom-sm font-medium text-gray-500"
            >Доска по умолчанию для новых категорий</label
          >
          <Skeleton v-if="isSettingLoading" class="h-9 w-full max-w-80" />
          <Input
            v-else
            id="settings-ai-board-name"
            v-model="aiDefaultBoard"
            name="name"
            type="text"
            maxlength="100"
            placeholder="Введите имя доски"
            class="max-w-80 border-none bg-gray-100 shadow-none"
            :class="{ 'ring-1 ring-red-500 focus-visible:ring-red-500': errors.aiDefaultBoard && submitCount > 0 }"
            :aria-invalid="Boolean(errors.aiDefaultBoard && submitCount > 0)"
            v-bind="aiDefaultBoardAttrs"
          />

          <div v-if="errors.aiDefaultBoard && submitCount > 0" class="text-red-500 text-xs">
            {{ errors.aiDefaultBoard }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end w-full pt-2 gap-x-2 border-t border-gray-200">
      <Button
        type="submit"
        size="sm"
        class="gap-x-2 text-xs"
        :disabled="isButtonDisabled && !isSettingUpdating"
      >
        <Spinner v-if="isSettingUpdating" class="size-3" />
        <span>Сохранить</span>
      </Button>
    </div>
  </form>
</template>
