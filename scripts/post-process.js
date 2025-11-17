#!/usr/bin/env node

/**
 * Central post-processing orchestrator
 * Runs all post-build tasks in the correct order
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// List of post-processing scripts to run in order
const scripts = [
  'optimize-images.js',
  'replace-images-webp.js',
  'generate-pdf.js',
  'postbuild.js',
];

async function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    const projectRoot = path.resolve(__dirname, '..');
    console.log(`\n▶️  Running ${scriptName}...\n`);

    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: projectRoot,
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${scriptName} exited with code ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runAllPostProcessing() {
  try {
    console.log('🚀 Starting post-processing pipeline...\n');
    console.log(`Scripts to run: ${scripts.join(', ')}\n`);

    for (const script of scripts) {
      await runScript(script);
    }

    console.log('\n✨ Post-processing pipeline completed successfully!\n');
  } catch (error) {
    console.error(`\n❌ Post-processing failed: ${error.message}\n`);
    process.exit(1);
  }
}

runAllPostProcessing();
