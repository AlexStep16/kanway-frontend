<script setup lang="ts">
import { LogOut } from '@lucide/vue'

const { mutate: logout } = useLogout()
const { data: user } = useUser()
</script>

<template>
  <button
    type="button"
    class="inline-flex gap-x-1 py-2 px-3 text-xs self-start font-semibold rounded-md border border-transparent bg-red-100 text-red-500 transition-colors duration-100 hover:bg-red-200 disabled:opacity-50 disabled:pointer-events-none"
    @click="logout()"
    v-if="user"
  >
    <LogOut class="size-4" />
    <span>Выйти</span>
  </button>
</template>
