/**
 * Returns the initials (max 2 letters) from a contact name string
 * @param name Contact name string
 */
export function getContactInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0].toUpperCase(); // Only first letter for single name
  }
  // Take first letter of first two words
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
