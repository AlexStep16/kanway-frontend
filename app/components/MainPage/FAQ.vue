<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
</script>

<template>
  <section class="relative z-1 overflow-hidden bg-gray-50">
    <div class="max-w-340 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <!-- Title -->
      <div
        data-aos="fade"
        data-aos-duration="1000"
        data-aos-once="true"
        class="max-w-2xl mx-auto text-center mb-10 lg:mb-14"
      >
        <h2 class="text-2xl font-bold md:text-4xl md:leading-tight">
          Остались вопросы?<br />
          У нас есть ответы
        </h2>
      </div>
      <!-- End Title -->

      <div class="max-w-2xl mx-auto">
        <!-- Accordion -->
        <Accordion
          type="single"
          collapsible
          class="w-full faq-group"
          default-value="item-1"
        >
          <!-- Item 1 -->
          <AccordionItem
            value="item-1"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
            class="rounded-xl border-none p-6 transition-colors data-[state=open]:bg-gray-100"
          >
            <AccordionTrigger
              class="group flex w-full items-center justify-between gap-x-3 rounded-lg py-0 pb-3 text-start font-semibold text-gray-800 transition-colors hover:no-underline hover:text-blue-500 focus:text-blue-500 focus:outline-hidden data-[state=open]:text-blue-500 md:text-lg [&>svg]:size-5 [&>svg]:text-gray-600 group-hover:[&>svg]:text-blue-500 data-[state=open]:[&>svg]:text-blue-500"
            >
              Как именно работает AI? Это просто чат-бот?
            </AccordionTrigger>
            <AccordionContent class="pb-0">
              <p class="text-gray-800 text-base">
                Нет, это гораздо больше. Наш AI-ассистент работает как настоящий помощник: он
                анализирует вашу команду, составляет пошаговый план действий (например, "найти
                задачи" -> "изменить цвет" -> "переместить"), а затем выполняет его. Он понимает
                контекст вашей работы, помнит предыдущие сообщения и даже задает уточняющие вопросы,
                если команда неоднозначна.
              </p>
            </AccordionContent>
          </AccordionItem>

          <!-- Item 2 -->
          <AccordionItem
            value="item-2"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-anchor=".faq-group"
            data-aos-duration="1000"
            data-aos-once="true"
            class="rounded-xl border-none p-6 transition-colors data-[state=open]:bg-gray-100"
          >
            <AccordionTrigger
              class="group flex w-full items-center justify-between gap-x-3 rounded-lg py-0 pb-3 text-start font-semibold text-gray-800 transition-colors hover:no-underline hover:text-blue-500 focus:text-blue-500 focus:outline-hidden data-[state=open]:text-blue-500 md:text-lg [&>svg]:size-5 [&>svg]:text-gray-600 group-hover:[&>svg]:text-blue-500 data-[state=open]:[&>svg]:text-blue-500"
            >
              Мои задачи и данные в безопасности? Вы отправляете их в сторонние сервисы?
            </AccordionTrigger>
            <AccordionContent class="pb-0">
              <p class="text-gray-800 text-base">
                Конфиденциальность — наш главный приоритет. Мы используем передовые LLM-модели через
                защищенные API, но мы НЕ используем ваши данные для обучения моделей. Ваша
                информация обрабатывается для выполнения команды и ни для чего больше. Все данные
                хранятся в зашифрованном виде на надежных серверах.
              </p>
            </AccordionContent>
          </AccordionItem>

          <!-- Item 3 -->
          <AccordionItem
            value="item-3"
            data-aos="fade-up"
            data-aos-delay="600"
            data-aos-anchor=".faq-group"
            data-aos-duration="1000"
            data-aos-once="true"
            class="rounded-xl border-none p-6 transition-colors data-[state=open]:bg-gray-100"
          >
            <AccordionTrigger
              class="group flex w-full items-center justify-between gap-x-3 rounded-lg py-0 pb-3 text-start font-semibold text-gray-800 transition-colors hover:no-underline hover:text-blue-500 focus:text-blue-500 focus:outline-hidden data-[state=open]:text-blue-500 md:text-lg [&>svg]:size-5 [&>svg]:text-gray-600 group-hover:[&>svg]:text-blue-500 data-[state=open]:[&>svg]:text-blue-500"
            >
              Как расходуются кредиты в Kanway AI?
            </AccordionTrigger>
            <AccordionContent class="pb-0">
              <p class="text-gray-800 text-base">
                Расход кредитов напрямую зависит от объема интеллектуальной работы, которую
                выполняет система. В Kanway задействована цепочка агентов, и чем больше информации
                им нужно обработать и создать, тем больше ресурсов ИИ расходуется.<br /><br />
                Вы платите за результат: от короткого совета до полноценной архитектуры проекта.
              </p>
            </AccordionContent>
          </AccordionItem>

          <!-- Item 4 -->
          <AccordionItem
            value="item-4"
            data-aos="fade-up"
            data-aos-delay="900"
            data-aos-anchor=".faq-group"
            data-aos-duration="1000"
            data-aos-once="true"
            class="rounded-xl border-none p-6 transition-colors data-[state=open]:bg-gray-100"
          >
            <AccordionTrigger
              class="group flex w-full items-center justify-between gap-x-3 rounded-lg py-0 pb-3 text-start font-semibold text-gray-800 transition-colors hover:no-underline hover:text-blue-500 focus:text-blue-500 focus:outline-hidden data-[state=open]:text-blue-500 md:text-lg [&>svg]:size-5 [&>svg]:text-gray-600 group-hover:[&>svg]:text-blue-500 data-[state=open]:[&>svg]:text-blue-500"
            >
              Чем вы лучше других таск-менеджеров, в которых тоже есть AI?
            </AccordionTrigger>
            <AccordionContent class="pb-0">
              <p class="text-gray-800 text-base">
                Большинство AI-инструментов — это "умное" автодополнение или генерация текста. Наш
                сервис — это полноценный исполнительный агент. Он не просто предлагает идеи, а
                выполняет ваши команды, понимая контекст вашей работы. Наш AI-ассистент интегрирован
                глубоко в таск-менеджер, что позволяет ему эффективно управлять задачами, проектами
                и командами.
              </p>
            </AccordionContent>
          </AccordionItem>

          <!-- Item 5 -->
          <AccordionItem
            value="item-5"
            data-aos="fade-up"
            data-aos-delay="1200"
            data-aos-anchor=".faq-group"
            data-aos-duration="1000"
            data-aos-once="true"
            class="rounded-xl border-none p-6 transition-colors data-[state=open]:bg-gray-100"
          >
            <AccordionTrigger
              class="group flex w-full items-center justify-between gap-x-3 rounded-lg py-0 pb-3 text-start font-semibold text-gray-800 transition-colors hover:no-underline hover:text-blue-500 focus:text-blue-500 focus:outline-hidden data-[state=open]:text-blue-500 md:text-lg [&>svg]:size-5 [&>svg]:text-gray-600 group-hover:[&>svg]:text-blue-500 data-[state=open]:[&>svg]:text-blue-500"
            >
              Возможна ли командная работа в Kanway?
            </AccordionTrigger>
            <AccordionContent class="pb-0">
              <p class="text-gray-800 text-base">
                Сейчас архитектура Kanway оптимизирована для «второго мозга» и персональной
                продуктивности. Это позволяет ИИ-агентам максимально глубоко подстраиваться под ваш
                личный контекст. Многопользовательский режим и общие пространства находятся в
                разработке и станут доступны в рамках корпоративных планов.
              </p>
            </AccordionContent>
          </AccordionItem>

          <!-- Item 6 -->
          <AccordionItem
            value="item-6"
            data-aos="fade-up"
            data-aos-delay="1500"
            data-aos-anchor=".faq-group"
            data-aos-duration="1000"
            data-aos-once="true"
            class="rounded-xl border-none p-6 transition-colors data-[state=open]:bg-gray-100"
          >
            <AccordionTrigger
              class="group flex w-full items-center justify-between gap-x-3 rounded-lg py-0 pb-3 text-start font-semibold text-gray-800 transition-colors hover:no-underline hover:text-blue-500 focus:text-blue-500 focus:outline-hidden data-[state=open]:text-blue-500 md:text-lg [&>svg]:size-5 [&>svg]:text-gray-600 group-hover:[&>svg]:text-blue-500 data-[state=open]:[&>svg]:text-blue-500"
            >
              Какова ваша политика возврата?
            </AccordionTrigger>
            <AccordionContent class="pb-0">
              <p class="text-gray-800 text-base">
                У нас предусмотрен возврат товаров и средств. Наш главный приоритет — доверительные
                отношения с клиентами и нашим сообществом.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <!-- End Accordion -->
      </div>
    </div>
  </section>
</template>
