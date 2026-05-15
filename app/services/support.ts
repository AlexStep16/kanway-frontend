import { ThemesEnum } from '~/enums/ThemesEnum'

export async function sendSupport(
  theme: ThemesEnum,
  details: string,
  email: string,
  name: string,
): Promise<void> {
  return await postSupportApi(theme, details, email, name)
}
