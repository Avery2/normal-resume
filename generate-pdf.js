#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Starting PDF generation...');

  try {
    // Check if required files exist
    const htmlPath = path.resolve('./Justin_Avery_Chan_Resume.html');
    const cssPath = path.resolve('./print.css');

    if (!fs.existsSync(htmlPath)) {
      throw new Error('Justin_Avery_Chan_Resume.html not found in current directory');
    }

    if (!fs.existsSync(cssPath)) {
      throw new Error('print.css not found in current directory');
    }

    console.log('📄 Loading HTML and CSS files...');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Load the HTML file as a file:// URL so CSS loads properly
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

    console.log('🎨 Applying styles and generating PDF...');

    // Generate PDF with print settings
    await page.pdf({
      path: 'Justin_Avery_Chan_Resume.pdf',
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.75in',
        right: '0.75in',
        bottom: '0.75in',
        left: '0.75in'
      }
    });

    await browser.close();

    console.log('✅ PDF generated successfully: Justin_Avery_Chan_Resume.pdf');

    // Check file size for feedback
    const stats = fs.statSync('Justin_Avery_Chan_Resume.pdf');
    const fileSizeInKB = Math.round(stats.size / 1024);
    console.log(`📊 File size: ${fileSizeInKB} KB`);

    // Run PDF tests
    console.log('');
    try {
      const { spawn } = require('child_process');
      const testProcess = spawn('node', ['test-pdf.js'], { stdio: 'inherit' });

      testProcess.on('close', (code) => {
        // Tests complete (don't exit on test failures)
        console.log('\n🏁 PDF generation and testing complete!');
      });
    } catch (testError) {
      console.log('⚠️  Could not run PDF tests:', testError.message);
      console.log('🏁 PDF generation complete!');
    }

  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    process.exit(1);
  }
})();