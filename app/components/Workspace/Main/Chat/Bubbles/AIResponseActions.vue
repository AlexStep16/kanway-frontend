<script setup lang="ts">
import { ThumbsDown, ThumbsUp } from 'lucide-vue-next'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'

const props = defineProps<{
  message: IChatMessage
  creditsUsed?: number
}>()

const chatStore = useChatStore()

const { activeChatId } = storeToRefs(chatStore)

const { mutate: likeMessage, isPending: isLikePending } = useRateMessage()
const { mutate: dislikeMessage, isPending: isDislikePending } = useRateMessage()

function handleLikeMessage() {
  if (props.message.rating === true) return
  likeMessage({ id: props.message.id, chatId: activeChatId.value, rating: true })
}

function handleDislikeMessage() {
  if (props.message.rating === false) return
  dislikeMessage({ id: props.message.id, chatId: activeChatId.value, rating: false })
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-start gap-1">
    <button
      type="button"
      title="Нравится"
      aria-label="Нравится"
      :disabled="isLikePending || isDislikePending"
      class="text-xs flex items-center justify-center rounded-md text-gray-500 p-1.5 bg-gray-100 hover:bg-gray-200 transition-colors duration-100"
      :class="{
        'bg-green-100 text-green-600': props.message.rating === true,
      }"
      @click="handleLikeMessage"
    >
      <ThumbsUp
        class="size-3"
        v-if="!isLikePending"
      />
      <span
        class="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"
        v-else
      ></span>
    </button>

    <button
      type="button"
      title="Не нравится"
      aria-label="Не нравится"
      :disabled="isLikePending || isDislikePending"
      class="text-xs flex items-center justify-center rounded-md text-gray-500 p-1.5 bg-gray-100 hover:bg-gray-200 transition-colors duration-100 mr-1"
      :class="{
        'bg-red-100 text-red-500': props.message.rating === false,
      }"
      @click="handleDislikeMessage"
    >
      <ThumbsDown
        class="size-3"
        v-if="!isDislikePending"
      />
      <span
        class="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"
        v-else
      ></span>
    </button>

    <div
      v-if="creditsUsed"
      class="text-gray-500 text-xs"
    >
      {{ creditsUsed }} {{ getCreditsDeclension(creditsUsed) }}
    </div>
  </div>
</template>
