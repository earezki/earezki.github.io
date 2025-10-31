/**
 * Calculate reading time for content based on average reading speed
 * @constant WORDS_PER_MINUTE - Average reading speed (220 words per minute)
 */
const WORDS_PER_MINUTE = 220;

/**
 * Reading time calculation result
 */
export interface ReadingTimeResult {
  /** Estimated reading time in minutes (minimum 1) */
  minutes: number;
  /** Total word count in content */
  words: number;
  /** Human-readable reading time text */
  text: string;
}

/**
 * Calculates the estimated reading time for given content
 * @param content - The text content to analyze
 * @returns Object containing minutes, word count, and formatted text
 * @example
 * const result = readingTime("Hello world...");
 * // { minutes: 1, words: 100, text: "1 min read" }
 */
export default function readingTime(content: string): ReadingTimeResult {
  if (!content || typeof content !== 'string') {
    return { minutes: 1, words: 0, text: '1 min read' };
  }

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  
  return { 
    minutes, 
    words, 
    text: `${minutes} min read` 
  };
}