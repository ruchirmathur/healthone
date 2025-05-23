import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserFeedbackAnalytics from './pages/UserFeedbackAnalytics';
import HospitalPriceDashboard from './pages/HospitalPriceDashboard';
import MemberBenefits from './pages/MemberHealthCopilotDashboard';

const AppRoutes = () => (
  <Routes>
    <Route path="/underwriters-dashboard" element={<Dashboard />} />
    <Route path="/user-feedback-analytics" element={<UserFeedbackAnalytics />} />
    <Route path="/hospital-transparency" element={<HospitalPriceDashboard />} />
    <Route path="/member-benefits" element={<MemberBenefits />} />
  </Routes>
);

export default AppRoutes;