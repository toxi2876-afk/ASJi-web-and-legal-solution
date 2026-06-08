import fs from 'fs';
import path from 'path';

function searchInFile(fileName: string, pattern: string) {
  const filePath = path.join(process.cwd(), 'reconstructed', fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${fileName}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`=== Matches for ${pattern} in ${fileName} ===`);
  let idx = 0;
  while (true) {
    idx = content.indexOf(pattern, idx);
    if (idx === -1) break;
    console.log(content.substring(idx - 100, idx + 1000));
    console.log('----------------------------------------------------');
    idx += pattern.length;
  }
}

console.log('Search for services items:');
searchInFile('src_components_site_ServicesSection.tsx.js', 'const ');
searchInFile('src_components_site_ServicesSection.tsx.js', 'function ');

console.log('Search for portfolio items:');
searchInFile('src_components_site_PortfolioSection.tsx.js', 'const ');
searchInFile('src_components_site_PortfolioSection.tsx.js', 'function ');
