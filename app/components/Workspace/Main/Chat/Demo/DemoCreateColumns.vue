<script lang="ts" setup>
import type { IColumn } from '~/interfaces/domain/IColumn'

const mockColumns = ref<IColumn[]>([
  {
    id: '6a2828d5cd3f218e4f7bb07d',
    name: 'Бэклог',
    workspace: { id: '69e736c1bea70b6721b5b06a', name: '35635563' },
    board: { id: '6a2828b8c0b5b8a1d747233c', name: 'Приложение' },
    rank: '0|i00007:',
    isDeleted: false,
    isDeletedExternal: false,
    userId: '69e735c82ea70b6721b5afe0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6a2828d5cd3f218e4f7bb07f',
    name: 'В работе',
    workspace: { id: '69e736c1bea70b6721b5b06a', name: '35635563' },
    board: { id: '6a2828b8c0b5b8a1d747233c', name: 'Приложение' },
    rank: '0|i0000f:',
    isDeleted: false,
    isDeletedExternal: false,
    userId: '69e735c8bea23b6721b5afe0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6a2828d5cd3f218e4f7bb081',
    name: 'На согласовании',
    workspace: { id: '69e736c1bea70b6721b5b06a', name: '35635563' },
    board: { id: '6a2828b8c0b5b8a1d747233c', name: 'Приложение' },
    rank: '0|i0000n:',
    isDeleted: false,
    isDeletedExternal: false,
    userId: '69e735c8bea70b6744b5afe0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6a2828d5cd3f218e4f7bb083',
    name: 'Готово',
    workspace: { id: '69e736c1bea70b6721b5b06a', name: '35635563' },
    board: { id: '6a2828b8c0b5b8a1d747233c', name: 'Приложение' },
    rank: '0|i0000v:',
    isDeleted: false,
    isDeletedExternal: false,
    userId: '69e735c8bea70b6721b5afe0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])
</script>

<template>
  <ChatColumnsView
    :items="mockColumns"
    :is-selectable="false"
    :is-temporary="true"
  />
</template>
