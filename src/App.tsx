import React, { useEffect, useState } from 'react';
import { Route, Routes, Outlet, useNavigate } from 'react-router-dom';
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

interface ApiData {
  selectedUseCase?: string | string[];
}

function App() {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const [orgName, setOrgName] = useState('');
  const [apiData, setApiData] = useState<ApiData | null>(null);
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
          navigate('/error'); // Add error route
        });
    }
  }, [isAuthenticated, getIdTokenClaims, navigate]);

  useEffect(() => {
    if (orgName) {
      const apiHost = process.env.REACT_APP_API_BUILDER_HOST;
      setApiLoading(true);
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
    }
  }, [orgName]);

  // Normalize selectedUseCase to array
  const allowedUseCases = [
    'Healthcare Underwriter Dashboard',
    'User Feedback Analysis Dashboard',
    'Healthcare Price Transparency',
    'Member Dashboard'
  ];

  const selectedUseCase = apiData?.selectedUseCase
    ? Array.isArray(apiData.selectedUseCase)
      ? apiData.selectedUseCase.filter(uc => allowedUseCases.includes(uc))
      : allowedUseCases.includes(apiData.selectedUseCase)
        ? [apiData.selectedUseCase]
        : []
    : [];

  return (
    <Routes>
      <Route path="/" element={<AutoLogin />} />
      <Route path="/callback" element={<div>Processing login...</div>} />
      
      <Route element={<AuthenticationGuard component={ProtectedLayout} />}>
        <Route path="/" element={<Dashboard />} />
        {selectedUseCase.includes('Healthcare Underwriter Dashboard') && (
          <Route path="/dashboard" element={<Dashboard />} />
        )}
        {selectedUseCase.includes('Healthcare Price Transparency') && (
          <Route path="/hospital" element={<HospitalPriceDashboard />} />
        )}
        {selectedUseCase.includes('User Feedback Analysis Dashboard') && (
          <Route path="/feedback" element={<UserFeedbackAnalytics />} />
        )}
        {selectedUseCase.includes('Member Dashboard') && (
          <Route path="/memberdashboard" element={<MemberHealthCopilotDashboard />} />
        )}
      </Route>
      
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const ProtectedLayout = () => (
  <div style={{ display: 'flex' }}>
    <Header />
    <Sidebar selectedUseCase={[]} /> {/* Update this after fixing Sidebar */}
    <div style={{ flexGrow: 1, padding: '24px', marginLeft: 240 }}>
      <Outlet />
    </div>
  </div>
);

export default App;
