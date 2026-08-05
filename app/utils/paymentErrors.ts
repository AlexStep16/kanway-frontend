// utils/paymentErrors.ts

export interface CancellationDetails {
  party?: 'merchant' | 'yoo_money' | 'payment_network'
  reason?: string
}

export interface PaymentErrorToast {
  title: string
  description: string
}

export function getPaymentCancelInfo(details?: CancellationDetails): PaymentErrorToast {
  const reason = details?.reason

  switch (reason) {
    // --- ДЕНЬГИ И ЛИМИТЫ ---
    case 'insufficient_funds':
      return {
        title: 'Недостаточно средств',
        description: 'На карте не хватает денег. Пополните счет или используйте другую карту',
      }
    case 'payment_method_limit_exceeded':
      return {
        title: 'Превышен лимит карты',
        description: 'Превышен суточный или разовый лимит на операции по вашей карте',
      }

    // --- ОШИБКИ ВВОДА ДАННЫХ ---
    case 'invalid_card_number':
    case 'invalid_csc':
      return {
        title: 'Ошибка в данных карты',
        description: 'Неправильно указан номер карты или CVC/CVV код. Проверьте реквизиты',
      }
    case 'card_expired':
      return {
        title: 'Срок карты истек',
        description: 'Истек срок действия банковской карты. Воспользуйтесь другой картой',
      }

    // --- АУТЕНТИФИКАЦИЯ И СМС ---
    case '3d_secure_failed':
      return {
        title: 'Ошибка 3D-Secure',
        description: 'Не введен или введен неверно код подтверждения из СМС от банка',
      }

    // --- ТАЙМАУТЫ И ОТМЕНЫ ---
    case 'expired_on_confirmation':
      return {
        title: 'Время оплаты истекло',
        description: 'Вы не успели завершить платеж за отведенное время. Попробуйте еще раз',
      }

    // --- ОГРАНИЧЕНИЯ И БЕЗОПАСНОСТЬ ---
    case 'country_forbidden':
      return {
        title: 'Карта не поддерживается',
        description: 'Оплата картами банков этой страны временно ограничена',
      }
    case 'fraud_suspected':
    case 'payment_method_restricted':
      return {
        title: 'Операция отклонена',
        description: 'Ваш банк заблокировал платеж из соображений безопасности',
      }

    // --- СБОИ СИСТЕМЫ И БАНКОВ ---
    case 'issuer_unavailable':
    case 'internal_timeout':
      return {
        title: 'Сбой на стороне банка',
        description: 'Сервер банка временно недоступен. Повторите попытку через пару минут',
      }

    // --- ОБЩИЙ ОТКАЗ БАНКА (FALLBACK) ---
    case 'call_issuer':
    case 'general_decline':
    default:
      return {
        title: 'Платеж отклонен банком',
        description: 'Ваш банк отклонил транзакцию. Обратитесь в банк или используйте другую карту',
      }
  }
}
