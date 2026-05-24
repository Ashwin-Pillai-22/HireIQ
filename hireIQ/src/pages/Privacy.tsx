// pages/Privacy.tsx
import React from "react";

const Privacy: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Privacy Policy</h1>

      <p>
        This Privacy Policy explains how we collect, use, and protect your data.
      </p>

      <h3>Information We Collect</h3>
      <p>Name, email, and usage data.</p>

      <h3>How We Use Information</h3>
      <p>To improve services and user experience.</p>

      <h3>Data Protection</h3>
      <p>We implement industry-standard security measures.</p>
    </div>
  );
};

const styles: { container: React.CSSProperties } = {
  container: {
    padding: "40px",
    maxWidth: "800px",
    margin: "auto",
    lineHeight: 1.6,
  },
};

export default Privacy;