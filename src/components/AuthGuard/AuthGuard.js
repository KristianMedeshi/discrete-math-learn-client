import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function AuthGuard() {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const intervalTime = 60000;
    const checkJwtExpiration = () => {
      console.log();
      const exp = jwtDecode(localStorage.getItem('token')).exp - intervalTime / 1000;
      const currentTime = new Date().getTime() / 1000;
      setIsExpired(currentTime > exp);
    };

    checkJwtExpiration();

    const interval = setInterval(() => {
      checkJwtExpiration();
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return isExpired
    ? <Navigate to="/sign-in" replace />
    : <Outlet />;
}

export default AuthGuard;
