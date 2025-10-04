import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = React.memo(({ className }) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-labelledby="logo-title"
    role="img"
  >
    <title id="logo-title">شعار كاشف</title>
    <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {/* Scanning Frame */}
      <path d="M16 4 H 4 V 16" />
      <path d="M48 4 H 60 V 16" />
      <path d="M16 60 H 4 V 48" />
      <path d="M48 60 H 60 V 48" />

      {/* Processor Icon */}
      <rect x="18" y="18" width="28" height="28" rx="2" />
      <rect x="26" y="26" width="12" height="12" rx="2" />
      
      {/* Processor Legs (thinner stroke) */}
      <g strokeWidth="2.5">
        {/* Top lines */}
        <path d="M24 18v-4" />
        <path d="M32 18v-4" />
        <path d="M40 18v-4" />
        {/* Bottom lines */}
        <path d="M24 46v4" />
        <path d="M32 46v4" />
        <path d="M40 46v4" />
        {/* Left lines */}
        <path d="M18 24h-4" />
        <path d="M18 32h-4" />
        <path d="M18 40h-4" />
        {/* Right lines */}
        <path d="M46 24h4" />
        <path d="M46 32h4" />
        <path d="M46 40h4" />
      </g>
    </g>
  </svg>
));