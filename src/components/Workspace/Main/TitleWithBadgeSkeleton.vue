<template>
  <div class="rounded-md bg-gray-300 animate-pulse flex items-center text-sm text-gray-500 gap-x-2">
    <span>Загрузка</span>
    <NumberBadge :number="21" />
    <slot></slot>
  </div>
</template>
