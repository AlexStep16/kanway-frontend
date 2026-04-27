<template>
  <div :id="containerId"></div>
</template>

<script setup lang="ts">
import { yandexAuthApi } from '@/api/auth'
import { YandexAuthPayload } from '@/interfaces/YandexAuthPayload'
import dayjs from 'dayjs'
import { onMounted, nextTick } from 'vue'

const props = defineProps({
  containerId: {
    type: String,
    default: 'yandex-auth',
  },
})

onMounted(async () => {
  // Даем Vue время отрисовать div
  await nextTick()

  const oauthQueryParams = {
    client_id: '3b999a918afb4a9085e6238f30ae3df5',
    response_type: 'token',
    redirect_uri: 'https://kanway.ru/suggest/token',
  }
  const tokenPageOrigin = 'https://kanway.ru'

  ;(window as any).YaAuthSuggest.init(oauthQueryParams, tokenPageOrigin, {
    view: 'button',
    parentId: props.containerId,
    buttonSize: 'm',
    buttonView: 'main',
    buttonTheme: 'light',
    buttonBorderRadius: '10',
    buttonIcon: 'ya',
  })
    .then(({ handler }: any) => handler())
    .then((data: YandexAuthPayload) => {
      yandexAuthApi({
        ...data,
        timezone: dayjs.tz.guess(),
      }).then(() => {
        window.location.reload()
      })
    })
    .catch((error: any) => console.log('Обработка ошибки', error))
})
</script>
