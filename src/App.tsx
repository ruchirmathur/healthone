import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AutoLogin } from './pages/AutoLogin';
import Dashboard from './pages/Dashboard';
import HospitalPriceDashboard from './pages/HospitalPriceDashboard';
import UserFeedbackAnalytics from './pages/UserFeedbackAnalytics';
import MemberHealthCopilotDashboard from './pages/MemberHealthCopilotDashboard';
import { AuthenticationGuard } from './pages/authentication-guard';
import NotFound from './pages/NotFound';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

interface ApiData {
  selectedUseCase?: string;
}

function App() {
  const { isLoading: authLoading, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setApiLoading(true);
      getIdTokenClaims().then(claims => {
        const org = claims?.org_name || claims?.['https://yourdomain/org_name'] || '';
        const apiHost = process.env.REACT_APP_API_BUILDER_HOST;
        
        fetch(`${apiHost}/retrieve/${encodeURIComponent(org)}`)
          .then(response => response.json())
          .then(data => {
            setApiData(data);
            setApiLoading(false);
            
            // Redirect to correct route after API load
            const targetPath = getPathForUseCase(data.selectedUseCase);
            if (location.pathname !== targetPath) {
              navigate(targetPath, { replace: true });
            }
          });
      });
    }
  }, [isAuthenticated, getIdTokenClaims, navigate, location.pathname]);

  const getPathForUseCase = (useCase?: string) => {
    switch (useCase) {
      case 'Healthcare Price Transparency':
        return '/hospital';
      case 'User Feedback Analysis Dashboard':
        return '/feedback';
      case 'Member Dashboard':
        return '/memberdashboard';
      case 'Voice enabled Healthcare Price Transparency':
        return '/voice-enabled';
      default:
        return '/dashboard';
    }
  };

  if (authLoading) {
    return <div>Loading authentication...</div>;
  }

  const ProtectedLayoutWrapper = () => (
    <div className="app-container">
      <Header />
      <Sidebar selectedUseCase={apiData?.selectedUseCase} />
      <div className="main-content">
        {apiLoading ? (
          <div>Loading application data...</div>
        ) : (
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hospital" element={<HospitalPriceDashboard />} />
            <Route path="/feedback" element={<UserFeedbackAnalytics />} />
            <Route path="/memberdashboard" element={<MemberHealthCopilotDashboard />} />
            <Route path="/voice-enabled" element={<div>Voice Enabled View</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<AutoLogin />} />
      <Route path="/callback" element={<div>Processing login...</div>} />
      <Route element={<AuthenticationGuard component={ProtectedLayoutWrapper} />}>
        <Route index element={<div />} /> {/* Empty element for nested routes */}
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
