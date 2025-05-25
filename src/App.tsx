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

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then(claims => setOrgName(
        claims?.org_name || claims?.['https://yourdomain/org_name'] || ''
      ));
    }
  }, [isAuthenticated, getIdTokenClaims]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // You can use orgName anywhere in App component
  // For demonstration, here's how to log it:
  console.log('Organization Name:', orgName);

  return (
    <Routes>
      <Route path="/" element={<AutoLogin />} />
      <Route path="/callback" element={<div>Processing login...</div>} />
      <Route element={<AuthenticationGuard component={ProtectedLayout} />}>
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

const ProtectedLayout = () => (
  <div className="app-container">
    <Header />
    <Sidebar />
    <div className="main-content">
      <Outlet />
    </div>
  </div>
);

export default App;
