/**
 * Fetch historical stock data for AI Financial News articles
 * Generates JSON files for each ticker on the article's publication date
 * Data includes 3 months of daily OHLCV data for context
 * Uses yahoo-finance2 library 
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '../cache/stock-data');
const PUBLIC_DATA_DIR = path.join(__dirname, '../public/stock-data');
const AIFINNEWS_DIR = path.join(__dirname, '../src/content/aifinnews');

/**
 * Fetch stock data from Yahoo Finance API
 * @param {string} ticker - Stock ticker symbol
 * @param {Date} targetDate - Article publication date
 * @returns {Promise<Object>} Stock data with OHLCV for 3 months
 */
async function fetchYahooFinanceData(ticker, targetDate) {
  try {
    // Calculate date range: 3 months before target date
    const endDate = new Date(targetDate);
    const startDate = new Date(targetDate);
    startDate.setMonth(startDate.getMonth() - 3);
    
    console.log(`Fetching data for ${ticker} from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}...`);
    
    const queryOptions = {
      period1: startDate,
      period2: endDate,
      interval: '1d'
    };
    
    const result = await yahooFinance.historical(ticker, queryOptions);
    
    if (!result || result.length === 0) {
      throw new Error(`No data returned for ${ticker}`);
    }
    
    // Transform to our format
    const chartData = result.map(quote => ({
      date: quote.date.toISOString().split('T')[0],
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.close,
      volume: quote.volume
    })).filter(d => d.close !== null && d.close !== undefined);
    
    if (chartData.length === 0) {
      throw new Error(`No valid data points for ${ticker}`);
    }
    
    // Get quote for metadata
    const quote = await yahooFinance.quote(ticker);
    
    // Calculate statistics
    const closes = chartData.map(d => d.close);
    const currentPrice = closes[closes.length - 1];
    const previousPrice = closes[0];
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;
    const high52w = Math.max(...closes);
    const low52w = Math.min(...closes);
    
    return {
      ticker,
      name: quote.longName || quote.shortName || ticker,
      currency: quote.currency || 'USD',
      exchangeName: quote.fullExchangeName || quote.exchange || 'NASDAQ',
      currentPrice: currentPrice.toFixed(2),
      change: change.toFixed(2),
      changePercent: changePercent.toFixed(2),
      high52w: high52w.toFixed(2),
      low52w: low52w.toFixed(2),
      volume: chartData[chartData.length - 1].volume,
      chartData,
      generatedAt: new Date().toISOString(),
      articleDate: targetDate.toISOString().split('T')[0]
    };
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error.message);
    return null;
  }
}

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  
  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      let value = match[2].trim();
      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');
      frontmatter[match[1]] = value;
    }
  }
  
  return frontmatter;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Fetching stock data for AI Financial News articles...\n');
  
  // Create both cache and public directories
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_DATA_DIR, { recursive: true });
  
  // Find all aifinnews markdown files
  const allFiles = await fs.readdir(AIFINNEWS_DIR);
  const files = allFiles.filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} AI Financial News articles\n`);
  
  let processed = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const file of files) {
    const filePath = path.join(AIFINNEWS_DIR, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    
    if (!frontmatter || !frontmatter.ticker || !frontmatter.pubDate) {
      console.log(`⏭️  Skipping ${file} (no ticker or pubDate)`);
      skipped++;
      continue;
    }
    
    const ticker = frontmatter.ticker;
    const pubDate = new Date(frontmatter.pubDate);
    const dateStr = pubDate.toISOString().split('T')[0];
    const cacheFile = path.join(CACHE_DIR, `${ticker}-${dateStr}.json`);
    const publicFile = path.join(PUBLIC_DATA_DIR, `${ticker}-${dateStr}.json`);
    
    // Check if data already exists in cache (don't call Yahoo Finance again)
    try {
      await fs.access(cacheFile);
      console.log(`✓ ${ticker} (${dateStr}) - already exists in cache`);
      
      // Copy to public if not there
      try {
        await fs.access(publicFile);
      } catch {
        const cacheData = await fs.readFile(cacheFile, 'utf-8');
        await fs.writeFile(publicFile, cacheData);
        console.log(`  ↳ Copied to public directory`);
      }
      
      skipped++;
      continue;
    } catch {
      // File doesn't exist, proceed to fetch
    }
    
    // Fetch and save data to both locations
    const stockData = await fetchYahooFinanceData(ticker, pubDate);
    
    if (stockData) {
      const jsonData = JSON.stringify(stockData, null, 2);
      
      // Save to cache (committed in GitHub Actions)
      await fs.writeFile(cacheFile, jsonData);
      
      // Also save to public (for runtime access)
      await fs.writeFile(publicFile, jsonData);
      
      console.log(`✅ ${ticker} (${dateStr}) - saved ${stockData.chartData.length} data points`);
      processed++;
      
      // Rate limiting: wait 200ms between requests to avoid Yahoo Finance throttling
      await new Promise(resolve => setTimeout(resolve, 200));
    } else {
      console.log(`❌ ${ticker} (${dateStr}) - failed to fetch`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Summary:`);
  console.log(`   ✅ Processed: ${processed}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📁 Total files: ${files.length}`);
  console.log(`   💾 Cache: ${CACHE_DIR}`);
  console.log(`   📂 Public: ${PUBLIC_DATA_DIR}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
