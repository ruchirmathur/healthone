import React, { useEffect, useState } from 'react';
import { Route, Routes, Outlet, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AutoLogin } from './pages/AutoLogin';
import Voicechat from './pages/Voicechat';
import Dashboard from './pages/Dashboard';
import HospitalPriceDashboard from './pages/HospitalPriceDashboard';
import UserFeedbackAnalytics from './pages/UserFeedbackAnalytics';
import MemberHealthCopilotDashboard from './pages/MemberHealthCopilotDashboard';
import { AuthenticationGuard } from './pages/authentication-guard';
import NotFound from './pages/NotFound';
import './App.css';

interface ApiData {
  selectedUseCase?: string | string[];
  color?: string;
  appName?: string;
}

function App() {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const [orgName, setOrgName] = useState('');
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims()
        .then(claims => {
          const org = claims?.org_name || claims?.['https://yourdomain/org_name'] || '';
          setOrgName(org);
        })
        .catch(error => {
          console.error('Auth0 claims error:', error);
          navigate('/error');
        });
    }
  }, [isAuthenticated, getIdTokenClaims, navigate]);

  useEffect(() => {
    if (orgName) {
      const apiHost = process.env.REACT_APP_API_BUILDER_HOST;
      setApiLoading(true);

      setTimeout(() => {
        fetch(`${apiHost}/retrieve/${encodeURIComponent(orgName)}`)
          .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
          })
          .then((data: ApiData) => {
            setApiData(data);
            setApiLoading(false);
          })
          .catch(error => {
            console.error('API Error:', error);
            setApiData({ selectedUseCase: [] });
            setApiLoading(false);
          });
      }, 1000);
    }
  }, [orgName]);

  // Normalize selectedUseCase to array
  const allowedUseCases = [
    'Healthcare Underwriter Dashboard',
    'User Feedback Analysis Dashboard',
    'Healthcare Price Transparency',
    'Member Dashboard',
    'Voice enabled Healthcare Price Transparency'
  ];

  const selectedUseCase = apiData?.selectedUseCase
    ? Array.isArray(apiData.selectedUseCase)
      ? apiData.selectedUseCase.filter(uc => allowedUseCases.includes(uc))
      : allowedUseCases.includes(apiData.selectedUseCase)
        ? [apiData.selectedUseCase]
        : []
    : [];

  // Use org display name and color from API if available
  const orgDisplayName = apiData?.appName || orgName || "HealthOne Platform";
  const headerColor = apiData?.color || "#2155CD";

  // Show loading spinner while API is processing
  if (apiLoading) {
    return (
      <div className="custom-loading-bg">
        <div className="custom-spinner"></div>
        <div className="custom-loading-text">Loading your application...</div>
      </div>
    );
  }

  // Layout for protected routes
  const ProtectedLayout = () => (
    <div className="app-container">
      <Header orgName={orgDisplayName} headerColor={headerColor} />
      <div className="app-body">
        <Sidebar selectedUseCase={selectedUseCase} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/autologin" element={<AutoLogin />} />
      <Route path="/callback" element={<div>Processing login...</div>} />
      
      <Route element={<AuthenticationGuard component={ProtectedLayout} />}>
        {selectedUseCase.includes('Healthcare Underwriter Dashboard') && (
          <Route path="/dashboard" element={<Dashboard />} />
        )}
        {selectedUseCase.includes('Healthcare Price Transparency') && (
          <Route path="/hospital" element={<HospitalPriceDashboard />} />
        )}
        {selectedUseCase.includes('User Feedback Analysis Dashboard') && (
          <Route path="/feedback" element={<UserFeedbackAnalytics />} />
        )}
        {selectedUseCase.includes('Voice enabled Healthcare Price Transparency') && (
          <Route path="/voicechat" element={<Voicechat />} />
        )}
        {selectedUseCase.includes('Member Dashboard') && (
          <Route path="/memberdashboard" element={<MemberHealthCopilotDashboard />} />
        )}
        <Route path="/" element={<DefaultLanding selectedUseCase={selectedUseCase} />} />
      </Route>
      
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Redirect "/" to the first allowed use case route
const DefaultLanding: React.FC<{ selectedUseCase: string[] }> = ({ selectedUseCase }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedUseCase.includes('Healthcare Underwriter Dashboard')) {
      navigate('/dashboard', { replace: true });
    } else if (selectedUseCase.includes('Healthcare Price Transparency')) {
      navigate('/hospital', { replace: true });
    } else if (selectedUseCase.includes('User Feedback Analysis Dashboard')) {
      navigate('/feedback', { replace: true });
    } else if (selectedUseCase.includes('Member Dashboard')) {
      navigate('/memberdashboard', { replace: true });
    }else if (selectedUseCase.includes('Voice enabled Healthcare Price Transparency')) {
      navigate('/voicechat', { replace: true });
    }
  }, [selectedUseCase, navigate]);

  return <div>Redirecting...</div>;
};

export default App;
