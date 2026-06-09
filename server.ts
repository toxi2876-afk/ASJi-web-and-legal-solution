import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

const dbPath = path.join(process.cwd(), 'data', 'database.json');

// Ensure database file directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initial/default seed data
const initialServices = [
  {
    id: 1,
    title: "Legal Consulting",
    icon: "Scale",
    shortDesc: "Expert legal guidance for individuals and businesses.",
    fullDesc: "Our experienced legal consultants provide comprehensive advisory services covering corporate law, contracts, compliance, and dispute resolution. We ensure your legal interests are fully protected.",
    features: ["Corporate Law", "Contract Review", "Dispute Resolution", "Regulatory Compliance"],
    color: "#C9A84C"
  },
  {
    id: 2,
    title: "Web Development",
    icon: "Globe",
    shortDesc: "Modern, responsive websites and web applications.",
    fullDesc: "We build stunning, high-performance websites and web applications tailored to your business needs. From landing pages to complex platforms, we deliver digital excellence.",
    features: ["Custom Design", "Responsive UI", "E-commerce", "CMS Integration"],
    color: "#C9A84C"
  },
  {
    id: 3,
    title: "Document Drafting",
    icon: "FileText",
    shortDesc: "Professional legal documents crafted with precision.",
    fullDesc: "Our legal experts draft, review, and finalize all types of legal documents including agreements, MOUs, NDAs, employment contracts, and corporate resolutions with meticulous attention to detail.",
    features: ["Agreements & Contracts", "MOUs & NDAs", "Employment Contracts", "Corporate Resolutions"],
    color: "#C9A84C"
  },
  {
    id: 4,
    title: "SEO & Digital Marketing",
    icon: "TrendingUp",
    shortDesc: "Grow your online presence and reach your audience.",
    fullDesc: "We help businesses dominate search rankings and expand their digital footprint. Our data-driven SEO and marketing strategies deliver measurable results and sustained growth.",
    features: ["SEO Optimization", "Content Strategy", "Social Media", "Analytics & Reporting"],
    color: "#C9A84C"
  }
];

const initialInquiries = [
  {
    id: 1,
    name: "Ahmed Rashid",
    email: "ahmed@rashid.com",
    service: "Legal Consulting",
    message: "Need advice on corporate compliance.",
    status: "New",
    date: "2026-06-01"
  },
  {
    id: 2,
    name: "Sara Khan",
    email: "sara@khan.com",
    service: "Web Development",
    message: "Looking for a full business website.",
    status: "Contacted",
    date: "2026-05-28"
  },
  {
    id: 3,
    name: "Bilal Mahmood",
    email: "bilal@mahmood.com",
    service: "Document Drafting",
    message: "Need an NDA drafted urgently.",
    status: "Closed",
    date: "2026-05-20"
  },
  {
    id: 4,
    name: "Fatima Noor",
    email: "fatima@noor.com",
    service: "SEO & Marketing",
    message: "Improve search rankings for our law firm.",
    status: "New",
    date: "2026-06-03"
  },
  {
    id: 5,
    name: "Zain Ul Abideen",
    email: "zain@ua.com",
    service: "Legal Consulting",
    message: "Dispute resolution consultation required.",
    status: "Contacted",
    date: "2026-05-30"
  },
  {
    id: 6,
    name: "Maria Ibrahim",
    email: "maria@ibrahim.com",
    service: "Web Development",
    message: "E-commerce platform with CMS integration.",
    status: "New",
    date: "2026-06-05"
  }
];

// Read DB file
function readDB() {
  if (!fs.existsSync(dbPath)) {
    const data = { services: initialServices, inquiries: initialInquiries };
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return data;
  }
  try {
    const text = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(text);
  } catch (err) {
    console.error("Error reading database file, resetting to initials", err);
    return { services: initialServices, inquiries: initialInquiries };
  }
}

// Write DB file
function writeDB(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// REST API routes FIRST
app.get('/api/services', (req, res) => {
  const db = readDB();
  res.json(db.services);
});

app.post('/api/services', (req, res) => {
  const db = readDB();
  const rawService = req.body;

  if (rawService.id) {
    // Update existing
    db.services = db.services.map((s: any) => s.id === Number(rawService.id) ? { ...s, ...rawService } : s);
  } else {
    // Add new
    const newService = {
      ...rawService,
      id: Date.now()
    };
    db.services.push(newService);
  }
  writeDB(db);
  res.json({ success: true, services: db.services });
});

app.put('/api/services/:id', (req, res) => {
  const db = readDB();
  const idToUpdate = Number(req.params.id);
  const updatedData = req.body;
  
  db.services = db.services.map((s: any) => s.id === idToUpdate ? { ...s, ...updatedData } : s);
  writeDB(db);
  res.json({ success: true, services: db.services });
});

app.delete('/api/services/:id', (req, res) => {
  const db = readDB();
  const idToDelete = Number(req.params.id);
  db.services = db.services.filter((s: any) => s.id !== idToDelete);
  writeDB(db);
  res.json({ success: true, services: db.services });
});

app.get('/api/inquiries', (req, res) => {
  const db = readDB();
  res.json(db.inquiries);
});

app.post('/api/inquiries', (req, res) => {
  const db = readDB();
  const rawInquiry = req.body;
  const newInquiry = {
    id: Date.now(),
    name: rawInquiry.name,
    email: rawInquiry.email,
    service: rawInquiry.service || "General",
    message: rawInquiry.message,
    status: "New",
    date: new Date().toISOString().split('T')[0]
  };
  db.inquiries.push(newInquiry);
  writeDB(db);
  res.json({ success: true, inquiry: newInquiry });
});

app.put('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  const idToUpdate = Number(req.params.id);
  const { status } = req.body;
  db.inquiries = db.inquiries.map((iq: any) => iq.id === idToUpdate ? { ...iq, status } : iq);
  writeDB(db);
  res.json({ success: true, inquiries: db.inquiries });
});

app.delete('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  const idToDelete = Number(req.params.id);
  db.inquiries = db.inquiries.filter((iq: any) => iq.id !== idToDelete);
  writeDB(db);
  res.json({ success: true, inquiries: db.inquiries });
});

// Vite server setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error("Failed to start server", err);
});
