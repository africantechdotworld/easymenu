import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/business/DashboardLayout';
import DashboardOverview from './DashboardOverview';
import DashboardMenu from './DashboardMenu';
import DashboardQR from './DashboardQR';
import DashboardSettings from './DashboardSettings';

const Dashboard = () => {
    // Basic check for token
    const token = localStorage.getItem('biz-token');

    if (!token) {
        return <Navigate to="/business/login" replace />;
    }

    return (
        <DashboardLayout>
            <Routes>
                <Route index element={<DashboardOverview />} />
                <Route path="menu" element={<DashboardMenu />} />
                <Route path="qr" element={<DashboardQR />} />
                <Route path="settings" element={<DashboardSettings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </DashboardLayout>
    );
};

export default Dashboard;
