import { ThemesEnum } from '~/enums/ThemesEnum'

export async function postSupportApi(
  theme: ThemesEnum,
  details: string,
  email: string,
  name: string,
): Promise<void> {
  return await apiCall<void>({
    method: 'POST',
    url: `/support`,
    data: {
      theme,
      details,
      email,
      name,
    },
  })
}
