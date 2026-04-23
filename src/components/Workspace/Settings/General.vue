<script setup lang="ts">
import { Camera, Lock } from 'lucide-vue-next'
import dayjs from 'dayjs'
import Avatar from '@components/Workspace/Settings/Avatar.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { HSSelect, HSStaticMethods, ICollectionItem } from 'preline'
import Spinner from '@/components/Loader/Spinner.vue'
import { useUpdateUser } from '@/composables/auth/mutations/useUpdateUser'
import ColorButtons from '@/components/Buttons/ColorButtons.vue'
import { AvailableColors } from '@/enums/AvailableColors'
import { Nullable } from '@/types/utils'
import { useResetAvatar } from '@/composables/auth/mutations/useResetAvatar'
import { useUser } from '@/composables/auth/queries/useUser'

const { data: user } = useUser()

const { mutate: updateUsername, isPending: isUsernameUpdating } = useUpdateUser()
const { mutate: updateUserTimezone, isPending: isUserTimezoneUpdating } = useUpdateUser()
const { mutate: updateAvatarColor } = useUpdateUser()
const { mutate: resetAvatar, isPending: isAvatarResetting } = useResetAvatar()

const avatarColor = ref<Nullable<AvailableColors>>(null)

const username = ref(user.value?.username ?? '')
const usernameHasErrors = ref(false)

const selectTimezoneRef = ref<HTMLElement | null>(null)

const haveChanges = computed(() => {
  return username.value !== (user.value?.username ?? '')
})

const getAllTimezoneOptions = computed(() => {
  const timezones = Intl.supportedValuesOf('timeZone')
  const labels: { timezone: string; label: string }[] = []

  for (const tz of timezones) {
    const utcOffsetFormatted = dayjs.tz(dayjs(), tz).format('Z')

    labels.push({
      timezone: tz,
      label: `${tz} (UTC${utcOffsetFormatted})`,
    })
  }

  return labels
})

function validateUsername(name: string): boolean {
  let isValid = true

  if (name.trim().length < 1) {
    toast.error('Имя должно содержать не менее 1 символов')

    isValid = false
  }

  if (name.length > 50) {
    toast.error('Имя не должно превышать 50 символов')

    isValid = false
  }

  return isValid
}

function handleSaveUsername() {
  if (!user.value) return

  const isUsernameValid = validateUsername(username.value)

  if (!isUsernameValid) usernameHasErrors.value = true
  else usernameHasErrors.value = false

  if (username.value && haveChanges.value && isUsernameValid) {
    updateUsername(
      { id: user.value?.id, username: username.value },
      {
        onSuccess: () => {
          toast.success('Имя успешно обновлено')
        },
      },
    )
  }
}

async function handleChangeTimezone(timezone: string) {
  if (!user.value) return

  if (timezone && timezone !== getUserTimezone.value) {
    updateUserTimezone(
      { id: user.value.id, timezone },
      {
        onSuccess: () => {
          toast.success('Часовой пояс успешно обновлен')
        },
      },
    )
  }
}

async function handleUpdateAvatarColor(color: AvailableColors) {
  if (color === avatarColor.value) return

  updateAvatarColor({
    id: user.value!.id,
    avatarColor: color,
  })
}

watch(
  user,
  (newValue) => {
    if (newValue) {
      avatarColor.value = newValue.avatarColor
    }
  },
  { immediate: true },
)

const getUserTimezone = computed((): string => {
  return user.value?.timezone || dayjs.tz.guess()
})

const hasUserAvatar = computed((): boolean => {
  return !!user.value?.avatarUrl
})

onMounted(() => {
  HSStaticMethods.autoInit()

  if (selectTimezoneRef.value) {
    const { element } = HSSelect.getInstance(
      selectTimezoneRef.value,
      true,
    ) as ICollectionItem<HSSelect>

    element.on('change', (val: string) => {
      handleChangeTimezone(val)
    })
  }
})
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Основная информация
    </h3>

    <div class="flex flex-col items-start gap-y-3 max-w-80">
      <div class="flex flex-col gap-y-1 w-full">
        <label class="text-custom-sm font-medium text-gray-500">Аватар</label>
        <Avatar class="size-15 sm:size-17" imageClasses="text-2xl sm:text-3xl">
          <Camera class="size-5" />
        </Avatar>

        <ColorButtons
          :color="avatarColor"
          @selectColor="handleUpdateAvatarColor"
          class="mt-2"
          :size="8"
          v-if="!hasUserAvatar"
        />

        <button
          class="py-2 px-3 text-xs text-white bg-red-400 hover:bg-red-500 transition-colors duration-100 rounded-md w-max mt-2"
          type="button"
          v-if="hasUserAvatar"
          @click="resetAvatar()"
        >
          <Spinner v-if="isAvatarResetting" class="size-3" />
          Удалить аватар
        </button>
      </div>

      <div class="flex flex-col gap-y-1">
        <label class="text-custom-sm font-medium text-gray-500">Имя</label>
        <input
          id="settings-name"
          name="name"
          autocomplete="off"
          type="text"
          class="max-w-80 w-full border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          @input="usernameHasErrors = false"
          :class="{ 'ring-1 ring-red-500 focus:ring-red-500': usernameHasErrors }"
          placeholder="Введите имя"
          v-model="username"
        />

        <button
          type="button"
          class="flex items-center justify-center gap-x-2 py-2 px-3 bg-blue-500 hover:opacity-90 transition-[opacity,colors] text-white text-xs font-medium rounded-md duration-100 focus:outline-hidden disabled:opacity-30 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-default"
          :disabled="!haveChanges"
          @click="handleSaveUsername"
        >
          <Spinner v-if="isUsernameUpdating" class="size-3" />
          <span>Сохранить</span>
        </button>
      </div>

      <div class="flex flex-col gap-y-1 w-full">
        <label class="text-custom-sm font-medium text-gray-500">E-Mail</label>
        <div class="relative flex items-center">
          <input
            id="settings-email"
            name="email"
            autocomplete="on"
            type="text"
            class="w-full truncate border-none bg-gray-100 rounded-md pl-3 pr-9 py-2 text-sm focus:outline-none focus:ring-1 disabled:text-gray-500 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Введите E-Mail"
            disabled
            value="alexander.ivanov@example.com"
          />
          <Lock class="size-4 absolute right-3 text-gray-500" />
        </div>
      </div>
    </div>
  </div>
  <div class="grow flex flex-col gap-y-2">
    <h3
      class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
    >
      Регион
    </h3>
    <div class="flex flex-col gap-y-3 max-w-80">
      <div class="flex flex-col gap-y-1 w-full">
        <label class="text-custom-sm font-medium text-gray-500">Часовой пояс</label>
        <div class="flex items-center relative">
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
            "dropdownScope": "window",
            "wrapperClasses": "w-full"
          }'
            class="hidden w-full"
            ref="selectTimezoneRef"
          >
            <option
              v-for="timezone in getAllTimezoneOptions"
              :key="timezone.timezone"
              :value="timezone.timezone"
              :selected="timezone.timezone === getUserTimezone"
            >
              {{ timezone.label }}
            </option>
          </select>

          <Spinner v-if="isUserTimezoneUpdating" class="size-4 text-gray-500 absolute -right-6" />
        </div>
      </div>
    </div>
  </div>
</template>
