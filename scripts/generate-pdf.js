import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate PDF files from HTML using Puppeteer
 * This creates actual PDF files at build time
 */

function generatePrintableHTML(content, lang, updatedDate) {
  const title = lang === 'fr' ? 'CV - El Mehdi AREZKI' : 'Resume - El Mehdi AREZKI';
  const updatedText = lang === 'fr' ? 'Mis à jour' : 'Updated';
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1d2433;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-size: 11pt;
    }
    
    .updated-info {
      text-align: right;
      font-size: 0.9em;
      color: #556070;
      margin-bottom: 1.5em;
      padding-bottom: 0.5em;
      border-bottom: 1px solid #e2e8f0;
    }
    
    h1 {
      font-size: 2em;
      margin-bottom: 0.5em;
      color: #1d2433;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 0.3em;
    }
    
    h2 {
      font-size: 1.5em;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      color: #2563eb;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.2em;
      page-break-after: avoid;
    }
    
    h3 {
      font-size: 1.2em;
      margin-top: 1.2em;
      margin-bottom: 0.4em;
      color: #1d2433;
      page-break-after: avoid;
    }
    
    h4 {
      font-size: 1em;
      margin-top: 1em;
      margin-bottom: 0.3em;
      color: #556070;
      page-break-after: avoid;
    }
    
    p {
      margin: 0.5em 0;
      text-align: justify;
    }
    
    ul {
      margin: 0.5em 0;
      padding-left: 1.5em;
    }
    
    li {
      margin: 0.3em 0;
    }
    
    a {
      color: #2563eb;
      text-decoration: none;
    }
    
    strong {
      font-weight: 600;
      color: #1d2433;
    }
    
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 1.5em 0;
    }
    
    .profile-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2em;
      border-radius: 8px;
      margin-bottom: 2em;
      text-align: center;
    }
    
    .profile-banner h1 {
      color: white;
      border: none;
      margin: 0;
    }
    
    .tech-badge, .skill-tag {
      display: inline-block;
      background: #e2e8f0;
      color: #1d2433;
      padding: 0.25em 0.75em;
      border-radius: 12px;
      font-size: 0.85em;
      margin: 0.2em;
      font-weight: 500;
    }
    
    .project-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1em;
      margin: 1em 0;
      background: #f8fafc;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="updated-info">
    ${updatedText}: ${updatedDate}
  </div>
  ${content}
</body>
</html>`;
}

async function generatePDFs() {
  let browser = null;
  
  try {
    console.log('📄 Generating PDF files using Puppeteer...\n');
    
    const publicDir = path.join(__dirname, '..', 'public');
    const distDir = path.join(__dirname, '..', 'dist');
    
    // Ensure directories exist
    [publicDir, distDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    // Launch browser with GitHub Actions-friendly settings
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    const languages = ['fr', 'en'];
    const updatedDate = '10-2025';
    
    for (const lang of languages) {
      console.log(`  Processing ${lang.toUpperCase()}...`);
      
      // Read the markdown content
      const markdownFile = path.join(publicDir, `cv-${lang}.md`);
      
      if (!fs.existsSync(markdownFile)) {
        console.warn(`⚠️  Warning: ${markdownFile} not found, skipping PDF for ${lang}`);
        continue;
      }
      
      const markdown = fs.readFileSync(markdownFile, 'utf-8');
      
      // Simple markdown to HTML conversion
      const htmlContent = markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        .replace(/^---$/gm, '<hr>')
        .replace(/^(?!<[hl]|<li|<hr)(.*$)/gm, (match) => {
          const trimmed = match.trim();
          return trimmed ? `<p>${trimmed}</p>` : '';
        })
        .replace(/(<li>.*?<\/li>\s*)+/gs, (match) => `<ul>${match}</ul>`)
        .replace(/<\/ul>\s*<ul>/g, '');
      
      const fullHtml = generatePrintableHTML(htmlContent, lang, updatedDate);
      
      // Create a new page
      const page = await browser.newPage();
      
      // Set content
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      const pdfPath = path.join(publicDir, `cv-${lang}.pdf`);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: {
          top: '1.5cm',
          right: '1.5cm',
          bottom: '1.5cm',
          left: '1.5cm'
        },
        printBackground: true
      });
      
      // Copy to dist as well
      fs.copyFileSync(pdfPath, path.join(distDir, `cv-${lang}.pdf`));
      
      await page.close();
      
      console.log(`  ✅ Generated PDF for ${lang.toUpperCase()}: ${path.basename(pdfPath)}`);
    }
    
    console.log('\n✨ PDF generation completed successfully!');
    console.log('� Files generated: cv-fr.pdf, cv-en.pdf\n');
    
  } catch (error) {
    console.error('❌ Error generating PDFs:', error.message);
    
    // Don't fail the build if PDF generation fails
    console.warn('⚠️  Continuing build without PDFs...');
    
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

generatePDFs();
