<script setup lang="ts">
import { AvailableColors } from '@enums/AvailableColors'
import { generateUUID } from '@utils/idGenerator'
import Body from '@components/Forms/CreateEditWorkspace/Body.vue'
import { HSDropdown } from 'preline'
import { computed, onMounted, ref } from 'vue'
import { workspaceValidation } from '@helpers/workspaceValidation'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { toast } from 'vue-sonner'
import { WorkspaceValidationErrors } from '@interfaces/WorkspaceValidationErrors'
import WorkspaceModel from '@/models/WorkspaceModel'
import { Nullable } from '@/types/utils'

const dropdown = ref<Nullable<HTMLElement>>(null)
const dropdownMenu = ref<Nullable<HTMLElement>>(null)
const dropdownInstance = ref<Nullable<HSDropdown>>(null)

const validationErrors = ref<WorkspaceValidationErrors>({
  name: { isValid: true, errorMessage: '' },
})

const WORKSPACE_STORE = useWorkspaceDataStore()

const name = ref('')
const color = ref<AvailableColors>(AvailableColors.BLUE)

const props = defineProps<{
  item?: WorkspaceModel
  isDropdown?: boolean
  dropdownClasses?: string
  mode: 'create' | 'edit'
  dropdownMenuWidth?: number
}>()

const emit = defineEmits<{
  (e: 'workspaceCreated', workspace: WorkspaceModel): void
  (e: 'workspaceEdited', workspace: WorkspaceModel): void
}>()

async function createWorkspace() {
  if (validationErrors.value.name.isValid === false) return

  const workspace = {
    name: name.value,
    color: color.value,
  }

  validationErrors.value = workspaceValidation(workspace)

  if (!validationErrors.value.name.isValid) {
    toast.error(validationErrors.value.name.errorMessage)

    return
  }

  const result = await WORKSPACE_STORE.addWorkspace(workspace)

  if (result !== false && typeof result === 'object' && result !== null) {
    closeDropdown()
    emit('workspaceCreated', result as WorkspaceModel)

    resetForm()
  }
}

async function editWorkspace() {
  if (props.item == null) return

  if (validationErrors.value.name.isValid === false) return

  const workspace = {
    ...props.item,
    name: name.value,
    color: color.value,
  }

  validationErrors.value = workspaceValidation(workspace)

  if (!validationErrors.value.name.isValid) {
    toast.error(validationErrors.value.name.errorMessage)

    return
  }

  const result = await WORKSPACE_STORE.updateWorkspace(workspace)

  if (result !== false) {
    closeDropdown()

    emit('workspaceEdited', result)
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

function resetForm() {
  if (props.item) {
    name.value = props.item.name
    color.value = props.item.color
    resetErrors()

    return
  }

  name.value = ''
  color.value = AvailableColors.BLUE
  resetErrors()
}

function handleSubmit() {
  if (props.mode === 'create') {
    createWorkspace()
  } else {
    editWorkspace()
  }
}

const getIsLoading = computed(() => {
  if (props.mode === 'create') {
    return WORKSPACE_STORE.isAddingWorkspace
  } else if (props.item) {
    return WORKSPACE_STORE.isWorkspaceEditing(props.item.id)
  } else {
    return false
  }
})

const isFormChanged = computed(() => {
  if (props.item) {
    return name.value !== props.item.name || color.value !== props.item.color
  } else {
    return name.value !== '' || color.value !== AvailableColors.BLUE
  }
})

defineExpose({
  resetForm,
})

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  if (props.item) {
    name.value = props.item.name
    color.value = props.item.color
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
        v-model:color="color"
        :mode="mode"
        :errors="validationErrors"
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
    v-model:color="color"
    :mode="mode"
    :errors="validationErrors"
    :dropdownMenuWidth="dropdownMenuWidth"
  />
</template>
