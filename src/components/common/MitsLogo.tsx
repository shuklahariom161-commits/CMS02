import React from 'react';

interface MitsLogoProps {
  variant?: 'emblem' | 'full' | 'navbar';
  className?: string;
  showSubtitle?: boolean;
}

export const MitsCrestEmblem: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-10 h-10',
  size,
}) => {
  return (
    <img
      src="/mits-crest.svg"
      alt="MITS Gwalior Official Emblem"
      className={`shrink-0 object-contain rounded-xl ${className}`}
      style={size ? { width: size, height: size } : undefined}
      loading="eager"
      referrerPolicy="no-referrer"
    />
  );
};

export const CampusOneFullLogo: React.FC<{ className?: string }> = ({
  className = 'h-10 w-auto',
}) => {
  return (
    <img
      src="/campusone-mits-logo.svg"
      alt="CampusOne - MITS Gwalior"
      className={`shrink-0 object-contain ${className}`}
      loading="eager"
      referrerPolicy="no-referrer"
    />
  );
};

export const MitsLogo: React.FC<MitsLogoProps> = ({
  variant = 'full',
  className = '',
}) => {
  if (variant === 'emblem') {
    return <MitsCrestEmblem className={className} />;
  }

  // Full official unified logo:
  return <CampusOneFullLogo className={className || 'h-10 sm:h-11 md:h-12 w-auto'} />;
};
