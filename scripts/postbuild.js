import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Post-build script to copy necessary files from dist/ to public/
 * and ensure markdown CVs are in dist/ for deployment
 */

const FILES_TO_COPY = [
  { from: 'dist/search.json', to: 'public/search.json', description: 'Search index' },
  { from: 'public/cv-fr.md', to: 'dist/cv-fr.md', description: 'French CV (Markdown)' },
  { from: 'public/cv-en.md', to: 'dist/cv-en.md', description: 'English CV (Markdown)' },
  { from: 'public/cv-fr.pdf', to: 'dist/cv-fr.pdf', description: 'French CV (PDF)' },
  { from: 'public/cv-en.pdf', to: 'dist/cv-en.pdf', description: 'English CV (PDF)' },
];

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(from, to, description) {
  try {
    if (!fs.existsSync(from)) {
      console.warn(`⚠️  Warning: ${from} not found, skipping ${description}`);
      return false;
    }
    
    ensureDirectoryExists(to);
    fs.copyFileSync(from, to);
    console.log(`✅ Copied ${description}: ${from} → ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Error copying ${description}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Running post-build tasks...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  FILES_TO_COPY.forEach(({ from, to, description }) => {
    if (copyFile(from, to, description)) {
      successCount++;
    } else {
      failCount++;
    }
  });
  
  console.log(`\n✨ Post-build completed: ${successCount} successful, ${failCount} skipped/failed`);
  
  // Exit with error code if critical files failed
  if (failCount > 0 && successCount === 0) {
    process.exit(1);
  }
}

main();
