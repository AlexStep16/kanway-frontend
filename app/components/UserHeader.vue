<script lang="ts" setup>
const { data: user } = useUser()
</script>

<template>
  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
    <UserAvatar />

    <div class="grid flex-1 text-left text-sm leading-tight">
      <span class="truncate font-medium">{{ user?.username }}</span>
      <span class="truncate text-xs">{{ user?.email }}</span>
    </div>
  </div>
</template>
