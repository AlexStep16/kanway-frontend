<script setup lang="ts">
import TitleBoard from '@/components/Workspace/Header/TitleBoard.vue'
import TitleArchive from '@/components/Workspace/Header/TitleArchive.vue'
import SearchBox from '@/components/Workspace/Header/SearchBox.vue'
import Filter from '@/components/Workspace/Header/Filter.vue'
import Tabs from '@/enums/TabsEnum'

defineProps<{
  tab: Tabs
}>()
</script>

<template>
  <!-- Header -->
  <div
    class="flex items-center whitespace-nowrap w-full h-[3.625rem] shrink-0 border-b border-gray-200"
  >
    <TitleBoard v-if="tab === Tabs.Board" />
    <TitleArchive v-if="tab === Tabs.Archive" />

    <div class="flex ms-auto items-stretch gap-x-3">
      <SearchBox :placeholder="tab === Tabs.Archive ? 'Поиск в архиве...' : ''" />
      <Filter />
    </div>
  </div>
  <!-- End Header -->
</template>
