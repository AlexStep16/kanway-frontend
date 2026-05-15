<script setup lang="ts">
import { AvailableColors } from '~/enums/AvailableColors'
import { X } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import { toTypedSchema } from '@vee-validate/zod'
import z from 'zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

const uiStore = useUIStore()

const isWorkspaceDialogOpen = computed(() => uiStore.isWorkspaceDialogOpen)

const { mutate: createWorkspace, isPending: isCreatingWorkspace } = useCreateWorkspace()

const schema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(1, 'Название пространства не может быть пустым')
      .max(100, 'Название пространства не может быть длиннее 100 символов'),
    color: z
      .string()
      .refine((value) => Object.values(AvailableColors).includes(value as AvailableColors), {
        message: 'Выберите цвет для пространства',
      }),
  }),
)

const { handleSubmit, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    color: AvailableColors.BLUE,
  },
})

const [name, nameAttrs] = defineField('name')
const [color] = defineField('color')

const onSubmit = handleSubmit(
  (values) => {
    createWorkspace(
      {
        payload: {
          name: values.name,
          color: values.color as AvailableColors,
        },
      },
      {
        onSuccess() {
          uiStore.isWorkspaceDialogOpen = false
        },
      },
    )
  },
  (values) => {
    if (values.errors.name) toast.error(values.errors.name)
    if (values.errors.color) toast.error(values.errors.color)
  },
)

const isSubmitDisabled = computed(() => {
  return isCreatingWorkspace.value || !name.value?.trim() || !color.value
})

const getFirstNameLetted = computed(() => {
  if (!name.value) return ''

  return name.value.trim()[0]!.toUpperCase()
})
</script>

<template>
  <Dialog v-model:open="isWorkspaceDialogOpen">
    <DialogContent
      class="sm:max-w-[425px] p-4"
      :show-close-button="false"
    >
      <DialogClose
        class="absolute top-2.5 right-2.5 inline-flex appearance-none items-center justify-center rounded-md p-1 hover:bg-secondary hover:text-foreground"
        aria-label="Close"
      >
        <X class="size-4.5" />
      </DialogClose>

      <DialogHeader>
        <DialogTitle class="text-base">Создание пространства</DialogTitle>
        <DialogDescription class="sr-only">
          Введите имя для вашего нового пространства. Вы всегда сможете изменить его позже.
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <Label
            for="name-1"
            class="text-sm"
            >Название</Label
          >
          <Input
            id="name-1"
            autocomplete="off"
            name="workspace"
            v-bind="nameAttrs"
            v-model="name"
          />
        </div>
        <div class="flex flex-col gap-1">
          <Label class="text-sm">Цвет</Label>
          <div class="flex gap-2 w-full flex-wrap">
            <Button
              :class="
                cn(
                  'size-7 flex p-0 hover:scale-120 transition-transform duration-200',
                  color === availableColor && 'ring-2 ring-blue-500 ring-offset-1 scale-110',
                )
              "
              v-for="availableColor in Object.values(AvailableColors)"
              :key="availableColor"
              :style="{ backgroundColor: availableColor }"
              @click="color = availableColor"
            >
              {{ availableColor === color ? getFirstNameLetted || '✓' : '' }}
            </Button>
          </div>
        </div>
      </div>
      <Separator />
      <DialogFooter>
        <DialogClose as-child>
          <Button
            size="sm"
            class="text-xs"
            variant="outline"
          >
            Отмена
          </Button>
        </DialogClose>
        <Button
          size="sm"
          class="text-xs"
          @click="onSubmit"
          :disabled="isSubmitDisabled"
        >
          <template v-if="isCreatingWorkspace">
            <Spinner />
            <span>Создание</span>
          </template>
          <span v-else>Создать</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
