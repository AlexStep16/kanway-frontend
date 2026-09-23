<script setup lang="ts">
const uiStore = useUIStore()

const showEmptyInputMessage = ref(true)

function onSearchInput(value: string) {
  showEmptyInputMessage.value = value.length === 0
}
</script>

<template>
  <div
    class="flex flex-col w-full bg-background rounded-lg shadow-2xl pointer-events-auto border overflow-hidden"
  >
    <SearchBox
      @input="onSearchInput"
      variant="static"
    />
  </div>

  <DialogTitle class="sr-only">Поиск по пространствам и доскам</DialogTitle>
  <DialogDescription class="sr-only"> Введите поисковый запрос </DialogDescription>
</template>
