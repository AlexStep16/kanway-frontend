<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { Camera, Lock } from '@lucide/vue'
import dayjs from 'dayjs'
import { z } from 'zod'
import SettingsAvatar from '~/components/Workspace/Settings/SettingsAvatar.vue'
import { toast } from 'vue-sonner'
import { AvailableColors } from '~/enums/AvailableColors'
import { cn } from '~/lib/utils'

const { data: user } = useUser()

const { mutate: updateUsername, isPending: isUsernameUpdating } = useUpdateUser()
const { mutate: updateUserTimezone, isPending: isUserTimezoneUpdating } = useUpdateUser()
const { mutate: updateAvatarColor } = useUpdateUser()
const { mutate: resetAvatar, isPending: isAvatarResetting } = useResetAvatar()

const avatarColor = ref<AvailableColors | null>(null)

const email = computed(() => user.value?.email ?? '')

const schema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(1, 'Имя должно содержать не менее 1 символа')
      .max(50, 'Имя не должно превышать 50 символов'),
  }),
)

const { errors, handleSubmit, defineField, resetForm, meta, submitCount } = useForm({
  validationSchema: schema,
  initialValues: {
    username: user.value?.username ?? '',
  },
})

const [username, usernameAttrs] = defineField('username')

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

const handleSaveUsername = handleSubmit((values) => {
  if (!user.value) return

  const normalizedUsername = values.username.trim()

  if (!meta.value.dirty || isUsernameUpdating.value) {
    return
  }

  updateUsername(
    { id: user.value.id, username: normalizedUsername },
    {
      onSuccess: () => {
        resetForm({
          values: {
            username: normalizedUsername,
          },
        })
      },
    },
  )
})

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
      resetForm({
        values: {
          username: newValue.username ?? '',
        },
      })
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
const timezoneValue = computed({
  get() {
    return getUserTimezone.value
  },
  set(value: string) {
    handleChangeTimezone(value)
  },
})
</script>

<template>
  <form
    class="contents"
    @submit.prevent
  >
    <div class="flex flex-col gap-y-2 pb-px">
      <div class="flex items-center gap-x-2 pb-1 sm:pb-2">
        <h3 class="text-lg font-medium text-gray-800">Профиль</h3>
        <Spinner
          v-if="isUsernameUpdating"
          class="text-gray-400"
        />
      </div>

      <div class="flex flex-col items-start gap-y-3 max-w-80">
        <div class="flex flex-col gap-y-1 w-full">
          <label class="text-custom-sm font-medium text-gray-500">Аватар</label>
          <SettingsAvatar
            class="size-15 sm:size-17"
            imageClasses="text-2xl sm:text-3xl"
          >
            <Camera class="size-5" />
          </SettingsAvatar>

          <div
            class="flex gap-1.5 items-center mt-2 flex-wrap"
            v-if="!hasUserAvatar"
          >
            <Button
              :class="
                cn(
                  'size-8 flex p-0 hover:scale-115 transition-transform duration-200',
                  avatarColor === availableColor && 'ring-2 ring-blue-500 ring-offset-1 scale-110',
                )
              "
              v-for="availableColor in Object.values(AvailableColors)"
              :key="availableColor"
              :style="{ backgroundColor: availableColor }"
              @click.prevent="handleUpdateAvatarColor(availableColor)"
            />
          </div>

          <button
            class="py-2 px-3 text-xs text-white bg-red-400 hover:bg-red-500 transition-colors duration-100 rounded-md w-max mt-2"
            type="button"
            v-if="hasUserAvatar"
            @click="resetAvatar()"
          >
            <Spinner
              v-if="isAvatarResetting"
              class="size-3"
            />
            Удалить аватар
          </button>
        </div>

        <div class="flex flex-col gap-y-1 w-full">
          <label class="text-custom-sm font-medium text-gray-500">Имя</label>
          <Input
            id="settings-name"
            name="name"
            autocomplete="off"
            type="text"
            class="w-full border-none bg-gray-100 shadow-none"
            :class="{
              'ring-1 ring-red-500 focus-visible:ring-red-500': errors.username && submitCount > 0,
            }"
            :aria-invalid="Boolean(errors.username && submitCount > 0)"
            placeholder="Введите имя"
            v-model="username"
            v-bind="usernameAttrs"
            @blur="handleSaveUsername"
          />

          <div
            v-if="errors.username && submitCount > 0"
            class="text-red-500 text-xs"
          >
            {{ errors.username }}
          </div>
        </div>

        <div class="flex flex-col gap-y-1 w-full">
          <label class="text-custom-sm font-medium text-gray-500">E-Mail</label>
          <div class="relative flex items-center">
            <Input
              id="settings-email"
              name="email"
              autocomplete="on"
              type="text"
              class="w-full truncate border-none bg-gray-100 pl-3 pr-9 shadow-none disabled:text-gray-500"
              placeholder="Введите E-Mail"
              disabled
              v-model="email"
            />
            <Lock class="size-4 absolute right-3 text-gray-500" />
          </div>
        </div>

        <div class="flex flex-col gap-y-1 w-full">
          <label class="text-custom-sm font-medium text-gray-500">Часовой пояс</label>
          <div class="flex items-center relative">
            <Select v-model="timezoneValue">
              <SelectTrigger class="w-full bg-white text-sm shadow-none">
                <SelectValue placeholder="Выберите пояс..." />
              </SelectTrigger>
              <SelectContent class="max-h-72">
                <SelectItem
                  v-for="timezone in getAllTimezoneOptions"
                  :key="timezone.timezone"
                  :value="timezone.timezone"
                >
                  {{ timezone.label }}
                </SelectItem>
              </SelectContent>
            </Select>

            <Spinner
              v-if="isUserTimezoneUpdating"
              class="size-4 text-gray-500 absolute -right-6"
            />
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
