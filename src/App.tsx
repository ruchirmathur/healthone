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

function App() {
  const { isLoading, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [orgName, setOrgName] = useState('');
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then(claims => {
        const org =
          claims?.org_name ||
          claims?.['https://yourdomain/org_name'] ||
          '';
        setOrgName(org);
      });
    }
  }, [isAuthenticated, getIdTokenClaims]);

  useEffect(() => {
    if (orgName) {
      const apiHost = process.env.REACT_APP_API_BUILDER_HOST;
      fetch(`${apiHost}/retrieve/${encodeURIComponent(orgName)}`)
        .then(response => response.json())
        .then(data => {
          setApiData(data);
          console.log('API Data:', data);
        })
        .catch(error => {
          console.error('Error fetching API data:', error);
        });
    }
  }, [orgName]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // The use cases you want to support
  const allowedUseCases = [
    'Healthcare Price Transparency',
    'User Feedback Analysis Dashboard',
    'Healthcare Underwriter Dashboard',
    'Member Dashboard'
  ];

  // Only include allowed use cases that are present in the API response
  const selectedUseCase: string[] = Array.isArray(apiData?.selectedUseCase)
    ? apiData.selectedUseCase.filter((uc: string) => allowedUseCases.includes(uc))
    : [];

  return (
    <div style={{ display: 'flex' }}>
      <Header />
      <Sidebar selectedUseCase={selectedUseCase} />
      <main style={{ flexGrow: 1, padding: '24px', marginLeft: 240 }}>
        <Routes>
          {selectedUseCase.includes('Healthcare Underwriter Dashboard') && (
            <Route
              path="/dashboard"
              element={<AuthenticationGuard component={Dashboard} />}
            />
          )}
          {selectedUseCase.includes('User Feedback Analysis Dashboard') && (
            <Route
              path="/feedback"
              element={<AuthenticationGuard component={UserFeedbackAnalytics} />}
            />
          )}
          {selectedUseCase.includes('Healthcare Price Transparency') && (
            <Route
              path="/hospital"
              element={<AuthenticationGuard component={HospitalPriceDashboard} />}
            />
          )}
          {selectedUseCase.includes('Member Dashboard') && (
            <Route
              path="/memberdashboard"
              element={<AuthenticationGuard component={MemberHealthCopilotDashboard} />}
            />
          )}
          <Route path="/autologin" element={<AutoLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
