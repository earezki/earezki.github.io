#!/usr/bin/env node

/**
 * Backfill Missing Prediction Fields
 * 
 * This script scans existing AI financial news articles and adds missing
 * prediction-related fields to the frontmatter by fetching historical price
 * data from Yahoo Finance for the date in the filename.
 * 
 * Fields added when missing:
 * - priceAtPrediction: Stock price on publication date
 * - prediction52WeekHigh: 52-week high on publication date
 * - prediction52WeekLow: 52-week low on publication date
 * - targetDate: 14 days from publication date
 * - confidence: Extracted from title/content if present
 * - prediction: Extracted from title/content if present
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { default: YahooFinance } = require('yahoo-finance2');

const yahooFinance = new YahooFinance();

const CONTENT_DIR = path.join(process.cwd(), 'src/content/aifinnews');
const CACHE_FILE = path.join(process.cwd(), 'cache/prediction-backfill.json');

/**
 * Load backfill cache to avoid re-processing files
 */
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch (error) {
    console.warn('[WARN] Could not load cache:', error.message);
  }
  return { processed: {} };
}

/**
 * Save backfill cache
 */
function saveCache(cache) {
  try {
    const cacheDir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('[ERROR] Could not save cache:', error.message);
  }
}

/**
 * Generate checksum for file content
 */
function generateChecksum(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    
    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    frontmatter[key] = value;
  }
  
  return frontmatter;
}

/**
 * Extract prediction from title or content
 */
function extractPrediction(frontmatter, content) {
  const title = frontmatter.title || '';
  const body = content.toLowerCase();
  
  // Check title first
  if (title.includes('increase')) return 'increase';
  if (title.includes('decrease')) return 'decrease';
  
  // Check body for **Prediction:** marker
  const predMatch = body.match(/\*\*prediction:\*\*\s*(increase|decrease)/i);
  if (predMatch) return predMatch[1].toLowerCase();
  
  return null;
}

/**
 * Extract confidence from title
 */
function extractConfidence(frontmatter) {
  const title = frontmatter.title || '';
  const match = title.match(/confidence\s+(\d+)\/10/i);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Fetch stock price data from Yahoo Finance
 */
async function fetchYahooFinanceData(ticker, date) {
  try {
    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);
    
    // Query a week before and after to ensure we get data
    const startDate = new Date(targetDate);
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date(targetDate);
    endDate.setDate(endDate.getDate() + 7);
    
    // Fetch historical data
    const queryOptions = { period1: startDate, period2: endDate };
    const result = await yahooFinance.historical(ticker, queryOptions);
    
    if (!result || result.length === 0) {
      throw new Error('No historical data returned');
    }
    
    // Find closest date to target date
    let closestData = result[0];
    let minDiff = Math.abs(new Date(result[0].date) - targetDate);
    
    for (const data of result) {
      const diff = Math.abs(new Date(data.date) - targetDate);
      if (diff < minDiff) {
        minDiff = diff;
        closestData = data;
      }
    }
    
    // Fetch quote for 52-week high/low
    const quote = await yahooFinance.quote(ticker);
    
    if (!quote || !quote.fiftyTwoWeekHigh || !quote.fiftyTwoWeekLow) {
      throw new Error('Missing quote data for 52-week range');
    }
    
    return {
      price: parseFloat(closestData.close.toFixed(2)),
      high52Week: parseFloat(quote.fiftyTwoWeekHigh.toFixed(2)),
      low52Week: parseFloat(quote.fiftyTwoWeekLow.toFixed(2))
    };
    
  } catch (error) {
    console.error(`[ERROR] Failed to fetch data for ${ticker}:`, error.message);
    return null;
  }
}

/**
 * Calculate target date (14 days from publication)
 */
function calculateTargetDate(pubDate) {
  const date = new Date(pubDate);
  date.setDate(date.getDate() + 14);
  return date.toISOString().split('T')[0];
}

/**
 * Check if article needs backfilling
 */
function needsBackfill(frontmatter) {
  return !frontmatter.priceAtPrediction || 
         !frontmatter.prediction52WeekHigh || 
         !frontmatter.prediction52WeekLow ||
         !frontmatter.targetDate;
}

/**
 * Update frontmatter in markdown content
 */
