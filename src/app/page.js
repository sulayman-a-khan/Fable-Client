import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedEbooks from '@/components/home/FeaturedEbooks';
import TopWriters from '@/components/home/TopWriters';
import GenreGrid from '@/components/home/GenreGrid';

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Featured Ebooks Section */}
      <FeaturedEbooks />

      {/* Explore by Genre Section */}
      <GenreGrid />

      {/* Top Writers Section */}
      <TopWriters />
    </div>
  );
}
