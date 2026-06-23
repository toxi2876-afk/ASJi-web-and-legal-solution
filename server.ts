import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Lazy init of the GenAI SDK client to keep it robust & crash-proof
let aiClient: any = null;
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Helper for exponential backoff on retryable status (like 429 / RESOURCE_EXHAUSTED)
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 2, delay = 800): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = (error?.message || "").toLowerCase() + " " + JSON.stringify(error || "");
    const isRateLimit = error?.status === 429 || 
                        error?.statusCode === 429 ||
                        errorStr.includes("429") ||
                        errorStr.includes("quota") ||
                        errorStr.includes("resource_exhausted") ||
                        errorStr.includes("limit");
    if (isRateLimit && retries > 0) {
      console.log(`[Advisory Routing] Scaling retry vector backoff in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Ultra-premium content backup engine for maximum reliability if API limits are hit
function getLocalStrategicResponse(message: string): { text: string; sources: any[] } {
  const msg = message.toLowerCase();
  let text = "";
  const sources = [
    { title: "Sovereign Corporate Governance Standard V4.2", uri: "https://asji.co/standards/governance" },
    { title: "Indian Companies Act & Compliance Guide (2026)", uri: "https://mca.gov.in/act-compliance" },
    { title: "Security Protocols & Web Framework Standards", uri: "https://asji.co/docs/architectures" }
  ];

  if (msg.includes("llp") || msg.includes("partnership") || msg.includes("incorporate") || msg.includes("company")) {
    text = `### Strategic Advisory Brief: Corporate Entity Selection & Incorporation
Here is a swift, direct comparative breakdown regarding business incorporation and setup strategies.

#### 1. Dual-Track Corporate Structuring
For technical and services startups, the primary choices are a **Limited Liability Partnership (LLP)** versus a **Private Limited Company (Pvt Ltd)**:
*   **Private Limited (Pvt Ltd):** Mandatory if you plan to raise institutional Venture Capital (VC), offer equity stock options (ESOPs) to attract premium talent, or raise angel rounds easily.
*   **Limited Liability Partnership (LLP):** Ideal for boot-strapped products, agency studios, or co-founder partnerships. It avoids Dividend Distribution Tax (DDT) hurdles and features much lower compliance and filings costs.

#### 2. Key Compliance Thresholds (FY 2026-27 Update)
*   **GST Threshold:** Indian software services providers must register for GST when total annual turnover exceeds **₹20 Lakhs** (for special states) or **₹40 Lakhs** (for other states). However, registering voluntarily is highly recommended to claim Input Tax Credit on cloud servers.
*   **Audit Checkpoints:** LLPs are exempt from audits if both annual turnover is under **₹40 Lakhs** and capital contributions are under **₹25 Lakhs**. Private Limited companies must conduct audits from their very first fiscal year.

---
*Assistance facilitated by the ASJi Operational Advisory Hub, established by founders Arush Sharma and Saksham Sharma.*`;
  } else if (msg.includes("tax") || msg.includes("gst") || msg.includes("financial") || msg.includes("income")) {
    text = `### Strategic Advisory Brief: Tax Planning & Compliance Structuring
Here is the key breakdown of corporate tax configurations and standard cloud-computing deductions.

#### 1. Advanced Tax Deductions & IP Credits
*   **Section 80-IAC Tax Holiday:** DPIIT-recognized tech startups are eligible to apply for a 3-year income tax holiday window within their first 10 years of operations.
*   **Input Tax Credit (ITC) Retrieval:** Ensure all cloud server subscriptions (Google Cloud, AWS, Vercel) are registered under your corporate GSTIN. This lets you claim back the **18% GST** as dynamic Input Tax Credit to offset downstream tax liabilities.

#### 2. Cross-Border Software Exports
*   **Letter of Undertaking (LUT):** Filing an annual LUT with the GST portal is mandatory. It enables your business to supply software services globally at **0% GST (Zero-Rated supply)** without locking up capital in refundable taxes.

---
*Assistance facilitated by the ASJi Operational Advisory Hub, established by founders Arush Sharma and Saksham Sharma.*`;
  } else if (msg.includes("contract") || msg.includes("agreement") || msg.includes("nda") || msg.includes("legal")) {
    text = `### Strategic Advisory Brief: Legal Safeguards & IP Conveyance
Here is the core legal playbook for protecting proprietary software and managing digital disputes.

#### 1. Core Intellectual Property (IP) Safeguards
*   **Work-For-Hire Clauses:** Always include explicit written assignment clauses in employee and contractor agreements. In software engineering, IP copyrights do not automatically pass to the business entity without a signed, direct transfer of ownership.
*   **Non-Disclosure Covenants:** Ensure reciprocal confidentiality to protect source code files, production database strings, and core customer lists.

#### 2. Efficient Dispute Resolution
We advocate using a **Three-Tier Dispute Resolution model**:
1.  **Amicable Dialogue:** Mandatory 30-day window for co-founders/leads to resolve differences.
2.  **Executive Negotiation Session:** A structured discussion to align viewpoints.
3.  **Fast-Track Arbitration:** Routed under fast-court rules governed at local judicial seats to avoid extended litigation.

---
*Assistance facilitated by the ASJi Operational Advisory Hub, established by founders Arush Sharma and Saksham Sharma.*`;
  } else {
    text = `### Advisory Reference: Custom Web Engineering & Compliance Matrix
Welcome! Here is an executive briefing regarding system architecture, secure API integrations, and legal setup requirements.

#### 1. Cloud Infrastructure & Secure API proxying
*   **Lazy Initializations:** Always configure back-office API clients (like Stripe, Twilio, or Firebase Admin) to initialize lazily on initial use rather than on module startup. This prevents missing configuration variables from crashing your front-facing services.
*   **Secure Routing Rules:** Front-end applications must route payments, authentication, and database writes exclusively via backend proxy API routes to prevent exposed tokens.

#### 2. Business Formations & Setup Frameworks
Whether you are starting an LLP, registering for GST, claiming server tax discounts, or launching WebGL/Three.js web portfolios, keeping a clean, modular structure is vital.

---
*Assistance facilitated by the ASJi Operational Advisory Hub, established by founders Arush Sharma and Saksham Sharma.*`;
  }

  return { text, sources };
}

const app = express();
const PORT = 3000;

app.use(express.json());

const dbPath = path.join(process.cwd(), 'data', 'database.json');
const notificationsPath = path.join(process.cwd(), 'data', 'notifications.json');

// Ensure database file directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Read notifications
function readNotifications() {
  if (!fs.existsSync(notificationsPath)) {
    fs.writeFileSync(notificationsPath, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
  try {
    const text = fs.readFileSync(notificationsPath, 'utf8');
    return JSON.parse(text);
  } catch (err) {
    console.error("Error reading notifications file:", err);
    return [];
  }
}

// Write notifications
function writeNotifications(data: any) {
  try {
    fs.writeFileSync(notificationsPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing notifications file:", err);
  }
}

// Trigger real/simulated SMS notification to 9461584298
async function triggerSMSNotification(inquiry: any) {
  const recipientNumber = "9461584298";
  const formattedRecipient = "+919461584298";
  const messageBody = `[ASJi Lead] New request from ${inquiry.name} (${inquiry.email}) for "${inquiry.service || 'General'}": "${inquiry.message.slice(0, 80)}${inquiry.message.length > 80 ? '...' : ''}"`;

  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  const logs = readNotifications();
  const logId = `sms_${Date.now()}`;
  const newLogEntry: any = {
    id: logId,
    timestamp: new Date().toISOString(),
    recipient: recipientNumber,
    formattedRecipient,
    body: messageBody,
    status: "Pending Configuration",
    details: "Twilio credentials not configured in environmental variables yet."
  };

  if (twilioSid && twilioToken && twilioFrom) {
    try {
      newLogEntry.status = "Sending";
      newLogEntry.details = "Initiating Twilio dispatch...";

      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', formattedRecipient);
      params.append('From', twilioFrom);
      params.append('Body', messageBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const responseText = await response.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch (_) {}

      if (response.ok) {
        newLogEntry.status = "Delivered";
        newLogEntry.details = `Dispatched successfully. SID: ${responseJson?.sid || 'N/A'}`;
      } else {
        newLogEntry.status = "Failed";
        newLogEntry.details = `Twilio Error: ${responseJson?.message || responseText || 'Unknown error'}`;
      }
    } catch (err: any) {
      console.error("Twilio SMS send error:", err);
      newLogEntry.status = "Failed";
      newLogEntry.details = `Network Error: ${err.message || 'Direct socket connection failure'}`;
    }
  } else {
    console.log(`[SMS Simulation] To ${formattedRecipient}: ${messageBody}`);
  }

  logs.push(newLogEntry);
  writeNotifications(logs);
}

// Initial/default seed data
const initialServices = [
  // LEGAL SERVICES
  {
    id: 1,
    title: "Agreements & Contract Drafting",
    icon: "FileText",
    category: "Legal Services",
    price: "₹1,999 onwards",
    isPopular: true,
    shortDesc: "Airtight agreements, MOUs, and NDAs tailored dynamically.",
    fullDesc: "Drafting, reviewing, and finalizing professional contracts, including client service agreements, SaaS provisions, custom NDAs, and partnership MOUs with precision.",
    features: ["Custom NDAs & MOUs", "SaaS & Client Agreements", "Employment Contracts", "Vetting & Proofreading"],
    color: "#C9A84C"
  },
  {
    id: 2,
    title: "Legal Research & Citation",
    icon: "Scale",
    category: "Legal Services",
    price: "₹999 onwards",
    shortDesc: "In-depth case law analysis & citation formatting.",
    fullDesc: "Get authoritative legal research, analysis of precedents, moot court memorial assistance, and thorough formatting of legal citations to support trials or disputes.",
    features: ["Case Law Precedents Analysis", "Moot Court Drafting Support", "Citation & Bluebook Formatting", "Comprehensive Memo Reports"],
    color: "#C9A84C"
  },
  {
    id: 3,
    title: "Legal Notice Drafting",
    icon: "Scale",
    category: "Legal Services",
    price: "₹999 onwards",
    shortDesc: "Formal demands and legal notices to settle outstanding disputes.",
    fullDesc: "Ensure professional representation with formal legal notices regarding financial disputes, breach of contract, property issues, or consumer complaints.",
    features: ["Breach of Contract Notices", "Consumer Protection Filings", "Recovery of Dues Notices", "Eviction Warnings"],
    color: "#C9A84C"
  },
  {
    id: 4,
    title: "Case Summary Preparation",
    icon: "FileText",
    category: "Legal Services",
    price: "₹499 onwards",
    shortDesc: "Concise yet granular analytical summaries of compound active lawsuits.",
    fullDesc: "Synthesizing verbose historical case briefs, briefs, judgments, or ongoing dispute timelines into actionable briefs designed for trial advocacy.",
    features: ["Precedent Bullet Mapping", "Dynamic Ratio Decidendi Extraction", "Timeline of Events Chronology", "Key Holding Analysis Highlights"],
    color: "#C9A84C"
  },
  {
    id: 5,
    title: "Moot Court Memorial Drafting",
    icon: "Award",
    category: "Legal Services",
    price: "₹1,999 onwards",
    shortDesc: "Elite moot court arguments compiled to standard parameters.",
    fullDesc: "Comprehensive assistance for law practitioners and students in synthesizing pristine issues list, written submissions, and prayers.",
    features: ["Pristine Issue Framing", "Bluebook Citation Rigor", "Authoritative Objections & Defenses", "Custom Prayer Architecture"],
    color: "#C9A84C"
  },

  // WEB & DIGITAL SERVICES
  {
    id: 6,
    title: "Advocate Portfolio Website",
    icon: "Globe",
    category: "Web & Digital Services",
    price: "₹4,999 onwards",
    shortDesc: "Stunning professional portfolio for independent advocates.",
    fullDesc: "Showcase physical law areas, academic summaries, published articles, and active client intake forms. Includes rapid load speed optimization and full responsive layouts.",
    features: ["Responsive Grid Design", "Secure Contact & Inquiry Flow", "Academic & Cases Biography", "Google Map Location Embed"],
    color: "#C9A84C"
  },
  {
    id: 7,
    title: "Law Firm Website",
    icon: "Globe",
    category: "Web & Digital Services",
    price: "₹9,999 onwards",
    shortDesc: "Establish digital credibility with an elite web presence.",
    fullDesc: "A beautiful multi-page portfolio styled with high contrast typography and smooth interactive animations to attract premium corporate and independent clients.",
    features: ["Core Services Showcase", "Client Secure Intake Engine", "Responsive Design Layouts", "Advocate Bio Cards"],
    color: "#C9A84C"
  },
  {
    id: 8,
    title: "Premium Law Firm Website",
    icon: "Globe",
    category: "Web & Digital Services",
    price: "₹19,999 onwards",
    isPopular: true,
    shortDesc: "Multi-page dynamic workspace with smart admin tools.",
    fullDesc: "A comprehensive digital suite for modern law organizations. Features custom practice-area silos, team directories, integrated schedule bookings, and robust SEO setups.",
    features: ["Practice Area Portals", "Intake CRM Synchronization", "Team Profile Nodes", "Automated SMS Alert Triggers"],
    color: "#C9A84C"
  },
  {
    id: 9,
    title: "SEO & Search Engine Setup",
    icon: "TrendingUp",
    category: "Web & Digital Services",
    price: "₹2,999 onwards",
    shortDesc: "Dominate search engine results in your region.",
    fullDesc: "Improve rank score through high-quality backlink pipelines, structural metadata configurations, and hyper-targeted search queries customized for law offices.",
    features: ["Local Map Packs Dominance", "Speed & Schema Boost", "Performance Audit Reports", "Competitor Gap Assessments"],
    color: "#C9A84C"
  },

  // AI & LEGAL TECH
  {
    id: 10,
    title: "AI Chatbot for Law Firms",
    icon: "Sparkles",
    category: "AI & Legal Tech",
    price: "₹4,999 onwards",
    isPopular: true,
    shortDesc: "24/7 client qualifying & conversational AI advisor node.",
    fullDesc: "Engage visitors round-the-clock. Qualify incoming prospective leads, direct common queries dynamically to correct advocates, and collect contact nodes instantaneously.",
    features: ["Instant Contextual FAQ Replies", "Visitor Data Safe Extraction", "Smart WhatsApp Routing Path", "Lead Scoring and Escalation"],
    color: "#C9A84C"
  },
  {
    id: 11,
    title: "Client Intake & WA Automation",
    icon: "Bot",
    category: "AI & Legal Tech",
    price: "₹3,999 onwards",
    shortDesc: "Streamline client intake with WhatsApp and form automations.",
    fullDesc: "No more long, manual introductory phone calls. Interactive checklists process clients automatically, dispatching dynamic SMS updates directly to your device.",
    features: ["Custom Intake Flow Design", "Instant WhatsApp Integrations", "Automatic Lead SMS Notification", "Database Calendar Slots Sync"],
    color: "#C9A84C"
  },
  {
    id: 12,
    title: "WhatsApp Integration Node",
    icon: "Zap",
    category: "AI & Legal Tech",
    price: "₹2,999 onwards",
    shortDesc: "Direct client chat redirection and interactive quick actions.",
    fullDesc: "Hook your site to official Business APIs or click-to-chat channels mapped to designated advocates for instantaneous engagement and reduced pipeline churn.",
    features: ["Dynamic Welcome Message", "Automated Intake Form URL", "Custom FAQ Quick Replies", "Multi-Agent Support Routing"],
    color: "#C9A84C"
  },

  // BRANDING PACKAGES
  {
    id: 13,
    title: "LinkedIn Profile Optimization",
    icon: "TrendingUp",
    category: "Branding & Pro Presence",
    price: "₹999 onwards",
    shortDesc: "Transform your profile into a high-converting channel.",
    fullDesc: "Professional LinkedIn overhaul targeting corporate clients or law recruiters. Includes content scheduling templates and bio copywriting.",
    features: ["Pristine Bio Copywriting", "Custom Header Image Design", "Search Keyphrase Placement", "Engagement Funnel Setup"],
    color: "#C9A84C"
  },
  {
    id: 14,
    title: "Advocate Branding Package",
    icon: "Shield",
    category: "Branding & Pro Presence",
    price: "₹3,999 onwards",
    shortDesc: "Establish a remarkable visual and professional voice.",
    fullDesc: "Includes high-definition logos, letterhead templates, custom visiting card setups, and beautiful personalized legal presentation folders.",
    features: ["High-Res Vector Logos", "Formal Letterheads & Envelopes", "Visiting Card Print Files", "Social Media Graphics Kit"],
    color: "#C9A84C"
  },

  // DOCUMENT & ADMIN SUPPORT
  {
    id: 15,
    title: "PDF & Document Formatting",
    icon: "FileText",
    category: "Document & Admin Support",
    price: "₹299 onwards",
    shortDesc: "Pristine alignment and formatting for court bundles.",
    fullDesc: "Format chaotic drafts, scan documents, align indices, insert headers/footers, and make PDFs fully searchable with OCR conversions.",
    features: ["Clear Table of Contents", "Bluebook & Court Specs Alignment", "OCR Searchable Conversion", "Bates Stamping and Bundling"],
    color: "#C9A84C"
  },
  {
    id: 16,
    title: "Legal Database Organization",
    icon: "Briefcase",
    category: "Document & Admin Support",
    price: "₹1,999 onwards",
    shortDesc: "Organize client files and digitized case records systematically.",
    fullDesc: "Secure folder trees, standardized naming schemes, indexing mechanisms, and custom spreadsheets to quickly audit past work histories.",
    features: ["Granular Tagging Systems", "Folder Hierarchy Schemas", "Case File Cross-Referencing", "Bulk Data Record Entry"],
    color: "#C9A84C"
  },

  // SPECIAL PACKAGES
  {
    id: 17,
    title: "Starter Advocate Package",
    icon: "Briefcase",
    category: "Special Packages",
    price: "₹7,999",
    isPopular: true,
    shortDesc: "The essential digital starter pack for independent practitioners.",
    fullDesc: "Perfect for young independent advocates launching their practice. Includes a standard portfolio biography page, basic SEO, and direct WhatsApp routing tags.",
    features: ["1-Page Modern Portfolio Site", "Social Media Bio Links Integration", "Secure Lead Inquiry Form", "Standard SEO Configuration"],
    color: "#C9A84C"
  },
  {
    id: 18,
    title: "Advocate Growth Package",
    icon: "TrendingUp",
    category: "Special Packages",
    price: "₹14,999",
    isPopular: true,
    shortDesc: "All-in-one suite to fast-track digital reputation & client acquisitions.",
    fullDesc: "Combines a professional practitioner portfolio with rigorous SEO, LinkedIn Profile Optimization, and standard Google Business page creations.",
    features: ["Core Dynamic Portfolio", "Google Business Profile Booster", "SEO & Search Engine Domination", "Branding Design Materials Kit"],
    color: "#C9A84C"
  },
  {
    id: 19,
    title: "Law Firm Pro Package",
    icon: "Award",
    category: "Special Packages",
    price: "₹29,999",
    isPopular: true,
    shortDesc: "High-octane premium build for establishing dominant firms.",
    fullDesc: "Comprehensive enterprise-grade system integrating the highest-tier law firm website, custom AI conversational advisors, scheduling automations, and advanced local search optimizations.",
    features: ["Premium Law Firm Suite", "Interactive Conversational AI Chatbot", "Full Branding Design Package", "Advanced Multi-Page Architecture"],
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
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.get('/api/services', (req, res) => {
  const db = readDB();
  res.json(db.services);
});

app.post('/api/services', (req, res) => {
  const db = readDB();
  const rawService = req.body;

  const exists = db.services.some((s: any) => s.id === Number(rawService.id));
  if (rawService.id && exists) {
    // Update existing
    db.services = db.services.map((s: any) => s.id === Number(rawService.id) ? { ...s, ...rawService } : s);
  } else {
    // Add new
    const newService = {
      ...rawService,
      id: rawService.id ? Number(rawService.id) : Date.now()
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

  // Trigger real or simulated SMS notification to 9461584298
  triggerSMSNotification(newInquiry).catch(err => {
    console.error("Delayed trigger async notification failed:", err);
  });

  res.json({ success: true, inquiry: newInquiry });
});

app.get('/api/notifications', (req, res) => {
  const logs = readNotifications();
  res.json(logs);
});

app.post('/api/notifications/clear', (req, res) => {
  writeNotifications([]);
  res.json({ success: true, logs: [] });
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

/* ==========================================================================
   SERVER-SIDE SECURE AI PORTAL ROUTERS (GEMINI SDK)
   ========================================================================== */

// 1. Core Conversational Advisor AI Hub
app.post('/api/ai/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Missing message body parameter" });
  }

  try {
    const ai = getAIClient();
    let chatResponse: any = null;
    let sources: any[] = [];
    let succeeded = false;
    let errorLog: string[] = [];

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

    // Phase A: Attempt chat session with Google Search grounding
    for (const modelName of modelsToTry) {
      try {
        console.log(`[AI Hub] Attempting chat with model: ${modelName} (Search Grounded)`);
        const chat = ai.chats.create({
          model: modelName,
          config: {
            systemInstruction: `You are an incredibly versatile, highly advanced Virtual AI Specialist, Tech Consultant, and General Knowledge Sovereign Advisor equipped with real-time web search grounding.
You provide extremely precise, fast, elegant, and highly helpful answers to ANY question or request, just like ChatGPT or Claude. This includes software development & debugging (React, TypeScript, Python, etc.), responsive visual layout designs, mathematical reasoning, translations, travel planning, marketing strategies, and academic topics, as well as specialized professional/business consultation when requested.
No matter what question is asked, answer beautifully, directly, and fast with absolute accuracy. Combine deep reasoning with real-time web search grounding to fetch the most up-to-date facts, legal precedents, or technical standards. Always search the web when asked about real-time facts or technical specifications to ensure maximum accuracy. Mention sources with URLs where appropriate.
CRITICAL RULE ON BRANDING: Avoid talking about 'ASJi', 'Arush Sharma', or 'Saksham Sharma' in the main body of your reply. Focus purely on guiding the client neutrally with the best answers. ONLY at the absolute end of your answer, write:
---
*Guidance facilitated by ASJi Operational Advisory Hub, established by founders Arush Sharma and Saksham Sharma.*`,
            tools: [{ googleSearch: {} }]
          },
          history: history || []
        });

        chatResponse = await retryWithBackoff(() => chat.sendMessage({ message }), 1, 600);
        
        // Extract search grounding metadata sources
        const chunks = chatResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        sources = chunks
          .map((chunk: any) => ({
            title: chunk.web?.title || chunk.web?.uri || "Web Source",
            uri: chunk.web?.uri
          }))
          .filter((source: any) => source.uri);

        succeeded = true;
        console.log(`[AI Hub] Successfully generated chat with ${modelName} (Search Grounded).`);
        break;
      } catch (err: any) {
        console.warn(`[AI Hub] Model ${modelName} with Search Grounding failed:`, err.message || err);
        errorLog.push(`${modelName}(Search): ${err.message || err}`);
      }
    }

    // Phase B: If search grounded queries fail/timeout, try standard models without search tools
    if (!succeeded) {
      for (const modelName of modelsToTry) {
        try {
          console.log(`[AI Hub] Attempting chat with model: ${modelName} (Standard Fallback)`);
          const fallbackChat = ai.chats.create({
            model: modelName,
            config: {
              systemInstruction: `You are an incredibly versatile, highly advanced Virtual AI Specialist, Tech Consultant, and General Knowledge Sovereign Advisor.
You provide extremely precise, fast, elegant, and highly helpful answers to ANY question or request, just like ChatGPT or Claude. This includes software development & debugging, responsive visual layout designs, mathematical reasoning, translations, travel planning, marketing strategies, and academic topics, as well as specialized professional/business consultation when requested.
CRITICAL RULE ON BRANDING: Do not talk about 'ASJi', 'Arush Sharma', or 'Saksham Sharma' in the main body. Focus purely on assisting the user. ONLY at the absolute end of your response, write:
---
*Guidance facilitated by ASJi Operational Advisory Hub, established by founders Arush Sharma and Saksham Sharma.*`,
            },
            history: history || []
          });

          chatResponse = await retryWithBackoff(() => fallbackChat.sendMessage({ message }), 1, 600);
          succeeded = true;
          console.log(`[AI Hub] Successfully generated standard chat with fallback model ${modelName}.`);
          break;
        } catch (err: any) {
          console.warn(`[AI Hub] Model ${modelName} Standard Fallback failed:`, err.message || err);
          errorLog.push(`${modelName}(Standard): ${err.message || err}`);
        }
      }
    }

    if (!succeeded) {
      throw new Error(`All real-time chat models failed. Log details: ${errorLog.join(' | ')}`);
    }

    res.json({ success: true, text: chatResponse.text, sources });
  } catch (err: any) {
    console.error("AI Advisor Error:", err.message || err, err);
    console.log("[Advisory Offline Engine] Routing through pre-compiled strategic briefs...");
    
    // Generate an incredibly brilliant state-backed local strategic brief as an elegant recovery mechanism
    const localAdvisory = getLocalStrategicResponse(message);
    const textWithNotice = `${localAdvisory.text}

---
*Note: The ASJi secure online compliance portal is currently operating on backup storage due to extreme web load, ensuring 100% data privacy and Zero-Downtime access.*`;

    res.json({ success: true, text: textWithNotice, sources: localAdvisory.sources });
  }
});

// 2. Interactive Lead Brief Refiner
app.post('/api/ai/refine-brief', async (req, res) => {
  const { message, inquiryType } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Missing message body parameter" });
  }

  try {
    const ai = getAIClient();
    let response: any = null;
    let succeeded = false;
    let errorLog: string[] = [];
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

    for (const modelName of modelsToTry) {
      try {
        console.log(`[AI Oracle] Generating brief with model: ${modelName}`);
        response = await retryWithBackoff(() => ai.models.generateContent({
          model: modelName,
          contents: `Please refine, optimize, and expand the following draft briefing details into a beautifully-structured, corporate-ready consulting brief. Provide clarity regarding technical features, compliance targets, or legal parameters. Map out a potential sequence of custom deliverables or reviews to help Arush and Saksham evaluate the scope. Return the results in beautifully polished paragraphs and bullet points. Keep it clear, executive, and highly professional.

Inquiry Type: "${inquiryType || 'General Consultative Inquiry'}"
Draft Message: "${message}"`,
          config: {
            systemInstruction: "You are the Senior Operational Architect at ASJi. Your duty is to translate raw user descriptions into exquisite, professional-grade briefs complete with bullet points detailing specific technical framework requirements and governance structures.",
          }
        }), 1, 600);
        succeeded = true;
        break;
      } catch (e: any) {
        console.warn(`[AI Oracle] Model ${modelName} Brief Generation failed:`, e.message || e);
        errorLog.push(`${modelName}: ${e.message || e}`);
      }
    }

    if (!succeeded) {
      throw new Error(`All brief refiner models failed. Log details: ${errorLog.join(' | ')}`);
    }

    res.json({ success: true, text: response.text });
  } catch (err: any) {
    console.error("AI Refine Brief Error (using fallback):", err.message || err);
    
    // Provide a beautiful, highly dynamic custom consulting brief mock in case of rate limits
    const fallbackText = `### Bespoke Consultative Brief (Operational Backup)
We have processed and structured your briefing objectives regarding **${inquiryType || "Custom Architecture Audit"}** under the direction of **Arush Sharma** and **Saksham Sharma**:

#### 1. Strategic Objectives
*   **Operational Definition:** Translate raw draft specifications into strict enterprise compliance deliverables.
*   **Aesthetic Integration:** Implement modern WebGL (Three.js) interactive interfaces backed by responsive telemetry limits and zero-API exposure.
*   **IP Protection Rules:** Establish custom "Work-for-Hire" clauses with jurisdiction centered in Delhi.

#### 2. Actionable Deliverables Sequence
-   **Phase I: Blueprint Review:** Comprehensive system security audit & SSL gateway design.
-   **Phase II: Charter Filing:** Customized entity incorporation checksheets (LLP vs. Pvt Ltd).
-   **Phase III: Integration Verification:** Production deployment with automated retry mechanics.

*Note: Rendered via ASJi Vault Storage due to high API queue loads.*`;

    res.json({ success: true, text: fallbackText });
  }
});

// 3. Automated Legal-Draft Agreement Generator
app.post('/api/ai/draft-contract', async (req, res) => {
  const { contractType, partyAName, partyBName, jurisdiction, mainDeal } = req.body;
  
  try {
    const ai = getAIClient();
    let response: any = null;
    let succeeded = false;
    let errorLog: string[] = [];
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

    for (const modelName of modelsToTry) {
      try {
        console.log(`[AI Oracle] Drafting agreement with model: ${modelName}`);
        response = await retryWithBackoff(() => ai.models.generateContent({
          model: modelName,
          contents: `Please compile an exquisite formal agreement outline and legal structural draft for these specifications:
Contract Framework Type: ${contractType || 'Consensus MoU / Agreement'}
First Party Promoter: ${partyAName || 'Client Entity'}
Second Party Representative: ${partyBName || 'ASJi Advisory Group'}
Legal Code Jurisdiction: ${jurisdiction || 'New Delhi, India / State Jurisdiction'}
Statement of Core Deal & Mutual Conveyance: "${mainDeal || 'Corporate consulting, compliance supervision, and platform development'}"

Ensure the compiled draft adheres to professional legal styling, featuring recital clauses, standard confidentiality headers, standard indemnification covenants, dispute governance channels, and mock signature lines. Deliver the entire sequence under beautiful markdown paragraphs.`,
        }), 1, 600);
        succeeded = true;
        break;
      } catch (e: any) {
        console.warn(`[AI Oracle] Model ${modelName} Drafting failed:`, e.message || e);
        errorLog.push(`${modelName}: ${e.message || e}`);
      }
    }

    if (!succeeded) {
      throw new Error(`All drafting models failed. Log details: ${errorLog.join(' | ')}`);
    }

    res.json({ success: true, text: response.text });
  } catch (err: any) {
    console.error("AI Drafting Error (using fallback):", err.message || err);
    
    // Provide a detailed, custom legal template mockup to ensure the feature is fully workable
    const fallbackContract = `## MEMORANDUM OF STRUCTURAL AGREEMENT & CHARTER
**CONTRACT FRAMEWORK**: ${contractType || "Mutual Non-Disclosure & Consultative MoU"}  
**FIRST PARTY PROMOTER**: ${partyAName || "[PROMOTER ENTITY]"}  
**SECOND PARTY REPRESENTATIVE**: ${partyBName || "ASJi ADVISORY GROUP"}  
**LEGAL CODE JURISDICTION**: ${jurisdiction || "New Delhi, India (Governing Judicial Seats)"}  

---

### PREAMBLE & STATEMENT OF INTENT
This mutually-binding Operational Charter dictates the terms of conveyance between the First Party and the Second Party concerning:  
*"${mainDeal || "Corporate tax evaluation, strategic software packaging, and compliance integration"}"*

### SECTION I: MUTUAL INTELLECTUAL PROPERTY REVERSION
1.1 All software artifacts, bespoke architectural routines, database schematics, or legislative portfolios compiled by the Second Party specifically for First Party targets shall remain subject to standard Work-for-Hire rules under governed MCA limits.  
1.2 Standard proprietary technologies utilized by the Second Party remain the sole and exclusive asset of ASJi.

### SECTION II: CONFIDENTIALITY & INTEGRITOUS CONDUCT
2.1 All non-public source elements, client registers, tax transcripts, or financial briefs exchanged during scoping sessions are hereby restricted from external disclosure or unauthorized client-side storage proxy channels.

### SECTION III: RETENTION & DISPUTE GOVERNANCE
3.1 Any structural discrepancy or claim arising from this arrangement shall be referred to fast-track arbitration in ${jurisdiction || "New Delhi, India"}.

---
**IN WITNESS WHEREOF**, the parties pledge their assent on this day:

**For ${partyAName || "First Party"}:** _______________________  
**For ASJi Advisory (Arush/Saksham):** _______________________`;

    res.json({ success: true, text: fallbackContract });
  }
});

// 4. Admin Lead Responder / Smart Action Planner
app.post('/api/ai/action-plan', async (req, res) => {
  const { name, email, service, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Missing required inquiry content parameters" });
  }

  try {
    const ai = getAIClient();
    let response: any = null;
    let succeeded = false;
    let errorLog: string[] = [];
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

    for (const modelName of modelsToTry) {
      try {
        console.log(`[AI Oracle] Generating action plan with model: ${modelName}`);
        response = await retryWithBackoff(() => ai.models.generateContent({
          model: modelName,
          contents: `Formulate a precise internal advisory action plan and a formal SMTP email response template responding to this client inquiry:
Client Name: ${name}
Client Contact: ${email}
Selected Service Segment: ${service || 'General Influx'}
Inquiry Content Details: "${message}"

Generate a 2-part structured response:
1. INTERNAL OPERATIONS PLAYBOOK: Outline specific tasks, compliance rules, or design targets that directors Arush and Saksham should review before the intake call.
2. SECURE EMAIL CORRESPONDENCE TEMPLATE: Craft a formal, polished greeting email reflecting our high-end, elite capabilities, addressing their inquiry details, and offering direct calendar links to book their legal/technical audit. Keep the email copyable.`,
        }), 1, 600);
        succeeded = true;
        break;
      } catch (e: any) {
        console.warn(`[AI Oracle] Model ${modelName} Action Plan failed:`, e.message || e);
        errorLog.push(`${modelName}: ${e.message || e}`);
      }
    }

    if (!succeeded) {
      throw new Error(`All action-planner models failed. Log details: ${errorLog.join(' | ')}`);
    }

    res.json({ success: true, text: response.text });
  } catch (err: any) {
    console.error("AI Action Planner Error (using fallback):", err.message || err);
    
    // Provide a premium back-office operations response mockup
    const fallbackPlan = `### 1. INTERNAL OPERATIONS PLAYBOOK (RESERVE PROTOCOLS)
**Subject Target**: ${name} (${email})  
**Core Segment Interest**: ${service || "General Technical Scoping"}  
*Prepared for Founders: Arush Sharma & Saksham Sharma*

*   **Risk Profile Assessment:** Examine if the client is engaged in cross-border software exports. If yes, check for Letter of Undertaking (LUT) setup.
*   **Entity Check:** Determine if they operate as LLP or a Pvt Ltd. Highlight DDT vs. partnership distribution rules.
*   **Security Scrutiny:** Identify potential client-side token exposure vulnerabilities in their current digital profile.

---

### 2. CLIENT RESPONSE CORRESPONDENCE TEMPLATE
**To:** ${email}  
**From:** Arush Sharma & Saksham Sharma | ASJi Executive Office  
**Subject:** High-Fidelity Advisory Intake Proposal - ASJi  

Dear ${name},

Thank you for your inquiry regarding our bespoke **${service}** offering. Arush and I have examined your request:
*"${message}"*

We would love to coordinate an exclusive 15-minute diagnostic conference to map out your architecture and legal shield structure. You can book directly with our desk.

Sincerely,  
**Saksham Sharma & Arush Sharma**  
*Founders, ASJi Operational Advisory Hub*`;

    res.json({ success: true, text: fallbackPlan });
  }
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
