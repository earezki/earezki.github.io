/**
 * Default limits for excerpt generation
 */
const DEFAULT_WORD_LIMIT = 40;
const DEFAULT_CHAR_LIMIT = 180;
const ELLIPSIS = '…';

/**
 * Generates a plain text excerpt from markdown content by stripping formatting
 * and limiting length. Removes code blocks, inline code, headings, images,
 * and links while preserving their text content where applicable.
 * 
 * @param markdown - The markdown content to extract excerpt from
 * @param wordLimit - Maximum number of words (default: 40)
 * @param charLimit - Maximum number of characters (default: 180)
 * @returns Plain text excerpt with ellipsis if truncated
 * 
 * @example
 * const excerpt = plainExcerpt("# Title\n\nSome **bold** text", 10, 50);
 * // "Title Some bold text"
 */
export function plainExcerpt(
  markdown: string, 
  wordLimit = DEFAULT_WORD_LIMIT, 
  charLimit = DEFAULT_CHAR_LIMIT
): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  // Strip code fences & inline code, headings, images, links keeping text label
  const noCode = markdown
    .replace(/```[\s\S]*?```/g, ' ')                      // Remove block code
    .replace(/`[^`]*`/g, ' ')                             // Remove inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')                // Remove images
    .replace(/\[[^\]]*\]\([^)]*\)/g, (match) =>           // Extract link text
      match.replace(/\[|\]\([^)]*\)/g, '')
    )
    .replace(/^#+\s*(.*)$/gm, '$1');                      // Remove heading markers

  // Collapse multiple whitespace into single space
  const collapsed = noCode.replace(/\s+/g, ' ').trim();

  // Apply word limit
  let words = collapsed.split(' ').slice(0, wordLimit).join(' ');

  // Apply character limit if exceeded
  if (words.length > charLimit) {
    words = words.slice(0, charLimit).replace(/\s+\S*$/, '');
  }

  // Add ellipsis if content was truncated
  return words + (collapsed.length > words.length ? ELLIPSIS : '');
}