<script setup lang="ts">
import { X } from 'lucide-vue-next'

const isOpen = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const close = () => isOpen.value = false
</script>

<template>
  <AlertDialog :open="isOpen" @update:open="(val) => isOpen = val">
    <AlertDialogContent class="max-w-sm p-0 overflow-hidden border-none shadow-2xl rounded-xl">
      <button
        @click="close"
        class="absolute right-4 top-4 rounded-full p-1 opacity-70 ring-offset-background transition-opacity hover:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
      >
        <X class="size-4" />
        <span class="sr-only">Закрыть</span>
      </button>

      <div class="p-6">
        <AlertDialogHeader class="space-y-3 text-center">
          <AlertDialogTitle class="text-xl font-bold tracking-tight text-foreground">
            Удаление аккаунта
          </AlertDialogTitle>
          <AlertDialogDescription class="text-sm text-muted-foreground">
            Вы уверены, что хотите это сделать? Это действие необратимо.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </div>

      <div class="border-t border-border bg-muted/30 px-6 py-4">
        <AlertDialogFooter class="flex-row gap-3 sm:justify-center">
          <AlertDialogCancel 
            @click="close"
            class="mt-0 flex-1 bg-background hover:bg-accent border-border"
          >
            Отмена
          </AlertDialogCancel>
          
          <AlertDialogAction
            @click="emit('confirm')"
            class="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Подтвердить
          </AlertDialogAction>
        </AlertDialogFooter>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>