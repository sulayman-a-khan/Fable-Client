'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="loading-page" style={{ minHeight: '80vh', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1rem', color: 'var(--danger)' }}>Something went wrong!</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        An unexpected error occurred while loading this page.
      </p>
      <button onClick={() => reset()} className="btn btn-primary">
        Try Again
      </button>
    </div>
  );
}
