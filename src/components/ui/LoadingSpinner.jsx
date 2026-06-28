'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text }) {
  const sizeClass = size === 'lg' ? 'spinner-lg' : size === 'sm' ? 'spinner-sm' : '';

  return (
    <motion.div
      className="loading-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`spinner ${sizeClass}`}></div>
      {text && (
        <motion.p
          className="loading-text"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}
