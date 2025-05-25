import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from './components/Loader';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HospitalPriceDashboard from './pages/HospitalPriceDashboard';
import UserFeedbackAnalytics from './pages/UserFeedbackAnalytics';
import MemberHealthCopilotDashboard from './pages/MemberHealthCopilotDashboard';
import NotFound from './pages/NotFound';

interface ApiData {
  selectedUseCase: string;
}

const useCaseRoutes: Record<string, string> = {
  'Healthcare Price Transparency': '/hospital',
  'User Feedback Analysis Dashboard': '/feedback',
  'Member Dashboard': '/memberdashboard',
  'Voice enabled Healthcare Price Transparency': '/voice-enabled'
};

export default function App() {
  const { isLoading: authLoading, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const navigate = useNavigate();

  // Combined loading state
  const isLoading = authLoading || apiLoading;

  // Get API data after authentication
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && !apiData) {
        try {
          const claims = await getIdTokenClaims();
          const org = claims?.org_name || claims?.['https://yourdomain/org_name'] || '';
          const response = await fetch(
            `${process.env.REACT_APP_API_BUILDER_HOST}/retrieve/${encodeURIComponent(org)}`
          );
          
          if (!response.ok) throw new Error('API failed');
          const data = await response.json();
          
          setApiData(data);
          setApiLoading(false);
          
          // Redirect to proper route if not already there
          const targetPath = useCaseRoutes[data.selectedUseCase] || '/dashboard';
          if (window.location.pathname !== targetPath) {
            navigate(targetPath, { replace: true });
          }
        } catch (error) {
          console.error(error);
          navigate('/404');
        }
      }
    };

    fetchData();
  }, [isAuthenticated, apiData, navigate, getIdTokenClaims]);

  if (isLoading) return <Loader message="Loading application..." />;

  return (
    <Layout selectedUseCase={apiData?.selectedUseCase}>
      <Routes>
        <Route path="/" element={<Navigate to={apiData ? useCaseRoutes[apiData.selectedUseCase] : '/dashboard'} replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hospital" element={<HospitalPriceDashboard />} />
        <Route path="/feedback" element={<UserFeedbackAnalytics />} />
        <Route path="/memberdashboard" element={<MemberHealthCopilotDashboard />} />
        <Route path="/voice-enabled" element={<div>Voice Enabled View</div>} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
