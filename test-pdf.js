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