// App.tsx
import React, { useEffect, useState } from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
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

interface ProtectedLayoutProps {
  selectedUseCase?: string;
  apiLoading: boolean;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ selectedUseCase, apiLoading }) => (
  <div className="app-container">
    <Header />
    <Sidebar selectedUseCase={selectedUseCase} loading={apiLoading} />
    <div className="main-content">
      <Outlet />
    </div>
  </div>
);

function App() {
  const { isLoading: authLoading, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setApiLoading(true);
      getIdTokenClaims()
        .then(claims => {
          const org = claims?.org_name || claims?.['https://yourdomain/org_name'] || '';
          const apiHost = process.env.REACT_APP_API_BUILDER_HOST;
          
          console.log('Fetching API data from:', `${apiHost}/data?org=${encodeURIComponent(org)}`);
          
          return fetch(`${apiHost}/retrieve/${encodeURIComponent(org)}`)
            .then(response => {
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              return response.json();
            })
            .then(data => {
              console.log('API response:', data);
              setApiData(data);
              setApiLoading(false);
            });
        })
        .catch(error => {
          console.error('API Error:', error);
          setApiLoading(false);
        });
    }
  }, [isAuthenticated, getIdTokenClaims]);

  if (authLoading) {
    return <div>Loading authentication...</div>;
  }

  const selectedUseCase = apiData?.selectedUseCase;
  console.log('Current selectedUseCase:', selectedUseCase);

  return (
    <Routes>
      <Route path="/" element={<AutoLogin />} />
      <Route path="/callback" element={<div>Processing login...</div>} />
      <Route element={<AuthenticationGuard component={() => (
        <ProtectedLayout 
          selectedUseCase={selectedUseCase} 
          apiLoading={apiLoading} 
        />
      )} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hospital" element={<HospitalPriceDashboard />} />
        <Route path="/feedback" element={<UserFeedbackAnalytics />} />
        <Route path="/memberdashboard" element={<MemberHealthCopilotDashboard />} />
        <Route path="/voice-enabled" element={<div>Voice Enabled View</div>} />
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
