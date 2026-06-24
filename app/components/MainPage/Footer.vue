<script setup lang="ts">
import KanwayLogo from '~/assets/kanway_logo_white.svg?skipsvgo'
</script>

<template>
  <footer class="mt-auto bg-gray-900 w-full">
    <div class="mt-auto w-full max-w-220 py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="col-span-full lg:col-span-1">
          <NuxtLink
            class="flex-none text-xl font-semibold text-white focus:outline-hidden focus:opacity-80"
            to="/"
            aria-label="Brand"
          >
            <KanwayLogo class="h-8 sm:h-10" />
          </NuxtLink>
        </div>
        <!-- End Col -->

        <div class="col-span-1">
          <h4 class="font-semibold text-gray-100">Продукт</h4>

          <div class="mt-3 grid space-y-3">
            <p>
              <NuxtLink
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                to="/#why"
              >
                Почему Kanway
              </NuxtLink>
            </p>
            <p>
              <NuxtLink
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                to="/#control"
                >Командный центр</NuxtLink
              >
            </p>
            <p>
              <NuxtLink
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                to="/#pricing"
                >Цены</NuxtLink
              >
            </p>
            <p>
              <NuxtLink
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                to="/#faq"
                >Вопросы</NuxtLink
              >
            </p>
          </div>
        </div>
        <!-- End Col -->

        <div class="col-span-1">
          <h4 class="font-semibold text-gray-100">Компания</h4>

          <div class="mt-3 grid space-y-3">
            <p>
              <NuxtLink
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                to="/privacy"
                >Политика конфиденциальности</NuxtLink
              >
            </p>
            <p>
              <NuxtLink
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                to="/terms"
                >Пользовательское соглашение</NuxtLink
              >
            </p>
            <p>
              <NuxtLink
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                to="/cookies"
                >Политика Cookies</NuxtLink
              >
            </p>
          </div>
        </div>
        <!-- End Col -->
      </div>
      <!-- End Grid -->

      <div class="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center">
        <div class="flex flex-wrap justify-between items-center gap-2">
          <p class="text-sm text-gray-400">© 2025 Kanway.</p>
        </div>
        <!-- End Col -->

        <!-- Social Brands -->

        <!-- End Social Brands -->
      </div>
    </div>
  </footer>
</template>
