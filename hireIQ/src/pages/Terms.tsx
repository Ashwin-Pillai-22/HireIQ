// pages/Terms.tsx
import React from "react";

const Terms: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Terms & Conditions</h1>

      <p>By using this application, you agree to the following terms.</p>

      <h3>Usage Rules</h3>
      <p>You must not misuse the platform.</p>

      <h3>Account Responsibility</h3>
      <p>You are responsible for your account and credentials.</p>

      <h3>Limitation of Liability</h3>
      <p>We are not liable for damages arising from usage.</p>
    </div>
  );
};

const styles: { container: React.CSSProperties } = {
  container: {
    padding: "40px",
    maxWidth: "800px",
    margin: "auto",
  },
};

export default Terms;