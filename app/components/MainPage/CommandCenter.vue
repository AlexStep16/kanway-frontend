<script setup lang="ts">
import { CheckCircle, Clock } from '@lucide/vue'
</script>

<template>
  <section class="relative py-24 w-full bg-white overflow-hidden isolate">
    <!-- Subtle background pattern & glow -->
    <div
      class="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_0%,#000_60%,transparent_100%)]"
    ></div>
    <div
      class="absolute top-0 inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl flex justify-center"
      aria-hidden="true"
    >
      <div
        class="aspect-1108/632 w-277 flex-none bg-linear-to-r from-indigo-100 to-blue-50 opacity-40"
      ></div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header Area -->
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
            >Командный центр</span
          >
        </div>
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
          Это не просто чат. <br class="hidden md:block" />
          <span class="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-500"
            >Это ваш командный центр.</span
          >
        </h2>
        <p class="text-base text-zinc-600 leading-relaxed">
          Наш AI-агент Kanway не просто создает задачи — он понимает многошаговые команды, уточняет
          детали и работает с целыми проектами одновременно.
        </p>
      </div>

      <!-- Features Grid -->
      <div
        class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
      >
        <!-- Card 1: Multi-step Decomposition -->
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="300"
          data-aos-once="true"
          class="h-full"
        >
          <!-- Сама карточка с hover-эффектами -->
          <div
            class="group relative flex flex-col h-full rounded-3xl bg-white p-8 ring-1 ring-zinc-200/80 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:ring-zinc-300"
          >
            <!-- Visual Mockup -->
            <div
              class="mb-8 w-full h-40 rounded-xl bg-zinc-50 border border-zinc-100 p-4 flex flex-col gap-3 relative overflow-hidden"
            >
              <div class="flex flex-col relative text-zinc-400 z-10">
                <div class="flex items-center gap-x-2">
                  <CheckCircle
                    class="size-4 text-green-400 shrink-0"
                    strokeWidth="2"
                  />
                  <div class="w-full text-xs">Ищу подходящие колонки</div>
                </div>

                <div class="flex justify-center w-4 shrink-0">
                  <div
                    class="w-0.5 bg-zinc-300 h-3 group-hover:h-4 transition-all duration-300 rounded-full"
                  ></div>
                </div>
                <div class="flex items-center gap-x-2">
                  <CheckCircle
                    class="size-4 text-green-400 shrink-0"
                    strokeWidth="2"
                  />
                  <div class="w-full text-xs">Создаю необходимые колонки</div>
                </div>
                <div class="flex justify-center w-4 shrink-0">
                  <div
                    class="w-0.5 bg-zinc-300 h-3 group-hover:h-4 transition-all duration-300 rounded-full"
                  ></div>
                </div>
                <div class="flex items-center gap-x-2">
                  <CheckCircle
                    class="size-4 text-green-400 shrink-0"
                    strokeWidth="2"
                  />
                  <div class="w-full text-xs">Заполняю задачи</div>
                </div>
                <div class="flex justify-center w-4 shrink-0">
                  <div
                    class="w-0.5 bg-zinc-300 h-3 group-hover:h-4 transition-all duration-300 rounded-full"
                  ></div>
                </div>
                <div class="flex items-center gap-x-2">
                  <Spinner class="size-4 shrink-0" />
                  <div class="w-full text-xs">Выставляю дедлайны</div>
                </div>
              </div>
              <!-- Fade Gradient -->
              <div
                class="absolute bottom-0 inset-x-0 h-12 bg-linear-to-t from-zinc-50 to-transparent z-20"
              ></div>
            </div>

            <h3 class="text-xl font-semibold leading-7 text-zinc-900">Многошаговые команды</h3>
            <p class="mt-3 text-base leading-relaxed text-zinc-600">
              Kanway не просто создаст карточку, а последовательно выполнит весь сценарий: развернет
              новые колонки, распределит по ним задачи, и выставит дедлайны за один проход.
            </p>
          </div>
        </div>

        <!-- Card 2: Intelligent Refinement -->
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="500"
          data-aos-once="true"
          class="h-full"
        >
          <!-- Сама карточка с hover-эффектами -->
          <div
            class="group relative flex flex-col h-full rounded-3xl bg-white p-8 ring-1 ring-zinc-200/80 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:ring-zinc-300"
          >
            <!-- Visual Mockup -->
            <div
              class="mb-8 w-full h-40 rounded-xl bg-zinc-50 border border-zinc-100 p-4 flex flex-col justify-center relative overflow-hidden"
            >
              <div class="w-full rounded-lg bg-white border border-zinc-200/50 p-3 shadow-sm">
                <div class="w-1/2 h-6 rounded bg-zinc-200 mb-4"></div>

                <div class="space-y-2">
                  <div class="flex items-center gap-1.5">
                    <!-- AI Insight Label -->
                    <div
                      class="text-xs font-medium text-primary/70 bg-primary/20 px-2 py-1 rounded-md"
                    >
                      #баг
                    </div>
                    <div
                      class="text-xs font-medium text-primary/70 bg-primary/20 px-2 py-1 rounded-md"
                    >
                      #срочно
                    </div>
                  </div>

                  <div
                    class="inline-flex items-center self-start gap-x-2 text-xs rounded-md py-1 px-2 bg-yellow-100 text-yellow-600"
                  >
                    <Clock class="size-3" />
                    <span>Завтра в 15:00</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 class="text-xl font-semibold leading-7 text-zinc-900">
              Интеллектуальное уточнение
            </h3>
            <p class="mt-3 text-base leading-relaxed text-zinc-600">
              Агент сам анализирует контекст, задает уточняющие вопросы, автоматически проставляет
              приоритеты, дедлайны и нужные теги.
            </p>
          </div>
        </div>

        <!-- Card 3: Whole Project Management -->
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="600"
          data-aos-once="true"
          class="h-full"
        >
          <div
            class="group relative flex flex-col h-full rounded-3xl bg-white p-8 ring-1 ring-zinc-200/80 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:ring-zinc-300"
          >
            <!-- Visual Mockup -->
            <div
              class="mb-8 w-full h-40 rounded-xl bg-zinc-50 border border-zinc-100 p-4 flex gap-2.5 relative overflow-hidden"
            >
              <!-- Column 1 -->
              <div class="flex-1 flex flex-col gap-2">
                <div class="flex items-center gap-1.5 mb-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
                  <div class="w-8 h-1.5 rounded bg-zinc-300"></div>
                </div>
                <div
                  class="w-full h-7 rounded-md bg-white border border-zinc-200/50 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5"
                ></div>
                <div
                  class="w-full h-10 rounded-md bg-white border border-zinc-200/50 shadow-sm transition-transform duration-300 delay-75 group-hover:-translate-y-0.5"
                ></div>
              </div>

              <!-- Column 2 (AI Active) -->
              <div class="flex-1 flex flex-col gap-2 relative">
                <div
                  class="absolute -inset-2 bg-indigo-500/5 blur-xl rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div class="flex items-center gap-1.5 mb-1 relative z-10">
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  <div class="w-12 h-1.5 rounded bg-zinc-300"></div>
                </div>
                <!-- AI Generated Card -->
                <div
                  class="w-full h-12 rounded-md bg-indigo-50 border border-indigo-200/60 shadow-sm ring-1 ring-inset ring-indigo-500/10 relative z-10 flex flex-col p-1.5 gap-1.5 transition-transform duration-300 group-hover:-translate-y-1"
                >
                  <div class="w-3/4 h-1.5 rounded bg-indigo-200"></div>
                  <div class="w-1/2 h-1.5 rounded bg-indigo-100"></div>
                </div>
                <div
                  class="w-full h-7 rounded-md bg-white border border-zinc-200/50 shadow-sm relative z-10"
                ></div>
              </div>

              <!-- Column 3 -->
              <div class="flex-1 flex flex-col gap-2 opacity-60">
                <div class="flex items-center gap-1.5 mb-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <div class="w-10 h-1.5 rounded bg-zinc-300"></div>
                </div>
                <div
                  class="w-full h-8 rounded-md bg-white border border-zinc-200/50 shadow-sm"
                ></div>
              </div>

              <!-- Fade Gradient -->
              <div
                class="absolute bottom-0 inset-x-0 h-8 bg-linear-to-t from-zinc-50 to-transparent z-20"
              ></div>
            </div>

            <h3 class="text-xl font-semibold leading-7 text-zinc-900">Работа с проектами</h3>
            <p class="mt-3 text-base leading-relaxed text-zinc-600">
              От одной команды до готовой доски. Агент генерирует колонки, доски и бэклог, мгновенно
              подготавливая пространство для работы.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
