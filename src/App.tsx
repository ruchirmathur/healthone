import React, { useEffect, useState } from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AutoLogin } from './pages/AutoLogin';
import Dashboard from './pages/Dashboard';
import HospitalPriceDashboard from './pages/HospitalPriceDashboard';
import UserFeedbackAnalytics from './pages/UserFeedbackAnalytics';
import MemberHealthCopilotDashboard from './pages/MemberHealthCopilotDashboard';
import { AuthenticationGuard } from './pages/authentication-guard';
import NotFound from './pages/NotFound';
import './App.css';

interface TenantConfig {
  id: string;
  TenantId: string;
  appName: string;
  selectedUseCase: string;
  color: string;
}

interface RouteConfig {
  path: string;
  label: string;
}

const useCaseRoutes: Record<string, RouteConfig[]> = {
  "User Feedback Analysis Dashboard": [
    { path: "/feedback", label: "User Feedback" }
  ],
  "Hospital Price Dashboard": [
    { path: "/hospital", label: "Hospital Prices" }
  ],
  "Member Health Copilot Dashboard": [
    { path: "/memberdashboard", label: "Member Health Copilot" }
  ],
  "Default": [
    { path: "/dashboard", label: "Dashboard" }
  ]
};

function App() {
  const { isLoading: authLoading, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const claims = await getIdTokenClaims();
        const orgNameFromClaims = claims?.org_name;
        
        if (!orgNameFromClaims) {
          throw new Error('Organization name not found in claims');
        }

        setOrgName(orgNameFromClaims);

        const apiHost = process.env.REACT_APP_API_HOST || '';
        const response = await fetch(
          `${apiHost}/retrieve/${encodeURIComponent(orgNameFromClaims)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TenantConfig = await response.json();
        setTenantConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
        setTenantConfig(null);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, getIdTokenClaims]);

  if (authLoading || loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const selectedUseCase = tenantConfig?.selectedUseCase || 'Default';
  const links = useCaseRoutes[selectedUseCase] || useCaseRoutes.Default;

  return (
    <Routes>
      <Route path="/" element={<AutoLogin />} />
      <Route path="/callback" element={<div>Processing login...</div>} />
      <Route element={
        <AuthenticationGuard component={() => (
          <ProtectedLayout 
            tenantConfig={tenantConfig}
            links={links}
            orgName={orgName}
          />
        )} />
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hospital" element={<HospitalPriceDashboard />} />
        <Route path="/feedback" element={<UserFeedbackAnalytics />} />
        <Route path="/memberdashboard" element={<MemberHealthCopilotDashboard />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

interface ProtectedLayoutProps {
  tenantConfig: TenantConfig | null;
  links: RouteConfig[];
  orgName: string;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ 
  tenantConfig, 
  links,
  orgName 
}) => (
  <div className="app-container">
    <Header 
      orgName={orgName || tenantConfig?.appName || ''}
      tenantId={tenantConfig?.TenantId || ''}
      color={tenantConfig?.color || '#2155CD'}
    />
    <Sidebar links={links} />
    <div className="main-content">
      <Outlet />
    </div>
  </div>
);

export default App;