function updateFrontmatter(content, updates) {
  const match = content.match(/^(---\n[\s\S]*?\n---)/);
  if (!match) return content;
  
  let frontmatterSection = match[1];
  const restOfContent = content.substring(frontmatterSection.length);
  
  // Add missing fields at the end of frontmatter (before closing ---)
  const linesToAdd = [];
  
  if (updates.prediction && !frontmatterSection.includes('prediction:')) {
    linesToAdd.push(`prediction: ${updates.prediction}`);
  }
  if (updates.confidence && !frontmatterSection.includes('confidence:')) {
    linesToAdd.push(`confidence: ${updates.confidence}`);
  }
  if (updates.priceAtPrediction) {
    linesToAdd.push(`priceAtPrediction: ${updates.priceAtPrediction}`);
  }
  if (updates.prediction52WeekHigh) {
    linesToAdd.push(`prediction52WeekHigh: ${updates.prediction52WeekHigh}`);
  }
  if (updates.prediction52WeekLow) {
    linesToAdd.push(`prediction52WeekLow: ${updates.prediction52WeekLow}`);
  }
  if (updates.targetDate) {
    linesToAdd.push(`targetDate: ${updates.targetDate}`);
  }
  
  if (linesToAdd.length === 0) return content;
  
  // Insert before closing ---
  frontmatterSection = frontmatterSection.replace(/\n---$/, '\n' + linesToAdd.join('\n') + '\n---');
  
  return frontmatterSection + restOfContent;
}

/**
 * Process all articles and backfill missing data
 */
async function backfillArticles() {
  console.log('\n🔄 Backfilling Missing Prediction Fields...\n');
  
  const cache = loadCache();
  let processed = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  
  const files = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();
  
  for (const fileName of files) {
    const filePath = path.join(CONTENT_DIR, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const checksum = generateChecksum(content);
    
    // Check if already processed with same content
    if (cache.processed[fileName] === checksum) {
      skipped++;
      continue;
    }
    
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter) {
      console.log(`  ⚠️  ${fileName}: No frontmatter found`);
      failed++;
      continue;
    }
    
    // Check if needs backfilling
    if (!needsBackfill(frontmatter)) {
      cache.processed[fileName] = checksum;
      skipped++;
      continue;
    }
    
    // Extract date from filename (format: YYYY-MM-DD-TICKER.md)
    const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) {
      console.log(`  ⚠️  ${fileName}: Could not extract date from filename`);
      failed++;
      continue;
    }
    
    const pubDate = dateMatch[1];
    const ticker = frontmatter.ticker;
    
    if (!ticker) {
      console.log(`  ⚠️  ${fileName}: No ticker in frontmatter`);
      failed++;
      continue;
    }
    
    console.log(`  📝 ${fileName} (${ticker})...`);
    
    // Fetch price data
    const priceData = await fetchYahooFinanceData(ticker, pubDate);
    if (!priceData) {
      console.log(`     ❌ Failed to fetch price data`);
      failed++;
      continue;
    }
    
    // Prepare updates
    const updates = {};
    
    if (!frontmatter.priceAtPrediction) {
      updates.priceAtPrediction = priceData.price;
    }
    if (!frontmatter.prediction52WeekHigh) {
      updates.prediction52WeekHigh = priceData.high52Week;
    }
    if (!frontmatter.prediction52WeekLow) {
      updates.prediction52WeekLow = priceData.low52Week;
    }
    if (!frontmatter.targetDate) {
      updates.targetDate = calculateTargetDate(pubDate);
    }
    if (!frontmatter.prediction) {
      const prediction = extractPrediction(frontmatter, content);
      if (prediction) updates.prediction = prediction;
    }
    if (!frontmatter.confidence) {
      const confidence = extractConfidence(frontmatter);
      if (confidence) updates.confidence = confidence;
    }
    
    // Update file
    const updatedContent = updateFrontmatter(content, updates);
    fs.writeFileSync(filePath, updatedContent);
    
    console.log(`     ✅ Added: price=$${priceData.price}, 52w range=$${priceData.low52Week}-$${priceData.high52Week}, target=${updates.targetDate}`);
    
    // Update cache
    cache.processed[fileName] = generateChecksum(updatedContent);
    processed++;
    updated++;
  }
  
  saveCache(cache);
  
  console.log(`\n✅ Backfill complete!`);
  console.log(`   Updated: ${updated} | Skipped: ${skipped} | Failed: ${failed} | Total: ${files.length}\n`);
}

// Run backfill
backfillArticles().catch(error => {
  console.error('\n❌ Backfill failed:', error);
  process.exit(1);
});
