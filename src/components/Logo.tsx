import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    hero: 'w-16 h-16',
  }[size];

  const textClasses = {
    sm: 'text-lg tracking-wider font-extrabold',
    md: 'text-xl tracking-wider font-extrabold',
    lg: 'text-2xl tracking-wider font-extrabold',
    hero: 'text-4xl tracking-widest font-black',
  }[size];

  return (
    <div
      id="thermalens-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Globe Circle */}
          <circle cx="60" cy="60" r="48" stroke="#3D5A45" strokeWidth="4" className="text-[#3D5A45]" />
          
          {/* Globe Latitude Lines */}
          <ellipse cx="60" cy="60" rx="48" ry="24" stroke="#486D52" strokeWidth="3" strokeDasharray="none" />
          <line x1="12" y1="60" x2="108" y2="60" stroke="#486D52" strokeWidth="3" />
          
          {/* Globe Longitude Lines */}
          <ellipse cx="60" cy="60" rx="24" ry="48" stroke="#3D5A45" strokeWidth="3" />
          <line x1="60" y1="12" x2="60" y2="108" stroke="#3D5A45" strokeWidth="3" />

          {/* Sinuous Wave (Heat curve with dual outline) */}
          <path
            d="M 22 78 C 36 78, 42 46, 56 46 C 70 46, 74 66, 88 50 C 96 40, 102 26, 108 24"
            fill="none"
            stroke="#1E3224"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 22 76 C 36 76, 42 44, 56 44 C 70 44, 74 64, 88 48 C 96 38, 102 24, 108 22"
            fill="none"
            stroke="#558B62"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span className={`text-[#14432A] font-extrabold uppercase font-sans ${textClasses}`}>
          THERMALENS
        </span>
      )}
    </div>
  );
};
