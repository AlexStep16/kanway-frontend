<script setup lang="ts">
import dayjs from 'dayjs'
import { Sparkles, Mic, SendHorizonal } from 'lucide-vue-next'
import type { ITaskState } from '~/stores/interfaces/ITaskState'

const demoText = 'Сходить в зал в 18:00, купить продукты по списку и подготовить презентацию к утру'
const displayedText = ref('')
const isThinking = ref(false)
const showTasks = ref(false)

const tasks: ITaskState[] = [
  {
    id: '1',
    name: 'Тренировка в зале',
    dueDate: dayjs().format('YYYY-MM-DD'),
    dueHours: 18,
    dueMinutes: 0,
    column: {
      id: '21312',
      name: 'Спорт',
    },
    workspace: {
      id: '1231451',
      name: 'Личное',
    },
    board: {
      id: '15151',
      name: 'Здоровье',
    },
    isDeleted: false,
    isDeletedExternal: false,
    rank: '1',
    isCompleted: false,
    tags: ['спорт'],
    userId: '123',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '1',
    name: 'Купить продукты',
    column: {
      id: '21312',
      name: 'Покупки',
    },
    workspace: {
      id: '24524',
      name: 'Личное',
    },
    board: {
      id: '524524',
      name: 'Дела',
    },
    isDeleted: false,
    isDeletedExternal: false,
    rank: '1',
    isCompleted: false,
    tags: ['покупки'],
    userId: '123',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '1',
    name: 'Подготовить презентацию',
    column: {
      id: '21312',
      name: 'Презентация',
    },
    workspace: {
      id: '24524',
      name: 'Работа',
    },
    board: {
      id: '524524',
      name: 'Проект Альфа',
    },
    isDeleted: false,
    isDeletedExternal: false,
    rank: '1',
    isCompleted: false,
    tags: ['покупки'],
    userId: '123',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Имитация печати и "мышления" ИИ
async function runDemo() {
  displayedText.value = ''
  showTasks.value = false

  // 1. Печатаем текст
  for (let i = 0; i < demoText.length; i++) {
    displayedText.value += demoText[i]
    await new Promise((r) => setTimeout(r, 40))
  }

  // 2. "Думаем"
  isThinking.value = true
  await new Promise((r) => setTimeout(r, 1800))
  isThinking.value = false

  // 3. Показываем результат
  showTasks.value = true
}

onMounted(() => {
  setTimeout(runDemo, 1000)
})
</script>

<template>
  <div class="relative pt-21 z-3 overflow-hidden">
    <div class="max-w-340 mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-24 pb-10">
      <!-- Announcement Banner -->
      <div class="flex justify-center">
        <a
          class="inline-flex items-center text-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-500 p-1 px-3 rounded-full transition hover:border-gray-300 focus:outline-hidden focus:border-gray-300"
          href="#"
        >
          ИИ-агент для управления проектами
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
          Минимум кликов - максимум результата. Система, которая понимает ваши намерения и мгновенно
          выполняет комплексные команды.
        </p>
      </div>

      <div
        data-aos="fade-up"
        data-aos-delay="150"
        data-aos-duration="1000"
        data-aos-once="true"
        class="mt-8 flex justify-center"
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

      <!-- Buttons -->
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        data-aos-duration="1000"
        data-aos-once="true"
        class="mt-8 gap-3 flex justify-center"
      >
        <div class="w-full max-w-3xl mx-auto space-y-4">
          <!-- КОНТЕЙНЕР ИНПУТА -->
          <div class="relative group">
            <!-- Фоновое свечение (Glow) - Tailwind v4 style -->
            <div
              class="absolute -inset-1 bg-linear-to-r from-primary to-blue-600 rounded-2xl blur-md opacity-25 group-hover:opacity-50 transition duration-1000"
            ></div>

            <div
              class="relative flex items-center bg-background border border-border/50 rounded-xl shadow-2xl overflow-hidden px-4 h-12 md:h-16"
            >
              <!-- Иконка слева -->
              <div class="flex items-center justify-center mr-4">
                <Sparkles
                  v-if="!isThinking"
                  class="size-6 text-primary animate-pulse"
                />
                <div
                  v-else
                  class="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
                ></div>
              </div>

              <!-- Текст (Имитация ввода) -->
              <div
                class="flex-1 font-medium text-foreground tracking-tight overflow-hidden whitespace-nowrap"
              >
                <span class="border-r-2 border-primary/50 animate-caret pr-1">{{
                  displayedText
                }}</span>
              </div>

              <!-- Кнопки справа -->
              <div class="flex items-center gap-2 ml-4">
                <Button
                  size="icon"
                  variant="ghost"
                  class="rounded-full hover:bg-primary/10 text-primary"
                >
                  <Mic class="size-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  class="rounded-full hover:bg-primary/10 text-primary"
                >
                  <SendHorizonal class="size-6" />
                </Button>
              </div>
            </div>
          </div>

          <!-- СПИСОК ЗАДАЧ (Появляются один за другим) -->
          <div class="flex flex-wrap justify-center gap-3">
            <template v-if="showTasks">
              <Task
                v-for="(task, index) in tasks"
                :key="task.id"
                class="animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500 fill-mode-forwards"
                :style="{ 'animation-delay': `${index * 200}ms` }"
                :task="task"
                :options="{
                  isStatic: true,
                  showInfo: true,
                }"
              >
              </Task>
            </template>

            <!-- Заглушка пока ИИ "думает" -->
            <template v-else-if="isThinking">
              <Skeleton
                v-for="i in 3"
                :key="i"
                class="h-20 w-100"
              />
            </template>
          </div>

          <!-- Кнопка перезапуска демо для пользователя -->
          <button
            @click="runDemo"
            class="text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest block mx-auto pt-2"
          >
            Повторить демонстрацию
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: hsl(var(--primary));
  }
}
.animate-caret {
  animation: caret 1s step-end infinite;
}
</style>
