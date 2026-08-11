import { AppConfig } from './config';

export interface Tenant {
  id: string; // Unique ID (e.g. 'tenant_1720000000000')
  slug: string; // URL Slug ID (e.g. 'rawda', 'nour', 'alex')
  name: string; // Human readable name (e.g. 'نسخة روضة', 'نسخة نور')
  ownerEmail?: string;
  adminPassword: string; // Password to access /admin/[slug]
  sitePassword: string; // Password to access /site/[slug]
  createdAt: string; // ISO date string
  status: 'active' | 'suspended';
  config: AppConfig; // Isolated 9-step romantic experience config for this tenant
}

export interface SuperAdminConfig {
  masterPassword: string;
  platformName: string;
}
