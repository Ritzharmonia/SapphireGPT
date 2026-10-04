import React from 'react';

interface SapphireIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const SapphireIcon: React.FC<SapphireIconProps> = ({
  className = '',
  size = 28,
  glow = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-60 bg-blue-500 animate-pulse pointer-events-none"
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-md"
      >
        <defs>
          <linearGradient id="sapphireGradMain" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#2563eb" />
            <stop offset="85%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="sapphireTopFacet" x1="14" y1="8" x2="34" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="sapphireSideFacetLeft" x1="6" y1="18" x2="24" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          <linearGradient id="sapphireCenterFacet" x1="24" y1="18" x2="24" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="60%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>

        {/* Outer Gem Profile */}
        <polygon
          points="14,8 34,8 44,18 24,42 4,18"
          fill="url(#sapphireGradMain)"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Top Table Facet */}
        <polygon
          points="14,8 34,8 28,18 20,18"
          fill="url(#sapphireTopFacet)"
          opacity="0.9"
        />

        {/* Left Upper Facet */}
        <polygon
          points="14,8 20,18 4,18"
          fill="#0284c7"
          opacity="0.8"
        />

        {/* Right Upper Facet */}
        <polygon
          points="34,8 44,18 28,18"
          fill="#0369a1"
          opacity="0.85"
        />

        {/* Central Lower Pavilion Facet */}
        <polygon
          points="20,18 28,18 24,42"
          fill="url(#sapphireCenterFacet)"
          opacity="0.95"
        />

        {/* Left Lower Pavilion Facet */}
        <polygon
          points="4,18 20,18 24,42"
          fill="url(#sapphireSideFacetLeft)"
          opacity="0.85"
        />

        {/* Right Lower Pavilion Facet */}
        <polygon
          points="44,18 28,18 24,42"
          fill="#1e3a8a"
          opacity="0.9"
        />

        {/* Facet Highlights */}
        <polyline
          points="14,8 20,18 24,42 28,18 34,8"
          stroke="#7dd3fc"
          strokeWidth="0.75"
          opacity="0.8"
          strokeLinejoin="round"
        />
        <line x1="4" y1="18" x2="44" y2="18" stroke="#bae6fd" strokeWidth="0.75" opacity="0.7" />

        {/* Sparkle reflection dot */}
        <circle cx="18" cy="14" r="1.5" fill="#ffffff" opacity="0.9" />
      </svg>
    </div>
  );
};
