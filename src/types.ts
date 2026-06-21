export interface Service {
  id: number;
  title: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  color?: string;
  category?: string;
  price?: string;
  isPopular?: boolean;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  service: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  date: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
  technologies?: string[];
  metrics?: { label: string; value: string }[];
  longDescription?: string;
  mockAppType?: 'portal' | 'marketplace' | 'editor' | 'charts' | 'website' | 'advisor';
}
