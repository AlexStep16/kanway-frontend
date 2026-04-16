<script setup lang="ts">
import KanwayLogo from '@assets/kanway_logo_white.svg?component'
</script>

<template>
  <footer class="mt-auto bg-gray-900 w-full">
    <div class="mt-auto w-full max-w-[55rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="col-span-full lg:col-span-1">
          <a
            class="flex-none text-xl font-semibold text-white focus:outline-hidden focus:opacity-80"
            href="#"
            aria-label="Brand"
          >
            <KanwayLogo class="h-8 sm:h-10" />
          </a>
        </div>
        <!-- End Col -->

        <div class="col-span-1">
          <h4 class="font-semibold text-gray-100">Продукт</h4>

          <div class="mt-3 grid space-y-3">
            <p>
              <a
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                href="#"
                >Возможности</a
              >
            </p>
            <p>
              <a
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                href="#"
                >Контроль</a
              >
            </p>
            <p>
              <a
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                href="#"
                >Тарифы</a
              >
            </p>
            <p>
              <a
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                href="#"
                >Вопросы</a
              >
            </p>
          </div>
        </div>
        <!-- End Col -->

        <div class="col-span-1">
          <h4 class="font-semibold text-gray-100">Компания</h4>

          <div class="mt-3 grid space-y-3">
            <p>
              <a
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                href="#"
                >Контакты</a
              >
            </p>
            <p>
              <a
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                href="#"
                >Политика конфиденциальности</a
              >
            </p>
            <p>
              <a
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                href="#"
                >Условия использования</a
              >
            </p>
            <p>
              <a
                class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                href="#"
                >Политика Cookies</a
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
