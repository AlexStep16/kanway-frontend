<script setup lang="ts">
import { generateUUID } from '@utils/idGenerator'
import Body from '@components/Forms/CreateEditBoard/Body.vue'
import { HSDropdown } from 'preline'
import { computed, onMounted, ref } from 'vue'
import { boardValidation } from '@helpers/boardValidation'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { toast } from 'vue-sonner'
import { BoardValidationErrors } from '@interfaces/BoardValidationErrors'
import type BoardModel from '@/models/BoardModel'
import { Nullable } from '@/types/utils'

const dropdown = ref<Nullable<HTMLElement>>(null)
const dropdownMenu = ref<Nullable<HTMLElement>>(null)
const dropdownInstance = ref<Nullable<HSDropdown>>(null)

const validationErrors = ref<BoardValidationErrors>({
  name: { isValid: true, errorMessage: '' },
})

const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()

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
  (e: 'boardCreated', board: BoardModel): void
  (e: 'boardEdited', board: BoardModel): void
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

const getIsLoading = computed(() => {
  if (props.mode === 'create') {
    return BOARD_STORE.isAddingBoard
  } else if (props.item) {
    return BOARD_STORE.isBoardEditing(props.item.id)
  } else {
    return false
  }
})

defineExpose({
  resetForm,
})

async function createBoard() {
  if (validationErrors.value.name.isValid === false) return

  const board = {
    name: name.value,
  }

  validationErrors.value = boardValidation(board)

  if (!validationErrors.value.name.isValid) {
    toast.error(validationErrors.value.name.errorMessage)

    return
  }

  const result = await BOARD_STORE.addBoardToWorkspace(board, WORKSPACE_STORE.getActiveWorkspaceId)

  if (result !== false && typeof result === 'object' && result !== null) {
    closeDropdown()
    emit('boardCreated', result as BoardModel)

    resetForm()
  }
}

async function editBoard() {
  if (props.item == null) return

  if (validationErrors.value.name.isValid === false) return

  const board = {
    ...props.item,
    name: name.value,
  }

  validationErrors.value = boardValidation(board)

  if (!validationErrors.value.name.isValid) {
    toast.error(validationErrors.value.name.errorMessage)

    return
  }

  const result = await BOARD_STORE.updateBoard(board)

  if (result !== false) {
    closeDropdown()

    emit('boardEdited', result)
  }
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

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  if (props.item) {
    name.value = props.item.name
  }

  if (dropdown.value && dropdown.value instanceof HTMLElement) {
    dropdownInstance.value = HSDropdown.getInstance(dropdown.value) as Nullable<HSDropdown>

    if (dropdownInstance.value) {
      dropdownInstance.value.on('close', resetForm)

      document.addEventListener('mousedown', (e: any) => {
        if (
          dropdownInstance.value &&
          dropdownMenu.value &&
          !dropdownMenu.value.contains(e.target)
        ) {
          if (dropdownInstance.value) {
            dropdownInstance.value.close()
          }
        }
      })
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
        :isLoading="getIsLoading"
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
    :isLoading="getIsLoading"
    :isFormChanged="isFormChanged"
    @resetErrors="resetErrors"
    @submit="handleSubmit"
    v-model:name="name"
    :errors="validationErrors"
    :mode="mode"
    :dropdownMenuWidth="dropdownMenuWidth"
  />
</template>
