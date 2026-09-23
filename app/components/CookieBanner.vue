<script setup lang="ts">
const COOKIE_BANNER_MAX_AGE = 60 * 60 * 24 * 365

const consentCookie = useCookie<boolean>('cookie_banner_accepted', {
  default: () => true,
  maxAge: COOKIE_BANNER_MAX_AGE,
  sameSite: 'lax',
})

const isVisible = ref(!consentCookie.value)
const isClosing = ref(false)

function acceptCookies() {
  consentCookie.value = true
  isClosing.value = true

  window.setTimeout(() => {
    isVisible.value = false
    isClosing.value = false
  }, 200)
}
</script>

<template>
  <div
    v-if="isVisible"
    :class="[
      'fixed inset-x-4 bottom-6 z-50 w-auto max-w-sm p-4 bg-white/95 border border-zinc-200/80 backdrop-blur-md rounded-xl shadow-lg shadow-zinc-200/30 transition-all duration-300 ease-in-out sm:left-auto sm:right-6 sm:w-full',
      isClosing ? 'translate-y-2.5 opacity-0' : 'translate-y-0 opacity-100',
    ]"
  >
    <div class="flex flex-col gap-3.5">
      <div class="flex items-center gap-2.5">
        <div class="p-1.5 bg-zinc-100 text-zinc-700 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-zinc-900">Мы используем cookie</h3>
      </div>

      <p class="text-[13px] leading-relaxed text-zinc-600">
        Файлы cookie помогают нам улучшать работу сайта для вашего удобства. Продолжая просмотр
        страниц, вы соглашаетесь с
        <NuxtLink
          to="/cookies"
          class="text-zinc-900 underline underline-offset-2 transition-colors hover:text-zinc-700"
        >
          политикой Cookies
        </NuxtLink>
        .
      </p>

      <div class="flex justify-end pt-1">
        <button
          @click="acceptCookies"
          class="w-full sm:w-auto px-5 py-2 text-xs font-medium bg-zinc-900 text-zinc-50 rounded-lg hover:bg-zinc-800 transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
        >
          ОК
        </button>
      </div>
    </div>
  </div>
</template>
