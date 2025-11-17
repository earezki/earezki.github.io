#!/usr/bin/env node

/**
 * Post-build script to replace image references with WebP versions
 * Processes all markdown files and replaces jpg, png, gif references
 * with WebP equivalents if the WebP file exists in public folder
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');
const publicDir = path.join(__dirname, '../public');

// Image extensions to look for
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

function replaceImagesWithWebP() {
  try {
    console.log('🔍 Scanning for markdown and HTML files with images...\n');

    let totalFilesScanned = 0;
    let totalReplacements = 0;

    // Recursively process all files in dist directory
    function processDirectory(dir) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          processDirectory(filePath);
        } else if (file.endsWith('.md') || file.endsWith('.html')) {
          let content = fs.readFileSync(filePath, 'utf-8');
          let replacements = 0;

          // Find all image references in the file
          // Match patterns like: /assets/image.jpg, ![alt](path), src="/assets/image.png", etc.
          const imageRegex = /(["']?)\/assets\/([^\/\s"']+\.(jpg|jpeg|png|gif))(["']?)/gi;

          content = content.replace(imageRegex, (match, quote1, filename, extension, quote2) => {
            const baseFilename = filename.replace(/\.(jpg|jpeg|png|gif)$/i, '');
            const webpFilename = `${baseFilename}.webp`;
            const webpPath = path.join(publicDir, 'assets', webpFilename);

            // Check if WebP version exists
            if (fs.existsSync(webpPath)) {
              replacements++;
              totalReplacements++;
              return `${quote1}/assets/${webpFilename}${quote2}`;
            }

            // Keep original if WebP doesn't exist
            return match;
          });

          // Only write if there were replacements
          if (replacements > 0) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`✅ ${path.relative(distDir, filePath)}`);
            console.log(`   Replaced ${replacements} image reference(s) with WebP`);
            totalFilesScanned++;
          }
        }
      }
    }

    processDirectory(distDir);

    console.log(`\n📊 Summary:`);
    console.log(`   Files processed: ${totalFilesScanned}`);
    console.log(`   Total replacements: ${totalReplacements}`);

    if (totalReplacements === 0) {
      console.log(`   ℹ️  No images were replaced (all WebP files already in use or not found)`);
    }

  } catch (error) {
    console.error('❌ Error replacing images with WebP:', error.message);
    process.exit(1);
  }
}

replaceImagesWithWebP();
