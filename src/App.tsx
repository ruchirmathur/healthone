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
  const { isLoading: authLoading, isAuthenticated, getIdTokenClaims } = useAuth0();
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
          navigate('/error');
        });
    }
  }, [isAuthenticated, getIdTokenClaims, navigate]);

  useEffect(() => {
    if (orgName) {
      const apiHost = process.env.REACT_APP_API_BUILDER_HOST;

      // Artificial delay for smoother UX
      setTimeout(() => {
        fetch(`${apiHost}/retrieve/${encodeURIComponent(orgName)}`)
          .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
          })
          .then((data: ApiData) => {
            setApiData(data);
          })
          .catch(error => {
            console.error('API Error:', error);
            setApiData({ selectedUseCase: [] });
          });
      }, 1000); // 1 second delay
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


  // Layout for protected routes
  const ProtectedLayout = () => (
    <div style={{ display: 'flex' }}>
      <Header />
      <Sidebar selectedUseCase={selectedUseCase} />
      <div style={{ flexGrow: 1, padding: '24px', marginLeft: 240 }}>
        <Outlet />
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/autologin" element={<AutoLogin />} />
      <Route path="/callback" element={<div>Processing login...</div>} />
      
      <Route element={<AuthenticationGuard component={ProtectedLayout} />}>
        {/* Only load Dashboard for "/" */}
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
        {/* Optionally, redirect "/" to the first allowed use case */}
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
    }
  }, [selectedUseCase, navigate]);

  return <div>Redirecting...</div>;
};

export default App;
