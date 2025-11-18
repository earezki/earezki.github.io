#!/usr/bin/env node

/**
 * AI Financial News Prediction Validator
 * 
 * Validates stock price predictions against actual market movements.
 * Features smart caching to avoid redundant API calls.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(process.cwd(), 'src/content/aifinnews');
const OUTPUT_FILE = path.join(process.cwd(), 'public/prediction-performance.json');
const CACHE_FILE = path.join(process.cwd(), 'cache/prediction-validation.json');

/**
 * Load validation cache
 */
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch (error) {
    console.warn('[WARN] Failed to load cache:', error.message);
  }
  return { validations: {}, checksums: {} };
}

/**
 * Save validation cache
 */
function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.warn('[WARN] Failed to save cache:', error.message);
  }
}

/**
 * Generate checksum for article content
 */
function generateChecksum(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Parse YAML frontmatter from markdown content
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n(.*?)\n---/s);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    if (!line.includes(':')) continue;

    const colonIndex = line.indexOf(':');
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Parse different value types
    if (value.toLowerCase() === 'increase' || value.toLowerCase() === 'decrease') {
      frontmatter[key] = value.toLowerCase();
    } else if (value.startsWith('[') && value.endsWith(']')) {
      try {
        frontmatter[key] = JSON.parse(value);
      } catch {
        frontmatter[key] = value;
      }
    } else if (value.startsWith('"') && value.endsWith('"')) {
      frontmatter[key] = value.slice(1, -1);
    } else if (!isNaN(value) && value !== '') {
      frontmatter[key] = value.includes('.') ? parseFloat(value) : parseInt(value);
    } else {
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

/**
 * Fetch historical stock price from Yahoo Finance API
 */
async function getPriceAtDate(ticker, targetDate, cache) {
  const cacheKey = `${ticker}-${targetDate.toISOString().split('T')[0]}`;
  
  // Check cache first
  if (cache.validations[cacheKey]?.price) {
    return cache.validations[cacheKey].price;
  }

  try {
    const target = new Date(targetDate);
    const startDate = new Date(target);
    startDate.setDate(startDate.getDate() - 5);
    const endDate = new Date(target);
    endDate.setDate(endDate.getDate() + 5);

    const start = Math.floor(startDate.getTime() / 1000);
    const end = Math.floor(endDate.getTime() / 1000);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${start}&period2=${end}&interval=1d`;
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) return null;

    const data = await response.json();
    
    if (!data.chart?.result?.[0]?.timestamp) return null;

    const timestamps = data.chart.result[0].timestamp;
    const closes = data.chart.result[0].indicators.quote[0].close;

    if (!timestamps.length || !closes.length) return null;

    // Find closest date to target
    let closestIndex = 0;
    let minDiff = Math.abs(timestamps[0] - target.getTime() / 1000);

    for (let i = 1; i < timestamps.length; i++) {
      const diff = Math.abs(timestamps[i] - target.getTime() / 1000);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    const price = closes[closestIndex];
    
    // Cache the result
    if (!cache.validations[cacheKey]) {
      cache.validations[cacheKey] = {};
    }
    cache.validations[cacheKey].price = price;

    return price;
  } catch (error) {
    console.warn(`[WARN] Error fetching price for ${ticker}:`, error.message);
    return null;
  }
}

/**
 * Validate a single prediction
 */
async function validatePrediction(articleData, currentDate, cache, fileName) {
  const { ticker, prediction, confidence, priceAtPrediction, pubDate, targetDate, categories } = articleData;

  if (!ticker || !prediction || !priceAtPrediction || !pubDate || !targetDate) {
    return null;
  }

  let pubDateObj, targetDateObj;
  try {
    pubDateObj = new Date(pubDate.split('T')[0]);
    targetDateObj = new Date(targetDate.split('T')[0]);
  } catch {
    return null;
  }

  // Skip if target date hasn't arrived yet
  if (currentDate < targetDateObj) {
    return null;
  }

  // Check cache for this specific validation
  const cacheKey = `${ticker}-${targetDateObj.toISOString().split('T')[0]}`;
  if (cache.validations[cacheKey]?.validated && cache.checksums[fileName]) {
    // Return cached validation if article hasn't changed
    const cachedValidation = cache.validations[cacheKey].validated;
    if (cachedValidation) {
      return cachedValidation;
    }
  }

  // Fetch actual price
  const actualPrice = await getPriceAtDate(ticker, targetDateObj, cache);
  if (actualPrice === null) return null;

  const priceChangePct = ((actualPrice - priceAtPrediction) / priceAtPrediction) * 100;
  const actualDirection = priceChangePct > 0 ? 'increase' : 'decrease';
  const isCorrect = prediction === actualDirection;

  const validation = {
    ticker,
    pubDate: pubDateObj.toISOString(),
    targetDate: targetDateObj.toISOString(),
    prediction,
    confidence,
    priceAtPrediction,
    priceAtTarget: actualPrice,
    priceChangePct: Math.round(priceChangePct * 100) / 100,
    actualDirection,
    isCorrect,
    categories: categories || []
  };

  // Cache the validation
  if (!cache.validations[cacheKey]) {
    cache.validations[cacheKey] = {};
  }
  cache.validations[cacheKey].validated = validation;

  return validation;
}

/**
 * Analyze all articles and compute metrics
 */
async function analyzeArticles() {
  const articles = [];
  const currentDate = new Date();
  const cache = loadCache();
  let cacheHits = 0;
  let cacheMisses = 0;

  console.log('🔍 Validating AI Financial Predictions...\n');

  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn('[WARN] Content directory not found');
    return createEmptyResults(currentDate);
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    try {
      const filePath = path.join(CONTENT_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const checksum = generateChecksum(content);
      const frontmatter = parseFrontmatter(content);

      if (!frontmatter.prediction) continue;

      // Check if we need to revalidate
      const needsValidation = cache.checksums[file] !== checksum;
      cache.checksums[file] = checksum;

      const validation = await validatePrediction(frontmatter, currentDate, cache, file);
      if (validation) {
        articles.push(validation);
        if (needsValidation) {
          cacheMisses++;
          console.log(`  ${frontmatter.ticker}: ${validation.isCorrect ? '✓' : '✗'} (validated)`);
        } else {
          cacheHits++;
          console.log(`  ${frontmatter.ticker}: ${validation.isCorrect ? '✓' : '✗'} (cached)`);
        }
      }
    } catch (error) {
      console.error(`[ERROR] ${file}:`, error.message);
    }
  }

  // Save updated cache
  saveCache(cache);

  console.log(`\n📊 Cache stats: ${cacheHits} hits, ${cacheMisses} misses\n`);

  if (articles.length === 0) {
    console.log('[INFO] No validated predictions found\n');
    return createEmptyResults(currentDate);
  }

  return computeMetrics(articles, currentDate, files.length);
}

function createEmptyResults(currentDate) {
  return {
    lastUpdated: currentDate.toISOString(),
    totalPredictions: 0,
    validatedPredictions: 0,
    overallAccuracy: 0,
    correctPredictions: 0,
    incorrectPredictions: 0,
    byConfidence: {},
    byDirection: {},
    avgCorrectIncreaseChange: 0,
    avgCorrectDecreaseChange: 0,
    predictions: []
  };
}

function computeMetrics(articles, currentDate, totalFiles) {
  const total = articles.length;
  const correct = articles.filter(a => a.isCorrect).length;
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  // By confidence
  const confidenceStats = {};
  for (const article of articles) {
    const conf = article.confidence || 0;
    if (!confidenceStats[conf]) {
      confidenceStats[conf] = { total: 0, correct: 0 };
    }
    confidenceStats[conf].total++;
    if (article.isCorrect) confidenceStats[conf].correct++;
  }

  const byConfidence = {};
  for (const [conf, data] of Object.entries(confidenceStats)) {
    byConfidence[conf] = {
      total: data.total,
      correct: data.correct,
      accuracy: Math.round((data.correct / data.total) * 10000) / 100
    };
  }

  // By direction
  const directionStats = {};
  for (const article of articles) {
    const dir = article.prediction;
    if (!directionStats[dir]) {
      directionStats[dir] = { total: 0, correct: 0 };
    }
    directionStats[dir].total++;
    if (article.isCorrect) directionStats[dir].correct++;
  }

  const byDirection = {};
  for (const [dir, data] of Object.entries(directionStats)) {
    byDirection[dir] = {
      total: data.total,
      correct: data.correct,
      accuracy: Math.round((data.correct / data.total) * 10000) / 100
    };
  }

  // Average changes
  const correctIncreases = articles
    .filter(a => a.prediction === 'increase' && a.isCorrect)
    .map(a => a.priceChangePct);
  
  const correctDecreases = articles
    .filter(a => a.prediction === 'decrease' && a.isCorrect)
    .map(a => a.priceChangePct);

  const avgCorrectIncreaseChange = correctIncreases.length > 0
    ? Math.round((correctIncreases.reduce((a, b) => a + b, 0) / correctIncreases.length) * 100) / 100
    : 0;

  const avgCorrectDecreaseChange = correctDecreases.length > 0
    ? Math.round((correctDecreases.reduce((a, b) => a + b, 0) / correctDecreases.length) * 100) / 100
    : 0;

  return {
    lastUpdated: currentDate.toISOString(),
    totalPredictions: totalFiles,
    validatedPredictions: total,
    overallAccuracy: Math.round(accuracy * 100) / 100,
    correctPredictions: correct,
    incorrectPredictions: total - correct,
    byConfidence,
    byDirection,
    avgCorrectIncreaseChange,
    avgCorrectDecreaseChange,
    predictions: articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
  };
}

async function main() {
  try {
    const results = await analyzeArticles();

    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

    console.log('✅ Validation complete!');
    console.log(`   Total: ${results.totalPredictions} | Validated: ${results.validatedPredictions} | Accuracy: ${results.overallAccuracy}%`);
    console.log(`   Results: ${path.relative(process.cwd(), OUTPUT_FILE)}\n`);
  } catch (error) {
    console.error('[ERROR]', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { analyzeArticles };
