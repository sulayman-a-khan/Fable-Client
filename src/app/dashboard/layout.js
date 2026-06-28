'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  FiUser, FiShoppingBag, FiBookOpen, FiBookmark, FiPlusCircle,
  FiTrendingUp, FiSettings, FiMenu, FiX, FiActivity, FiUsers
} from 'react-icons/fi';

export default function DashboardLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Authenticating user session..." />;
  }

  if (!user) return null;

  // Navigation config based on role
  const getSidebarLinks = () => {
    if (user.role === 'admin') {
      return [
        { name: 'Analytics', href: '/dashboard/admin', icon: FiTrendingUp },
        { name: 'Manage Users', href: '/dashboard/admin/users', icon: FiUsers },
        { name: 'Manage Ebooks', href: '/dashboard/admin/ebooks', icon: FiBookOpen },
        { name: 'All Transactions', href: '/dashboard/admin/transactions', icon: FiShoppingBag },
      ];
    }

    if (user.role === 'writer') {
      return [
        { name: 'Overview', href: '/dashboard/writer', icon: FiTrendingUp },
        { name: 'My Ebooks', href: '/dashboard/writer/ebooks', icon: FiBookOpen },
        { name: 'Upload Ebook', href: '/dashboard/writer/add-ebook', icon: FiPlusCircle },
        { name: 'Sales History', href: '/dashboard/writer/sales', icon: FiShoppingBag },
        { name: 'Bookmarks', href: '/dashboard/writer/bookmarks', icon: FiBookmark },
      ];
    }

    // Default reader links
    return [
      { name: 'Overview', href: '/dashboard/user', icon: FiActivity },
      { name: 'My Purchases', href: '/dashboard/user/purchases', icon: FiShoppingBag },
      { name: 'My Library', href: '/dashboard/user/library', icon: FiBookOpen },
      { name: 'Bookmarks', href: '/dashboard/user/bookmarks', icon: FiBookmark },
      { name: 'My Profile', href: '/dashboard/user/profile', icon: FiUser },
    ];
  };

  const links = getSidebarLinks();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div style={{
      display: 'flex',
      minHeight: 'calc(100vh - var(--nav-height))',
      position: 'relative'
    }}>
      {/* Sidebar - Desktop */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--glass-border)',
        padding: '2rem 1.5rem',
        display: 'none',
        flexDirection: 'column',
        gap: '0.5rem'
      }} className="sidebar-desktop">
        
        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem'
        }}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--glass-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-secondary)'
            }}>
              <FiUser />
            </div>
          )}
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.name}
            </p>
            <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '0.1rem 0.5rem' }}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-gradient)' : 'transparent',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all var(--transition-fast)'
                }}
                className="dropdown-item-hover"
              >
                <Icon />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Sidebar - Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          color: 'white',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 999,
          cursor: 'pointer'
        }}
        className="sidebar-mobile-toggle"
      >
        {sidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar - Mobile Drawer */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 998,
          backdropFilter: 'blur(4px)'
        }} onClick={toggleSidebar}>
          <div style={{
            width: '260px',
            height: '100%',
            background: 'var(--bg-secondary)',
            borderRight: '1px solid var(--glass-border)',
            padding: '3rem 1.5rem 2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }} onClick={(e) => e.stopPropagation()}>
            {/* User Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem'
            }}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--glass-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-secondary)'
                }}>
                  <FiUser />
                </div>
              )}
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</p>
                <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '0.1rem 0.5rem' }}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      background: isActive ? 'var(--accent-gradient)' : 'transparent',
                      fontWeight: isActive ? '600' : '400'
                    }}
                    className="dropdown-item-hover"
                  >
                    <Icon />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{
        flexGrow: 1,
        padding: '2.5rem',
        maxWidth: '100%',
        overflowX: 'hidden'
      }}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      <style jsx global>{`
        @media (min-width: 769px) {
          .sidebar-desktop {
            display: flex !important;
          }
          .sidebar-mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
