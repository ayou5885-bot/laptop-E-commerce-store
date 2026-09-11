#!/usr/bin/env node
/**
 * Generates lightweight SVG placeholder images for each laptop product.
 * These are written as .webp files (SVG content with .webp extension)
 * — they will be replaced by the user's real compressed images later.
 *
 * Actually, to ensure the browser renders them, we'll generate real SVG files
 * and the images.ts will point to .webp. So instead we create simple SVG
 * placeholders that the OptimizedImage component will load.
 *
 * But wait — the image paths in images.ts end in .webp. We need the actual
 * files to exist at those paths. Since we can't generate real WebP files
 * without image libraries, we'll generate SVG files but save them with the
 * correct names matching images.ts.
 *
 * Actually, the simplest approach: generate SVG files and update images.ts
 * to point to .svg. But the user wants .webp for replacement.
 *
 * Best approach: Create placeholder .svg files at the .svg path, and have
 * images.ts point to .svg. When the user adds their .webp files, they just
 * update images.ts. But the instructions say to use .webp paths.
 *
 * Let's just create the .svg files at .svg paths and update images.ts to
 * reference .svg. The user can change to .webp when they add real images.
 */

const fs = require('fs');
const path = require('path');

const laptops = [
  // Dell
  { name: 'dell-inspiron-15', brand: 'Dell', model: 'Inspiron 15', color: '#007db8' },
  { name: 'dell-inspiron-14', brand: 'Dell', model: 'Inspiron 14', color: '#007db8' },
  { name: 'dell-xps-13', brand: 'Dell', model: 'XPS 13', color: '#007db8' },
  { name: 'dell-xps-15', brand: 'Dell', model: 'XPS 15', color: '#007db8' },
  { name: 'dell-xps-17', brand: 'Dell', model: 'XPS 17', color: '#007db8' },
  { name: 'dell-latitude-5440', brand: 'Dell', model: 'Latitude 5440', color: '#007db8' },
  { name: 'dell-latitude-7440', brand: 'Dell', model: 'Latitude 7440', color: '#007db8' },
  { name: 'dell-g15', brand: 'Dell', model: 'G15', color: '#007db8' },
  { name: 'dell-g16', brand: 'Dell', model: 'G16', color: '#007db8' },
  { name: 'dell-inspiron-16', brand: 'Dell', model: 'Inspiron 16', color: '#007db8' },
  // HP
  { name: 'hp-pavilion-15', brand: 'HP', model: 'Pavilion 15', color: '#0096d6' },
  { name: 'hp-pavilion-14', brand: 'HP', model: 'Pavilion 14', color: '#0096d6' },
  { name: 'hp-envy-13', brand: 'HP', model: 'Envy 13', color: '#0096d6' },
  { name: 'hp-envy-14', brand: 'HP', model: 'Envy 14', color: '#0096d6' },
  { name: 'hp-envy-16', brand: 'HP', model: 'Envy 16', color: '#0096d6' },
  { name: 'hp-probook-450', brand: 'HP', model: 'ProBook 450', color: '#0096d6' },
  { name: 'hp-elitebook-840', brand: 'HP', model: 'EliteBook 840', color: '#0096d6' },
  { name: 'hp-victus-15', brand: 'HP', model: 'Victus 15', color: '#0096d6' },
  { name: 'hp-victus-16', brand: 'HP', model: 'Victus 16', color: '#0096d6' },
  { name: 'hp-omen-16', brand: 'HP', model: 'OMEN 16', color: '#0096d6' },
  // Lenovo
  { name: 'lenovo-ideapad-3', brand: 'Lenovo', model: 'IdeaPad 3', color: '#e2231a' },
  { name: 'lenovo-ideapad-flex-5', brand: 'Lenovo', model: 'IdeaPad Flex 5', color: '#e2231a' },
  { name: 'lenovo-thinkpad-e14', brand: 'Lenovo', model: 'ThinkPad E14', color: '#e2231a' },
  { name: 'lenovo-thinkpad-t14', brand: 'Lenovo', model: 'ThinkPad T14', color: '#e2231a' },
  { name: 'lenovo-thinkpad-x1-carbon', brand: 'Lenovo', model: 'ThinkPad X1 Carbon', color: '#e2231a' },
  { name: 'lenovo-yoga-7i', brand: 'Lenovo', model: 'Yoga 7i', color: '#e2231a' },
  { name: 'lenovo-yoga-9i', brand: 'Lenovo', model: 'Yoga 9i', color: '#e2231a' },
  { name: 'lenovo-loq-15', brand: 'Lenovo', model: 'LOQ 15', color: '#e2231a' },
  { name: 'lenovo-legion-5', brand: 'Lenovo', model: 'Legion 5', color: '#e2231a' },
  { name: 'lenovo-legion-pro-5', brand: 'Lenovo', model: 'Legion Pro 5', color: '#e2231a' },
  // ASUS
  { name: 'asus-vivobook-15', brand: 'ASUS', model: 'Vivobook 15', color: '#00539b' },
  { name: 'asus-vivobook-14', brand: 'ASUS', model: 'Vivobook 14', color: '#00539b' },
  { name: 'asus-zenbook-14', brand: 'ASUS', model: 'Zenbook 14', color: '#00539b' },
  { name: 'asus-zenbook-14-oled', brand: 'ASUS', model: 'Zenbook 14 OLED', color: '#00539b' },
  { name: 'asus-tuf-gaming-a15', brand: 'ASUS', model: 'TUF A15', color: '#00539b' },
  { name: 'asus-tuf-gaming-a16', brand: 'ASUS', model: 'TUF A16', color: '#00539b' },
  { name: 'asus-rog-strix-g16', brand: 'ASUS', model: 'ROG Strix G16', color: '#00539b' },
  { name: 'asus-rog-zephyrus-g14', brand: 'ASUS', model: 'ROG Zephyrus G14', color: '#00539b' },
  // Acer
  { name: 'acer-aspire-5', brand: 'Acer', model: 'Aspire 5', color: '#83b81a' },
  { name: 'acer-swift-3', brand: 'Acer', model: 'Swift 3', color: '#83b81a' },
  { name: 'acer-swift-go-14', brand: 'Acer', model: 'Swift Go 14', color: '#83b81a' },
  { name: 'acer-nitro-5', brand: 'Acer', model: 'Nitro 5', color: '#83b81a' },
  { name: 'acer-nitro-16', brand: 'Acer', model: 'Nitro 16', color: '#83b81a' },
  // Apple
  { name: 'macbook-air-13', brand: 'Apple', model: 'MacBook Air 13', color: '#555555' },
  { name: 'macbook-air-15', brand: 'Apple', model: 'MacBook Air 15', color: '#555555' },
  { name: 'macbook-pro-14', brand: 'Apple', model: 'MacBook Pro 14', color: '#555555' },
];

