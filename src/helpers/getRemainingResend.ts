export function getRemainingResend(key: string, resendCooldownSeconds: number = 60) {
  const savedTimestamp = localStorage.getItem(key)

  if (!savedTimestamp) return 0

  const savedTimeMs = Number(savedTimestamp)

  if (!Number.isFinite(savedTimeMs)) {
    localStorage.removeItem(key)
    return 0
  }

  const diff = Math.floor((Date.now() - savedTimeMs) / 1000)
  const remaining = resendCooldownSeconds - diff

  return remaining > 0 ? remaining : 0
}
