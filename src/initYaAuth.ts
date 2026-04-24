import { yandexAuthApi } from './api/auth'
import { YandexAuthPayload } from './interfaces/YandexAuthPayload'

export function initYaAuth() {
  const oauthQueryParams = {
    client_id: '3b999a918afb4a9085e6238f30ae3df5',
    response_type: 'token',
    redirect_uri: 'https://kanway.ru/suggest/token',
  }
  const tokenPageOrigin = 'https://kanway.ru'

  ;(window as any).YaAuthSuggest.init(oauthQueryParams, tokenPageOrigin, {
    view: 'button',
    parentId: 'yandex-auth',
    buttonSize: 'm',
    buttonView: 'main',
    buttonTheme: 'light',
    buttonBorderRadius: '10',
    buttonIcon: 'ya',
  })
    .then(({ handler }: any) => handler())
    .then((data: YandexAuthPayload) => {
      yandexAuthApi(data).then(() => {
        window.location.reload()
      })
    })
    .catch((error: any) => console.log('Обработка ошибки', error))
}
