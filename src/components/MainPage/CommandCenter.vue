<script setup lang="ts">
import {
  Layers,
  Brain,
  MessageCircleQuestionMark,
  Pencil,
  MessageCircleIcon,
  Map,
} from 'lucide-vue-next'
</script>

<template>
  <section class="relative z-1 overflow-hidden bg-white">
    <div
      data-aos="fade-down"
      data-aos-duration="1000"
      data-aos-anchor=".command-text"
      data-aos-once="true"
      class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-10"
    >
      <!-- Title -->
      <div class="max-w-2xl text-center mx-auto">
        <h1 class="block font-bold text-gray-800 text-2xl md:text-3xl lg:text-4xl">
          Это не просто чат. Это ваш командный центр.
        </h1>
      </div>
      <!-- End Title -->

      <div class="mt-4 max-w-2xl text-center mx-auto command-text">
        <p class="md:text-lg text-gray-600">
          Наш AI-агент не просто создает задачи — он понимает многошаговые команды, уточняет детали
          и работает с целыми проектами одновременно.
        </p>
      </div>
    </div>

    <div
      class="max-w-[85rem] px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pb-24 lg:pt-14 mx-auto icon-grid-block"
    >
      <!-- Grid -->
      <div
        class="grid grid-cols-[repeat(1,minmax(200px,500px))] justify-center md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
      >
        <!-- Icon Block -->
        <div
          data-aos="fade"
          data-aos-delay="300"
          data-aos-duration="1000"
          data-aos-anchor=".icon-grid-block"
          data-aos-once="true"
          class="flex flex-col justify-start border border-gray-200 rounded-xl text-center p-4 md:p-5"
        >
          <!-- Icon -->
          <div
            class="flex justify-center shrink-0 items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
          >
            <Layers class="size-6 text-white" />
          </div>
          <!-- End Icon -->

          <div class="mt-3 flex flex-col h-full">
            <h3 class="text-sm sm:text-lg font-semibold text-gray-800">Пакетные действия</h3>
            <div class="text-sm grow-1 text-gray-600 mt-1">
              Управляйте десятками задач одной командой. Создавайте, перемещайте и архивируйте
              сразу.
            </div>
            <div class="text-sm text-gray-800 mt-5">
              "<b>Архивируй</b> все выполненные задачи в проекте Релиз Q3."
            </div>
          </div>
        </div>
        <!-- End Icon Block -->

        <!-- Icon Block -->
        <div
          data-aos="fade"
          data-aos-delay="600"
          data-aos-duration="1000"
          data-aos-anchor=".icon-grid-block"
          data-aos-once="true"
          class="flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5"
        >
          <!-- Icon -->
          <div
            class="flex justify-center shrink-0 items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
          >
            <Brain class="size-6 text-white" />
          </div>
          <!-- End Icon -->
          <div class="mt-3 flex flex-col h-full">
            <h3 class="text-sm sm:text-lg font-semibold text-gray-800">
              Сложные фильтры без усилий
            </h3>
            <div class="text-sm grow-1 text-gray-600 mt-1">
              Используйте логические операторы "И"/"ИЛИ" на естественном языке, не задумываясь о
              синтаксисе.
            </div>
            <div class="text-sm text-gray-800 mt-5">
              "<b>Покажи</b> задачи на завтра, которые <b>ТАКЖЕ</b> имеют тег #срочно."
            </div>
          </div>
        </div>
        <!-- End Icon Block -->

        <!-- Icon Block -->
        <div
          data-aos="fade"
          data-aos-delay="900"
          data-aos-duration="1000"
          data-aos-anchor=".icon-grid-block"
          data-aos-once="true"
          class="flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5"
        >
          <!-- Icon -->
          <div
            class="flex justify-center shrink-0 items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
          >
            <MessageCircleQuestionMark class="size-6 text-white" />
          </div>
          <!-- End Icon -->
          <div class="mt-3 flex flex-col h-full">
            <h3 class="text-sm sm:text-lg font-semibold text-gray-800">Умное Уточнение</h3>
            <div class="text-sm grow-1 text-gray-600 mt-1">
              Если команда неоднозначна, ассистент не ошибется, а задаст уточняющий вопрос.
            </div>
            <div class="text-sm text-gray-800 mt-5">
              — "<b>Удали</b> задачу 'Отчет'."<br />
              — "<b>Найдено</b> две: 'Недельный отчет' и 'Годовой отчет'. Какую удалить?"
            </div>
          </div>
        </div>
        <!-- End Icon Block -->

        <!-- Icon Block -->
        <div
          data-aos="fade"
          data-aos-delay="1200"
          data-aos-duration="1000"
          data-aos-anchor=".icon-grid-block"
          data-aos-once="true"
          class="flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5"
        >
          <!-- Icon -->
          <div
            class="flex justify-center shrink-0 items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
          >
            <Pencil class="size-6 text-white" />
          </div>
          <!-- End Icon -->
          <div class="mt-3 flex flex-col h-full">
            <h3 class="text-sm sm:text-lg font-semibold text-gray-800">Точное Редактирование</h3>
            <div class="text-sm grow-1 text-gray-600 mt-1">
              Не просто изменяйте, а добавляйте, удаляйте или заменяйте части текста в названиях
              задач.
            </div>
            <div class="text-sm text-gray-800 mt-5">
              "В начале всех просроченных задач <b>добавь</b> [ПРОСРОЧЕНО]: ."
            </div>
          </div>
        </div>
        <!-- End Icon Block -->

        <!-- Icon Block -->
        <div
          data-aos="fade"
          data-aos-delay="1500"
          data-aos-duration="1000"
          data-aos-anchor=".icon-grid-block"
          data-aos-once="true"
          class="flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5"
        >
          <!-- Icon -->
          <div
            class="flex justify-center shrink-0 items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
          >
            <Map class="size-6 text-white" />
          </div>
          <!-- End Icon -->
          <div class="mt-3 flex flex-col h-full">
            <h3 class="text-sm sm:text-lg font-semibold text-gray-800">Понимание Контекста</h3>
            <div class="text-sm grow-1 text-gray-600 mt-1">
              Ассистент знает, на какой доске вы находитесь. Не нужно каждый раз уточнять проект.
            </div>
            <div class="text-sm text-gray-800 mt-5">
              (Находясь на доске 'Маркетинг') > "<b>Создай</b> задачу 'Подготовить презентацию'."
            </div>
          </div>
        </div>
        <!-- End Icon Block -->

        <!-- Icon Block -->
        <div
          data-aos="fade"
          data-aos-delay="1800"
          data-aos-duration="1000"
          data-aos-anchor=".icon-grid-block"
          data-aos-once="true"
          class="flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5"
        >
          <!-- Icon -->
          <div
            class="flex justify-center shrink-0 items-center size-12 bg-linear-to-br from-blue-600 to-violet-600 rounded-lg mx-auto"
          >
            <MessageCircleIcon class="size-6 text-white" />
          </div>
          <!-- End Icon -->
          <div class="mt-3 flex flex-col h-full">
            <h3 class="text-sm sm:text-lg font-semibold text-gray-800">Память Диалога</h3>
            <div class="text-sm grow-1 text-gray-600 mt-1">
              Ссылайтесь на предыдущие результаты. AI помнит, о чем вы говорили несколько шагов
              назад.
            </div>
            <div class="text-sm text-gray-800 mt-5">
              — "<b>Найди</b> все задачи с тегом #баг."<br />
              — "<b>Найдено</b> 5 задач."<br />
              — "Отлично, <b>перемести их</b> в архив."
            </div>
          </div>
        </div>
        <!-- End Icon Block -->
      </div>
      <!-- End Grid -->
    </div>
  </section>
</template>
