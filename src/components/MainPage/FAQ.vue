<script setup lang="ts"></script>

<template>
  <section class="relative z-1 overflow-hidden bg-gray-50">
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <!-- Title -->
      <div
        data-aos="fade"
        data-aos-duration="1000"
        data-aos-once="true"
        class="max-w-2xl mx-auto text-center mb-10 lg:mb-14"
      >
        <h2 class="text-2xl font-bold md:text-4xl md:leading-tight">
          Остались вопросы? У нас есть ответы.
        </h2>
        <p class="mt-1 text-gray-600">Ответы на самые часто задаваемые вопросы.</p>
      </div>
      <!-- End Title -->

      <div class="max-w-2xl mx-auto">
        <!-- Accordion -->
        <div class="hs-accordion-group faq-group">
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
            class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6 active"
            id="hs-basic-with-title-and-arrow-stretched-heading-one"
          >
            <button
              class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500"
              aria-expanded="true"
              aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-one"
            >
              Как именно работает AI? Это просто чат-бот?
              <svg
                class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m6 9 6 6 6-6" />
              </svg>
              <svg
                class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
            <div
              id="hs-basic-with-title-and-arrow-stretched-collapse-one"
              class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-one"
            >
              <p class="text-gray-800">
                Нет, это гораздо больше. Наш AI-ассистент работает как настоящий помощник: он
                анализирует вашу команду, составляет пошаговый план действий (например, "найти
                задачи" -> "изменить цвет" -> "переместить"), а затем выполняет его. Он понимает
                контекст вашей работы, помнит предыдущие сообщения и даже задает уточняющие вопросы,
                если команда неоднозначна.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-anchor=".faq-group"
            data-aos-duration="1000"
            data-aos-once="true"
            class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6"
            id="hs-basic-with-title-and-arrow-stretched-heading-two"
          >
            <button
              class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500"
              aria-expanded="false"
              aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-two"
            >
              Мои задачи и данные в безопасности? Вы отправляете их в сторонние сервисы?
              <svg
                class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m6 9 6 6 6-6" />
              </svg>
              <svg
                class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
            <div
              id="hs-basic-with-title-and-arrow-stretched-collapse-two"
              class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-two"
            >
              <p class="text-gray-800">
                Конфиденциальность — наш главный приоритет. Мы используем передовые LLM-модели через
                защищенные API, но мы НЕ используем ваши данные для обучения моделей. Ваша
                информация обрабатывается для выполнения команды и ни для чего больше. Все данные
                хранятся в зашифрованном виде на надежных серверах.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="600"
            data-aos-anchor=".faq-group"
            data-aos-duration="1000"
            data-aos-once="true"
            class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6"
            id="hs-basic-with-title-and-arrow-stretched-heading-three"
          >
            <button
              class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500"
              aria-expanded="false"
              aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-three"
            >
              Что считается одним "AI-сообщением" в тарифах?
              <svg
                class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m6 9 6 6 6-6" />
              </svg>
              <svg
                class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
            <div
              id="hs-basic-with-title-and-arrow-stretched-collapse-three"
              class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-three"
            >
              <p class="text-gray-800">
                Одно AI-сообщение — это любая ваша команда, которая требует от AI выполнения
                действия или сложного поиска (например, "создай задачу", "найди все просроченное",
                "переименуй проекты"). Простые диалоги в стиле "Привет, как дела?" не расходуют ваш
                лимит. Если вы достигнете лимита, AI-ассистент приостановит работу до начала
                следующего месяца, но вы по-прежнему сможете пользоваться таск-менеджером в ручном
                режиме.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="900"
            data-aos-anchor=".faq-group"
            data-aos-duration="1000"
            data-aos-once="true"
            class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6"
            id="hs-basic-with-title-and-arrow-stretched-heading-four"
          >
            <button
              class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500"
              aria-expanded="false"
              aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-four"
            >
              Чем вы лучше других таск-менеджеров, в которых тоже есть AI?
              <svg
                class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m6 9 6 6 6-6" />
              </svg>
              <svg
                class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
            <div
              id="hs-basic-with-title-and-arrow-stretched-collapse-four"
              class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-four"
            >
              <p class="text-gray-800">
                Большинство AI-инструментов — это "умное" автодополнение или генерация текста. Наш
                сервис — это полноценный исполнительный агент. Он не просто предлагает идеи, а
                выполняет ваши команды, понимая контекст вашей работы. Наш AI-ассистент интегрирован
                глубоко в таск-менеджер, что позволяет ему эффективно управлять задачами, проектами
                и командами.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="1200"
            data-aos-anchor=".faq-group"
            data-aos-duration="1000"
            data-aos-once="true"
            class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6"
            id="hs-basic-with-title-and-arrow-stretched-heading-five"
          >
            <button
              class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500"
              aria-expanded="false"
              aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-five"
            >
              Могу ли я использовать сервис со своей командой?
              <svg
                class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m6 9 6 6 6-6" />
              </svg>
              <svg
                class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
            <div
              id="hs-basic-with-title-and-arrow-stretched-collapse-five"
              class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-five"
            >
              <p class="text-gray-800">
                На данный момент сервис лучше всего подходит для индивидуальной работы и личной
                продуктивности. Функционал для совместной работы команд — наш главный приоритет, и
                он появится в ближайших обновлениях для тарифов "Премиум" и "Бизнес".
              </p>
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="1500"
            data-aos-anchor=".faq-group"
            data-aos-duration="1000"
            data-aos-once="true"
            class="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6"
            id="hs-basic-with-title-and-arrow-stretched-heading-six"
          >
            <button
              class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-blue-500 focus:outline-hidden focus:text-blue-500"
              aria-expanded="false"
              aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-six"
            >
              Какова ваша политика возврата?
              <svg
                class="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m6 9 6 6 6-6" />
              </svg>
              <svg
                class="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-blue-500"
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
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
            <div
              id="hs-basic-with-title-and-arrow-stretched-collapse-six"
              class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-six"
            >
              <p class="text-gray-800">
                Мы предлагаем возвраты. Мы стремимся к тому, чтобы сосредоточиться на построении
                отношений с нашими клиентами и сообществом.
              </p>
            </div>
          </div>
        </div>
        <!-- End Accordion -->
      </div>
    </div>
    <!-- End FAQ -->
  </section>
</template>
