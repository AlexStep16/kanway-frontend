<script setup lang="ts">
import AIInput from '@components/Workspace/Main/Chat/AIInput.vue'
import { Brain, Luggage, PanelLeftOpen } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'
import { ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import { Clapperboard, Newspaper, NotepadText } from 'lucide-vue-next'
import KanbarLogo from '../../../assets/kanbar_logo.svg?component'

const UI_STORE = useUIStore()

const startTiles = ref([
  {
    title: 'Контент-план на месяц',
    query:
      'Я веду блог про [тема]. Сгенерируй идеи для постов и расставь их по стадиям: Идея, Черновик, Дизайн, Опубликовано.',
    iconComponent: NotepadText,
  },
  {
    title: 'Сценарий для YouTube/Reels',
    query: 'Разбить процесс создания видео на этапы: от сценария до монтажа и дистрибуции.',
    iconComponent: Clapperboard,
  },
  {
    title: 'Написать книгу/статью',
    query: 'Структурировать главы и установить цели по количеству слов на каждый день.',
    iconComponent: Newspaper,
  },
  {
    title: 'Выучить новый навык с нуля',
    query:
      'Я хочу выучить Python. Построй мне дорожную карту (Roadmap) на 3 месяца в виде канбан-задач.',
    iconComponent: Brain,
  },
  {
    title: 'Планирование переезда/путешествия',
    query:
      'Я планирую переехать в Калининград из Москвы. Составь список дел: документы, билеты, вещи, жилье.',
    iconComponent: Luggage,
  },
])
</script>
<template>
  <div class="size-full flex items-center justify-center relative">
    <button
      type="button"
      class="inline-flex p-1.5 absolute left-0 top-5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-100"
      @click="UI_STORE.openSidebar()"
      v-if="!UI_STORE.isSidebarOpen"
    >
      <PanelLeftOpen class="size-5" />
    </button>

    <div class="flex w-full flex-col items-center gap-y-6 max-w-150">
      <div class="flex flex-col flex-wrap justify-center items-center text-center">
        <KanbarLogo class="h-10 sm:h-12" />
        <h2 class="text-2xl sm:text-4xl font-bold mt-3 text-gray-700">Что будем делать сегодня?</h2>
        <div class="flex items-center justify-center flex-wrap gap-2 mt-3">
          <Button size="sm" variant="outlinePrimary" v-for="tile of startTiles" :key="tile.title">
            <component :is="tile.iconComponent" class="size-4" />
            <span class="text-xs">{{ tile.title }}</span>
          </Button>
        </div>
      </div>

      <AIInput />
    </div>
  </div>
</template>
