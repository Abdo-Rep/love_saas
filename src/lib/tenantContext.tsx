import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tenant } from '@/types/tenant';
import { AppConfig } from '@/types/config';
import { TenantStore } from './tenantStore';

interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  loadTenantBySlug: (slug: string) => Tenant | null;
  setCurrentTenantDirectly: (tenant: Tenant) => void;
  updateCurrentTenantConfig: (newConfig: Partial<AppConfig>) => void;
  refreshTenants: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode; initialSlug?: string }> = ({
  children,
  initialSlug = 'rawda'
}) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(() => {
    if (initialSlug) {
      return TenantStore.getTenantBySlug(initialSlug);
    }
    return null;
  });

  const refreshTenants = useCallback(() => {
    const list = TenantStore.getAllTenants();
    setTenants(list);
  }, []);

  const loadTenantBySlug = useCallback((slug: string): Tenant | null => {
    const found = TenantStore.getTenantBySlug(slug);
    if (found) {
      setCurrentTenant(found);
      return found;
    }
    return null;
  }, []);

  const setCurrentTenantDirectly = useCallback((tenant: Tenant) => {
    setCurrentTenant(tenant);
    TenantStore.updateTenant(tenant.slug, tenant);
  }, []);

  useEffect(() => {
    refreshTenants();
    if (initialSlug) {
      loadTenantBySlug(initialSlug);
    }
  }, [initialSlug, refreshTenants, loadTenantBySlug]);

  const updateCurrentTenantConfig = useCallback((newConfig: Partial<AppConfig>) => {
    setCurrentTenant((prev) => {
      if (!prev) return null;
      const updatedConfig = { ...prev.config, ...newConfig };
      const newAdminPass = newConfig.adminPassword ?? prev.adminPassword ?? prev.config?.adminPassword ?? '';
      const newSitePass = newConfig.sitePassword ?? prev.sitePassword ?? prev.config?.sitePassword ?? '';

      const updatedTenant: Tenant = {
        ...prev,
        adminPassword: newAdminPass,
        sitePassword: newSitePass,
        config: {
          ...updatedConfig,
          adminPassword: newAdminPass,
          sitePassword: newSitePass
        }
      };

      TenantStore.updateTenantConfig(prev.slug, newConfig);
      return updatedTenant;
    });
  }, []);

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        tenants,
        loadTenantBySlug,
        setCurrentTenantDirectly,
        updateCurrentTenantConfig,
        refreshTenants
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
};
