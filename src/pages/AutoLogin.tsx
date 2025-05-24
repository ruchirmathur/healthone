import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AutoLogin: React.FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        loginWithRedirect({
          appState: { returnTo: '/dashboard' }
        });
      }
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
};
