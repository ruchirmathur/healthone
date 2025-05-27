import React, { useEffect } from "react";

// Define the type for the component props (if you need to extend in the future)
type VoicechatProps = {
  redirectUrl?: string; // Optional: allow override for testability
};

// Keyframes as a string for the spinner animation
const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
`;

// Inject keyframes into the document head (only once)
const injectSpinnerKeyframes = () => {
  if (!document.getElementById("voicechat-spinner-keyframes")) {
    const style = document.createElement("style");
    style.id = "voicechat-spinner-keyframes";
    style.innerHTML = spinnerKeyframes;
    document.head.appendChild(style);
  }
};

const DEFAULT_REDIRECT_URL = "https://healthvoicechat-fgh0dehxdkfac2ec.eastus2-01.azurewebsites.net";

const Voicechat: React.FC<VoicechatProps> = ({
  redirectUrl = DEFAULT_REDIRECT_URL,
}) => {
  useEffect(() => {
    injectSpinnerKeyframes();
    // Redirect after a short delay for UX (optional)
    const timeout = setTimeout(() => {
      window.location.replace(redirectUrl);
    }, 800);

    return () => clearTimeout(timeout);
  }, [redirectUrl]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.spinner} />
        <h2 style={styles.heading}>Redirecting you to Voice Chat...</h2>
        <p style={styles.text}>
          Please wait while we connect you to the external voice chat platform.
        </p>
      </div>
    </div>
  );
};

// Inline styles with TypeScript type safety
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    background: "linear-gradient(135deg, #4f8cff 0%, #a18fff 100%)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(79, 140, 255, 0.15)",
    padding: "48px 32px",
    textAlign: "center",
    maxWidth: 400,
    width: "100%",
  },
  spinner: {
    margin: "0 auto 24px",
    border: "6px solid #e0e7ff",
    borderTop: "6px solid #4f8cff",
    borderRadius: "50%",
    width: 48,
    height: 48,
    animation: "spin 1s linear infinite",
  },
  heading: {
    margin: "0 0 12px",
    color: "#4f8cff",
    fontWeight: 700,
    fontSize: 24,
    letterSpacing: 0.5,
  },
  text: {
    color: "#444",
    fontSize: 16,
  },
};

export default Voicechat;
