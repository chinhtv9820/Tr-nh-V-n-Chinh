import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their dashboard if they access unauthorized page
    if (user.role === UserRole.STUDENT) return <Navigate to="/student/opportunities" />;
    if (user.role === UserRole.PROFESSOR) return <Navigate to="/professor/opportunities" />;
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;