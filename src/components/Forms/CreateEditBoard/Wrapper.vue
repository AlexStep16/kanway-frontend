<script setup lang="ts">
import { generateUUID } from '@utils/idGenerator'
import Body from '@components/Forms/CreateEditBoard/Body.vue'
import { HSDropdown, HSStaticMethods } from 'preline'
import { computed, onMounted, ref } from 'vue'
import { boardValidation } from '@helpers/boardValidation'
import { toast } from 'vue-sonner'
import { BoardValidationErrors } from '@interfaces/BoardValidationErrors'
import type BoardModel from '@/models/BoardModel'
import { Nullable } from '@/types/utils'
import { useWorkspaceStore } from '@/stores/workspace'
import { useCreateBoard } from '@/composables/boards/mutations/useCreateBoard'
import { useUpdateBoard } from '@/composables/boards/mutations/useUpdateBoard'
import { storeToRefs } from 'pinia'
import { IBoard } from '@/interfaces/domain/IBoard'
import { onClickOutside } from '@vueuse/core'

const dropdown = ref<Nullable<HTMLElement>>(null)
const dropdownMenu = ref<Nullable<HTMLElement>>(null)
const dropdownInstance = ref<Nullable<HSDropdown>>(null)

const { mutateAsync: createBoardMutation, isPending: isCreating } = useCreateBoard()
const { mutateAsync: updateBoardMutation, isPending: isUpdating } = useUpdateBoard()

const validationErrors = ref<BoardValidationErrors>({
  name: { isValid: true, errorMessage: '' },
})

const WORKSPACE_STORE = useWorkspaceStore()

const { activeWorkspaceId } = storeToRefs(WORKSPACE_STORE)

const name = ref('')
const isFormChanged = computed(() => {
  if (props.item) {
    return name.value !== props.item.name
  } else {
    return name.value.trim() !== ''
  }
})

const props = defineProps<{
  item?: BoardModel
  mode: 'create' | 'edit'
  isDropdown?: boolean
  dropdownClasses?: string
  dropdownMenuWidth?: number
}>()

const emit = defineEmits<{
  (e: 'boardCreated', board: IBoard): void
  (e: 'boardEdited', board: IBoard): void
}>()

function resetForm() {
  if (props.item) {
    name.value = props.item.name
    resetErrors()

    return
  }

  name.value = ''
  resetErrors()
}

defineExpose({
  resetForm,
})

async function createBoard() {
  if (validationErrors.value.name.isValid === false || !activeWorkspaceId.value) return

  const board = {
    name: name.value,
  }

  validationErrors.value = boardValidation(board)

  if (!validationErrors.value.name.isValid) {
    toast.error(validationErrors.value.name.errorMessage)

    return
  }

  await createBoardMutation(
    {
      payload: {
        ...board,
        workspaceId: activeWorkspaceId.value,
      },
    },
    {
      onSuccess: (result) => {
        closeDropdown()
        emit('boardCreated', result.data[0])

        resetForm()
      },
    },
  )
}

async function editBoard() {
  if (props.item == null) return
  if (validationErrors.value.name.isValid === false) return
  if (!activeWorkspaceId.value) return

  const board = {
    ...props.item,
    name: name.value,
  }

  validationErrors.value = boardValidation(board)

  if (!validationErrors.value.name.isValid) {
    toast.error(validationErrors.value.name.errorMessage)

    return
  }

  await updateBoardMutation(
    { payload: board, workspaceId: activeWorkspaceId.value },
    {
      onSuccess: (result) => {
        closeDropdown()

        emit('boardEdited', result.data[0])
      },
    },
  )
}

function closeDropdown() {
  if (dropdownInstance.value) {
    dropdownInstance.value.close()
  }
}

function resetErrors() {
  validationErrors.value = {
    name: { isValid: true, errorMessage: '' },
  }
}

function handleSubmit() {
  if (props.mode === 'create') {
    createBoard()
  } else {
    editBoard()
  }
}

onClickOutside(dropdownMenu, () => {
  dropdownInstance.value?.close()
})

onMounted(() => {
  HSStaticMethods.autoInit()

  if (props.item) {
    name.value = props.item.name
  }

  if (dropdown.value && dropdown.value instanceof HTMLElement) {
    dropdownInstance.value = HSDropdown.getInstance(dropdown.value) as Nullable<HSDropdown>

    if (dropdownInstance.value) {
      dropdownInstance.value.on('close', resetForm)
    }
  }
})
</script>

<template>
  <div
    class="hs-dropdown [--strategy:absolute] [--offset:2] [--auto-close:false] relative w-full inline-flex"
    :class="dropdownClasses"
    ref="dropdown"
    v-if="isDropdown"
  >
    <slot />

    <div
      class="hs-dropdown-menu hs-dropdown-open:opacity-100 transition-[opacity,margin] duration opacity-0 hidden z-80 bg-white border border-gray-200 rounded-lg shadow-lg"
      role="menu"
      ref="dropdownMenu"
      aria-orientation="vertical"
      aria-labelledby="hs-sidebar-workspace-create"
    >
      <Body
        :id="generateUUID()"
        :isLoading="isCreating || isUpdating"
        :isFormChanged="isFormChanged"
        @resetErrors="resetErrors"
        @submit="handleSubmit"
        v-model:name="name"
        :errors="validationErrors"
        :mode="mode"
        :dropdownMenuWidth="dropdownMenuWidth"
      />
    </div>
  </div>

  <Body
    v-else
    :id="generateUUID()"
    :isLoading="isCreating || isUpdating"
    :isFormChanged="isFormChanged"
    @resetErrors="resetErrors"
    @submit="handleSubmit"
    v-model:name="name"
    :errors="validationErrors"
    :mode="mode"
    :dropdownMenuWidth="dropdownMenuWidth"
  />
</template>
