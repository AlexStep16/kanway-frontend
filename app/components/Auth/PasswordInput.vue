<script setup lang="ts">
import ShowPasswordButton from './ShowPasswordButton.vue'
import { CircleX, KeyRound } from '@lucide/vue'
import { checkPasswordStrengthApi } from '~/utils/api/auth'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue: string | undefined
    error?: string
    submitCount?: number
    placeholder?: string
    isPasswordModifiedAfterSubmit: boolean
    variant?: 'auth' | 'settings'
  }>(),
  {
    placeholder: 'Пароль',
    variant: 'auth',
    submitCount: 0,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const passwordRef = ref<HTMLInputElement | null>(null)
const isPasswordVisible = ref(false)
const isCheckingStrength = ref(false)

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const debouncedValue = refDebounced(
  computed(() => props.modelValue ?? ''),
  300,
)

const passwordStrength = ref<null | {
  score: number
  feedback: { warning: string; suggestions: string[] }
}>(null)

watch(debouncedValue, async (newValue) => {
  if (!newValue) {
    passwordStrength.value = null
    return
  }

  isCheckingStrength.value = true

  try {
    passwordStrength.value = await checkPasswordStrengthApi(newValue.trim())
  } catch {
    passwordStrength.value = null
  } finally {
    isCheckingStrength.value = false
  }
})

const strengthLabel = computed(() => {
  if (!passwordStrength.value) return ''
  const labels = ['Очень слабый', 'Слабый', 'Средний', 'Надежный', 'Отличный']
  return labels[passwordStrength.value.score]
})

const strengthColorClass = computed(() => {
  if (!passwordStrength.value) return 'bg-gray-200'
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-600']
  return colors[passwordStrength.value.score]
})

const requirements = [
  { label: 'Минимальное количество символов: 10', check: (val: string) => val.trim().length >= 10 },
]

const checklist = computed(() =>
  requirements.map((req) => ({
    label: req.label,
    isMet: req.check(debouncedValue.value || ''),
  })),
)

function handleTogglePasswordVisibility() {
  if (!passwordRef.value) return

  if (passwordRef.value.type === 'password') {
    passwordRef.value.type = 'text'
    isPasswordVisible.value = true
  } else {
    passwordRef.value.type = 'password'
    isPasswordVisible.value = false
  }
}

defineExpose({
  passwordStrength,
})
</script>

<template>
  <div class="flex flex-col gap-y-1.5">
    <div class="flex items-center relative">
      <KeyRound
        v-if="variant === 'auth'"
        class="size-4 absolute left-4 text-gray-400"
      />
      <input
        type="password"
        ref="passwordRef"
        :placeholder="placeholder"
        v-model="internalValue"
        v-bind="$attrs"
        :class="[
          variant === 'auth'
            ? 'py-2.5 px-10 bg-muted rounded-lg hover:border-gray-200 hover:bg-white focus-within:bg-white border-muted focus:border-blue-500 focus:ring-blue-500'
            : 'w-full border-none bg-gray-100 rounded-md pl-3 pr-10 truncate py-2 focus:ring-blue-500 focus:border-blue-500',
          'text-sm block w-full focus:outline-none focus:ring-1 disabled:opacity-50 disabled:pointer-events-none',
          {
            'ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500':
              error && submitCount > 0 && !isPasswordModifiedAfterSubmit,
          },
        ]"
      />
      <ShowPasswordButton
        :isPasswordVisible="isPasswordVisible"
        @toggle-password-visibility="handleTogglePasswordVisibility"
      />
    </div>

    <template v-if="modelValue && modelValue.length > 0">
      <div class="flex flex-col gap-y-1.5 mt-1">
        <div class="flex justify-between items-center text-[11px]">
          <span class="text-gray-400">Надежность пароля:</span>
          <span
            :class="[
              passwordStrength && passwordStrength.score >= 2 ? 'text-green-600' : 'text-red-500',
              'font-semibold',
            ]"
            v-if="!isCheckingStrength"
          >
            {{ strengthLabel }}
          </span>
          <Spinner
            class="size-3.5 text-gray-400"
            v-else
          />
        </div>
        <div class="flex gap-x-1">
          <div
            v-for="i in 4"
            :key="i"
            class="h-1 w-full rounded-full transition-all duration-300"
            :class="[
              passwordStrength && passwordStrength.score >= i ? strengthColorClass : 'bg-gray-200',
            ]"
          />
        </div>
      </div>

      <ul class="text-xs mt-0.5">
        <li
          v-for="(item, index) in checklist"
          :key="index"
          class="text-xs transition-colors duration-300 list-disc list-inside"
          :class="{
            'text-green-600': item.isMet,
            'text-gray-400': !item.isMet,
          }"
        >
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </template>

    <ul
      class="text-xs text-red-600"
      id="password-validation-error"
      v-if="error && submitCount > 0 && !isPasswordModifiedAfterSubmit"
    >
      <li class="list-inside flex items-center gap-1">
        <CircleX class="size-3" /><span>{{ error }}</span>
      </li>
    </ul>
  </div>
</template>
