/**
 * compress-images.mjs
 * Run: node compress-images.mjs
 *
 * Compresses the largest public images to web-optimised JPEGs/PNGs.
 * Uses 'sharp' which is already installed by Next.js.
 *
 * Targets:
 *   hero.jpg           4.1 MB  → target ~150 KB
 *   imgi_3_director    1.9 MB  → target ~120 KB
 *   imgi_15_blog2.png  1.5 MB  → target ~100 KB
 *   staff_*.png        600-866KB each → target ~80 KB
 */

import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, "public");

// Images to compress with specific settings
const TARGETS = [
  {
    file: "hero.jpg",
    width: 1920,
    quality: 72,
    format: "jpeg",
    progressive: true,
  },
  {
    file: "imgi_3_director.png",
    width: 800,
    quality: 75,
    format: "jpeg",
    outputFile: "imgi_3_director.jpg",
  },
  {
    file: "imgi_15_blog2.png",
    width: 1200,
    quality: 75,
    format: "jpeg",
    outputFile: "imgi_15_blog2.jpg",
  },
  {
    file: "staff_principal.png",
    width: 600,
    quality: 78,
    format: "jpeg",
    outputFile: "staff_principal.jpg",
  },
  {
    file: "staff_teacher1.png",
    width: 600,
    quality: 78,
    format: "jpeg",
    outputFile: "staff_teacher1.jpg",
  },
  {
    file: "staff_teacher2.png",
    width: 600,
    quality: 78,
    format: "jpeg",
    outputFile: "staff_teacher2.jpg",
  },
  {
    file: "staff_teacher3.png",
    width: 600,
    quality: 78,
    format: "jpeg",
    outputFile: "staff_teacher3.jpg",
  },
  {
    file: "staff_vice1.png",
    width: 600,
    quality: 78,
    format: "jpeg",
    outputFile: "staff_vice1.jpg",
  },
  {
    file: "staff_vice2.png",
    width: 600,
    quality: 78,
    format: "jpeg",
    outputFile: "staff_vice2.jpg",
  },
  {
    file: "carousel-lab.png",
    width: 900,
    quality: 78,
    format: "jpeg",
    outputFile: "carousel-lab.jpg",
  },
  {
    file: "carousel-library.png",
    width: 900,
    quality: 78,
    format: "jpeg",
    outputFile: "carousel-library.jpg",
  },
  {
    file: "carousel-students.png",
    width: 900,
    quality: 78,
    format: "jpeg",
    outputFile: "carousel-students.jpg",
  },
  {
    file: "imgi_3_games.png",
    width: 900,
    quality: 78,
    format: "jpeg",
    outputFile: "imgi_3_games.jpg",
  },
];

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function compress() {
  console.log("\n🔧  Compressing images for web performance...\n");

  let totalSaved = 0;

  for (const target of TARGETS) {
    const inputPath = join(PUBLIC_DIR, target.file);
    const outputFileName = target.outputFile || target.file;
    const outputPath = join(PUBLIC_DIR, outputFileName);

    try {
      const statBefore = await stat(inputPath);
      const sizeBefore = statBefore.size;

      let pipeline = sharp(inputPath).resize({
        width: target.width,
        withoutEnlargement: true,
        fit: "inside",
      });

      if (target.format === "jpeg") {
        pipeline = pipeline.jpeg({
          quality: target.quality,
          progressive: target.progressive ?? true,
          mozjpeg: true,
        });
      } else if (target.format === "png") {
        pipeline = pipeline.png({
          quality: target.quality,
          compressionLevel: 9,
        });
      }

      await pipeline.toFile(outputPath + ".tmp");

      // Replace original only if output is smaller
      const statAfter = await stat(outputPath + ".tmp");
      const sizeAfter = statAfter.size;

      if (sizeAfter < sizeBefore) {
        const { rename, unlink } = await import("fs/promises");
        // If output has a different name, keep the original too
        if (outputFileName !== target.file) {
          await rename(outputPath + ".tmp", outputPath);
        } else {
          await rename(outputPath + ".tmp", inputPath);
        }
        const saved = sizeBefore - sizeAfter;
        totalSaved += saved;
        console.log(
          `  ✅  ${target.file.padEnd(28)} ${formatBytes(sizeBefore).padStart(8)} → ${formatBytes(sizeAfter).padStart(8)}   saved ${formatBytes(saved)}`
        );
        if (outputFileName !== target.file) {
          console.log(`       ↳  Output written to: ${outputFileName}`);
        }
      } else {
        const { unlink } = await import("fs/promises");
        await unlink(outputPath + ".tmp");
        console.log(
          `  ⏭️   ${target.file.padEnd(28)} already optimised, skipping.`
        );
      }
    } catch (err) {
      console.log(`  ❌  ${target.file}: ${err.message}`);
    }
  }

  console.log(`\n🎉  Done! Total saved: ${formatBytes(totalSaved)}\n`);
}

compress();
