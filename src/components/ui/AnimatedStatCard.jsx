'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable animated stat card with number count-up effect.
 * Props: icon, value (number|string), label, color, prefix, suffix, delay
 */
export default function AnimatedStatCard({
  icon: Icon,
  value,
  label,
  color = 'var(--accent-primary)',
  bgColor,
  prefix = '',
  suffix = '',
  delay = 0,
}) {
  const [display, setDisplay] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const isNumeric = typeof value === 'number';

  useEffect(() => {
    if (!isNumeric) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = numericValue / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplay(numericValue);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [numericValue, isNumeric]);

  const displayValue = isNumeric
    ? `${prefix}${display.toLocaleString()}${suffix}`
    : `${prefix}${value}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="stat-card"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle glow */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: bgColor || color,
        opacity: 0.06,
        pointerEvents: 'none',
      }} />

      <div className="stat-icon" style={{ background: bgColor || `${color}1a`, color }}>
        {Icon && <Icon />}
      </div>
      <p className="stat-value">{displayValue}</p>
      <p className="stat-label">{label}</p>
    </motion.div>
  );
}
