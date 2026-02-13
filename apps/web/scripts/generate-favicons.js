const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = fs.readFileSync(path.join(__dirname, '../app/icon.svg'));

const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 512, name: 'icon-512x512.png' },
];

async function generateFavicons() {
    const publicDir = path.join(__dirname, '../public');
    
    for (const { size, name } of sizes) {
        try {
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(path.join(publicDir, name));
            console.log(`Generated ${name} (${size}x${size})`);
        } catch (error) {
            console.error(`Failed to generate ${name}:`, error);
        }
    }
    
    // Also generate favicon.ico (multi-resolution ICO file)
    // For ICO we'll use the 32x32 PNG as a simple workaround
    // True ICO format requires additional libraries
    try {
        await sharp(svgBuffer)
            .resize(32, 32)
            .png()
            .toFile(path.join(publicDir, 'favicon.ico'));
        console.log('Generated favicon.ico (32x32 PNG as fallback)');
    } catch (error) {
        console.error('Failed to generate favicon.ico:', error);
    }
}

generateFavicons().catch(console.error);
