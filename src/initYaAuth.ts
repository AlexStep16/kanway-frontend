export function initYaAuth() {
  const oauthQueryParams = {
    client_id: 'c46f0c53093440c39f12eff95a9f2f93',
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
    .then((data: any) => console.log('Сообщение с токеном', data))
    .catch((error: any) => console.log('Обработка ошибки', error))
}
