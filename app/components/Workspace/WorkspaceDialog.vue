<script setup lang="ts">
import { AvailableColors } from '~/enums/AvailableColors'
import { X } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import { toTypedSchema } from '@vee-validate/zod'
import z from 'zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

const uiStore = useUIStore()

const { mutate: createWorkspace, isPending: isCreatingWorkspace } = useCreateWorkspace()
const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace()

const isDialogOpen = computed({
  get: () => uiStore.isWorkspaceDialogOpen,
  set: (value) => {
    if (value) {
      return
    }

    uiStore.closeWorkspaceDialog()
  },
})

const editableWorkspace = computed(() => uiStore.editableWorkspace)
const isEditMode = computed(() => !!editableWorkspace.value)
const dialogTitle = computed(() =>
  isEditMode.value ? 'Редактирование пространства' : 'Создание пространства',
)
const dialogDescription = computed(() =>
  isEditMode.value
    ? 'Измените название и цвет пространства.'
    : 'Введите имя для вашего нового пространства. Вы всегда сможете изменить его позже.',
)

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

const { handleSubmit, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    color: AvailableColors.BLUE,
  },
})

const [name, nameAttrs] = defineField('name')
const [color] = defineField('color')

watch(
  editableWorkspace,
  (workspace) => {
    resetForm({
      values: {
        name: workspace?.name ?? '',
        color: workspace?.color ?? AvailableColors.BLUE,
      },
    })
  },
  { immediate: true },
)

const onSubmit = handleSubmit(
  (values) => {
    const payload = {
      name: values.name.trim(),
      color: values.color as AvailableColors,
    }

    if (editableWorkspace.value) {
      updateWorkspace(
        {
          payload: {
            id: editableWorkspace.value.id,
            ...payload,
          },
        },
        {
          onSuccess() {
            uiStore.closeWorkspaceDialog()
          },
        },
      )

      return
    }

    createWorkspace(
      {
        payload,
      },
      {
        onSuccess() {
          uiStore.closeWorkspaceDialog()
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
  return isSubmitting.value || !name.value?.trim() || !color.value
})

const isSubmitting = computed(() => isCreatingWorkspace.value || isUpdatingWorkspace.value)

const getFirstNameLetter = computed(() => {
  if (!name.value) return ''

  return name.value.trim()[0]!.toUpperCase()
})
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent
      class="sm:max-w-106.25 p-4"
      :show-close-button="false"
    >
      <DialogClose
        class="absolute top-2.5 right-2.5 inline-flex appearance-none items-center justify-center rounded-md p-1 hover:bg-secondary hover:text-foreground"
        aria-label="Close"
      >
        <X class="size-4.5" />
      </DialogClose>

      <DialogHeader>
        <DialogTitle class="text-base">{{ dialogTitle }}</DialogTitle>
        <DialogDescription class="sr-only">
          {{ dialogDescription }}
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
                  'size-7 flex p-0 hover:scale-115 transition-transform duration-200',
                  color === availableColor && 'ring-2 ring-blue-500 ring-offset-1 scale-110',
                )
              "
              v-for="availableColor in Object.values(AvailableColors)"
              :key="availableColor"
              :style="{ backgroundColor: availableColor }"
              @click="color = availableColor"
            >
              {{ availableColor === color ? getFirstNameLetter || '✓' : '' }}
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
          <template v-if="isSubmitting">
            <Spinner />
            <span>{{ isEditMode ? 'Сохранение' : 'Создание' }}</span>
          </template>
          <span v-else>{{ isEditMode ? 'Сохранить' : 'Создать' }}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
