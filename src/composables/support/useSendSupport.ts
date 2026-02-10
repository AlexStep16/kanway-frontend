import { ThemesEnum } from '@/enums/ThemesEnum'
import { sendSupport } from '@/services/support'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export function useSendSupport() {
  return useMutation({
    mutationFn: (data: { theme: ThemesEnum; details: string; email: string; name: string }) =>
      sendSupport(data.theme, data.details, data.email, data.name),
    onSuccess: () => {
      toast.success('Сообщение отправлено в поддержку.')
    },
  })
}
