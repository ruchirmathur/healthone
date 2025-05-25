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
        const org = claims?.org_name || claims?.['https://yourdomain/org_name'] || '';
        setOrgName(org);
      });
    }
  }, [isAuthenticated, getIdTokenClaims]);

  useEffect(() => {
    if (orgName) {
      const apiHost = process.env.REACT_APP_API_BUILDER_HOST;
      fetch(`${apiHost}/data?org=${encodeURIComponent(orgName)}`)
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

  return (
    <Routes>
      <Route path="/" element={<AutoLogin />} />
      <Route path="/callback" element={<div>Processing login...</div>} />
      <Route element={<AuthenticationGuard component={() => <ProtectedLayout selectedUseCase={apiData?.selectedUseCase} />} />}>
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

const ProtectedLayout = ({ selectedUseCase }) => (
  <div className="app-container">
    <Header />
    <Sidebar selectedUseCase={selectedUseCase} />
    <div className="main-content">
      <Outlet />
    </div>
  </div>
);

export default App;
