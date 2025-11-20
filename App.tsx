import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/student/Profile';
import OpportunityList from './pages/student/OpportunityList';
import ManageOpportunities from './pages/professor/ManageOpportunities';
import ApplicationList from './pages/professor/ApplicationList';
import Chat from './pages/Chat';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Layout />}>
            {/* Default Redirect */}
            <Route index element={<Navigate to="/login" replace />} />

            {/* Student Routes */}
            <Route 
              path="student/profile" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="student/opportunities" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                  <OpportunityList />
                </ProtectedRoute>
              } 
            />

            {/* Professor Routes */}
            <Route 
              path="professor/opportunities" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                  <ManageOpportunities />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="professor/applications" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                  <ApplicationList />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Shared Routes */}
            <Route 
              path="chat" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN]}>
                  <Chat />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;