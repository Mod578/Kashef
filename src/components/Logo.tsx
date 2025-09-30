import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * A React component that renders the "Kashef" application logo as an SVG.
 * The logo is an abstract representation of an eye with a CPU core as the iris,
 * symbolizing AI-powered vision and analysis.
 *
 * @param {LogoProps} props - The component props.
 * @param {string} [props.className] - Optional CSS classes to apply to the SVG element.
 * @returns {React.ReactElement} The rendered SVG logo.
 */
export const Logo: React.FC<LogoProps> = React.memo(({ className }) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-labelledby="logo-title"
    role="img"
    stroke="currentColor"
    fill="none"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title id="logo-title">شعار كاشف</title>
    {/* Eye shape */}
    <path d="M2,32 C2,32 12,18 32,18 C52,18 62,32 62,32 C62,32 52,46 32,46 C12,46 2,32 2,32 Z" />
    {/* Iris with CPU core */}
    <rect x="25" y="25" width="14" height="14" rx="2" />
  </svg>
));
