'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiBookOpen, FiArrowRight, FiAlertTriangle } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);
  
  const confirmedRef = useRef(false);

  useEffect(() => {
    async function confirmPayment() {
      if (!sessionId) {
        setError('No payment session found.');
        setLoading(false);
        return;
      }
      
      // Avoid duplicate confirmation requests on dev double-mount
      if (confirmedRef.current) return;
      confirmedRef.current = true;

      try {
        const { data } = await api.post('/transactions/confirm', { sessionId });
        if (data.success) {
          setTransaction(data.transaction);
          toast.success('Payment verified successfully!');
        } else {
          setError('Failed to confirm payment status.');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error confirming payment.');
      } finally {
        setLoading(false);
      }
    }

    confirmPayment();
  }, [sessionId]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Confirming payment with Stripe, please wait..." />;
  }

  if (error) {
    return (
      <div className="page-wrapper" style={{ padding: '6rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="card" style={{ padding: '3rem', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            <FiAlertTriangle style={{ fontSize: '4rem', color: 'var(--danger)', marginBottom: '1.5rem' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Verification Issue</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error}</p>
            <button onClick={() => router.push('/browse')} className="btn btn-primary" style={{ width: '100%' }}>
              Browse Ebooks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ padding: '6rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{
          padding: '4rem 3rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid var(--success)',
          boxShadow: '0 0 40px rgba(34, 197, 94, 0.15)'
        }}>
          <FiCheckCircle style={{ fontSize: '5rem', color: 'var(--success)', marginBottom: '1.5rem' }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '1rem' }}>Thank You!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Your payment was completed successfully. The ebook has been added to your digital library.
          </p>

          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2.5rem',
            textAlign: 'left',
            fontSize: '0.9rem',
            border: '1px solid var(--glass-border)'
          }}>
            <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
              <strong style={{ color: 'var(--text-primary)' }}>${transaction?.amount?.toFixed(2)}</strong>
            </p>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Transaction:</span>
              <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {transaction?._id?.substring(0, 16)}...
              </span>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {transaction?.ebook && (
              <button
                onClick={() => router.push(`/ebooks/${transaction.ebook}`)}
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <FiBookOpen />
                <span>Start Reading Now</span>
                <FiArrowRight />
              </button>
            )}
            <button
              onClick={() => router.push('/dashboard/user/purchases')}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Go to My Purchases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
