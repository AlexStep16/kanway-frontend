<script setup lang="ts"></script>

<template>
  <div class="relative pt-[84px] z-3 overflow-hidden">
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-24 pb-10">
      <!-- Announcement Banner -->
      <div class="flex justify-center">
        <a
          class="inline-flex items-center text-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-500 p-1 px-3 rounded-full transition hover:border-gray-300 focus:outline-hidden focus:border-gray-300"
          href="#"
        >
          Первый в России ИИ-ассистент для управления задачами
        </a>
      </div>
      <!-- End Announcement Banner -->

      <!-- Title -->
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-once="true"
        class="max-w-2xl mt-1 text-center mx-auto"
      >
        <h1 class="block font-bold text-gray-800 text-3xl md:text-4xl lg:text-5xl">
          Забудьте о кликах. Мы дали вашим задачам
          <span class="bg-clip-text bg-linear-to-tl from-blue-600 to-violet-600 text-transparent"
            >интеллект.</span
          >
        </h1>
      </div>
      <!-- End Title -->

      <div
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="1000"
        data-aos-once="true"
        class="mt-5 max-w-3xl text-center mx-auto hero-text"
      >
        <p class="text-base md:text-lg text-gray-600">
          Управляйте задачами без единого клика. Система, которая понимает ваши намерения и
          мгновенно выполняет комплексные команды.
        </p>
      </div>

      <!-- Buttons -->
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        data-aos-duration="1000"
        data-aos-once="true"
        class="mt-8 gap-3 flex justify-center"
      >
        <a
          class="inline-flex justify-center items-center gap-x-3 text-center bg-linear-to-tl from-blue-500 to-violet-500 hover:from-violet-500 hover:to-blue-500 border border-transparent text-white text-sm font-medium rounded-md focus:outline-hidden focus:from-violet-600 focus:to-blue-600 py-3 px-4"
          href="#"
        >
          Начать бесплатно
          <svg
            class="shrink-0 size-4"
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
            <path d="m9 18 6-6-6-6" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
