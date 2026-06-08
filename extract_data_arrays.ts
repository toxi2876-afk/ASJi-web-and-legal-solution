import fs from 'fs';
import path from 'path';

function findArrays(file: string) {
  const filePath = path.join(process.cwd(), 'reconstructed', file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n======================= DATA IN ${file} =======================`);
  
  // Find strings like 'const someName = [' or matches with objects [ { ... } ]
  const regex = /const\s+([A-Za-z0-9_]+)\s*=\s*\[/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const varName = match[1];
    const startIdx = match.index;
    const chunk = content.substring(startIdx, startIdx + 1500);
    console.log(`Variable: ${varName} near index ${startIdx}\n`, chunk);
    console.log('---------------------------------------------------------');
  }
}

findArrays('src_components_site_ServicesSection.tsx.js');
findArrays('src_components_site_PortfolioSection.tsx.js');
findArrays('src_components_site_AboutSection.tsx.js');
findArrays('src_components_site_Footer.tsx.js');
