'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  const refreshTenants = () => {
    const list = TenantStore.getAllTenants();
    setTenants(list);
  };

  const loadTenantBySlug = (slug: string): Tenant | null => {
    const found = TenantStore.getTenantBySlug(slug);
    if (found) {
      setCurrentTenant(found);
      return found;
    }
    return null;
  };

  const setCurrentTenantDirectly = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    TenantStore.updateTenant(tenant.slug, tenant);
  };

  useEffect(() => {
    refreshTenants();
    if (initialSlug) {
      loadTenantBySlug(initialSlug);
    }
  }, [initialSlug]);

  const updateCurrentTenantConfig = (newConfig: Partial<AppConfig>) => {
    if (!currentTenant) return;
    const updatedConfig = { ...currentTenant.config, ...newConfig };
    const updatedTenant: Tenant = {
      ...currentTenant,
      config: updatedConfig,
      sitePassword: newConfig.sitePassword || currentTenant.sitePassword
    };

    setCurrentTenant(updatedTenant);
    TenantStore.updateTenantConfig(currentTenant.slug, newConfig);
  };

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
