import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from '@/lib/configContext';
import { DynamicManifest } from '@/components/common/DynamicManifest';

import HomePage from '@/pages/HomePage';
import TenantPage from '@/pages/TenantPage';
import AdminPage from '@/pages/AdminPage';
import SuperAdminPage from '@/pages/SuperAdminPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <DynamicManifest />
      <ConfigProvider>
        <Routes>
          {/* Main Home / Secret tap */}
          <Route path="/" element={<HomePage />} />

          {/* Super Admin Control Center */}
          <Route path="/super-admin" element={<SuperAdminPage />} />

          {/* Tenant Admin Dashboard */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/:slug/admin" element={<AdminPage />} />

          {/* Dynamic Romantic Experience Visitor Page */}
          <Route path="/:slug" element={<TenantPage />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  );
}
