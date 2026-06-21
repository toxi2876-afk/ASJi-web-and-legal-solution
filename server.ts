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
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Missing message body parameter" });
    }
    const ai = getAIClient();
    
    // Construct chat session with system instruction matching ASJi context
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: "You are the ASJi Virtual AI Executive Advisor, representing an elite boutique software engineering studio combined with expert corporate legal and compliance advisory. You are overseen by ASJi founders Arush Sharma and Saksham Sharma. You provide extremely precise, elegant, and intelligent insights about technical architectures, web security, custom compliance tools, corporate legal procedures, tax structures, filing checklists, and corporate financial advisory. Keep answers executive-ready, highly professional, polite, informative, clean, and in clear markdown style with paragraphs.",
      },
      history: history || []
    });

    const chatResponse = await chat.sendMessage({ message });
    res.json({ success: true, text: chatResponse.text });
  } catch (err: any) {
    console.error("AI Chat Engine Failure:", err);
    res.status(500).json({ success: false, error: err.message || "Engine failure" });
  }
});

// 2. Interactive Lead Brief Refiner
app.post('/api/ai/refine-brief', async (req, res) => {
  try {
    const { message, inquiryType } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Missing message body parameter" });
    }
    const ai = getAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please refine, optimize, and expand the following draft briefing details into a beautifully-structured, corporate-ready consulting brief. Provide clarity regarding technical features, compliance targets, or legal parameters. Map out a potential sequence of custom deliverables or reviews to help Arush and Saksham evaluate the scope. Return the results in beautifully polished paragraphs and bullet points. Keep it clear, executive, and highly professional.

Inquiry Type: "${inquiryType || 'General Consultative Inquiry'}"
Draft Message: "${message}"`,
      config: {
        systemInstruction: "You are the Senior Operational Architect at ASJi. Your duty is to translate raw user descriptions into exquisite, professional-grade briefs complete with bullet points detailing specific technical framework requirements and governance structures.",
      }
    });

    res.json({ success: true, text: response.text });
  } catch (err: any) {
    console.error("AI Refine Brief Error:", err);
    res.status(500).json({ success: false, error: err.message || "Brief optimization error" });
  }
});

// 3. Automated Legal-Draft Agreement Generator
app.post('/api/ai/draft-contract', async (req, res) => {
  try {
    const { contractType, partyAName, partyBName, jurisdiction, mainDeal } = req.body;
    const ai = getAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please compile an exquisite formal agreement outline and legal structural draft for these specifications:
Contract Framework Type: ${contractType || 'Consensus MoU / Agreement'}
First Party Promoter: ${partyAName || 'Client Entity'}
Second Party Representative: ${partyBName || 'ASJi Advisory Group'}
Legal Code Jurisdiction: ${jurisdiction || 'New Delhi, India / State Jurisdiction'}
Statement of Core Deal & Mutual Conveyance: "${mainDeal || 'Corporate consulting, compliance supervision, and platform development'}"

Ensure the compiled draft adheres to professional legal styling, featuring recital clauses, standard confidentiality headers, standard indemnification covenants, dispute governance channels, and mock signature lines. Deliver the entire sequence under beautiful markdown paragraphs.`,
    });

    res.json({ success: true, text: response.text });
  } catch (err: any) {
    console.error("AI Drafting Error:", err);
    res.status(500).json({ success: false, error: err.message || "Drafting pipeline interruption" });
  }
});

// 4. Admin Lead Responder / Smart Action Planner
app.post('/api/ai/action-plan', async (req, res) => {
  try {
    const { name, email, service, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: "Missing required inquiry content parameters" });
    }
    const ai = getAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Formulate a precise internal advisory action plan and a formal SMTP email response template responding to this client inquiry:
Client Name: ${name}
Client Contact: ${email}
Selected Service Segment: ${service || 'General Influx'}
Inquiry Content Details: "${message}"

Generate a 2-part structured response:
1. INTERNAL OPERATIONS PLAYBOOK: Outline specific tasks, compliance rules, or design targets that directors Arush and Saksham should review before the intake call.
2. SECURE EMAIL CORRESPONDENCE TEMPLATE: Craft a formal, polished greeting email reflecting our high-end, elite capabilities, addressing their inquiry details, and offering direct calendar links to book their legal/technical audit. Keep the email copyable.`,
    });

    res.json({ success: true, text: response.text });
  } catch (err: any) {
    console.error("AI Action Planner Error:", err);
    res.status(500).json({ success: false, error: err.message || "Planning service interruption" });
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
