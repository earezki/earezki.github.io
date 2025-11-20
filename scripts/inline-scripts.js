#!/usr/bin/env node

/**
 * Inline Scripts Post-Processor
 * Inlines specified JavaScript files directly into HTML after minification
 * 
 * This improves performance for critical scripts by:
 * - Eliminating additional HTTP requests
 * - Ensuring scripts execute immediately
 * - Reducing render-blocking resources
 * 
 * Best for small, critical scripts like theme persistence, redirects
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import globPkg from 'glob';

const { glob } = globPkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

const SCRIPTS_TO_INLINE = [
  '/redirect.js',
];

/**
 * Read a script file from dist/ directory
 */
function readScriptContent(scriptPath) {
  const fullPath = path.join(distDir, scriptPath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Warning: Script not found: ${fullPath}`);
    return null;
  }
  
  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * Inline scripts in a single HTML file
 */
function inlineScriptsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  SCRIPTS_TO_INLINE.forEach(scriptPath => {
    const scriptContent = readScriptContent(scriptPath);
    if (!scriptContent) return;
    
    // Match: <script is:inline src="/redirect.js"></script>
    // or: <script src="/redirect.js"></script>
    const scriptTagRegex = new RegExp(
      `<script([^>]*?)\\s+src=["']${scriptPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']([^>]*?)>\\s*</script>`,
      'g'
    );
    
    const replacement = (match, attrs1, attrs2) => {
      // Preserve attributes but remove src
      const combinedAttrs = (attrs1 + ' ' + attrs2)
        .replace(/\s+src=["'][^"']*["']/g, '')
        .trim();
      
      const attrsStr = combinedAttrs ? ' ' + combinedAttrs : '';
      modified = true;
      return `<script${attrsStr}>\n${scriptContent}\n</script>`;
    };
    
    content = content.replace(scriptTagRegex, replacement);
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  
  return false;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔧 Inlining critical JavaScript files...\n');
  
  if (!fs.existsSync(distDir)) {
    console.error(`❌ Error: dist/ directory not found at ${distDir}`);
    process.exit(1);
  }
  
  const htmlFiles = glob.sync('**/*.html', { cwd: distDir, absolute: true });
  
  if (htmlFiles.length === 0) {
    console.log('ℹ️  No HTML files found in dist/');
    return;
  }
  
  let processedCount = 0;
  let modifiedCount = 0;
  
  htmlFiles.forEach(filePath => {
    processedCount++;
    const wasModified = inlineScriptsInFile(filePath);
    if (wasModified) {
      modifiedCount++;
      const relativePath = path.relative(distDir, filePath);
      console.log(`✅ Inlined scripts in: ${relativePath}`);
    }
  });
  
  console.log(`\n✨ Processed ${processedCount} HTML files, ${modifiedCount} modified`);
  console.log(`📦 Inlined scripts: ${SCRIPTS_TO_INLINE.join(', ')}\n`);
}

main().catch(error => {
  console.error('❌ Error during script inlining:', error);
  process.exit(1);
});
