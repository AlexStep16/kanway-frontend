<script setup lang="ts">
import { Check, X, Annoyed } from 'lucide-vue-next'
</script>

<template>
  <section
    class="relative z-1 overflow-hidden bg-[linear-gradient(180deg,var(--color-gray-300),var(--color-gray-100),#ffffff)] md:bg-[linear-gradient(90deg,var(--color-gray-300),var(--color-gray-100),#ffffff)]"
  >
    <div
      class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-10"
      data-aos="fade"
      data-aos-duration="1000"
      data-aos-once="true"
    >
      <!-- Title -->
      <div class="max-w-2xl text-center mx-auto relative z-10">
        <div class="relative inline-block">
          <h1
            class="block font-bold text-gray-800 text-2xl md:text-3xl lg:text-4xl whitespace-nowrap opacity-100"
          >
            Устали от рутины?
          </h1>

          <h1
            id="white-h-overlay"
            class="block font-bold text-white text-2xl md:text-3xl lg:text-4xl whitespace-nowrap absolute top-0 left-0"
          >
            Устали от рутины?
          </h1>
        </div>
      </div>
      <!-- End Title -->

      <div class="mt-4 max-w-2xl text-center mx-auto">
        <div class="relative inline-block">
          <p class="text-base md:text-lg text-gray-600">
            Средний таск-менеджер требует ~20 кликов, чтобы перенести 20 задач.<br />
            Мы сокращаем это до одной фразы.
          </p>
          <p id="white-text-overlay" class="text-base md:text-lg text-white absolute top-0 left-0">
            Средний таск-менеджер требует ~20 кликов, чтобы перенести 20 задач.<br />
            Мы сокращаем это до одной фразы.
          </p>
        </div>
      </div>
    </div>

    <div id="problem-solution" class="pb-16 mb:pb-24 pt-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <div
          class="grid grid-cols-[repeat(1,minmax(200px,400px))] justify-center md:grid-cols-2 gap-4 md:gap-8"
        >
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-once="true"
            class="flex flex-col gap-y-2 md:gap-y-3 bg-white shadow-[0px_5px_7px_0px_#80808026] rounded-xl p-4 md:p-6"
          >
            <div class="flex items-center">
              <Annoyed class="size-6 md:size-7 text-red-500 mr-2" />
              <h3 class="text-lg md:text-xl font-semibold text-gray-700">Обычный таск-менеджер</h3>
            </div>

            <p class="text-gray-500 leading-relaxed grow-1">
              Ваш текущий таск-менеджер — это просто цифровой список. Чтобы выполнить комплексное
              действие, например, перенести 20 просроченных задач, нужно выполнить ~20 утомительных
              кликов.
            </p>

            <ul class="space-y-2">
              <li class="flex items-center gap-x-2">
                <span class="text-red-500 font-bold"><X class="size-5 md:size-6" /></span>
                <span class="text-sm md:text-base text-gray-700 font-medium">
                  Долгое перетаскивание задач по доскам.
                </span>
              </li>
              <li class="flex items-center gap-x-2">
                <span class="text-red-500 font-bold"><X class="size-5 md:size-6" /></span>
                <span class="text-sm md:text-base text-gray-700 font-medium"
                  >Сложная настройка фильтров И/ИЛИ.</span
                >
              </li>
              <li class="flex items-center gap-x-2">
                <span class="text-red-500 font-bold"><X class="size-5 md:size-6" /></span>
                <span class="text-sm md:text-base text-gray-700 font-medium">
                  Риск ошибок из-за человеческого фактора.
                </span>
              </li>
            </ul>
          </div>

          <div
            data-aos="fade-left"
            data-aos-delay="500"
            data-aos-duration="1000"
            data-aos-once="true"
            class="flex flex-col gap-y-2 md:gap-y-3 bg-white shadow-[0px_0px_8px_4px_#ffffff2b] rounded-xl p-4 md:p-6"
          >
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0,0,256,256"
                class="size-6 md:size-7 text-blue-500 mr-2"
              >
                <g
                  fill="#3b82f6"
                  fill-rule="nonzero"
                  stroke="none"
                  stroke-width="1"
                  stroke-linecap="butt"
                  stroke-linejoin="miter"
                  stroke-miterlimit="10"
                  stroke-dasharray=""
                  stroke-dashoffset="0"
                  font-family="none"
                  font-weight="none"
                  font-size="none"
                  text-anchor="none"
                  style="mix-blend-mode: normal"
                >
                  <g transform="scale(5.12,5.12)">
                    <path
                      d="M49.306,26.548l-11.24,-3.613l-3.613,-11.241c-0.134,-0.414 -0.518,-0.694 -0.953,-0.694c-0.435,0 -0.819,0.28 -0.952,0.694l-3.613,11.241l-11.24,3.613c-0.415,0.133 -0.695,0.517 -0.695,0.952c0,0.435 0.28,0.819 0.694,0.952l11.24,3.613l3.613,11.241c0.134,0.414 0.518,0.694 0.953,0.694c0.435,0 0.819,-0.28 0.952,-0.694l3.613,-11.241l11.24,-3.613c0.415,-0.133 0.695,-0.517 0.695,-0.952c0,-0.435 -0.28,-0.819 -0.694,-0.952zM1.684,13.949l7.776,2.592l2.592,7.776c0.136,0.408 0.517,0.683 0.948,0.683c0.431,0 0.813,-0.275 0.948,-0.684l2.592,-7.776l7.776,-2.592c0.409,-0.135 0.684,-0.517 0.684,-0.948c0,-0.431 -0.275,-0.813 -0.684,-0.949l-7.776,-2.592l-2.592,-7.776c-0.135,-0.408 -0.517,-0.683 -0.948,-0.683c-0.431,0 -0.813,0.275 -0.948,0.684l-2.592,7.775l-7.776,2.592c-0.409,0.137 -0.684,0.518 -0.684,0.949c0,0.431 0.275,0.813 0.684,0.949zM17.316,39.05l-5.526,-1.842l-1.842,-5.524c-0.135,-0.408 -0.517,-0.684 -0.948,-0.684c-0.431,0 -0.813,0.275 -0.948,0.684l-1.842,5.524l-5.525,1.842c-0.408,0.136 -0.684,0.518 -0.684,0.949c0,0.431 0.275,0.813 0.684,0.949l5.526,1.842l1.841,5.524c0.136,0.407 0.517,0.683 0.948,0.683c0.431,0 0.813,-0.275 0.948,-0.684l1.842,-5.524l5.526,-1.842c0.409,-0.136 0.684,-0.518 0.684,-0.948c0,-0.43 -0.275,-0.813 -0.684,-0.949z"
                    ></path>
                  </g>
                </g>
              </svg>
              <h3 class="text-lg md:text-xl font-semibold text-blue-500">Kanbar</h3>
            </div>

            <p class="text-gray-500 leading-relaxed grow-1">
              Просто скажите, что вам нужно. Наш AI-агент понимает контекст и мгновенно выполняет
              многошаговые команды, освобождая ваше время для самого важного. Это очень просто!
            </p>

            <ul class="space-y-2">
              <li class="flex items-center gap-x-2">
                <span class="text-green-500 font-bold"><Check class="size-5 md:size-6" /></span>
                <span class="text-gray-700 font-medium text-sm md:text-base">
                  "<b>Перенеси</b> всё просроченное в Срочное."
                </span>
              </li>
              <li class="flex items-center gap-x-2">
                <span class="text-green-500 font-bold"><Check class="size-5 md:size-6" /></span>
                <span class="text-gray-700 font-medium text-sm md:text-base">
                  "<b>Покажи</b> задачи с #баг ИЛИ от Маши."
                </span>
              </li>
              <li class="flex items-center gap-x-2">
                <span class="text-green-500 font-bold"><Check class="size-5 md:size-6" /></span>
                <span class="text-gray-700 font-medium text-sm md:text-base">
                  Точное выполнение сложных команд за секунды.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div
      id="blue-circle"
      class="size-450 absolute -right-120 -top-10 bg-[linear-gradient(0deg,rgb(238,124,255)_0%,_#5a8bf8_100%)] rounded-full -z-1"
    ></div>
  </section>
</template>
