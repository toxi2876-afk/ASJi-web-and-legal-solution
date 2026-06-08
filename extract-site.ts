import fs from 'fs';
import path from 'path';

async function main() {
  const url = 'https://c5d69649c0a0492e8b1f839af315c607-latest.preview.enterapp.pro/assets/index-CN25BQS7.js';
  console.log('Fetching', url);
  const res = await fetch(url);
  const text = await res.text();
  console.log('File length:', text.length);

  const files = [
    { name: 'src/components/ui/toast.tsx', idx: 520578 },
    { name: 'src/components/ui/toaster.tsx', idx: 527331 },
    { name: 'src/components/ui/sonner.tsx', idx: 566239 },
    { name: 'src/components/ui/tooltip.tsx', idx: 600487 },
    { name: 'src/components/site/Navbar.tsx', idx: 703401 },
    { name: 'src/components/site/ThreeHero.tsx', idx: 1221382 },
    { name: 'src/components/site/HeroSection.tsx', idx: 1222189 },
    { name: 'src/components/site/AboutSection.tsx', idx: 1241741 },
    { name: 'src/components/site/ServicesSection.tsx', idx: 1267996 },
    { name: 'src/components/site/PortfolioSection.tsx', idx: 1286693 },
    { name: 'src/components/site/ContactSection.tsx', idx: 1305027 },
    { name: 'src/components/site/Footer.tsx', idx: 1333453 },
    { name: 'src/pages/Index.tsx', idx: 1349063 },
    { name: 'src/pages/NotFound.tsx', idx: 1353052 },
    { name: 'src/pages/AdminLogin.tsx', idx: 1356630 },
    { name: 'src/components/admin/AdminLayout.tsx', idx: 1374961 },
    { name: 'src/components/admin/DashboardStats.tsx', idx: 1387248 },
    { name: 'src/components/admin/ClientsTable.tsx', idx: 1400758 },
    { name: 'src/components/admin/ServicesManager.tsx', idx: 1422797 },
    { name: 'src/pages/AdminDashboard.tsx', idx: 1459582 },
    { name: 'src/router.tsx', idx: 1464724 },
    { name: 'src/App.tsx', idx: 1466713 },
    { name: 'src/main.tsx', idx: 1469243 }
  ];

  const outDir = path.join(process.cwd(), 'reconstructed');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const start = Math.max(0, file.idx - 2000); // give some buffer before
    const nextIdx = i < files.length - 1 ? files[i + 1].idx : text.length;
    const end = Math.min(text.length, nextIdx + 2000); // give some buffer after
    const chunk = text.substring(start, end);
    const safeName = file.name.replace(/\//g, '_');
    fs.writeFileSync(path.join(outDir, `${safeName}.js`), chunk);
    console.log(`Saved ${file.name} to ${safeName}.js (len: ${chunk.length})`);
  }
}

main().catch(console.error);
