#!/usr/bin/env node

/**
 * Minify redirect.js and output to public folder
 * Uses Terser for proper JavaScript minification
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.join(__dirname, '../src/scripts/redirect.js');
const destPath = path.join(__dirname, '../public/redirect.js');

async function minifyRedirect() {
  try {
    // Read the source file
    if (!fs.existsSync(srcPath)) {
      console.error(`❌ Source file not found: ${srcPath}`);
      process.exit(1);
    }

    const sourceCode = fs.readFileSync(srcPath, 'utf-8');
    
    // Minify using Terser
    const result = await minify(sourceCode, {
      compress: true,
      mangle: true,
    });
    
    if (result.error) {
      console.error('❌ Terser minification error:', result.error);
      process.exit(1);
    }

    const minified = result.code;
    
    // Ensure public directory exists
    const publicDir = path.dirname(destPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write minified code
    fs.writeFileSync(destPath, minified, 'utf-8');
    
    const originalSize = sourceCode.length;
    const minifiedSize = minified.length;
    const savings = Math.round((1 - minifiedSize / originalSize) * 100);
    
    console.log(`✅ Minified redirect.js using Terser`);
    console.log(`   Original: ${originalSize} bytes`);
    console.log(`   Minified: ${minifiedSize} bytes`);
    console.log(`   Saved: ${savings}%`);
  } catch (error) {
    console.error('❌ Error minifying redirect.js:', error.message);
    process.exit(1);
  }
}

minifyRedirect();
