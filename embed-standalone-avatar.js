const fs = require('fs');
const path = require('path');
const dir = __dirname;
const pngPath = path.join(dir, 'assets', 'nighty-portrait.png');
const htmlPath = path.join(dir, 'index-standalone.html');
const placeholder = 'AVATAR_B64_PLACEHOLDER';

if (!fs.existsSync(pngPath)) {
  console.error('Not found:', pngPath);
  process.exit(1);
}
const b64 = fs.readFileSync(pngPath).toString('base64');
let html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes(placeholder)) {
  console.error('Placeholder not found in HTML');
  process.exit(1);
}
html = html.replace(placeholder, b64);
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('OK: avatar embedded in index-standalone.html');
