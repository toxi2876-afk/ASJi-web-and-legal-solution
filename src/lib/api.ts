import { Service, Inquiry } from '../types';

// Default initial state matching the back-end seed data
const initialServices: Service[] = [
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
    fullDesc: "We build stunning, high-performance websites and web applications tailored to your business needs (led by Arush Sharma and Saksham Sharma). From landing pages to complex platforms, we deliver digital excellence.",
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
const STORAGE_SERVICES_KEY = 'asji_local_services';
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

// Detect if we are running in a static deployment (Vercel) where API routes aren't served by Node.js.
// We can test the API endpoint quickly or rely on transparent fallback on catch.
export const apiService = {
  // SERVICES ENDPOINTS
  getServices: async (): Promise<Service[]> => {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('API server unavailable');
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
      const res = await fetch('/api/inquiries');
      if (!res.ok) throw new Error('API inquiry fetch failed');
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
      return newInquiry;
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
  }
};
