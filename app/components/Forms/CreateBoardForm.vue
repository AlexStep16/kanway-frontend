<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'

import Input from '~/components/ui/input/Input.vue'
import Button from '~/components/ui/button/Button.vue'
import Spinner from '../ui/spinner/Spinner.vue'
import { ref } from 'vue'

const { mutate: createBoard, isPending: isCreatingBoard } = useCreateBoard()

const inputRef = ref<HTMLInputElement | null>(null)

const emits = defineEmits<{
  (e: 'close'): void
}>()

const props = defineProps<{
  workspaceId: string
}>()

const schema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(1, 'Название доски не может быть пустым')
      .max(100, 'Название доски не может быть длиннее 100 символов'),
  }),
)

const { handleSubmit, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
  },
})

const [name, nameAttrs] = defineField('name')

const connectExposed = (exposed: any) => {
  if (exposed?.inputRef) inputRef.value = exposed.inputRef
}

const onSubmit = handleSubmit(
  (values) => {
    createBoard(
      {
        payload: {
          name: values.name,
          workspaceId: props.workspaceId,
        },
      },
      {
        onSuccess() {
          emits('close')
        },
      },
    )
  },
  (values) => {
    if (values.errors.name) toast.error(values.errors.name)
  },
)

defineExpose({
  inputRef,
})
</script>

<template>
  <div class="flex flex-col gap-y-1">
    <Input
      :ref="connectExposed"
      placeholder="Название доски"
      v-model="name"
      v-bind="nameAttrs"
      @keydown.enter="onSubmit"
    />
    <Button
      size="sm"
      @click="onSubmit"
      :disabled="isCreatingBoard"
    >
      <template v-if="isCreatingBoard">
        <Spinner />
        <span>Создание</span>
      </template>
      <span v-else>Создать</span>
    </Button>
  </div>
</template>
