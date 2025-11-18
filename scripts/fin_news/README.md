# AI Financial News - Price Tracking & Prediction Validation

This system tracks stock prices at the time of AI-generated predictions and validates prediction accuracy after a 14-day period.

## Features

### 1. **Price Data Capture**
When generating financial news articles, the system now captures:
- Current stock price at prediction time
- 52-week high/low prices
- Prediction direction (increase/decrease)
- Confidence level (1-10)
- Target validation date (14 days from publication)

### 2. **Prediction Validation**
The validation system analyzes historical predictions via the build process:
- Fetching actual stock prices at target dates
- Comparing predicted vs actual price movements
- Calculating accuracy metrics overall and by:
  - Confidence level (to check calibration)
  - Prediction direction (increase vs decrease)
  - Individual ticker performance

### 3. **Performance Dashboard**
A dedicated page (`/ai-financial-news/performance/`) displays:
- Overall prediction accuracy
- Accuracy breakdown by confidence level
- Accuracy breakdown by prediction type
- Recent validated predictions table
- Average price changes for correct predictions

## Usage

### Generate Articles with Price Tracking
```bash
cd scripts/fin_news
python ai_fin_news.py
```

Articles will now include frontmatter like:
```yaml
---
title: "NVDA – 2025-11-18 - increase Confidence 8/10"
pubDate: 2025-11-18
ticker: "NVDA"
prediction: increase
confidence: 8
priceAtPrediction: 145.32
prediction52WeekHigh: 152.89
prediction52WeekLow: 98.45
targetDate: 2025-12-02
---
```

### Backfill Historical Articles
For existing articles without price data:
```bash
python scripts/fin_news/validate_predictions.py --backfill
```

This will:
- Read all existing articles
- Fetch historical prices from publication dates
- Extract predictions from article content
- Update frontmatter with price tracking fields

### Validate Predictions
Generate performance metrics:
```bash
python scripts/fin_news/validate_predictions.py
```

This creates `public/prediction-performance.json` with:
```json
{
  "lastUpdated": "2025-11-18T12:00:00",
  "overallAccuracy": 67.5,
  "validatedPredictions": 40,
  "correctPredictions": 27,
  "byConfidence": {
    "7": {"total": 15, "correct": 10, "accuracy": 66.67},
    "8": {"total": 20, "correct": 15, "accuracy": 75.00}
  },
  "predictions": [...]
}
```

### Build Site
```bash
npm run build
```

The performance dashboard will be available at `/ai-financial-news/performance/`

## Validation Methodology

### Prediction Timeframe
- **Default**: 14 days from publication
- **Rationale**: Balances short-term market noise with meaningful trend detection

### Success Criteria
- A prediction is **correct** if the actual price movement direction matches the predicted direction
- Magnitude of change is tracked but doesn't affect correctness
- Example: Predicting "increase" is correct even if price only went up 0.5%

### Price Data Source
- **Provider**: Yahoo Finance (via yfinance library)
- **Fallback**: If target date is a weekend/holiday, closest trading day is used
- **Historical Data**: Available back to ~1970s for most major stocks

### Confidence Calibration
Ideal calibration means:
- 7/10 confidence → ~70% accuracy
- 8/10 confidence → ~80% accuracy
- 9/10 confidence → ~90% accuracy

The dashboard helps identify if confidence scores are well-calibrated or need adjustment.

## Schema Changes

### Content Collection: `aifinnews`
New optional fields in `src/content/config.ts`:
```typescript
{
  prediction: z.enum(['increase', 'decrease']).optional(),
  confidence: z.number().min(1).max(10).optional(),
  priceAtPrediction: z.number().optional(),
  prediction52WeekHigh: z.number().optional(),
  prediction52WeekLow: z.number().optional(),
  targetDate: z.coerce.date().optional(),
}
```

## File Locations

- **Article Generation**: `scripts/fin_news/ai_fin_news.py`
- **Validation System**: `scripts/validate-predictions.js` + `scripts/backfill-predictions.cjs`
- **Performance Dashboard**: `src/pages/ai-financial-news/performance.astro`
- **Performance Data**: `public/prediction-performance.json` (generated)
- **Content Schema**: `src/content/config.ts`

## Automation (Optional)

Add to cron for daily validation:
```bash
# Run at 9 AM daily to validate predictions whose target date has passed
0 9 * * * cd /path/to/repo && npm run build  # Automatic via GitHub Actions

# Regenerate site if needed
5 9 * * * cd /path/to/repo && npm run build
```

## Future Enhancements

1. **Database Storage**: Move to SQLite for complex queries (accuracy by sector, market cap, etc.)
2. **Variable Timeframes**: Support custom prediction windows (7-day, 30-day, etc.)
3. **Risk-Adjusted Returns**: Factor in volatility and beta when measuring performance
4. **Sector Analysis**: Compare prediction accuracy across different market sectors
5. **Backtesting**: Simulate portfolio performance if all predictions were traded
6. **API Integration**: Real-time validation endpoint for live monitoring

## Troubleshooting

### "No validated predictions found"
- Ensure articles have `prediction` and `priceAtPrediction` fields
- Check that target dates have passed (validation only works after 14 days)
- Backfill runs automatically during build: `npm run build`

### "Failed to fetch price data"
- Verify yfinance is installed: `pip install yfinance`
- Check internet connection
- Ensure ticker symbols are valid
- Some historical data may be unavailable for delisted/new stocks

### Performance page shows error
- Build includes automatic validation: `npm run build`
- Check `public/prediction-performance.json` exists
- Rebuild site: `npm run build`

## Dependencies

Python:
- `yfinance` - Stock price data
- `tenacity` - Retry logic for API calls

Already included in `requirements.txt`
