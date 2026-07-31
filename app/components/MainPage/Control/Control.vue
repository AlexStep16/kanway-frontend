<script setup lang="ts">
import { CheckCircle, Map, Undo } from '@lucide/vue'
import DemoPlan from '~/components/Workspace/Main/Chat/Demo/DemoPlan.vue'
import DemoConfirmation from '~/components/Workspace/Main/Chat/Demo/DemoConfirmation.vue'
import DemoCancel from '~/components/Workspace/Main/Chat/Demo/DemoCancel.vue'

defineProps<{
  activeTab: typeof DemoPlan | typeof DemoConfirmation | typeof DemoCancel
}>()

const demoContainerRef = ref<HTMLDivElement | null>(null)
const isChatVisible = ref(false)

const { stop } = useIntersectionObserver(
  demoContainerRef,
  (entries) => {
    const entry = entries[0]

    if (entry?.isIntersecting) {
      isChatVisible.value = true
      stop()
    }
  },
  {
    threshold: 0.5,
  },
)
</script>

<template>
  <section class="relative isolate overflow-hidden bg-zinc-900 pt-24 pb-32 sm:pt-32 sm:pb-40">
    <div class="absolute inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#3f3f46_1px,transparent_1px),linear-gradient(to_bottom,#3f3f46_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_50%,transparent_100%)] opacity-20"
      ></div>

      <div
        class="absolute top-0 left-1/4 w-150 h-150 bg-indigo-500/10 blur-[120px] rounded-full"
      ></div>
      <div
        class="absolute bottom-0 right-1/4 w-125 h-125 bg-zinc-600/10 blur-[100px] rounded-full"
      ></div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-12 items-center">
        <div class="max-w-2xl">
          <h2
            data-aos="fade-down"
            data-aos-duration="1000"
            data-aos-delay="300"
            data-aos-once="true"
            class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight control-header"
          >
            Вы всегда за рулем
          </h2>
          <p
            data-aos="fade-down"
            data-aos-duration="1000"
            data-aos-delay="400"
            data-aos-once="true"
            class="text-base mb-10 text-zinc-400 leading-relaxed"
          >
            Мощный AI требует полного контроля. Мы создали систему, в которой вы всегда имеете
            последнее слово. Никаких сюрпризов.
          </p>

          <div class="flex flex-col gap-4">
            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="300"
              data-aos-once="true"
              data-aos-anchor=".control-header"
            >
              <button
                class="group relative flex items-start gap-4 rounded-xl border p-5 text-left transition-all focus:outline-none"
                :class="{
                  'border-zinc-600 bg-zinc-800 shadow-lg shadow-black/40': activeTab === DemoPlan,
                  'border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800/80 hover:border-zinc-700 shadow-sm':
                    activeTab !== DemoPlan,
                }"
                @click="$emit('update:activeTab', DemoPlan)"
              >
                <div
                  class="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                  v-if="activeTab === DemoPlan"
                ></div>

                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-lg"
                  :class="{
                    'bg-zinc-800/60 border border-zinc-700/80 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-500':
                      activeTab !== DemoPlan,
                    'bg-indigo-500/15 border border-indigo-500/40 text-indigo-400':
                      activeTab === DemoPlan,
                  }"
                >
                  <Map class="size-5" />
                </div>
                <div>
                  <h3
                    class="text-base font-bold mb-1"
                    :class="{
                      'text-white': activeTab === DemoPlan,
                      'text-zinc-300 group-hover:text-white transition-colors':
                        activeTab !== DemoPlan,
                    }"
                  >
                    Планирование
                  </h3>
                  <p
                    class="text-sm transition-colors leading-relaxed"
                    :class="{
                      'text-zinc-300': activeTab === DemoPlan,
                      'text-zinc-500 group-hover:text-zinc-300 transition-colors':
                        activeTab !== DemoPlan,
                    }"
                  >
                    Агент анализирует запрос и составляет цепочку действий. Вы видите, что он
                    собирается сделать до выполнения.
                  </p>
                </div>
              </button>
            </div>

            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="400"
              data-aos-once="true"
              data-aos-anchor=".control-header"
            >
              <button
                class="group relative flex items-start gap-4 rounded-xl border p-5 text-left transition-all focus:outline-none"
                :class="{
                  'border-zinc-600 bg-zinc-800 shadow-lg shadow-black/40':
                    activeTab === DemoConfirmation,
                  'border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800/80 hover:border-zinc-700 shadow-sm':
                    activeTab !== DemoConfirmation,
                }"
                @click="$emit('update:activeTab', DemoConfirmation)"
              >
                <div
                  class="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                  v-if="activeTab === DemoConfirmation"
                ></div>

                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-lg"
                  :class="{
                    'bg-zinc-800/60 border border-zinc-700/80 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-500':
                      activeTab !== DemoConfirmation,
                    'bg-indigo-500/15 border border-indigo-500/40 text-indigo-400':
                      activeTab === DemoConfirmation,
                  }"
                >
                  <CheckCircle class="size-5" />
                </div>
                <div>
                  <h3
                    class="text-base font-bold mb-1"
                    :class="{
                      'text-white': activeTab === DemoConfirmation,
                      'text-zinc-300 group-hover:text-white transition-colors':
                        activeTab !== DemoConfirmation,
                    }"
                  >
                    Подтверждение
                  </h3>
                  <p
                    class="text-sm transition-colors leading-relaxed"
                    :class="{
                      'text-zinc-300': activeTab === DemoConfirmation,
                      'text-zinc-500 group-hover:text-zinc-300 transition-colors':
                        activeTab !== DemoConfirmation,
                    }"
                  >
                    Безопасное выполнение. Подтверждайте изменения статусов или удаление карточек
                    одним кликом.
                  </p>
                </div>
              </button>
            </div>

            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="500"
              data-aos-once="true"
              data-aos-anchor=".control-header"
            >
              <button
                class="group relative flex items-start gap-4 rounded-xl border p-5 text-left transition-all focus:outline-none"
                :class="{
                  'border-zinc-600 bg-zinc-800 shadow-lg shadow-black/40': activeTab === DemoCancel,
                  'border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800/80 hover:border-zinc-700 shadow-sm':
                    activeTab !== DemoCancel,
                }"
                @click="$emit('update:activeTab', DemoCancel)"
              >
                <div
                  class="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                  v-if="activeTab === DemoCancel"
                ></div>

                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-lg"
                  :class="{
                    'bg-zinc-800/60 border border-zinc-700/80 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-500':
                      activeTab !== DemoCancel,
                    'bg-indigo-500/15 border border-indigo-500/40 text-indigo-400':
                      activeTab === DemoCancel,
                  }"
                >
                  <Undo class="size-5" />
                </div>
                <div>
                  <h3
                    class="text-base font-semibold transition-colors mb-1"
                    :class="{
                      'text-white': activeTab === DemoCancel,
                      'text-zinc-300 group-hover:text-white transition-colors':
                        activeTab !== DemoCancel,
                    }"
                  >
                    Отмена
                  </h3>
                  <p
                    class="text-sm transition-colors leading-relaxed"
                    :class="{
                      'text-zinc-300': activeTab === DemoCancel,
                      'text-zinc-500 group-hover:text-zinc-300 transition-colors':
                        activeTab !== DemoCancel,
                    }"
                  >
                    Что-то пошло не так? Мгновенный откат любых изменений возвращает доску в
                    предыдущее состояние.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="300"
          data-aos-once="true"
          data-aos-anchor=".control-header"
          class="w-full h-150 md:w-140 md:h-170 lg:w-120 lg:h-150 xl:w-140 xl:h-170 relative flex shrink-0 overflow-hidden rounded-[20px] border border-zinc-200/80 bg-white/95 shadow-sm ring-1 ring-black/2 backdrop-blur supports-backdrop-filter:bg-white/90"
          ref="demoContainerRef"
        >
          <ClientOnly>
            <Transition
              name="fade"
              mode="out-in"
            >
              <component
                :is="activeTab"
                class="flex-1"
                :isChatVisible="isChatVisible"
              />
            </Transition>
          </ClientOnly>
        </div>
      </div>
    </div>
  </section>
</template>
