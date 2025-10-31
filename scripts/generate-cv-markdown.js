import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to strip HTML tags and clean markdown
function stripHtml(content) {
  let cleaned = content
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Handle tech-stack and tech-badges divs - convert to inline badges
    .replace(/<div class="tech-stack">([\s\S]*?)<\/div>/g, (match, badges) => {
      const badgeList = badges
        .match(/<span class="tech-badge[^"]*">([^<]+)<\/span>/g)
        ?.map(badge => badge.replace(/<[^>]+>/g, '').trim())
        .filter(b => b)
        .join(' • ') || '';
      return badgeList ? `\n**Technologies:** ${badgeList}\n` : '';
    })
    // Handle skill-tag sections similarly
    .replace(/<div class="skills-section">([\s\S]*?)<\/div>/g, (match, content) => {
      // Extract category name
      const category = content.match(/<h4>(.*?)<\/h4>/)?.[1] || '';
      // Extract skill tags
      const skills = content
        .match(/<span class="skill-tag[^"]*">([^<]+)<\/span>/g)
        ?.map(skill => skill.replace(/<[^>]+>/g, '').trim())
        .filter(s => s)
        .join(' • ') || '';
      return category && skills ? `\n**${category}:** ${skills}\n` : '';
    })
    // Remove remaining div tags but keep content
    .replace(/<div[^>]*>/g, '')
    .replace(/<\/div>/g, '')
    // Remove span tags but keep content
    .replace(/<span[^>]*>/g, '')
    .replace(/<\/span>/g, '')
    // Remove other common HTML tags but keep content
    .replace(/<[^>]+>/g, '')
    // Clean up multiple blank lines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Trim lines
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Clean up multiple blank lines again
    .replace(/\n\n\n+/g, '\n\n');
  
  return cleaned;
}

// Function to wrap long lines at 80 characters
function wrapLines(content, maxWidth = 80) {
  const lines = content.split('\n');
  const wrapped = [];
  
  for (const line of lines) {
    // Don't wrap headers, links, or short lines
    if (line.startsWith('#') || line.startsWith('**') || line.includes('http') || line.length <= maxWidth) {
      wrapped.push(line);
      continue;
    }
    
    // Don't wrap bullet points or numbered lists
    if (line.match(/^[\s]*[-*•]\s/) || line.match(/^[\s]*\d+\.\s/)) {
      if (line.length <= maxWidth) {
        wrapped.push(line);
      } else {
        // Wrap long bullet points preserving indentation
        const indent = line.match(/^[\s]*/)[0];
        const bulletMatch = line.match(/^[\s]*([-*•]|\d+\.)\s/);
        const bullet = bulletMatch ? bulletMatch[0] : '';
        const text = line.substring(bullet.length);
        const words = text.split(' ');
        let currentLine = indent + bullet;
        
        for (const word of words) {
          if ((currentLine + ' ' + word).length <= maxWidth) {
            currentLine += (currentLine.endsWith(bullet) ? '' : ' ') + word;
          } else {
            wrapped.push(currentLine);
            currentLine = indent + '  ' + word; // Indent continuation
          }
        }
        if (currentLine.trim()) {
          wrapped.push(currentLine);
        }
      }
      continue;
    }
    
    // Wrap regular text
    if (line.length > maxWidth) {
      const words = line.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        if ((currentLine + ' ' + word).length <= maxWidth) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) wrapped.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) wrapped.push(currentLine);
    } else {
      wrapped.push(line);
    }
  }
  
  return wrapped.join('\n');
}

// Function to add reference URL
function addReference(content, lang) {
  const lines = content.split('\n');
  const reference = lang === 'fr' 
    ? '\n**CV en ligne :** https://earezki.com/about\n'
    : '\n**Online CV:** https://earezki.com/about\n';
  
  // Find the line with email and add reference after contact info
  let inserted = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('arezki.elmehdi@gmail.com') && !inserted) {
      // Insert after the contact links section
      let j = i;
      while (j < lines.length && (lines[j].includes('http') || lines[j].includes('[') || lines[j].trim() === '')) {
        j++;
      }
      lines.splice(j, 0, reference);
      inserted = true;
      break;
    }
  }
  
  return lines.join('\n');
}

// Function to extract the main content from markdown file
function extractContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove frontmatter
  let withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '');
  
  // Remove GitHub Stats section
  // Match the entire section from the separator before it to the separator after it
  // Use a more flexible pattern that matches any emoji or text followed by "GitHub Stats"
  withoutFrontmatter = withoutFrontmatter.replace(
    /---\s*\n+##\s+[^\n]*(?:GitHub Stats|Statistiques GitHub)[^\n]*\n[\s\S]*?\n---\s*\n/,
    '---\n\n'
  );
  
  return withoutFrontmatter;
}

// Generate markdown CVs
function generateMarkdownCVs() {
  const contentDir = path.join(__dirname, '..', 'src', 'content', 'about');
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Process French version
  const frPath = path.join(contentDir, 'about-fr.md');
  const frContent = extractContent(frPath);
  const frCleaned = stripHtml(frContent);
  const frWrapped = wrapLines(frCleaned);
  const frWithReference = addReference(frWrapped, 'fr');
  fs.writeFileSync(path.join(publicDir, 'cv-fr.md'), frWithReference);
  console.log('✅ Generated cv-fr.md');
  
  // Process English version
  const enPath = path.join(contentDir, 'about-en.md');
  const enContent = extractContent(enPath);
  const enCleaned = stripHtml(enContent);
  const enWrapped = wrapLines(enCleaned);
  const enWithReference = addReference(enWrapped, 'en');
  fs.writeFileSync(path.join(publicDir, 'cv-en.md'), enWithReference);
  console.log('✅ Generated cv-en.md');
}

// Run the generator
try {
  generateMarkdownCVs();
  console.log('✨ Markdown CVs generated successfully!');
} catch (error) {
  console.error('❌ Error generating markdown CVs:', error);
  process.exit(1);
}
