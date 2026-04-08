<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { onMounted, onUnmounted } from 'vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { X } from 'lucide-vue-next'
import { useSendSupport } from '@/composables/support/useSendSupport'
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import { ThemesEnum } from '@/enums/ThemesEnum'
import { useUser } from '@/composables/auth/queries/useUser'

const uiStore = useUIStore()

const { mutate: sendSupport, isPending: isSending } = useSendSupport()

const { data: user } = useUser()

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Неверный формат почты').min(1, 'Почта должна быть заполнена'),
    name: z
      .string()
      .min(1, 'Имя должно быть заполнено')
      .max(100, 'Имя должно быть не длиннее 100 символов'),
    agreement: z.boolean().refine((val) => val === true, {
      message: 'Необходимо согласие с политикой конфиденциальности',
    }),
    details: z
      .string()
      .min(1, 'Подробности должны быть заполнены')
      .max(1000, 'Подробности должны быть не длиннее 1000 символов'),
    theme: z.nativeEnum(ThemesEnum, {
      error: () => ({ message: 'Тема должна быть выбрана' }),
    }),
  }),
)

const { errors, handleSubmit, submitCount, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    name: '',
    agreement: false,
    details: '',
    theme: ThemesEnum.AI_ASSISTANT,
  },
})

const [email, emailAttrs] = defineField('email')
const [theme, themeAttrs] = defineField('theme')
const [name, nameAttrs] = defineField('name')
const [details, detailsAttrs] = defineField('details')
const [agreement, agreementAttrs] = defineField('agreement')

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
        uiStore.closeSupportModal()
        resetForm()
      },
    },
  )
})

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  if (user.value) {
    name.value = user.value.username || ''
    email.value = user.value.email || ''
  }
})

onUnmounted(() => {
  resetForm()
})
</script>

<template>
  <div
    id="hs-support"
    class="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-80 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    :ref="
      (el) => {
        if (el) uiStore.supportModalRef = el as HTMLElement
      }
    "
    tabindex="-1"
  >
    <div class="size-full flex items-center justify-center p-2 sm:p-4">
      <div
        class="max-w-340 relative px-4 py-6 sm:px-6 lg:pb-10 lg:pt-6 bg-white pointer-events-auto rounded-lg"
      >
        <div class="max-w-xl">
          <button
            class="absolute right-4 top-4 transition-colors duration-100 text-gray-400 hover:bg-gray-200 p-1 rounded-full"
            type="button"
            @click="uiStore.closeSupportModal()"
          >
            <X class="size-5" />
          </button>
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-800 sm:text-3xl">Как мы можем вам помочь?</h1>
            <p class="mt-1 text-gray-600 text-sm">
              Расскажите о вашей проблеме, и мы свяжемся с вами.
            </p>
          </div>

          <div class="mt-12">
            <!-- Form -->
            <form @submit.prevent="onSubmit" novalidate>
              <div class="grid gap-3 lg:gap-4">
                <!-- Grid -->
                <div class="grid grid-cols-1 gap-4 lg:gap-6">
                  <div>
                    <label
                      for="hs-firstname-hire-us-2"
                      class="block mb-1 text-sm text-gray-800 font-medium"
                      >Имя</label
                    >
                    <input
                      type="text"
                      name="hs-firstname-hire-us-2"
                      id="hs-firstname-hire-us-2"
                      v-model="name"
                      v-bind="nameAttrs"
                      class="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    />

                    <ul
                      class="text-xs text-red-600 mt-2"
                      id="email-error"
                      v-if="errors.name && submitCount > 0"
                    >
                      <li class="list-disc list-inside">{{ errors.name }}</li>
                    </ul>
                  </div>
                </div>
                <!-- End Grid -->

                <div>
                  <label
                    for="hs-work-email-hire-us-2"
                    class="block mb-1 text-sm text-gray-800 font-medium"
                    >Почта</label
                  >
                  <input
                    type="email"
                    name="hs-work-email-hire-us-2"
                    id="hs-work-email-hire-us-2"
                    autocomplete="email"
                    v-model="email"
                    v-bind="emailAttrs"
                    class="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  />

                  <ul
                    class="text-xs text-red-600 mt-2"
                    id="email-error"
                    v-if="errors.email && submitCount > 0"
                  >
                    <li class="list-disc list-inside">{{ errors.email }}</li>
                  </ul>
                </div>

                <div>
                  <label
                    for="hs-work-email-hire-us-2"
                    class="block mb-1 text-sm text-gray-800 font-medium"
                    >Тема</label
                  >
                  <select
                    id="select-theme"
                    v-model="theme"
                    v-bind="themeAttrs"
                    data-hs-select='{
                      "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-2 ps-3 pe-9 flex gap-x-2 w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm text-nowrap text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500",
                      "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                      "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                      "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                      "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                    }'
                    class="hidden"
                  >
                    <option :value="ThemesEnum.ACCOUNT">Аккаунт</option>
                    <option :value="ThemesEnum.AI_ASSISTANT">ИИ ассистент</option>
                    <option :value="ThemesEnum.BOARDS">Доски, пространства и задачи</option>
                    <option :value="ThemesEnum.PAYMENTS">Оплата и подписки</option>
                    <option :value="ThemesEnum.BUG_REPORT">Техническая ошибка</option>
                    <option :value="ThemesEnum.FEATURE_REQUEST">Предложение по улучшению</option>
                    <option :value="ThemesEnum.OTHER">Другое</option>
                  </select>

                  <ul
                    class="text-xs text-red-600 mt-2"
                    id="theme-error"
                    v-if="errors.theme && submitCount > 0"
                  >
                    <li class="list-disc list-inside">{{ errors.theme }}</li>
                  </ul>
                </div>

                <div>
                  <label
                    for="hs-about-hire-us-2"
                    class="block mb-1 text-sm text-gray-900 font-medium"
                    >Подробности</label
                  >
                  <textarea
                    id="hs-about-hire-us-2"
                    name="hs-about-hire-us-2"
                    v-model="details"
                    v-bind="detailsAttrs"
                    rows="4"
                    class="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  ></textarea>

                  <ul
                    class="text-xs text-red-600 mt-2"
                    id="details-error"
                    v-if="errors.details && submitCount > 0"
                  >
                    <li class="list-disc list-inside">{{ errors.details }}</li>
                  </ul>
                </div>
              </div>
              <!-- End Grid -->

              <!-- Checkbox -->
              <div class="mt-3 flex">
                <div class="flex">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    v-model="agreement"
                    v-bind="agreementAttrs"
                    class="mt-1 shrink-0 size-4 bg-transparent border-line-3 rounded-sm shadow-2xs text-blue-500 focus:ring-0 focus:ring-offset-0 checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                    :class="{
                      'border-red-400! bg-red-100!': errors.agreement,
                    }"
                  />
                </div>
                <div class="ms-3">
                  <label for="remember-me" class="text-sm text-gray-800"
                    >Отправляя эту форму, я прочитал и согласен с
                    <a
                      class="text-blue-500 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
                      href="#"
                      >Политикой конфиденциальности</a
                    ></label
                  >
                </div>
              </div>
              <!-- End Checkbox -->

              <div class="mt-6 grid">
                <RegisterButton :isProcessing="isSending" text="Отправить запрос" />
              </div>

              <div class="mt-3 text-center">
                <p class="text-sm text-gray-700">Мы свяжемся с вами в течение 1-2 рабочих дней.</p>
              </div>
            </form>
            <!-- End Form -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
