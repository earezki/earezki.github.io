/**
 * Converts a string to a URL-safe slug format
 * 
 * Process:
 * 1. Converts to lowercase
 * 2. Trims whitespace
 * 3. Removes non-alphanumeric characters (except spaces and hyphens)
 * 4. Replaces spaces with hyphens
 * 5. Collapses multiple hyphens into one
 * 
 * @param str - The string to slugify
 * @returns URL-safe slug string
 * 
 * @example
 * slugify("Hello World!") // "hello-world"
 * slugify("TypeScript & JavaScript") // "typescript-javascript"
 * slugify("  Multiple   Spaces  ") // "multiple-spaces"
 */
export function slugify(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')    // Remove non-alphanumeric (keep spaces and hyphens)
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/-+/g, '-');             // Collapse multiple hyphens
}
