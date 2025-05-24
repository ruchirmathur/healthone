import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import React from "react";

interface AuthenticationGuardProps {
  component: React.ComponentType;
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ component }) => {
  const { error } = useAuth0();

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#b91c1c" }}>
        <h2>Authorization Error</h2>
        <p>{error.message || "You are not authorized to view this page."}</p>
      </div>
    );
  }

  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <div>Loading...</div>,
  });
  return <Component />;
};
