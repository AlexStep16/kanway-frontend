export function getSafeBase64String(str: string) {
  return encodeURIComponent(btoa(str))
}
