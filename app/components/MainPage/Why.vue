<script setup lang="ts">
import { Check, MoveRight, X } from '@lucide/vue'
</script>

<template>
  <section class="relative isolate py-12 md:py-16 bg-zinc-100 overflow-hidden font-sans">
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 why-header">
      <!-- Section Header -->
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="300"
        data-aos-once="true"
        class="text-center max-w-2xl mx-auto mb-10 md:mb-12"
      >
        <div
          class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-zinc-200 mb-4"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
          <span class="text-[11px] font-semibold text-zinc-900 uppercase tracking-wider"
            >Почему Kanway</span
          >
        </div>
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
          Обычный Канбан — это формы <br class="hidden md:block" />
          Kanway — это живой диалог
        </h2>
        <p class="text-base text-zinc-600 leading-relaxed">
          Забудьте про ручное заполнение карточек, клики и перетаскивания. Вы просто пишете в чат, а
          доска обновляется сама.
        </p>
      </div>

      <!-- Desktop Headers (Hidden on Mobile) -->
      <div
        class="hidden lg:grid grid-cols-[1fr_32px_1fr] gap-4 mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400"
      >
        <div
          data-aos="fade-zoom-in"
          data-aos-offset="200"
          data-aos-duration="700"
          data-aos-delay="300"
          data-aos-once="true"
          data-aos-anchor=".why-header"
          class="pl-3"
        >
          Традиционные доски
        </div>
        <div class="text-center"></div>
        <div
          data-aos="fade-zoom-in"
          data-aos-offset="200"
          data-aos-duration="700"
          data-aos-delay="800"
          data-aos-once="true"
          data-aos-anchor=".why-header"
          class="pl-3 text-indigo-600 flex items-center gap-1.5"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
          С Kanway
        </div>
      </div>

      <!-- Comparison Grid -->
      <div class="flex flex-col gap-8 lg:gap-3">
        <!-- Row 1: Create -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_32px_1fr] gap-4 items-stretch">
          <!-- Bad Card -->
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
            data-aos-once="true"
            data-aos-anchor=".why-header"
            class="group p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-sm transition-colors duration-200 hover:bg-zinc-100"
          >
            <div class="flex items-start gap-3">
              <div
                class="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-red-500 transition-colors"
              >
                <X class="size-4" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-zinc-900 mb-1.5">Рутина с формами</h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  Чтобы создать одну задачу, нужно выбрать доску, прокликать теги и заполнить
                  описание. Это отнимает минуты.
                </p>
              </div>
            </div>
          </div>

          <!-- <ArrowRight class="size-4" /> Badge -->
          <div class="flex lg:flex-col items-center justify-center -my-2 lg:my-0 relative z-10">
            <MoveRight
              data-aos="flip-left"
              data-aos-duration="2000"
              data-aos-delay="900"
              data-aos-once="true"
              data-aos-anchor=".why-header"
              class="size-4 text-zinc-400 transform rotate-90 lg:rotate-0"
            />
          </div>

          <!-- Good Card -->
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="1000"
            data-aos-once="true"
            data-aos-anchor=".why-header"
            class="group p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 shadow-sm transition-all duration-200 hover:border-indigo-200 relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-linear-to-br from-indigo-500/0 to-indigo-500/5 group-hover:to-indigo-500/10 transition-colors duration-200"
            ></div>
            <div class="relative z-10 flex items-start gap-3">
              <div
                class="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-600"
              >
                <Check class="size-4" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-indigo-950 mb-1.5">Задачи через чат</h3>
                <p class="text-indigo-900/80 text-sm leading-relaxed">
                  Просто напишите:
                  <span class="font-medium text-indigo-700"
                    >«Добавь баг с авторизацией на завтра 14:00»</span
                  >. Kanway сам поймёт контекст и создаст карточку со всеми атрибутами.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Read -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_32px_1fr] gap-4 items-stretch">
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="500"
            data-aos-once="true"
            data-aos-anchor=".why-header"
            class="group p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-sm transition-colors duration-200 hover:bg-zinc-100"
          >
            <div class="flex items-start gap-3">
              <div
                class="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-red-500 transition-colors"
              >
                <X class="size-4" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-zinc-900 mb-1.5">Сложные фильтры</h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  Чтобы узнать свой план на день, нужно каждый раз настраивать сложные фильтры.
                </p>
              </div>
            </div>
          </div>

          <div class="flex lg:flex-col items-center justify-center -my-2 lg:my-0 relative z-10">
            <MoveRight
              data-aos="flip-left"
              data-aos-duration="2000"
              data-aos-delay="1100"
              data-aos-once="true"
              data-aos-anchor=".why-header"
              class="size-4 text-zinc-400 transform rotate-90 lg:rotate-0"
            />
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="1200"
            data-aos-once="true"
            data-aos-anchor=".why-header"
            class="group p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 shadow-sm transition-all duration-200 hover:border-indigo-200 relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-linear-to-br from-indigo-500/0 to-indigo-500/5 group-hover:to-indigo-500/10 transition-colors duration-200"
            ></div>
            <div class="relative z-10 flex items-start gap-3">
              <div
                class="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-600"
              >
                <Check class="size-4" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-indigo-950 mb-1.5">Мгновенные сводки</h3>
                <p class="text-indigo-900/80 text-sm leading-relaxed">
                  Спросите:
                  <span class="font-medium text-indigo-700"
                    >«Какие срочные баги мне нужно исправить первыми?»</span
                  >. Kanway мгновенно найдёт и выведет списком всю нужную информацию прямо в диалог.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 3: Update -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_32px_1fr] gap-4 items-stretch">
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="600"
            data-aos-once="true"
            data-aos-anchor=".why-header"
            class="group p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-sm transition-colors duration-200 hover:bg-zinc-100"
          >
            <div class="flex items-start gap-3">
              <div
                class="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-red-500 transition-colors"
              >
                <X class="size-4" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-zinc-900 mb-1.5">Ручное перемещение</h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  Ищете нужную карточку глазами среди колонок, чтобы перетащить её мышкой в «В
                  работе» или поменять дедлайн внутри неё.
                </p>
              </div>
            </div>
          </div>

          <div class="flex lg:flex-col items-center justify-center -my-2 lg:my-0 relative z-10">
            <MoveRight
              data-aos="flip-left"
              data-aos-duration="2000"
              data-aos-delay="1300"
              data-aos-once="true"
              data-aos-anchor=".why-header"
              class="size-4 text-zinc-400 transform rotate-90 lg:rotate-0"
            />
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="1400"
            data-aos-once="true"
            data-aos-anchor=".why-header"
            class="group p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 shadow-sm transition-all duration-200 hover:border-indigo-200 relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-linear-to-br from-indigo-500/0 to-indigo-500/5 group-hover:to-indigo-500/10 transition-colors duration-200"
            ></div>
            <div class="relative z-10 flex items-start gap-3">
              <div
                class="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-600"
              >
                <Check class="size-4" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-indigo-950 mb-1.5">Управление текстом</h3>
                <p class="text-indigo-900/80 text-sm leading-relaxed">
                  Напишите:
                  <span class="font-medium text-indigo-700"
                    >«Переведи задачу про логин в ревью»</span
                  >. Kanway сам найдет тикет и передвинет его в нужную колонку без единого клика.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 4: Delete -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_32px_1fr] gap-4 items-stretch">
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="700"
            data-aos-once="true"
            data-aos-anchor=".why-header"
            class="group p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-sm transition-colors duration-200 hover:bg-zinc-100"
          >
            <div class="flex items-start gap-3">
              <div
                class="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-red-500 transition-colors"
              >
                <X class="size-4" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-zinc-900 mb-1.5">Лишние клики</h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  Чтобы убрать мусор из бэклога, нужно открывать каждую карточку, искать меню
                  действий, нажимать «удалить» и подтверждать.
                </p>
              </div>
            </div>
          </div>

          <div class="flex lg:flex-col items-center justify-center -my-2 lg:my-0 relative z-10">
            <MoveRight
              data-aos="flip-left"
              data-aos-duration="2000"
              data-aos-delay="1500"
              data-aos-once="true"
              data-aos-anchor=".why-header"
              class="size-4 text-zinc-400 transform rotate-90 lg:rotate-0"
            />
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="1600"
            data-aos-once="true"
            data-aos-anchor=".why-header"
            class="group p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 shadow-sm transition-all duration-200 hover:border-indigo-200 relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-linear-to-br from-indigo-500/0 to-indigo-500/5 group-hover:to-indigo-500/10 transition-colors duration-200"
            ></div>
            <div class="relative z-10 flex items-start gap-3">
              <div
                class="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-600"
              >
                <Check class="size-4" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-indigo-950 mb-1.5">
                  Чистка в одно сообщение
                </h3>
                <p class="text-indigo-900/80 text-sm leading-relaxed">
                  Скажите:
                  <span class="font-medium text-indigo-700"
                    >«Удали все завершенные задачи за прошлую неделю»</span
                  >. Kanway поймет о чем речь и мгновенно очистит доску. Ваш фокус останется на
                  работе.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
