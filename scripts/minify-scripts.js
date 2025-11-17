#!/usr/bin/env node

/**
 * Minify all JS files from src/scripts to public
 * Uses Terser for proper JavaScript minification
 * Preserves original filenames
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcScriptsDir = path.join(__dirname, '../src/scripts');
const publicDir = path.join(__dirname, '../public');

async function minifyAllScripts() {
  try {
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Get all JS files from src/scripts directory
    const files = fs.readdirSync(srcScriptsDir).filter(file => file.endsWith('.js'));
    
    if (files.length === 0) {
      console.log('ℹ️  No JavaScript files found in src/scripts');
      return;
    }

    for (const file of files) {
      const srcPath = path.join(srcScriptsDir, file);
      const destPath = path.join(publicDir, file);

      // Read the source file
      const sourceCode = fs.readFileSync(srcPath, 'utf-8');
      
      const result = await minify(sourceCode, {
        compress: true,
        mangle: true,
      });
      
      if (result.error) {
        console.error(`❌ Terser minification error for ${file}:`, result.error);
        process.exit(1);
      }

      const minified = result.code;
      
      // Write minified code
      fs.writeFileSync(destPath, minified, 'utf-8');
      
      const originalSize = sourceCode.length;
      const minifiedSize = minified.length;
      const savings = Math.round((1 - minifiedSize / originalSize) * 100);
      
      console.log(`✅ Minified ${file}`);
      console.log(`   Original: ${originalSize} bytes → Minified: ${minifiedSize} bytes (${savings}% saved)`);
    }

  } catch (error) {
    console.error('❌ Error minifying scripts:', error.message);
    process.exit(1);
  }
}

minifyAllScripts();
