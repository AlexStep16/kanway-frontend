<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { ThemesEnum } from '~/enums/ThemesEnum'

const uiStore = useUIStore()

const { mutate: sendSupport, isPending: isSending } = useSendSupport()

const { data: user } = useUser()

const schema = toTypedSchema(
  z.object({
    email: z.email('Неверный формат почты').min(1, 'Почта должна быть заполнена'),
    name: z
      .string()
      .min(1, 'Имя должно быть заполнено')
      .max(100, 'Имя должно быть не длиннее 100 символов'),
    details: z
      .string()
      .min(1, 'Подробности должны быть заполнены')
      .max(1000, 'Подробности должны быть не длиннее 1000 символов'),
    theme: z.enum(ThemesEnum, {
      error: () => ({ message: 'Тема должна быть выбрана' }),
    }),
  }),
)

const { handleSubmit, resetForm, setValues, submitCount } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    name: '',
    details: '',
    theme: ThemesEnum.AI_ASSISTANT,
  },
})

const validationTriggers = computed(() => ({
  validateOnInput: submitCount.value > 0,
  validateOnChange: submitCount.value > 0,
  validateOnBlur: submitCount.value > 0,
  validateOnModelUpdate: submitCount.value > 0,
}))

const onSubmit = handleSubmit((values) => {
  sendSupport(
    {
      theme: values.theme,
      details: values.details,
      email: values.email,
      name: values.name,
    },
    {
      onSuccess: () => {
        uiStore.isSupportModalOpen = false
        resetForm()
      },
    },
  )
})

watch(
  user,
  (newUser) => {
    if (newUser) {
      setValues({
        name: newUser.username || '',
        email: newUser.email || '',
      })
    }
  },
  { immediate: true },
)

watch(
  () => uiStore.isSupportModalOpen,
  (val) => {
    if (!val) resetForm()
  },
)
</script>

<template>
  <Dialog v-model:open="uiStore.isSupportModalOpen">
    <DialogContent
      class="sm:max-w-125 max-h-[95svh] p-0 overflow-hidden border-none shadow-2xl rounded-xl"
    >
      <div class="relative bg-background p-6 sm:p-8">
        <div class="text-center mb-8">
          <DialogTitle class="text-2xl font-bold text-foreground sm:text-3xl">
            Как мы можем вам помочь?
          </DialogTitle>
          <DialogDescription class="mt-2 text-sm text-muted-foreground">
            Расскажите о вашей проблеме, и мы свяжемся с вами.
          </DialogDescription>
        </div>

        <form
          @submit="onSubmit"
          class="space-y-4"
        >
          <FormField
            v-slot="{ componentField }"
            v-bind="validationTriggers"
            name="name"
          >
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Иван"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            v-bind="validationTriggers"
            name="email"
          >
            <FormItem>
              <FormLabel>Почта</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="example@mail.com"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            v-bind="validationTriggers"
            name="theme"
          >
            <FormItem>
              <FormLabel>Тема</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тему..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem :value="ThemesEnum.ACCOUNT">Аккаунт</SelectItem>
                  <SelectItem :value="ThemesEnum.AI_ASSISTANT">ИИ ассистент</SelectItem>
                  <SelectItem :value="ThemesEnum.BOARDS">Доски и задачи</SelectItem>
                  <SelectItem :value="ThemesEnum.PAYMENTS">Оплата</SelectItem>
                  <SelectItem :value="ThemesEnum.BUG_REPORT">Ошибка</SelectItem>
                  <SelectItem :value="ThemesEnum.FEATURE_REQUEST">Предложение</SelectItem>
                  <SelectItem :value="ThemesEnum.OTHER">Другое</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            v-bind="validationTriggers"
            name="details"
          >
            <FormItem>
              <FormLabel>Подробности</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишите вашу проблему..."
                  class="resize-none"
                  rows="4"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="pt-2">
            <Button
              type="submit"
              class="w-full"
              :disabled="isSending"
            >
              <Spinner
                v-if="isSending"
                class="mr-2 size-4"
              />
              Отправить запрос
            </Button>
            <p class="mt-3 text-center text-[11px] text-muted-foreground">
              Мы свяжемся с вами в течение 1-2 рабочих дней.
            </p>
          </div>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>
