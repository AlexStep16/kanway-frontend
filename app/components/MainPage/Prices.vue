<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
</script>

<template>
  <section class="relative z-1 overflow-hidden bg-white">
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <!-- Title -->
      <div
        data-aos="fade-down"
        data-aos-duration="1000"
        data-aos-once="true"
        class="flex flex-col gap-y-4"
      >
        <div class="max-w-2xl text-center mx-auto">
          <h1 class="block font-bold text-gray-800 text-2xl md:text-3xl lg:text-4xl">
            Выберите свой план.
          </h1>
        </div>
        <!-- End Title -->

        <div class="max-w-2xl text-center mx-auto">
          <p class="md:text-lg text-gray-600">
            Начните бесплатно. Перейдите на Премиум, когда будете готовы к большему.
          </p>
        </div>
      </div>
      <!-- Grid -->
      <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">
        <!-- Card -->
        <div
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-once="true"
          class="flex flex-col border border-gray-200 text-center rounded-xl p-8"
        >
          <h4 class="font-medium text-lg text-gray-800">Базовый</h4>
          <span class="mt-5 md:mt-7 font-bold text-4xl md:text-5xl text-gray-800">₽0</span>
          <p class="mt-2 text-sm text-gray-500">Для знакомства с ИИ-ассистентом</p>

          <ul class="mt-5 md:mt-7 space-y-2.5 text-sm text-left grow">
            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 1 пространство </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 5 досок </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 20 кредитов </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Базовая модель: <b>Kanway Lite</b> </span>
            </li>

            <li class="flex items-center gap-x-2">
              <X class="size-4 text-red-600 shrink-0" />
              <span class="text-gray-800"> Доступ к модели <b>Kanway Pro</b> </span>
            </li>

            <li class="flex items-center gap-x-2">
              <X class="size-4 text-red-600 shrink-0" />
              <span class="text-gray-800"> Режим <b>Критик</b></span>
            </li>
          </ul>

          <a
            class="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50"
            href="#"
          >
            Регистрация
          </a>
        </div>
        <!-- End Card -->

        <!-- Card -->
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-once="true"
          class="flex flex-col border-2 border-blue-600 text-center shadow-xl rounded-xl p-8"
        >
          <p class="mb-3">
            <span
              class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs uppercase font-semibold bg-blue-100 text-blue-800"
              >Рекомендуем</span
            >
          </p>
          <h4 class="font-medium text-lg text-gray-800">Премиум</h4>
          <span class="mt-5 md:mt-7 font-bold text-4xl md:text-5xl text-gray-800">₽999</span>
          <p class="mt-2 text-sm text-gray-500">Для активной работы и роста проектов</p>

          <ul class="mt-5 md:mt-7 space-y-2.5 text-sm text-left grow">
            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 5 пространств </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 20 досок </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 600 кредитов </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Приоритетная поддержка </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Доступ к модели <b>Kanway Pro</b> </span>
            </li>

            <li class="flex items-center gap-x-2">
              <X class="size-4 text-red-600 shrink-0" />
              <span class="text-gray-800"> Режим <b>Критик</b></span>
            </li>
          </ul>

          <a
            class="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            href="#"
          >
            Регистрация
          </a>
        </div>
        <!-- End Card -->

        <!-- Card -->
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-once="true"
          class="flex flex-col border border-gray-200 text-center rounded-xl p-8"
        >
          <h4 class="font-medium text-lg text-gray-800">Архитектор</h4>
          <span class="mt-5 md:mt-7 font-bold text-4xl md:text-5xl text-gray-800">₽2499</span>
          <p class="mt-2 text-sm text-gray-500">Для проектирования сложных систем и бизнеса</p>

          <ul class="mt-5 md:mt-7 space-y-2.5 text-sm text-left grow">
            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Неограниченно пространств </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Неограниченно досок </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> 1300 кредитов </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Приоритетная поддержка </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Доступ к модели <b>Kanway Pro</b> </span>
            </li>

            <li class="flex items-center gap-x-2">
              <Check class="size-4 text-blue-600 shrink-0" />
              <span class="text-gray-800"> Режим <b>Критик</b></span>
            </li>
          </ul>

          <a
            class="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50"
            href="#"
          >
            Регистрация
          </a>
        </div>
        <!-- End Card -->
      </div>
      <!-- End Grid -->
    </div>
  </section>
</template>
