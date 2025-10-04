export function plainExcerpt(markdown: string, wordLimit = 40, charLimit = 180): string {
  // Strip code fences & inline code, headings, images, links keeping text label
  const noCode = markdown
    .replace(/```[\s\S]*?```/g, ' ') // block code
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[[^\]]*\]\([^)]*\)/g, (m) => m.replace(/\[|\]\([^)]*\)/g, '')) // links -> text
    .replace(/^#+\s*(.*)$/gm, '$1');
  const collapsed = noCode.replace(/\s+/g, ' ').trim();
  let words = collapsed.split(' ').slice(0, wordLimit).join(' ');
  if (words.length > charLimit) {
    words = words.slice(0, charLimit).replace(/\s+\S*$/, '');
  }
  return words + (collapsed.length > words.length ? '…' : '');
}