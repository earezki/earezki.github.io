#!/usr/bin/env node

/**
 * Optimize images in public/assets
 * Compresses JPGs, PNGs and generates WebP versions
 * Run as part of the build process
 */

import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '../public/assets');

async function optimizeImages() {
  try {
    if (!fs.existsSync(assetsDir)) {
      console.log('ℹ️  Assets directory not found, skipping image optimization');
      return;
    }

    // Get all image files
    const allFiles = fs.readdirSync(assetsDir);
    const sourceImages = allFiles.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    const webpFiles = allFiles.filter(f => f.endsWith('.webp'));
    
    if (sourceImages.length === 0) {
      console.log('ℹ️  No images found to optimize');
      return;
    }

    // Check if all images have WebP versions
    const allHaveWebP = sourceImages.every(sourceFile => {
      const webpName = sourceFile.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
      return webpFiles.includes(webpName);
    });

    if (allHaveWebP && webpFiles.length === sourceImages.length) {
      console.log('✅ Image optimization skipped - all WebP versions already exist');
      console.log(`   ${sourceImages.length} source images → ${webpFiles.length} WebP versions`);
      return;
    }

    console.log('🖼️  Optimizing images...');
    
    // Get initial file sizes
    let totalOriginal = 0;
    sourceImages.forEach(file => {
      const stat = fs.statSync(path.join(assetsDir, file));
      totalOriginal += stat.size;
    });

    // Optimize JPEGs and PNGs (only if they're older than WebP)
    const imagesToOptimize = sourceImages.filter(sourceFile => {
      const webpName = sourceFile.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
      const webpPath = path.join(assetsDir, webpName);
      
      if (!fs.existsSync(webpPath)) {
        return true; // Optimize if WebP doesn't exist
      }
      
      // Check if source is newer than WebP
      const sourceTime = fs.statSync(path.join(assetsDir, sourceFile)).mtimeMs;
      const webpTime = fs.statSync(webpPath).mtimeMs;
      return sourceTime > webpTime;
    });

    if (imagesToOptimize.length === 0) {
      console.log('✅ Image optimization skipped - all source images are up to date');
      return;
    }

    console.log(`   Processing ${imagesToOptimize.length} of ${sourceImages.length} images...`);

    // Optimize JPEGs and PNGs
    await imagemin([`${assetsDir}/*.{jpg,jpeg,png}`], {
      destination: assetsDir,
      plugins: [
        imageminMozjpeg({ quality: 80 }),
        imageminPngquant({
          quality: [0.6, 0.8],
          strip: true
        })
      ]
    });

    // Generate WebP versions
    await imagemin([`${assetsDir}/*.{jpg,jpeg,png}`], {
      destination: assetsDir,
      plugins: [
        imageminWebp({ quality: 75 })
      ],
      rename: {
        extname: '.webp'
      }
    });

    // Calculate savings
    let totalOptimized = 0;
    const updatedWebpFiles = fs.readdirSync(assetsDir)
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    
    updatedWebpFiles.forEach(file => {
      const stat = fs.statSync(path.join(assetsDir, file));
      totalOptimized += stat.size;
    });

    const savings = totalOriginal - (totalOptimized / 2);
    const savingsPercent = Math.round((savings / totalOriginal) * 100);

    console.log(`✅ Image optimization complete`);
    console.log(`   Original size: ${(totalOriginal / 1024).toFixed(1)} KB`);
    console.log(`   WebP versions generated for ${imagesToOptimize.length} images`);
    console.log(`   Estimated savings: ~${savingsPercent}% with WebP`);
    
  } catch (error) {
    console.error('❌ Error optimizing images:', error.message);
    // Don't fail the build for image optimization
    console.log('ℹ️  Continuing build despite image optimization error');
  }
}

optimizeImages();
