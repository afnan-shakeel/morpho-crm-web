// src/app/shared/utils/validation.ts

export function isValidEmail(email: string): boolean {
  // Regex to check email validity
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isGuid(id: string): boolean {
  // Regex to check standard GUID/UUID format
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return guidRegex.test(id);
}