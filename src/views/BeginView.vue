<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { LogOut, Camera } from 'lucide-vue-next'
import ColorButtons from '@/components/Buttons/ColorButtons.vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { HSAccordion, HSStaticMethods } from 'preline'
import Avatar from '@components/Workspace/Settings/Avatar.vue'
import { AvailableColors } from '@enums/AvailableColors'
import { Nullable } from '@/types/utils'
import SubmitButton from '@/components/Forms/BasicCreateEditForm/SubmitButton.vue'
import { useCreateWorkspace } from '@/composables/workspaces/mutations/useCreateWorkspace'
import { useUpdateUser } from '@/composables/auth/mutations/useUpdateUser'
import { useUser } from '@/composables/auth/queries/useUser'
import KanwayLogo from '@assets/kanway_logo.svg?component'

enum Tab {
  WORKSPACE = 0,
  USER = 1,
  AVATAR = 2,
}

const { data: user } = useUser()

const { mutate: createWorkspace, isPending: isAddingWorkspace } = useCreateWorkspace()
const { mutate: updateUsername, isPending: isUsernameUpdating } = useUpdateUser()
const { mutate: updateAvatarColor, isPending: isUserAvatarColorUpdating } = useUpdateUser()

const validationErrors = ref({
  workspaceName: '',
  username: '',
})

const colorsAccordion = ref<Nullable<HTMLElement>>(null)
const colorsAccordionInstance = ref<Nullable<HSAccordion>>(null)
const workspaceName = ref('')
const workspaceColor = ref(AvailableColors.BLUE)
const username = ref('')
const avatarColor = ref(user.value ? user.value.avatarColor : AvailableColors.BLUE)
const oldAvatarColor = ref(avatarColor.value)
const currentTab = ref(Tab.WORKSPACE)
const progressLabelRef = ref<Nullable<HTMLElement>>(null)
const progressBarRef = ref<Nullable<HTMLElement>>(null)

function workspaceNameInputHandler() {
  if (colorsAccordionInstance.value) {
    colorsAccordionInstance.value.show()
  }
}

function validateWorkspaceName(name: string): boolean {
  let isValid = true

  if (name.trim().length < 1) {
    validationErrors.value.workspaceName = 'Название должно содержать не менее 1 символов'

    isValid = false
  } else if (name.length > 100) {
    validationErrors.value.workspaceName = 'Название не должно превышать 100 символов'

    isValid = false
  } else {
    validationErrors.value.workspaceName = ''
  }

  return isValid
}

function validateUsername(name: string): boolean {
  let isValid = true

  if (name.trim().length < 1) {
    validationErrors.value.username = 'Имя должно содержать не менее 1 символов'

    isValid = false
  } else if (name.length > 50) {
    validationErrors.value.username = 'Имя не должно превышать 50 символов'

    isValid = false
  } else {
    validationErrors.value.username = ''
  }

  return isValid
}

function resetValidationUsername() {
  validationErrors.value.username = ''
}

const getCurrentProgress = computed((): number => {
  switch (currentTab.value) {
    case Tab.WORKSPACE:
      return 0
    case Tab.USER:
      return 50
    case Tab.AVATAR:
      return 100
    default:
      return 0
  }
})

function getProgressLabelWidth() {
  if (progressLabelRef.value) {
    return progressLabelRef.value.offsetWidth
  }
  return 40
}

function updateProgressLabel() {
  nextTick(() => {
    const labelWidth = getProgressLabelWidth()

    if (progressLabelRef.value && progressBarRef.value) {
      const progressBarWidth = progressBarRef.value.offsetWidth

      let left = progressBarWidth * (getCurrentProgress.value / 100) - labelWidth / 2

      if (left < 0) left = 0
      if (left + labelWidth > progressBarWidth) left = progressBarWidth - labelWidth

      progressLabelRef.value.style.left = left + 'px'
    }
  })
}

