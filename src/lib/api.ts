import { Service, Inquiry } from '../types';

// Default initial state matching the back-end seed data
const initialServices: Service[] = [
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

const initialInquiries: Inquiry[] = [
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
    service: "SEO & Digital Marketing",
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

// LocalStorage helpers to simulate database operations on purely static hosts
const STORAGE_SERVICES_KEY = 'asji_local_services_v3';
const STORAGE_INQUIRIES_KEY = 'asji_local_inquiries';

function getLocalServices(): Service[] {
  const data = localStorage.getItem(STORAGE_SERVICES_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(initialServices));
    return initialServices;
  }
  return JSON.parse(data);
}

function saveLocalServices(services: Service[]) {
  localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(services));
}

function getLocalInquiries(): Inquiry[] {
  const data = localStorage.getItem(STORAGE_INQUIRIES_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(initialInquiries));
    return initialInquiries;
  }
  return JSON.parse(data);
}

function saveLocalInquiries(inquiries: Inquiry[]) {
  localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(inquiries));
}

// Local storage notifications simulation
const STORAGE_NOTIFICATIONS_KEY = 'asji_local_notifications';

function getLocalNotifications(): any[] {
  const data = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

function saveLocalNotifications(notifications: any[]) {
  localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function simulateLocalSMSNotification(inquiry: any) {
  const recipientNumber = "9461584298";
  const formattedRecipient = "+919461584298";
  const messageBody = `[ASJi Lead] New request from ${inquiry.name} (${inquiry.email}) for "${inquiry.service || 'General'}": "${inquiry.message.slice(0, 80)}${inquiry.message.length > 80 ? '...' : ''}"`;
  
  const currentLogs = getLocalNotifications();
  currentLogs.push({
    id: `sms_local_${Date.now()}`,
    timestamp: new Date().toISOString(),
    recipient: recipientNumber,
    formattedRecipient,
    body: messageBody,
    status: "Pending Configuration (Client Static Simulation)",
    details: "Using local mock client persistence. Configure TWILIO environmental variables on the server to send real SMS."
  });
  saveLocalNotifications(currentLogs);
}

// Detect if we are running in a static deployment (Vercel) where API routes aren't served by Node.js.
// We can test the API endpoint quickly or rely on transparent fallback on catch.
export const apiService = {
  // SERVICES ENDPOINTS
  getServices: async (): Promise<Service[]> => {
    try {
      const res = await fetch(`/api/services?t=${Date.now()}`);
      if (!res.ok) throw new Error('API server unavailable');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('API returned HTML instead of JSON');
      }
      const data = await res.json();
      if (Array.isArray(data)) return data;
      return getLocalServices();
    } catch (err) {
      console.warn('API fetch failed, reading services from local storage fallback:', err);
      return getLocalServices();
    }
  },

  addService: async (service: Omit<Service, 'id'>): Promise<Service[]> => {
    const rawService = { ...service, id: Date.now() };
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rawService)
      });
      if (!res.ok) throw new Error('API write failed');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('API returned HTML instead of JSON');
      }
      const data = await res.json();
      // Keep local storage updated too!
      const current = getLocalServices();
      current.push({ ...rawService });
      saveLocalServices(current);
      return data.services || current;
    } catch (err) {
      console.warn('API POST failed, updating local services store:', err);
      const current = getLocalServices();
      current.push({ ...rawService });
      saveLocalServices(current);
      return current;
    }
  },

  updateService: async (id: number, service: Omit<Service, 'id'>): Promise<Service[]> => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });
      if (!res.ok) throw new Error('API update failed');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('API returned HTML instead of JSON');
      }
      const data = await res.json();
      // Sync local storage
      const current = getLocalServices().map(s => s.id === id ? { ...service, id } : s);
      saveLocalServices(current);
      return data.services || current;
    } catch (err) {
      console.warn('API PUT failed, updating local services store:', err);
      const current = getLocalServices().map(s => s.id === id ? { ...service, id } : s);
      saveLocalServices(current);
      return current;
    }
  },

  deleteService: async (id: number): Promise<Service[]> => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('API delete failed');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('API returned HTML instead of JSON');
      }
      const data = await res.json();
      // Sync local storage
      const current = getLocalServices().filter(s => s.id !== id);
      saveLocalServices(current);
      return data.services || current;
    } catch (err) {
      console.warn('API DELETE failed, updating local services store:', err);
      const current = getLocalServices().filter(s => s.id !== id);
      saveLocalServices(current);
      return current;
    }
  },

  // INQUIRIES ENDPOINTS
  getInquiries: async (): Promise<Inquiry[]> => {
    try {
      const res = await fetch(`/api/inquiries?t=${Date.now()}`);
      if (!res.ok) throw new Error('API inquiry fetch failed');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('API returned HTML instead of JSON');
      }
      const data = await res.json();
      if (Array.isArray(data)) return data;
      return getLocalInquiries();
    } catch (err) {
      console.warn('API inquiries fetch failed, using local storage fallback:', err);
      return getLocalInquiries();
    }
  },

  addInquiry: async (inquiry: { name: string; email: string; service: string; message: string }): Promise<Inquiry> => {
    const newInquiry: Inquiry = {
      id: Date.now(),
      name: inquiry.name,
      email: inquiry.email,
      service: inquiry.service || "General Inquiry",
      message: inquiry.message,
      status: "New",
      date: new Date().toISOString().split('T')[0]
    };
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry)
      });
      if (!res.ok) throw new Error('API inquiries submission failed');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('API returned HTML instead of JSON');
      }
      const data = await res.json();
      // Keep local storage updated
      const current = getLocalInquiries();
      current.push(newInquiry);
      saveLocalInquiries(current);
      return data.inquiry || newInquiry;
    } catch (err) {
      console.warn('API inquiries write failed, saving to local state:', err);
      const current = getLocalInquiries();
      current.push(newInquiry);
      saveLocalInquiries(current);
      
      // Simulate locally too in offline/static modes
      simulateLocalSMSNotification(newInquiry);
      
      return newInquiry;
    }
  },

  getSMSNotifications: async (): Promise<any[]> => {
    try {
      const res = await fetch(`/api/notifications?t=${Date.now()}`);
      if (!res.ok) throw new Error('API notifications fetch failed');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('API returned HTML instead of JSON');
      }
      const data = await res.json();
      if (Array.isArray(data)) return data;
      return getLocalNotifications();
    } catch (err) {
      console.warn('API notifications fetch failed, reading from local storage:', err);
      return getLocalNotifications();
    }
  },

  clearSMSNotifications: async (): Promise<any[]> => {
    try {
      const res = await fetch('/api/notifications/clear', {
        method: 'POST'
      });
      if (!res.ok) throw new Error('API notifications clear failed');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('API returned HTML instead of JSON');
      }
      const data = await res.json();
      saveLocalNotifications([]);
      return data.logs || [];
    } catch (err) {
      console.warn('API notifications clear failed, resetting local storage:', err);
      saveLocalNotifications([]);
      return [];
    }
  },

  updateInquiryStatus: async (id: number, nextStatus: 'New' | 'Contacted' | 'Closed'): Promise<Inquiry[]> => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error('API update inquiry failed');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('API returned HTML instead of JSON');
      }
      const data = await res.json();
      // Keep local storage synced
      const current = getLocalInquiries().map(iq => iq.id === id ? { ...iq, status: nextStatus } : iq);
      saveLocalInquiries(current);
      return data.inquiries || current;
    } catch (err) {
      console.warn('API inquiry update failed, saving status to local state:', err);
      const current = getLocalInquiries().map(iq => iq.id === id ? { ...iq, status: nextStatus } : iq);
      saveLocalInquiries(current);
      return current;
    }
  },

  deleteInquiry: async (id: number): Promise<Inquiry[]> => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('API inquiry deletion failed');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('API returned HTML instead of JSON');
      }
      const data = await res.json();
      // Keep local storage synced
      const current = getLocalInquiries().filter(iq => iq.id !== id);
      saveLocalInquiries(current);
      return data.inquiries || current;
    } catch (err) {
      console.warn('API inquiry deletion failed, updating local state:', err);
      const current = getLocalInquiries().filter(iq => iq.id !== id);
      saveLocalInquiries(current);
      return current;
    }
  },

  // SECURE SERVER-PROXY AI ADVISOR & COMPLIANCE TOOLS
  askAIAdvisor: async (message: string, history?: any[]): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    if (!res.ok) {
      throw new Error('API AI Chat advisor connection failed');
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Serverless backend not reachable (returned HTML instead of JSON). Please make sure the backend is running or configured on Vercel.');
    }
    const data = await res.json();
    return {
      text: data.text || '',
      sources: data.sources
    };
  },

  refineBriefWithAI: async (message: string, inquiryType: string): Promise<string> => {
    const res = await fetch('/api/ai/refine-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, inquiryType })
    });
    if (!res.ok) {
      throw new Error('API AI Brief refiner failed');
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Serverless backend not reachable (returned HTML instead of JSON).');
    }
    const data = await res.json();
    return data.text || '';
  },

  draftContractWithAI: async (contractType: string, partyAName: string, partyBName: string, jurisdiction: string, mainDeal: string): Promise<string> => {
    const res = await fetch('/api/ai/draft-contract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractType, partyAName, partyBName, jurisdiction, mainDeal })
    });
    if (!res.ok) {
      throw new Error('API AI Draft Generator failed');
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Serverless backend not reachable (returned HTML instead of JSON).');
    }
    const data = await res.json();
    return data.text || '';
  },

  generateAIActionPlan: async (inquiry: Inquiry): Promise<string> => {
    const res = await fetch('/api/ai/action-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: inquiry.name,
        email: inquiry.email,
        service: inquiry.service,
        message: inquiry.message
      })
    });
    if (!res.ok) {
      throw new Error('API AI Action Plan playbook generation failed');
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Serverless backend not reachable (returned HTML instead of JSON).');
    }
    const data = await res.json();
    return data.text || '';
  }
};
