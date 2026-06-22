'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiBookOpen, FiBookmark, FiPlusCircle, FiSliders } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isWriter, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Ebooks', href: '/browse' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const getDashboardHref = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'writer') return '/dashboard/writer';
    return '/dashboard/user';
  };

  return (
    <nav className="nav-container-fixed" style={{
      height: 'var(--nav-height)',
      background: 'rgba(6, 11, 24, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--glass-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }} className="text-gradient">
          <FiBookOpen style={{ color: 'var(--accent-secondary)' }} />
          <span>FABLE</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'color var(--transition-fast)'
                }}
              >
                {link.name}
              </Link>
            );
          })}

          {isAuthenticated && (
            <Link
              href={getDashboardHref()}
              style={{
                color: pathname.startsWith('/dashboard') ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: pathname.startsWith('/dashboard') ? '600' : '400',
              }}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* User Account / CTA Section */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
          {isAuthenticated ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={toggleDropdown}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <FiUser style={{ color: 'var(--accent-secondary)' }} />
                )}
                <span>{user.name.split(' ')[0]}</span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '220px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  zIndex: 110
                }}>
                  <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.5rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    <span className="badge badge-primary" style={{ marginTop: '0.25rem', fontSize: '0.65rem' }}>
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href={getDashboardHref()}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)'
                    }}
                    className="dropdown-item-hover"
                  >
                    <FiSliders />
                    <span>My Dashboard</span>
                  </Link>

                  {isWriter && (
                    <Link
                      href="/dashboard/writer/add-ebook"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                      }}
                      className="dropdown-item-hover"
                    >
                      <FiPlusCircle />
                      <span>Upload Ebook</span>
                    </Link>
                  )}

                  {!isAdmin && (
                    <Link
                      href={isWriter ? '/dashboard/writer/bookmarks' : '/dashboard/user/bookmarks'}
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                      }}
                      className="dropdown-item-hover"
                    >
                      <FiBookmark />
                      <span>Bookmarks</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: 'var(--danger)',
                      background: 'transparent',
                      width: '100%',
                      textAlign: 'left'
                    }}
                    className="dropdown-item-hover-danger"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href="/login" style={{ color: 'var(--text-secondary)' }} className="btn-ghost">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          style={{
            display: 'flex',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: '1.5rem',
            border: 'none',
            cursor: 'pointer'
          }}
          className="mobile-menu-btn"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 99
        }} className="mobile-drawer">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                color: pathname === link.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: pathname === link.href ? '600' : '400',
                fontSize: '1.1rem'
              }}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              href={getDashboardHref()}
              onClick={() => setIsOpen(false)}
              style={{
                color: pathname.startsWith('/dashboard') ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: pathname.startsWith('/dashboard') ? '600' : '400',
                fontSize: '1.1rem'
              }}
            >
              Dashboard
            </Link>
          )}

          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.5rem 0' }}></div>

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--glass-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiUser style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                )}
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="btn btn-danger btn-sm"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/login" onClick={() => setIsOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                Login
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Inline styles for media queries inside this layout */}
      <style jsx global>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-drawer {
            display: none !important;
          }
        }
        .dropdown-item-hover:hover {
          background: var(--glass-bg) !important;
          color: var(--text-primary) !important;
        }
        .dropdown-item-hover-danger:hover {
          background: var(--danger-bg) !important;
          color: var(--danger) !important;
        }
      `}</style>
    </nav>
  );
}