async function handleCreateWorkspace() {
  if (!validateWorkspaceName(workspaceName.value)) {
    return
  }

  createWorkspace(
    {
      payload: { name: workspaceName.value, color: workspaceColor.value },
    },
    {
      onSettled: () => {
        currentTab.value = Tab.USER
      },
    },
  )
}

async function handleUpdateUsername() {
  if (!validateUsername(username.value)) {
    return
  }

  updateUsername(
    {
      id: user.value!.id,
      username: username.value,
    },
    {
      onSuccess: () => {
        currentTab.value = Tab.AVATAR
      },
    },
  )
}

async function handleUpdateAvatarColor() {
  if (avatarColor.value === oldAvatarColor.value) return

  updateAvatarColor(
    {
      id: user.value!.id,
      avatarColor: avatarColor.value,
    },
    {
      onSuccess: () => {
        oldAvatarColor.value = avatarColor.value

        navigate('/workspace')
      },
    },
  )
}

watch(getCurrentProgress, () => updateProgressLabel(), { immediate: true })

onMounted(() => {
  HSStaticMethods.autoInit()

  if (colorsAccordion.value && colorsAccordion.value instanceof HTMLElement) {
    const { element } = HSAccordion.getInstance(colorsAccordion.value, true) as any

    colorsAccordionInstance.value = element
  }

  window.addEventListener('resize', () => updateProgressLabel())
})
</script>

