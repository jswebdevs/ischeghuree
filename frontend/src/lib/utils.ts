/**
 * A utility to merge class names.
 * This is a lightweight version that doesn't require external dependencies.
 */
type ClassValue = string | number | boolean | null | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(" ");
}
