<script lang="ts" setup>
import { AvailableColors } from '~/enums/AvailableColors'
import KanwayLogo from '~/assets/kanway_logo.svg?skipsvgo'
import ExitButton from '~/components/Auth/ExitButton.vue'
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { FolderKanban, UserSquare } from '@lucide/vue'
import { cn } from '~/lib/utils'

const { data: user } = useUser()

const schema = toTypedSchema(
  z.object({
    workspaceName: z
      .string()
      .min(1, 'Название должно содержать не менее 1 символов')
      .max(100, 'Название не должно превышать 100 символов'),
    workspaceColor: z.enum(AvailableColors, {
      message: 'Выберите цвет для рабочего пространства',
    }),
    username: z
      .string()
      .min(1, 'Имя пользователя должно содержать не менее 1 символов')
      .max(50, 'Имя пользователя не должно превышать 50 символов'),
  }),
)

const openItem = ref('')
const isWorkspaceLoading = ref(false)

function preloadWorkspaceRoutes() {
  void Promise.all([
    import('~/pages/workspace/[[workspaceId]].vue'),
    import('~/pages/workspace/[[workspaceId]]/[[boardId]].vue'),
  ])
}

function toggleColors() {
  openItem.value = openItem.value === 'colors' ? '' : 'colors'
}

const { handleSubmit, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    workspaceName: '',
    workspaceColor: AvailableColors.BLUE,
    username: user.value?.username || '',
  },
})

const [workspaceName, workspaceNameAttrs] = defineField('workspaceName')
const [workspaceColor] = defineField('workspaceColor')
const [username, usernameAttrs] = defineField('username')

const { mutate: welcome, isPending: isWelcomePending } = useWelcome()

function workspaceNameInputHandler() {
  toggleColors()
}

const onSubmit = handleSubmit(
  (values) => {
    preloadWorkspaceRoutes()

    welcome(
      {
        payload: {
          workspaceName: values.workspaceName,
          workspaceColor: values.workspaceColor,
          username: values.username,
        },
      },
      {
        onSuccess: async (workspace) => {
          try {
            isWorkspaceLoading.value = true
            await nextTick()
            await navigateTo(`/workspace/${workspace.id}`)
          } catch {
            toast.error('Произошла ошибка при переходе на страницу рабочего пространства')
          } finally {
            isWorkspaceLoading.value = false
          }
        },
      },
    )
  },
  (values) => {
    if (values.errors.workspaceName) toast.error(values.errors.workspaceName)
    if (values.errors.username) toast.error(values.errors.username)
  },
)

const isCreatingWorkspace = computed(() => isWelcomePending.value)
</script>

<template>
  <div
    v-if="isWorkspaceLoading"
    class="min-h-screen w-full bg-white flex items-center justify-center p-6"
    role="status"
    aria-live="polite"
  >
    <div class="flex flex-col items-center gap-4 text-center text-gray-500">
      <Spinner class="size-7" />
      <p class="text-sm font-medium">Открываем рабочее пространство...</p>
    </div>
  </div>

  <div
    v-else
    class="size-full bg-gray-100 min-h-screen flex flex-col px-2"
  >
    <header class="w-full py-5 px-4 sm:px-10 flex justify-between items-center">
      <NuxtLink
        to="/"
        class="cursor-pointer"
        aria-label="На главную"
      >
        <KanwayLogo class="h-8 sm:h-10" />
      </NuxtLink>

      <ExitButton />
    </header>

    <main class="flex items-center justify-center grow">
      <div class="flex flex-col gap-4 w-full max-w-100">
        <h2 class="text-center text-2xl text-gray-700 font-bold">Давайте начнем!</h2>
        <div class="bg-white rounded-md border border-gray-200 p-4 justify-between w-full">
          <form
            @submit.prevent="onSubmit"
            novalidate
          >
            <div class="flex flex-col gap-y-2">
              <div class="flex flex-col gap-y-2">
                <span class="text-sm font-medium text-gray-700"
                  >Название рабочего пространства</span
                >
                <div class="flex items-center relative">
                  <FolderKanban class="size-4 absolute left-4 text-gray-400" />
                  <input
                    type="text"
                    @input="workspaceNameInputHandler"
                    id="workspaceName"
                    name="workspaceName"
                    class="py-2.5 pr-4 pl-10 text-sm block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    v-model="workspaceName"
                    v-bind="workspaceNameAttrs"
                    placeholder="Маркетинг"
                  />
                </div>
                <Accordion
                  v-model="openItem"
                  type="single"
                  collapsible
                  class="w-full border-none"
                >
                  <AccordionItem
                    value="color-selection"
                    class="border-none"
                  >
                    <AccordionTrigger class="hidden" />

                    <AccordionContent class="pb-2">
                      <div class="flex gap-2 w-full flex-wrap">
                        <Button
                          :class="
                            cn(
                              'size-7 flex p-0 hover:scale-115 transition-transform duration-200',
                              workspaceColor === availableColor &&
                                'ring-2 ring-blue-500 ring-offset-1 scale-110',
                            )
                          "
                          v-for="availableColor in Object.values(AvailableColors)"
                          :key="availableColor"
                          :style="{ backgroundColor: availableColor }"
                          @click="workspaceColor = availableColor"
                        >
                          {{
                            availableColor === workspaceColor
                              ? workspaceName?.substring(0, 1) || '✓'
                              : ''
                          }}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div class="flex flex-col gap-y-2">
                <span class="text-sm font-medium text-gray-700">Как к вам обращаться?</span>
                <div class="flex items-center relative">
                  <UserSquare class="size-4 absolute left-4 text-gray-400" />
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    class="py-2.5 pr-4 pl-10 text-sm block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    v-model="username"
                    v-bind="usernameAttrs"
                    placeholder="Иван"
                  />
                </div>
              </div>

              <Button
                variant="default"
                size="default"
                class="text-xs mt-2"
                :disabled="isCreatingWorkspace"
              >
                <Spinner
                  class="size-4 absolute"
                  v-if="isCreatingWorkspace"
                />
                <span
                  :class="{
                    'opacity-0': isCreatingWorkspace,
                  }"
                  >Начать работу</span
                >
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