<template>
  <div class="size-full bg-gray-100 fixed inset-0 flex flex-col">
    <header class="w-full py-5 px-4 sm:px-10 flex justify-between items-center">
      <a @click="navigate('/')" class="cursor-pointer" aria-label="На главную">
        <KanwayLogo class="h-8 sm:h-10" />
      </a>

      <button
        type="button"
        class="inline-flex gap-x-1 py-2 px-3 text-xs self-start font-semibold rounded-md border border-transparent bg-red-100 text-red-500 transition-colors duration-100 hover:bg-red-200 disabled:opacity-50 disabled:pointer-events-none"
      >
        <LogOut class="size-4" />
        <span>Выйти</span>
      </button>
    </header>

    <main class="flex items-center justify-center grow">
      <div class="flex flex-col gap-y-6 max-h-100 h-full p-4 justify-between w-full max-w-100">
        <TransitionGroup
          class="flex items-center justify-center h-full relative"
          tag="div"
          name="slide-left"
        >
          <div class="flex items-center justify-center w-full" :key="currentTab">
            <div
              class="rounded-lg flex flex-col gap-y-4 sm:gap-y-6 items-center w-full"
              v-if="currentTab === Tab.WORKSPACE"
            >
              <div class="text-center space-y-2 sm:space-y-3 items-center w-full">
                <h1 class="text-2xl sm:text-3xl text-gray-800 font-bold">Давайте начнем!</h1>
                <p class="text-sm text-center text-gray-500">
                  Введите название вашего первого пространства
                </p>
              </div>
              <div class="flex flex-col gap-y-2 items-start w-full">
                <div class="flex flex-col items-start gap-y-1 w-full">
                  <input
                    type="text"
                    class="text-sm flex-1 w-full py-2 px-4 border bg-gray-50 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{
                      'ring-1 ring-red-500 focus:ring-red-500': validationErrors.workspaceName,
                    }"
                    maxlength="100"
                    placeholder="Например, Команда маркетинга"
                    @input="workspaceNameInputHandler"
                    v-model="workspaceName"
                  />
                  <div v-if="validationErrors.workspaceName" class="text-red-500 text-xs">
                    {{ validationErrors.workspaceName }}
                  </div>
                </div>

                <div class="hs-accordion" id="hs-unstyled-heading-one" ref="colorsAccordion">
                  <button
                    class="hs-accordion-toggle hidden"
                    aria-expanded="true"
                    aria-controls="hs-unstyled-collapse-one"
                  ></button>
                  <div
                    id="hs-basic-collapse-two"
                    class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                    role="region"
                    aria-labelledby="hs-basic-heading-two"
                  >
                    <div class="flex flex-col items-start gap-y-1 w-full pb-1 px-1">
                      <p class="text-sm text-gray-500">Выберите цвет</p>
                      <ColorButtons
                        :color="workspaceColor"
                        :size="9"
                        @selectColor="(color: AvailableColors) => (workspaceColor = color)"
                      >
                        <span class="font-bold text-white">{{
                          workspaceName.substring(0, 1)
                        }}</span>
                      </ColorButtons>
                    </div>
                  </div>
                </div>
              </div>

              <SubmitButton
                :isLoading="isAddingWorkspace"
                :isFormChanged="workspaceName.length > 0"
                :customClass="'text-sm'"
                text="Создать"
                @submit="handleCreateWorkspace"
              ></SubmitButton>
            </div>

            <div
              class="rounded-lg flex flex-col gap-y-2 sm:gap-y-4 items-center w-full"
              v-if="currentTab === Tab.USER"
            >
              <div class="text-center space-y-2 sm:space-y-3 items-center w-full">
                <h1 class="text-2xl sm:text-3xl text-gray-800 font-bold">Представьтесь</h1>
                <p class="text-sm text-center text-gray-500">Как к вам обращаться?</p>
              </div>
              <div class="flex flex-col gap-y-2 items-start w-full">
                <div class="flex flex-col items-start gap-y-1 w-full">
                  <input
                    type="text"
                    class="text-sm flex-1 w-full py-2 px-4 border bg-gray-50 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{
                      'ring-1 ring-red-500 focus:ring-red-500': validationErrors.workspaceName,
                    }"
                    @input="resetValidationUsername"
                    maxlength="50"
                    placeholder="Например, Иван Петров"
                    v-model="username"
                  />

                  <div v-if="validationErrors.username" class="text-red-500 text-xs">
                    {{ validationErrors.username }}
                  </div>
                </div>
              </div>

              <SubmitButton
                :isLoading="isUsernameUpdating"
                :isFormChanged="username.length > 0"
                :customClass="'text-sm'"
                text="Сохранить"
                @submit="handleUpdateUsername"
              ></SubmitButton>
            </div>

            <div
              class="rounded-lg flex flex-col gap-y-2 sm:gap-y-4 items-center w-full"
              v-if="currentTab === Tab.AVATAR"
            >
              <div class="text-center space-y-2 sm:space-y-3 items-center w-full">
                <h1 class="text-2xl sm:text-3xl text-gray-800 font-bold">Выберите аватар</h1>
                <p class="text-sm text-center text-gray-500">
                  Вы можете загрузить изображение<br />
                  или выбрать цвет фона
                </p>
              </div>
              <div class="flex flex-col items-center gap-y-3 w-full">
                <div class="w-full flex justify-center">
                  <Avatar
                    :avatarColor="avatarColor"
                    class="size-17"
                    imageClasses="text-3xl sm:text-4xl"
                  >
                    <Camera class="size-8" />
                  </Avatar>
                </div>
                <ColorButtons
                  :color="avatarColor"
                  @selectColor="(color: AvailableColors) => (avatarColor = color)"
                  :size="9"
                />
              </div>

              <SubmitButton
                :isLoading="isUserAvatarColorUpdating"
                :isFormChanged="true"
                :customClass="'text-sm'"
                text="Сохранить"
                @submit="handleUpdateAvatarColor"
              ></SubmitButton>
            </div>
          </div>
        </TransitionGroup>

        <div class="flex w-full">
          <div class="space-y-3 w-full">
            <!-- Progress -->
            <div>
              <div
                class="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                role="progressbar"
                ref="progressBarRef"
                :aria-valuenow="getCurrentProgress"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition-width duration-500"
                  :style="{ width: getCurrentProgress + '%' }"
                ></div>
              </div>

              <div
                class="relative inline-block mt-2 py-0.5 px-1.5 bg-blue-50 border border-blue-200 text-xs font-medium transition-all duration-500 text-blue-600 rounded-lg"
                ref="progressLabelRef"
              >
                {{ getCurrentProgress }}%
              </div>
            </div>
            <!-- End Progress -->
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
