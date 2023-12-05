import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AuthGuard() {
  const userId = useSelector((state) => state.auth.userId);

  return userId ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

export default AuthGuard;
