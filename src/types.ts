export interface Service {
  id: number;
  title: string;
  icon: 'Scale' | 'Globe' | 'FileText' | 'TrendingUp';
  shortDesc: string;
  fullDesc: string;
  features: string[];
  color?: string;
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
}
