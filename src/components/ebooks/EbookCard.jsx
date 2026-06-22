'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBook, FiUser, FiTag } from 'react-icons/fi';

export default function EbookCard({ ebook }) {
  const { _id, title, price, genre, coverImage, writer } = ebook;
  const writerName = writer?.name || 'Unknown Writer';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Cover Image Container */}
      <Link href={`/ebooks/${_id}`} style={{ display: 'block', overflow: 'hidden', position: 'relative', aspectRatio: '3/4.2' }}>
        <img
          src={coverImage || 'https://via.placeholder.com/300x420?text=No+Cover'}
          alt={title}
          className="card-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x420?text=No+Cover';
          }}
        />
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
          fontSize: '1.15rem',
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
          <FiUser style={{ color: 'var(--accent-secondary)' }} />
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>{writerName}</span>
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
              fontSize: '1.2rem',
              color: 'var(--text-primary)'
            }}>
              {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
            </span>
          </div>

          <Link href={`/ebooks/${_id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
