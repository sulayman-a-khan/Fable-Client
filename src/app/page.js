import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedEbooks from '@/components/home/FeaturedEbooks';
import NewReleasesCarousel from '@/components/home/NewReleasesCarousel';
import TopWriters from '@/components/home/TopWriters';
import GenreGrid from '@/components/home/GenreGrid';

export const metadata = {
  title: 'Fable — Discover & Read Original Ebooks',
  description: 'Fable connects ebook enthusiasts with talented independent writers. Browse, purchase, and read ebooks directly in your browser.',
};

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Featured Ebooks Section */}
      <FeaturedEbooks />

      {/* New Releases Carousel (Swiper) */}
      <NewReleasesCarousel />

      {/* Explore by Genre Section */}
      <GenreGrid />

      {/* Top Writers Section */}
      <TopWriters />
    </div>
  );
}
