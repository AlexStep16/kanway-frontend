<script setup lang="ts">
import AvatarImage from '@/components/Workspace/AvatarImage.vue'
import { useAuthStore } from '@stores/auth'
import { ref } from 'vue'

defineProps<{
  size?: number
  cameraSize?: number
  imageClasses?: string
}>()

const AUTH_STORE = useAuthStore()

const avatarRef = ref<HTMLInputElement | null>(null)

function triggerFileSelect() {
  avatarRef.value?.click()
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null

  if (file) {
    await AUTH_STORE.updateAvatar(file)
  }
}
</script>

<template>
  <div class="rounded-full bg-gray-300 relative" @click="triggerFileSelect">
    <input type="file" accept="image/*" class="hidden" ref="avatarRef" @change="handleFileChange" />
    <AvatarImage :imageClasses />

    <div
      class="size-full flex items-center justify-center absolute cursor-pointer text-white inset-0 rounded-full bg-black outline-2 outline-transparent opacity-0 hover:opacity-70 hover:outline-blue-500 transition-all duration-100"
    >
      <slot></slot>
    </div>
  </div>
</template>
