import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AutoLogin from './pages/AutoLogin';
import Dashboard from './pages/Dashboard';
import HospitalPriceDashboard from './pages/HospitalPriceDashboard';
import UserFeedbackAnalytics from './pages/UserFeedbackAnalytics';
import MemberHealthCopilotDashboard from './pages/MemberHealthCopilotDashboard';

import { useAuth0 } from '@auth0/auth0-react';
import './App.css';
import { AuthenticationGuard } from './pages/authentication-guard';


function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '20px', background: '#f5f5f5' }}>
          <Routes>
           <Route
              path="/"
              element={<AuthenticationGuard component={AutoLogin} />}
            />
            <Route
              path="/dashboard"
              element={<AuthenticationGuard component={Dashboard} />}
            />
            <Route
              path="/hospital"
              element={<AuthenticationGuard component={HospitalPriceDashboard} />}
            />
            <Route
              path="/feedback"
              element={<AuthenticationGuard component={UserFeedbackAnalytics} />}
            />
             <Route
              path="/memberdashboard"
              element={<AuthenticationGuard component={MemberHealthCopilotDashboard} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
