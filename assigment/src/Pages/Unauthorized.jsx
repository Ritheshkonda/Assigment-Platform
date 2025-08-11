import React from 'react';

export default function Unauthorized() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>🚫 403 - Unauthorized Access</h2>
      <p>You don't have permission to view this page.</p>
      <a href="/" style={{ color: '#725cad', textDecoration: 'none', fontWeight: 'bold' }}>Go Back</a>
    </div>
  );
}
