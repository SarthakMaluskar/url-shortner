import React from 'react';
import ShortenCard from '../components/ShortenCard';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-header">
        <h1 className="hero-heading">Shorten a URL</h1>
        <p className="hero-description">
          Create short, memorable links with real-time click tracking and custom aliases.
        </p>
      </div>

      <ShortenCard autoFocus={true} />
    </div>
  );
}