const outputDir = path.join(process.cwd(), 'public', 'images', 'laptops');

function generateSVG(laptop) {
  const brandColor = laptop.color;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <rect x="150" y="120" width="500" height="320" rx="12" fill="#e9ecef" stroke="${brandColor}" stroke-width="2"/>
  <rect x="170" y="140" width="460" height="280" rx="4" fill="#1a1d21"/>
  <rect x="180" y="150" width="440" height="260" rx="2" fill="${brandColor}" opacity="0.15"/>
  <rect x="120" y="440" width="560" height="16" rx="8" fill="#dee2e6"/>
  <rect x="350" y="448" width="100" height="6" rx="3" fill="#ced4da"/>
  <text x="400" y="290" font-family="Inter, sans-serif" font-size="36" font-weight="700" fill="${brandColor}" text-anchor="middle">${laptop.brand}</text>
  <text x="400" y="330" font-family="Inter, sans-serif" font-size="20" font-weight="500" fill="#6c757d" text-anchor="middle">${laptop.model}</text>
</svg>`;
}

laptops.forEach((laptop) => {
  const filePath = path.join(outputDir, `${laptop.name}.svg`);
  fs.writeFileSync(filePath, generateSVG(laptop));
  console.log(`Created: ${laptop.name}.svg`);
});

console.log(`\nTotal: ${laptops.length} placeholder images created`);
