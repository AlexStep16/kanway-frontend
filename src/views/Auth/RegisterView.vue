<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRegister } from '@/composables/auth/mutations/useRegister'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import RegisterButton from '@/components/Buttons/RegisterButton.vue'

const { mutate: register, isPending: isRegistering } = useRegister()

const schema = toTypedSchema(
  z.object({
    email: z.email('Неверный формат'),
    password: z.string().min(10, 'Пароль должен содержать минимум 10 символов'),
    agreement: z.boolean().refine((val) => val === true, {
      message: 'Необходимо согласие с политикой конфиденциальности',
    }),
  }),
)

const { errors, handleSubmit, submitCount, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
    agreement: false,
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [agreement, agreementAttrs] = defineField('agreement')

const onSubmit = handleSubmit(
  (values) => {
    register({ email: values.email, password: values.password })
  },
  (values) => {
    if (values.errors.password) toast.error(values.errors.password)
    if (values.errors.agreement) toast.error(values.errors.agreement)
  },
)

onMounted(() => {
  window.HSStaticMethods.autoInit()
})
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div
      class="size-full sm:w-100 sm:h-auto bg-white sm:border sm:border-gray-200 sm:rounded-xl shadow-2xs overflow-y-auto"
    >
      <div class="p-4 pt-7 sm:p-7">
        <div class="text-center flex justify-center flex-col items-center">
          <a href="/">
            <svg height="33" viewBox="0 0 103 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.272 8.328H15.84L11.16 13.44L15.96 21H10.536L7.872 16.656L6.216 18.264V21H1.44V3.576H6.216V13.176L10.272 8.328ZM23.7118 8.04C25.6478 8.04 27.2238 8.368 28.4398 9.024C29.6558 9.664 30.2638 10.712 30.2638 12.168V17.112C30.2638 17.384 30.3278 17.608 30.4558 17.784C30.5838 17.96 30.7758 18.048 31.0318 18.048H31.8958V20.808C31.8478 20.84 31.7198 20.896 31.5118 20.976C31.3198 21.04 31.0398 21.104 30.6718 21.168C30.3038 21.248 29.8798 21.288 29.3998 21.288C28.4718 21.288 27.7038 21.152 27.0958 20.88C26.5038 20.592 26.0958 20.2 25.8718 19.704C25.2638 20.184 24.5838 20.568 23.8318 20.856C23.0798 21.144 22.1998 21.288 21.1918 21.288C18.2158 21.288 16.7278 20.104 16.7278 17.736C16.7278 16.504 17.0558 15.568 17.7118 14.928C18.3838 14.272 19.3438 13.824 20.5918 13.584C21.8398 13.344 23.4718 13.224 25.4878 13.224V12.6C25.4878 12.104 25.3118 11.728 24.9598 11.472C24.6238 11.216 24.1838 11.088 23.6398 11.088C23.1438 11.088 22.7118 11.176 22.3438 11.352C21.9918 11.528 21.8158 11.808 21.8158 12.192V12.288H17.1118C17.0958 12.208 17.0878 12.096 17.0878 11.952C17.0878 10.752 17.6558 9.8 18.7918 9.096C19.9438 8.392 21.5838 8.04 23.7118 8.04ZM25.4878 15.48C24.1278 15.48 23.1198 15.632 22.4638 15.936C21.8238 16.224 21.5038 16.616 21.5038 17.112C21.5038 17.912 22.0478 18.312 23.1358 18.312C23.7598 18.312 24.3038 18.144 24.7678 17.808C25.2478 17.472 25.4878 17.056 25.4878 16.56V15.48ZM42.1916 8.04C43.6636 8.04 44.7676 8.448 45.5036 9.264C46.2396 10.08 46.6076 11.256 46.6076 12.792V21H41.8316V13.368C41.8316 12.824 41.6876 12.392 41.3996 12.072C41.1276 11.736 40.7356 11.568 40.2236 11.568C39.6316 11.568 39.1516 11.76 38.7836 12.144C38.4156 12.528 38.2316 13 38.2316 13.56V21H33.4556V8.328H37.3676L37.6796 10.248C38.1756 9.576 38.8236 9.04 39.6236 8.64C40.4396 8.24 41.2956 8.04 42.1916 8.04ZM54.2634 9.504C55.1754 8.528 56.3594 8.04 57.8154 8.04C59.5274 8.04 60.8474 8.6 61.7754 9.72C62.7034 10.824 63.1674 12.464 63.1674 14.64C63.1674 16.832 62.7034 18.488 61.7754 19.608C60.8474 20.728 59.5274 21.288 57.8154 21.288C56.0554 21.288 54.7114 20.592 53.7834 19.2L53.3754 21H49.4874V3.6H54.2634V9.504ZM56.3274 11.568C55.6234 11.568 55.0954 11.824 54.7434 12.336C54.3914 12.832 54.2154 13.48 54.2154 14.28V15.072C54.2154 15.872 54.3914 16.52 54.7434 17.016C55.0954 17.512 55.6234 17.76 56.3274 17.76C57.7034 17.76 58.3914 16.944 58.3914 15.312V14.04C58.3914 12.392 57.7034 11.568 56.3274 11.568ZM71.7353 8.04C73.6713 8.04 75.2473 8.368 76.4633 9.024C77.6793 9.664 78.2873 10.712 78.2873 12.168V17.112C78.2873 17.384 78.3513 17.608 78.4793 17.784C78.6073 17.96 78.7993 18.048 79.0553 18.048H79.9193V20.808C79.8713 20.84 79.7433 20.896 79.5353 20.976C79.3433 21.04 79.0633 21.104 78.6953 21.168C78.3273 21.248 77.9033 21.288 77.4233 21.288C76.4953 21.288 75.7273 21.152 75.1193 20.88C74.5273 20.592 74.1193 20.2 73.8953 19.704C73.2873 20.184 72.6073 20.568 71.8553 20.856C71.1033 21.144 70.2233 21.288 69.2153 21.288C66.2393 21.288 64.7513 20.104 64.7513 17.736C64.7513 16.504 65.0793 15.568 65.7353 14.928C66.4073 14.272 67.3673 13.824 68.6153 13.584C69.8633 13.344 71.4953 13.224 73.5113 13.224V12.6C73.5113 12.104 73.3353 11.728 72.9833 11.472C72.6473 11.216 72.2073 11.088 71.6633 11.088C71.1673 11.088 70.7352 11.176 70.3672 11.352C70.0153 11.528 69.8393 11.808 69.8393 12.192V12.288H65.1353C65.1193 12.208 65.1113 12.096 65.1113 11.952C65.1113 10.752 65.6793 9.8 66.8153 9.096C67.9673 8.392 69.6073 8.04 71.7353 8.04ZM73.5113 15.48C72.1513 15.48 71.1433 15.632 70.4873 15.936C69.8473 16.224 69.5273 16.616 69.5273 17.112C69.5273 17.912 70.0713 18.312 71.1593 18.312C71.7833 18.312 72.3273 18.144 72.7913 17.808C73.2713 17.472 73.5113 17.056 73.5113 16.56V15.48ZM89.1831 8.016C89.5511 8.016 89.8791 8.064 90.1671 8.16C90.4551 8.24 90.5991 8.288 90.5991 8.304V12.312H89.0631C88.0711 12.312 87.3511 12.568 86.9031 13.08C86.4711 13.592 86.2551 14.352 86.2551 15.36V21H81.4791V8.328H85.3911L85.7031 10.248C85.9911 9.512 86.4471 8.96 87.0711 8.592C87.6951 8.208 88.3991 8.016 89.1831 8.016Z"
                fill="#3B82F6"
              ></path>
              <path
                d="M102.861 5.1097L100.613 4.38709L99.8905 2.13884C99.8637 2.05604 99.7869 2.00004 99.6999 2.00004C99.6129 2.00004 99.5361 2.05604 99.5095 2.13884L98.7869 4.38709L96.5389 5.1097C96.4559 5.1363 96.3999 5.2131 96.3999 5.30011C96.3999 5.38711 96.4559 5.46391 96.5387 5.49051L98.7867 6.21312L99.5093 8.46137C99.5361 8.54417 99.6129 8.60017 99.6999 8.60017C99.7869 8.60017 99.8637 8.54417 99.8903 8.46137L100.613 6.21312L102.861 5.49051C102.944 5.46391 103 5.38711 103 5.30011C103 5.2131 102.944 5.1363 102.861 5.1097ZM93.3366 2.58985L94.8918 3.10826L95.4102 4.66349C95.4374 4.74509 95.5137 4.8001 95.5999 4.8001C95.6861 4.8001 95.7625 4.74509 95.7895 4.66329L96.3079 3.10806L97.8631 2.58965C97.9449 2.56265 97.9999 2.48625 97.9999 2.40005C97.9999 2.31385 97.9449 2.23744 97.8631 2.21024L96.3079 1.69183L95.7895 0.136603C95.7625 0.0550011 95.6861 0 95.5999 0C95.5137 0 95.4372 0.0550011 95.4102 0.136803L94.8918 1.69183L93.3366 2.21024C93.2548 2.23764 93.1998 2.31385 93.1998 2.40005C93.1998 2.48625 93.2548 2.56265 93.3366 2.58985ZM96.4631 7.61015L95.3578 7.24174L94.9894 6.13692C94.9624 6.05532 94.886 6.00012 94.7998 6.00012C94.7136 6.00012 94.6372 6.05512 94.6102 6.13692L94.2418 7.24174L93.1368 7.61015C93.0552 7.63735 93 7.71375 93 7.79996C93 7.88616 93.055 7.96256 93.1368 7.98976L94.242 8.35817L94.6102 9.46299C94.6374 9.54439 94.7136 9.59959 94.7998 9.59959C94.886 9.59959 94.9624 9.54459 94.9894 9.46279L95.3578 8.35797L96.4631 7.98956C96.5449 7.96236 96.5999 7.88596 96.5999 7.79996C96.5999 7.71395 96.5449 7.63735 96.4631 7.61015Z"
                fill="#3B82F6"
              ></path>
            </svg>
          </a>
          <h1 class="block mt-4 text-2xl font-bold text-gray-800">Регистрация</h1>
          <p class="mt-2 text-sm text-gray-600">
            Уже есть аккаунт?
            <a
              class="text-blue-500 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
              href="sign-in"
            >
              Войти
            </a>
          </p>
        </div>

        <div class="mt-5">
          <button
            type="button"
            class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg class="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
              <path
                d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                fill="#4285F4"
              />
              <path
                d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                fill="#34A853"
              />
              <path
                d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                fill="#FBBC05"
              />
              <path
                d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                fill="#EB4335"
              />
            </svg>
            Войти с Google
          </button>

          <div
            class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6"
          >
            Или
          </div>

          <!-- Form -->
          <form @submit.prevent="onSubmit" novalidate>
            <div class="grid gap-y-4">
              <!-- Form Group -->
              <div>
                <label for="email" class="block text-sm mb-2">Почта</label>
                <div class="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    v-model="email"
                    v-bind="emailAttrs"
                  />
                </div>
                <ul
                  class="text-xs text-red-600 mt-2"
                  id="email-error"
                  v-if="errors.email && submitCount > 0"
                >
                  <li class="list-disc list-inside">{{ errors.email }}</li>
                </ul>
              </div>
              <!-- End Form Group -->

              <!-- Form Group -->
              <div class="flex flex-col gap-y-2">
                <div>
                  <label for="password" class="block text-sm mb-2">Пароль</label>
                  <div class="relative">
                    <input
                      id="password"
                      type="password"
                      name="password"
                      class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      v-model="password"
                      v-bind="passwordAttrs"
                    />
                    <button
                      type="button"
                      data-hs-toggle-password='{
                        "target": "#password"
                      }'
                      class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600"
                    >
                      <svg
                        class="shrink-0 size-4"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          class="hs-password-active:hidden"
                          d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                        ></path>
                        <path
                          class="hs-password-active:hidden"
                          d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                        ></path>
                        <path
                          class="hs-password-active:hidden"
                          d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                        ></path>
                        <line
                          class="hs-password-active:hidden"
                          x1="2"
                          x2="22"
                          y1="2"
                          y2="22"
                        ></line>
                        <path
                          class="hidden hs-password-active:block"
                          d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                        ></path>
                        <circle
                          class="hidden hs-password-active:block"
                          cx="12"
                          cy="12"
                          r="3"
                        ></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                <div
                  class="flex items-center text-gray-500 gap-x-2 text-custom-sm"
                  :class="{
                    'text-green-500': password.length >= 10,
                  }"
                  v-if="password"
                >
                  <span>•</span>
                  <span>Минимальное количество символов - 10</span>
                </div>
              </div>
              <!-- End Form Group -->

              <!-- Checkbox -->
              <div class="flex items-center">
                <div class="flex">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="shrink-0 mt-0.5 border-gray-200 cursor-pointer rounded-sm text-blue-500 focus:ring-blue-500"
                    :class="{
                      'border-red-400! bg-red-100': errors.agreement,
                    }"
                    v-model="agreement"
                    v-bind="agreementAttrs"
                  />
                </div>
                <div class="ms-3 text-wrap">
                  <label for="remember-me" class="text-sm"
                    >Я принимаю
                    <a
                      class="text-blue-500 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
                      href="#"
                      >Правила и политику конфиденциальности</a
                    ></label
                  >
                </div>
              </div>
              <!-- End Checkbox -->

              <RegisterButton :isProcessing="isRegistering" text="Регистрация" />
            </div>
          </form>
          <!-- End Form -->
        </div>
      </div>
    </div>
  </div>
</template>
