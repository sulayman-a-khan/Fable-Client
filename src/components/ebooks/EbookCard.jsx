'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiUser, FiTag, FiBookOpen } from 'react-icons/fi';

export default function EbookCard({ ebook, index = 0 }) {
  const { _id, title, price, genre, coverImage, writer } = ebook;
  const writerName = writer?.name || 'Unknown Writer';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {/* Cover Image Container */}
      <Link href={`/ebooks/${_id}`} style={{ display: 'block', overflow: 'hidden', position: 'relative', aspectRatio: '3/4.2' }}>
        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={coverImage || 'https://placehold.co/300x420?text=No+Cover'}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            style={{ objectFit: 'cover' }}
          />
        </motion.div>
        {/* Genre Overlay Badge */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 10
        }}>
          <span className="badge badge-primary" style={{ backdropFilter: 'blur(8px)' }}>
            {genre}
          </span>
        </div>

        {/* Free badge */}
        {price === 0 && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 10,
            background: 'var(--success)',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.05em'
          }}>
            FREE
          </div>
        )}

        {/* Purchased badge */}
        {ebook.isPurchased && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: price === 0 ? '4.5rem' : '1rem',
            zIndex: 10,
            background: 'var(--accent-secondary)',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.05em'
          }}>
            PURCHASED
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="card-body" style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        padding: '1.25rem'
      }}>
        {/* Title */}
        <h4 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.1rem',
          fontWeight: 600,
          lineHeight: '1.3',
          marginBottom: '0.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.6rem'
        }}>
          <Link href={`/ebooks/${_id}`} style={{ color: 'var(--text-primary)' }}>
            {title}
          </Link>
        </h4>

        {/* Writer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginBottom: '1rem'
        }}>
          <FiUser style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
          <Link
            href={`/writers/${writer?._id || writer}`}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            {writerName}
          </Link>
        </div>

        {/* Pricing & CTA */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FiTag style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem' }} />
            <span style={{
              fontWeight: 700,
              fontSize: '1.15rem',
              color: price === 0 ? 'var(--success)' : 'var(--text-primary)'
            }}>
              {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
            </span>
          </div>

          <Link href={`/ebooks/${_id}`} className="btn btn-secondary btn-sm" style={{
            padding: '0.4rem 0.8rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <FiBookOpen />
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
