import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="loading-page" style={{ minHeight: '80vh', textAlign: 'center' }}>
      <h1 className="text-gradient" style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
        The book you are looking for has been moved to another shelf, or the page does not exist.
      </p>
      <Link href="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
}
