export function passwordMinValidator(password: string) {
  if (password.length < 6) return false;
  
  return true;
}

export function passwordMaxValidator(password: string) {
  if (password.length > 30) return false;
  
  return true;
}

export function passwordCompareValidator(password: string, passwordAgain: string) {
  if (password !== passwordAgain) return false;
  
  return true;
}