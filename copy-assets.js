const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    const stat = fs.lstatSync(fromPath);
    if (stat.isFile()) {
      fs.copyFileSync(fromPath, toPath);
    } else if (stat.isDirectory()) {
      copyFolderSync(fromPath, toPath);
    }
  });
}

// Copy images to dist/images
const src = path.join(__dirname, 'images');
const dest = path.join(__dirname, 'dist', 'images');

if (fs.existsSync(src)) {
  copyFolderSync(src, dest);
  console.log('Successfully copied images directory to dist/images');
} else {
  console.warn('Images directory not found');
}
