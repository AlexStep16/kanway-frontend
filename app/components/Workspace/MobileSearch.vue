<script setup lang="ts">
const uiStore = useUIStore()

const showEmptyInputMessage = ref(true)

function onSearchInput(value: string) {
  showEmptyInputMessage.value = value.length === 0
}
</script>

<template>
  <Dialog v-model:open="uiStore.isMobileSearchOpen">
    <DialogContent
      class="max-h-[95svh] p-0 border-none bg-transparent shadow-none flex flex-col items-start justify-center sm:p-4 translate-y-0! top-[2.5svh]!"
      :show-close-button="false"
    >
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
    </DialogContent>
  </Dialog>
</template>
