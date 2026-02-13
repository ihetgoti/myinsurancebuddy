const fs = require('fs');
const path = require('path');

// ICO file format constants
const ICO_HEADER_SIZE = 6;
const ICO_DIR_ENTRY_SIZE = 16;

// Read PNG files
const png16 = fs.readFileSync(path.join(__dirname, '../public/favicon-16x16.png'));
const png32 = fs.readFileSync(path.join(__dirname, '../public/favicon-32x32.png'));

// Create ICO header
const header = Buffer.alloc(ICO_HEADER_SIZE);
header.writeUInt16LE(0, 0); // Reserved
header.writeUInt16LE(1, 2); // Type: ICO
header.writeUInt16LE(2, 4); // Count: 2 images

// Create directory entries
const dir1 = Buffer.alloc(ICO_DIR_ENTRY_SIZE);
dir1.writeUInt8(16, 0); // Width
dir1.writeUInt8(16, 1); // Height
dir1.writeUInt8(0, 2); // Color palette
dir1.writeUInt8(0, 3); // Reserved
dir1.writeUInt16LE(1, 4); // Color planes
dir1.writeUInt16LE(32, 6); // Bits per pixel
dir1.writeUInt32LE(png16.length, 8); // Size
dir1.writeUInt32LE(ICO_HEADER_SIZE + ICO_DIR_ENTRY_SIZE * 2, 12); // Offset

const dir2 = Buffer.alloc(ICO_DIR_ENTRY_SIZE);
dir2.writeUInt8(32, 0); // Width
dir2.writeUInt8(32, 1); // Height
dir2.writeUInt8(0, 2); // Color palette
dir2.writeUInt8(0, 3); // Reserved
dir2.writeUInt16LE(1, 4); // Color planes
dir2.writeUInt16LE(32, 6); // Bits per pixel
dir2.writeUInt32LE(png32.length, 8); // Size
dir2.writeUInt32LE(ICO_HEADER_SIZE + ICO_DIR_ENTRY_SIZE * 2 + png16.length, 12); // Offset

// Combine all parts
const icoBuffer = Buffer.concat([header, dir1, dir2, png16, png32]);

// Write ICO file
fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
console.log('Created favicon.ico with 16x16 and 32x32 PNG images');
