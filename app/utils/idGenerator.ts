import { v4 as uuidv4 } from 'uuid'

export function generateUUID(): string {
  return uuidv4()
}

export function generateClientId(prefix: string = 'client_'): string {
  return prefix + uuidv4()
}
