import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import UploadPage from '../pages/UploadPage';
import ProcessingPage from '../pages/ProcessingPage';
import PreferencesPage from '../pages/PreferencesPage';
import WorkflowWizardPage from '../pages/WorkflowWizardPage';
import CompletionPage from '../pages/CompletionPage';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Authenticated Routes */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/workflow/:id" element={<WorkflowWizardPage />} />
        <Route path="/workflow/:id/complete" element={<CompletionPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
