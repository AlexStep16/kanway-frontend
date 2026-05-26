export function getCreditsDeclension(credits: number) {
  const lastDigit = credits % 10
  const lastTwoDigits = credits % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'кредитов'
  }

  switch (lastDigit) {
    case 1:
      return 'кредит'
    case 2:
    case 3:
    case 4:
      return 'кредита'
    default:
      return 'кредитов'
  }
}
