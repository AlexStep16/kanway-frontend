<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { HSStaticMethods } from 'preline'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import YandexAuth from '@/views/Auth/YandexAuth.vue'
import AuthForm from '@/components/Auth/AuthForm.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'
import { usePageContext } from 'vike-vue/usePageContext'
import AskCreateForm from '@/components/Auth/AskCreateForm.vue'

const email = ref('')
const pageContext = usePageContext()

const currentStep = computed(() => {
  const step = pageContext.urlParsed.searchAll?.step?.[0]

  return step || 'email'
})

onMounted(() => {
  HSStaticMethods.autoInit()
})
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div
      class="size-full sm:w-100 sm:h-auto bg-white sm:border sm:border-gray-200 sm:rounded-xl shadow-2xs overflow-y-auto"
    >
      <div class="p-4 pt-7 sm:p-7">
        <div class="relative overflow-hidden text-center flex justify-center flex-col items-center">
          <a href="/">
            <KanwayLogo class="h-8 sm:h-10" />
          </a>

          <div
            class="overflow-hidden relative w-full min-h-8 flex justify-center items-center text-nowrap mt-4"
          >
            <Transition name="slide-up">
              <h1
                class="block text-2xl font-bold text-gray-800"
                v-if="currentStep === 'email'"
                key="welcome"
              >
                Добро пожаловать!
              </h1>
              <div v-else-if="currentStep === 'create'" key="create-account">
                <h1 class="block text-2xl font-bold text-gray-800">Создать аккаунт?</h1>
                <p class="text-muted-foreground text-sm mt-2">Кажется такого аккаунта ещё нет</p>
              </div>
              <h1 class="block text-2xl font-bold text-gray-800" v-else key="welcome-back">
                С возвращением!
              </h1>
            </Transition>
          </div>
        </div>

        <div class="relative mt-8">
          <div v-show="currentStep === 'email'">
            <YandexAuth :containerId="'yandex-auth-no-pass'" />

            <div
              class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6"
            >
              Или
            </div>
          </div>

          <AuthForm v-if="currentStep === 'email'" />
          <AskCreateForm :initial-email="email" v-else-if="currentStep === 'create'" />
          <LoginForm :initial-email="email" v-else-if="currentStep === 'password'" />
        </div>
      </div>
    </div>
  </div>
</template>
