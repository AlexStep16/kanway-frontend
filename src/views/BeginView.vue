<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { onMounted, ref } from 'vue'
import { HSAccordion, HSStaticMethods } from 'preline'
import { AvailableColors } from '@enums/AvailableColors'
import { Nullable } from '@/types/utils'
import { useUser } from '@/composables/auth/queries/useUser'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import ExitButton from '@/components/Auth/ExitButton.vue'
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import ColorButtons from '@/components/Buttons/ColorButtons.vue'
import { FolderKanban, UserSquare } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import { useWelcome } from '@/composables/workspaces/mutations/useWelcome'
import Spinner from '@/components/ui/spinner/Spinner.vue'

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

const colorsAccordion = ref<Nullable<HTMLElement>>(null)
const colorsAccordionInstance = ref<Nullable<HSAccordion>>(null)

function workspaceNameInputHandler() {
  if (colorsAccordionInstance.value) {
    colorsAccordionInstance.value.show()
  }
}

const onSubmit = handleSubmit(
  (values) => {
    welcome(
      {
        payload: {
          workspaceName: values.workspaceName,
          workspaceColor: values.workspaceColor,
          username: values.username,
        },
      },
      {
        onSuccess: () => {
          navigate('/workspace')
        },
      },
    )
  },
  (values) => {
    if (values.errors.workspaceName) toast.error(values.errors.workspaceName)
    if (values.errors.username) toast.error(values.errors.username)
  },
)

onMounted(() => {
  HSStaticMethods.autoInit()

  if (colorsAccordion.value && colorsAccordion.value instanceof HTMLElement) {
    const { element } = HSAccordion.getInstance(colorsAccordion.value, true) as any

    colorsAccordionInstance.value = element
  }
})
</script>

<template>
  <div class="size-full bg-gray-100 fixed inset-0 flex flex-col">
    <header class="w-full py-5 px-4 sm:px-10 flex justify-between items-center">
      <a @click="navigate('/')" class="cursor-pointer" aria-label="На главную">
        <KanwayLogo class="h-8 sm:h-10" />
      </a>

      <ExitButton />
    </header>

    <main class="flex items-center justify-center grow">
      <div class="flex flex-col gap-4 w-full max-w-100">
        <h2 class="text-center text-2xl text-gray-700 font-bold">Давайте начнем!</h2>
        <div class="bg-white rounded-md border border-gray-200 p-4 justify-between w-full">
          <form @submit.prevent="onSubmit" novalidate>
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
                    class="py-2.5 pr-4 pl-10 block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    v-model="workspaceName"
                    v-bind="workspaceNameAttrs"
                    placeholder="Маркетинг"
                  />
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
                    <div class="flex flex-col items-start gap-y-1 w-full p-1">
                      <ColorButtons
                        :color="workspaceColor"
                        :size="9"
                        @selectColor="(color: AvailableColors) => (workspaceColor = color)"
                        v-if="workspaceColor"
                      >
                        <span class="font-bold text-white">{{
                          workspaceName?.substring(0, 1)
                        }}</span>
                      </ColorButtons>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-y-2">
                <span class="text-sm font-medium text-gray-700">Как к вам обращаться?</span>
                <div class="flex items-center relative">
                  <UserSquare class="size-4 absolute left-4 text-gray-400" />
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    class="py-2.5 pr-4 pl-10 block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    v-model="username"
                    v-bind="usernameAttrs"
                    placeholder="Иван"
                  />
                </div>
              </div>

              <Button variant="default" size="default" class="text-xs mt-2">
                <Spinner class="size-4 absolute" v-if="isWelcomePending" />
                <span
                  :class="{
                    'opacity-0': isWelcomePending,
                  }"
                  >Сохранить</span
                >
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
