<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
</script>

<template>
  <section class="relative isolate z-3 pt-20 overflow-hidden min-h-screen bg-neutral-50">
    <div class="absolute inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
      <div
        class="absolute inset-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_100%_100%_at_50%_0%,#000_60%,transparent_100%)] opacity-70"
      ></div>

      <div
        class="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-indigo-500/30 to-transparent"
      ></div>

      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-300 h-300 flex items-center justify-center"
      >
        <div
          class="absolute w-75 h-75 rounded-full border border-zinc-300 animate-[pulse_4s_ease-in-out_infinite]"
        ></div>
        <div class="absolute w-150 h-150 rounded-full border border-zinc-200"></div>
        <div class="absolute w-225 h-225 rounded-full border border-zinc-200/60"></div>
        <div
          class="absolute w-300 h-300 rounded-full border border-zinc-200/40 border-dashed animate-[spin_120s_linear_infinite]"
        ></div>
      </div>

      <div
        class="absolute -top-40 left-1/2 -translate-x-1/2 w-175 h-125 bg-linear-to-b from-indigo-100/60 to-transparent blur-[100px] rounded-full mix-blend-multiply"
      ></div>
      <div
        class="absolute top-[20%] left-[-10%] w-125 h-125 bg-zinc-200/40 blur-[120px] rounded-full mix-blend-multiply"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-indigo-50/50 blur-[120px] rounded-full mix-blend-multiply"
      ></div>
    </div>
    <div
      class="w-full flex flex-col lg:flex-row items-center justify-center gap-8 px-8 sm:px-10 lg:px-16 pt-12 md:pt-16 lg:pt-24 pb-10"
    >
      <div class="flex flex-col items-center lg:items-start max-w-2xl">
        <!-- Announcement Banner -->
        <div class="flex justify-center">
          <span
            class="inline-flex items-center text-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-500 p-1 px-3 rounded-full transition hover:border-gray-300 focus:outline-hidden focus:border-gray-300"
          >
            ИИ-агент для управления проектами
          </span>
        </div>
        <!-- End Announcement Banner -->

        <!-- Title -->
        <div class="max-w-2xl mt-1">
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl text-center lg:text-left font-extrabold tracking-tight text-zinc-950 leading-[1.15]"
          >
            Забудьте о кликах<br />
            Мы дали вашим
            <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-violet-600">
              задачам интеллект</span
            >
          </h1>
        </div>
        <!-- End Title -->

        <div class="mt-5 max-w-3xl text-center lg:text-left hero-text">
          <p class="text-base md:text-lg text-gray-600">
            Управляйте своей Kanban-доской с помощью естественного языка. Создавайте, редактируйте и
            переносите карточки, просто написав об этом в чат.
          </p>
        </div>

        <div class="mt-8 flex justify-center">
          <NuxtLink
            class="inline-flex justify-center items-center gap-x-3 text-center bg-linear-to-tl from-blue-500 to-violet-500 hover:from-violet-500 hover:to-blue-500 border border-transparent text-white text-sm font-medium rounded-md focus:outline-hidden focus:from-violet-600 focus:to-blue-600 py-3 px-4"
            to="/auth?step=signup"
          >
            Начать бесплатно
            <ChevronRight class="shrink-0 size-4" />
          </NuxtLink>
        </div>
      </div>

      <div
        class="w-full h-150 md:w-140 md:h-170 lg:w-120 lg:h-150 xl:w-140 xl:h-170 relative flex shrink-0 overflow-hidden rounded-[20px] border border-zinc-200/80 bg-white/95 shadow-sm ring-1 ring-black/2 backdrop-blur supports-backdrop-filter:bg-white/90"
      >
        <ClientOnly>
          <DemoChat />
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
