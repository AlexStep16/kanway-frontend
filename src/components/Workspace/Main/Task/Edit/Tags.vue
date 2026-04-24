<script lang="ts" setup>
import { TaskModel } from '@models/TaskModel'
import { ChevronDown, Hash, X } from 'lucide-vue-next'
import ButtonCreate from '@components/Buttons/ButtonCreate.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  task: TaskModel
}>()

const newTag = ref<string>('')

const emit = defineEmits<{
  (e: 'removeTag', index: number): void
  (e: 'addTag', tag: string): void
}>()

function getTagsEnding(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return ' тег'
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return ' тега'
  } else {
    return ' тегов'
  }
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag === '') return

  emit('addTag', tag)

  newTag.value = ''
}

const getTagsTitle = computed(() => {
  if (props.task.tags.length > 0) {
    return props.task.tags.length + getTagsEnding(props.task.tags.length)
  } else {
    return 'Теги'
  }
})
</script>

<template>
  <div class="hs-dropdown [--auto-close:inside] relative inline-flex">
    <button
      id="hs-dropdown-tags"
      type="button"
      class="hs-dropdown-toggle h-8 px-2 inline-flex items-center gap-x-2 text-xs sm:text-custom-sm font-medium border rounded-lg shadow-2xs transition-colors duration-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none:"
      :class="{
        'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 focus:bg-gray-200 ':
          props.task.tags.length === 0,
        'bg-blue-100 border-blue-200 text-blue-500 hover:bg-blue-200 focus:bg-blue-200':
          props.task.tags.length > 0,
      }"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Dropdown"
    >
      <div class="flex items-center gap-x-1">
        <Hash class="size-3.5 sm:size-4" />
        <span>{{ getTagsTitle }}</span>
      </div>
      <ChevronDown
        class="inline-flex items-center justify-center size-4 duration-200 hs-dropdown-open:rotate-180"
      />
    </button>

    <div
      class="hs-dropdown-menu transition-[opacity,margin] z-20 duration hs-dropdown-open:opacity-100 opacity-0 hidden w-65 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="hs-dropdown-tags"
    >
      <div class="flex flex-col p-2">
        <div class="flex flex-col gap-y-0.5 grow">
          <span class="text-xs text-gray-400">Теги</span>
          <div class="flex flex-wrap gap-1 max-h-50 overflow-y-auto">
            <div
              v-for="(tag, index) in props.task.tags"
              :key="tag + props.task.id"
              class="inline-flex cursor-text items-center gap-x-1.5 py-0.5 px-2 rounded-sm text-custom-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              #{{ tag }}
              <button
                type="button"
                class="focus:outline-hidden"
                @click.prevent.stop="$emit('removeTag', index)"
              >
                <X class="size-3.5 text-gray-400 hover:text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-y-1 grow" :class="{ 'mt-2': props.task.tags.length > 0 }">
          <input
            id="tags-input"
            type="text"
            class="w-full rounded-lg border placeholder:text-gray-300 border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200 py-1 px-2 text-sm focus:ring-0 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Добавить тег"
            @keydown.stop=""
            @keypress.stop=""
            @keyup.enter="addTag"
            v-model="newTag"
            autocomplete="off"
          />

          <ButtonCreate :text="'Добавить'" @click="addTag" />
        </div>

        <!-- <div class="flex flex-col gap-y-0.5 grow mt-2">
          <span class="text-xs text-gray-400">Теги в пространстве</span>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in ['дом', 'семья', 'покупки']"
              :key="tag"
              class="inline-flex cursor-pointer items-center gap-x-1.5 py-0.5 px-2 rounded-sm text-custom-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              #{{ tag }}
            </span>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
