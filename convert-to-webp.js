/**
 * convert-to-webp.js
 * ──────────────────────────────────────────────────────────
 * Converts all PNG and JPG/JPEG images in the ./images folder
 * to optimized .webp format using the `sharp` library.
 *
 * Usage:
 *   npm install sharp
 *   node convert-to-webp.js
 *
 * Output: Each converted file is saved alongside the original
 * as <filename>.webp. Originals are NOT deleted.
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ sharp is not installed. Run: npm install sharp');
  process.exit(1);
}

const INPUT_DIR = path.join(__dirname, 'images');
const QUALITY = 80; // 80% quality — great balance of size vs. clarity

const supportedExts = ['.png', '.jpg', '.jpeg'];

async function convertImages() {
  const files = fs.readdirSync(INPUT_DIR);
  const targets = files.filter(f => supportedExts.includes(path.extname(f).toLowerCase()));

  if (targets.length === 0) {
    console.log('No PNG/JPG images found in ./images');
    return;
  }

  console.log(`\nConverting ${targets.length} images to WebP (quality: ${QUALITY}%)...\n`);

  let converted = 0;
  let skipped = 0;
  let totalSaved = 0;

  for (const file of targets) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputFile = path.basename(file, path.extname(file)) + '.webp';
    const outputPath = path.join(INPUT_DIR, outputFile);

    // Skip if webp already exists and is newer
    if (fs.existsSync(outputPath)) {
      const inStat = fs.statSync(inputPath);
      const outStat = fs.statSync(outputPath);
      if (outStat.mtimeMs > inStat.mtimeMs) {
        console.log(`  ⏭️  Skipped (up to date): ${file}`);
        skipped++;
        continue;
      }
    }

    try {
      const inSize = fs.statSync(inputPath).size;
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);
      const outSize = fs.statSync(outputPath).size;
      const saved = inSize - outSize;
      const pct = ((saved / inSize) * 100).toFixed(1);
      totalSaved += saved;
      console.log(`  ✅ ${file} → ${outputFile}  (${(inSize/1024).toFixed(0)}KB → ${(outSize/1024).toFixed(0)}KB, saved ${pct}%)`);
      converted++;
    } catch (err) {
      console.error(`  ❌ Failed: ${file} — ${err.message}`);
    }
  }

  console.log(`\n${'─'.repeat(55)}`);
  console.log(`Converted: ${converted}  |  Skipped: ${skipped}  |  Total saved: ${(totalSaved / 1024).toFixed(0)} KB`);
  console.log(`\n💡 Tip: Update img src attributes in index.html to use the new .webp files.`);
}

convertImages();
