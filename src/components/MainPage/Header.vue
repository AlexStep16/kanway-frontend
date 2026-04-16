<script setup lang="ts">
import { Shield, CreditCard, MessageCircleQuestionMark } from 'lucide-vue-next'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import Star from '@assets/star.svg?component'
</script>

<template>
  <header
    id="header"
    class="fixed top-0 left-0 flex border-b border-gray-100 py-0 sm:py-2 flex-wrap bg-white lg:justify-start lg:flex-nowrap z-50 w-full"
  >
    <nav
      class="relative max-w-[95rem] w-full mx-auto lg:flex lg:items-center lg:justify-between lg:gap-3 p-3 sm:px-6 lg:px-8"
    >
      <div class="flex justify-between items-center gap-x-1">
        <a
          class="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80"
          href="#"
          aria-label="Brand"
        >
          <KanwayLogo class="h-8 sm:h-10" />
        </a>

        <!-- Collapse Button -->
        <button
          type="button"
          class="hs-collapse-toggle lg:hidden relative size-9 flex justify-center items-center font-medium text-sm rounded-lg border transition-colors duration-200 border-gray-200 text-gray-800 hover:bg-blue-100 hover:text-blue-500 hover:border-blue-500 focus:outline-hidden focus:text-blue-500 focus:bg-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          id="hs-header-base-collapse"
          aria-expanded="false"
          aria-controls="hs-header-base"
          aria-label="Открыть или скрыть навигацию"
          data-hs-collapse="#hs-header-base"
        >
          <svg
            class="hs-collapse-open:hidden size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
          <svg
            class="hs-collapse-open:block shrink-0 hidden size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span class="sr-only">Открыть или скрыть навигацию</span>
        </button>
        <!-- End Collapse Button -->
      </div>

      <!-- Collapse -->
      <div
        id="hs-header-base"
        class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:block"
        aria-labelledby="hs-header-base-collapse"
      >
        <div
          class="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
        >
          <div class="pt-2 lg:py-0 flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-1">
            <div class="grow">
              <div
                class="flex flex-col lg:flex-row lg:justify-end lg:items-center gap-0.5 lg:gap-1"
              >
                <a
                  class="p-2 flex items-center text-sm text-gray-800 lg:hover:bg-blue-100 hover:text-blue-500 transition-colors duration-200 rounded-lg focus:outline-hidden focus:text-blue-500"
                  href="#"
                  aria-current="page"
                >
                  <Star class="shrink-0 size-4 me-2 block lg:hidden" />
                  Возможности
                </a>

                <a
                  class="p-2 flex items-center text-sm text-gray-800 lg:hover:bg-blue-100 hover:text-blue-500 transition-colors duration-200 rounded-lg focus:outline-hidden focus:text-blue-500"
                  href="#"
                >
                  <Shield class="shrink-0 size-4 me-2 block lg:hidden" />
                  Контроль
                </a>

                <a
                  class="p-2 flex items-center text-sm text-gray-800 lg:hover:bg-blue-100 hover:text-blue-500 transition-colors duration-200 rounded-lg focus:outline-hidden focus:text-blue-500"
                  href="#"
                >
                  <CreditCard class="shrink-0 size-4 me-2 block lg:hidden" />
                  Тарифы
                </a>

                <a
                  class="p-2 flex items-center text-sm text-gray-800 lg:hover:bg-blue-100 hover:text-blue-500 transition-colors duration-200 rounded-lg focus:outline-hidden focus:text-blue-500"
                  href="#"
                >
                  <MessageCircleQuestionMark class="shrink-0 size-4 me-2 block lg:hidden" />
                  Вопросы
                </a>
              </div>
            </div>

            <div class="my-2 lg:my-0 lg:mx-2">
              <div class="w-full h-px lg:w-px lg:h-4 bg-gray-100 lg:bg-gray-300"></div>
            </div>

            <!-- Button Group -->
            <div class="flex flex-wrap items-center gap-x-1.5">
              <a
                class="py-[7px] px-2.5 inline-flex items-center font-medium text-sm text-gray-800 transition-colors duration-200 hover:text-blue-500 focus:outline-hidden focus:text-blue-500"
                href="/sign-in"
              >
                Войти
              </a>
              <a
                class="py-2.5 px-3.5 inline-flex items-center font-medium text-sm rounded-full bg-blue-500 text-white hover:opacity-90 transition-opacity duration-200 focus:outline-hidden focus:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                href="/sign-up"
              >
                Начать бесплатно
              </a>
            </div>
            <!-- End Button Group -->
          </div>
        </div>
      </div>
      <!-- End Collapse -->
    </nav>
  </header>
</template>
