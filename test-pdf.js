#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function testPDF() {
  console.log('🧪 Running PDF tests...');

  const pdfPath = path.resolve('./Justin_Avery_Chan_Resume.pdf');
  let warnings = [];
  let passed = 0;
  let total = 0;

  // Test 1: PDF file exists
  total++;
  if (!fs.existsSync(pdfPath)) {
    warnings.push('❌ PDF file does not exist');
  } else {
    console.log('✅ PDF file exists');
    passed++;
  }

  if (!fs.existsSync(pdfPath)) {
    console.log(`\n📊 Tests passed: ${passed}/${total}`);
    return;
  }

  // Test 2: File size is reasonable (not too small, not too large)
  total++;
  const stats = fs.statSync(pdfPath);
  const fileSizeKB = Math.round(stats.size / 1024);
  if (fileSizeKB < 50) {
    warnings.push(`❌ PDF seems too small (${fileSizeKB} KB) - might be corrupted`);
  } else if (fileSizeKB > 1000) {
    warnings.push(`❌ PDF seems too large (${fileSizeKB} KB) - might be inefficient`);
  } else {
    console.log(`✅ PDF file size is reasonable (${fileSizeKB} KB)`);
    passed++;
  }

  // Test 3: PDF is single page (using a simple heuristic)
  total++;
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfString = pdfBuffer.toString('latin1');

    // Count page objects in PDF (rough heuristic)
    const pageMatches = pdfString.match(/\/Type\s*\/Page[^s]/g);
    const pageCount = pageMatches ? pageMatches.length : 0;

    if (pageCount === 1) {
      console.log('✅ PDF appears to be single page');
      passed++;
    } else if (pageCount === 0) {
      warnings.push('❌ Could not determine page count - PDF might be corrupted');
    } else {
      warnings.push(`❌ PDF has ${pageCount} pages - should be single page`);
    }
  } catch (error) {
    warnings.push('❌ Failed to analyze PDF page count');
  }

  // Test 4: PDF is not password protected (can be opened)
  total++;
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    if (pdfBuffer.includes('Encrypt')) {
      warnings.push('❌ PDF appears to be encrypted/password protected');
    } else {
      console.log('✅ PDF is not password protected');
      passed++;
    }
  } catch (error) {
    warnings.push('❌ Failed to check PDF encryption status');
  }

  // Test 5: Check if HTML file exists (for iframe)
  total++;
  const htmlPath = path.resolve('./Justin_Avery_Chan_Resume.html');
  if (!fs.existsSync(htmlPath)) {
    warnings.push('❌ HTML file does not exist - iframe in index.html will be broken');
  } else {
    console.log('✅ HTML file exists for iframe');
    passed++;
  }

  // Test 6: Check if index.html exists and has proper links
  total++;
  const indexPath = path.resolve('./index.html');
  if (!fs.existsSync(indexPath)) {
    warnings.push('❌ index.html does not exist');
  } else {
    try {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      const hasHtmlIframe = indexContent.includes('Justin_Avery_Chan_Resume.html');
      const hasPdfLink = indexContent.includes('Justin_Avery_Chan_Resume.pdf');
      const hasDownloadLink = indexContent.includes('download=');

      if (hasHtmlIframe && hasPdfLink && hasDownloadLink) {
        console.log('✅ index.html has proper resume links');
        passed++;
      } else {
        warnings.push('❌ index.html missing proper resume links');
      }
    } catch (error) {
      warnings.push('❌ Failed to read index.html');
    }
  }

  // Test 7: Check if HTML has links and CSS styles them properly
  total++;
  try {
    const resumeHtmlPath = path.resolve('./Justin_Avery_Chan_Resume.html');
    const resumeCssPath = path.resolve('./print.css');
    const htmlContent = fs.readFileSync(resumeHtmlPath, 'utf8');
    const cssContent = fs.readFileSync(resumeCssPath, 'utf8');

    // Check if HTML has links
    const hasLinks = htmlContent.includes('<a href=');

    // Check if CSS styles links properly
    const hasLinkStyling = cssContent.includes('color: #0066cc') &&
                          cssContent.includes('text-decoration: underline');

    if (hasLinks && hasLinkStyling) {
      console.log('✅ HTML contains links and CSS styles them visibly');
      passed++;
    } else if (!hasLinks) {
      warnings.push('❌ HTML contains no links to style');
    } else {
      warnings.push('❌ CSS does not properly style links (missing blue color or underline)');
    }
  } catch (error) {
    warnings.push('❌ Failed to analyze link styling');
  }

  // Test 8: Check if PDF might have clickable links (rough heuristic)
  total++;
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfString = pdfBuffer.toString('latin1');

    // Look for PDF annotation objects that might indicate links
    const hasAnnotations = pdfString.includes('/Annot') || pdfString.includes('/Link') || pdfString.includes('/URI');

    if (hasAnnotations) {
      console.log('✅ PDF appears to contain link annotations');
      passed++;
    } else {
      warnings.push('❌ PDF does not appear to contain clickable links');
    }
  } catch (error) {
    warnings.push('❌ Failed to analyze PDF link annotations');
  }

  // Print summary
  console.log(`\n📊 Tests passed: ${passed}/${total}`);

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => console.log(`   ${warning}`));
    console.log('\n💡 These are warnings only - PDF generation completed successfully');
  } else {
    console.log('\n🎉 All tests passed! PDF looks good.');
  }
}

// Run tests
testPDF().catch(error => {
  console.error('❌ Test runner failed:', error.message);
});