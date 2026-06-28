'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBookOpen, FiArrowRight, FiStar } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const floatVariant = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function HeroBanner() {
  const { isAuthenticated, isWriter } = useAuth();

  let publishLink = '/register?role=writer';
  if (isAuthenticated) {
    publishLink = isWriter ? '/dashboard/writer/add-ebook' : '/dashboard/user';
  }

  return (
    <section className="section" style={{
      position: 'relative',
      padding: '8rem 0 6rem 0',
      background: 'radial-gradient(circle at 70% 30%, rgba(99,102,241,0.12), transparent 50%), radial-gradient(circle at 10% 80%, rgba(245,158,11,0.08), transparent 40%)',
      overflow: 'hidden',
    }}>
      {/* Animated glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.22, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: '400px', height: '400px',
          borderRadius: '50%', background: 'var(--accent-primary)',
          filter: 'blur(130px)', top: '-60px', right: '8%',
          opacity: 0.15, pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.13, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute', width: '500px', height: '500px',
          borderRadius: '50%', background: 'var(--accent-secondary)',
          filter: 'blur(160px)', bottom: '-120px', left: '-60px',
          opacity: 0.08, pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          style={{ textAlign: 'center' }}
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1.25rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '2rem',
              fontSize: '0.85rem', color: 'var(--text-secondary)',
            }}>
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: '8px', height: '8px', background: 'var(--accent-secondary)', borderRadius: '50%', display: 'inline-block' }}
              />
              Welcome to the Future of Digital Books
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
              lineHeight: '1.12',
              marginBottom: '1.5rem',
              letterSpacing: '-0.025em',
              fontWeight: 800,
            }}
          >
            Discover &amp; Read <br />
            <span className="text-gradient">Original Ebooks</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: '1.2rem', color: 'var(--text-secondary)',
              maxWidth: '640px', margin: '0 auto 2.5rem auto', lineHeight: '1.7',
            }}
          >
            Democratizing access to exceptional literature. Fable connects ebook enthusiasts with talented independent writers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/browse" className="btn btn-primary btn-lg">
                <span>Browse Library</span>
                <FiArrowRight />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href={publishLink} className="btn btn-secondary btn-lg">
                <span>Publish Your Book</span>
                <FiBookOpen style={{ color: 'var(--accent-secondary)' }} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeUp}
            style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: '2rem', flexWrap: 'wrap', marginTop: '3.5rem',
            }}
          >
            {[
              { icon: FiStar, text: 'Curated Quality', color: 'var(--accent-secondary)' },
              { icon: FiBookOpen, text: 'In-Browser Reader', color: 'var(--accent-primary)' },
              { icon: FiArrowRight, text: 'Instant Access', color: '#10b981' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Icon style={{ color }} />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
