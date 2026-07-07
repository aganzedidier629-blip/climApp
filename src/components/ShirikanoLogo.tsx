import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
}

export default function ShirikanoLogo({ className = '', variant = 'horizontal', size = 'md' }: LogoProps) {
  // Dimensions based on size
  const iconSize = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24';
  const textTitleSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-4xl';
  const textSubSize = size === 'sm' ? 'text-[9px] tracking-[0.2em]' : size === 'md' ? 'text-xs tracking-[0.25em]' : 'text-sm tracking-[0.28em]';
  const taglineSize = size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-xs' : 'text-sm';

  const brainIcon = (
    <svg
      viewBox="0 0 100 100"
      className={`${iconSize} text-[#22b0a8] fill-none stroke-current`}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left side: Cybernetic Circuit Brain */}
      <g strokeWidth="2.5" className="text-[#22b0a8]">
        {/* Main brain shell left boundary */}
        <path d="M 50 15 C 38 15, 20 22, 20 38 C 20 45, 23 52, 15 60 C 8 68, 12 78, 25 80 C 28 80, 32 82, 38 85 C 44 88, 50 82, 50 85" strokeWidth="2.5" />
        
        {/* Circuit Trunk lines and nodes */}
        <path d="M 50 35 L 35 35 M 35 35 L 30 45" />
        <circle cx="30" cy="45" r="2.5" className="fill-[#22b0a8] stroke-none" />

        <path d="M 50 50 L 32 50 L 26 62" />
        <circle cx="26" cy="62" r="2.5" className="fill-[#22b0a8] stroke-none" />

        <path d="M 50 65 L 40 65 L 34 74" />
        <circle cx="34" cy="74" r="2.5" className="fill-[#22b0a8] stroke-none" />

        <path d="M 50 22 L 38 22 C 34 22, 28 26, 28 32" />
        <circle cx="28" cy="32" r="2.5" className="fill-[#22b0a8] stroke-none" />
        
        {/* Center line (split) */}
        <line x1="50" y1="15" x2="50" y2="85" strokeWidth="1.5" strokeDasharray="3,3" className="opacity-40" />
      </g>

      {/* Right side: Biological Organic Brain wrinkles */}
      <g strokeWidth="2.5" className="text-[#22b0a8]">
        {/* Main brain shell right boundary */}
        <path d="M 50 15 C 62 15, 80 22, 80 38 C 80 45, 77 52, 85 60 C 92 68, 88 78, 75 80 C 72 80, 68 82, 62 85 C 56 88, 50 82, 50 85" />
        
        {/* Lobe folds */}
        <path d="M 50 25 C 60 25, 68 28, 68 35 C 68 40, 58 40, 50 40" />
        <path d="M 50 45 C 64 45, 74 48, 74 55 C 74 62, 62 62, 50 62" />
        <path d="M 50 68 C 60 68, 70 70, 70 75 C 70 80, 60 80, 50 80" />
        <path d="M 50 32 C 55 32, 60 34, 60 38" />
        <path d="M 50 52 C 58 52, 64 54, 64 58" />
      </g>
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{brainIcon}</div>;
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {brainIcon}
        <div className="mt-3">
          <h1 className={`${textTitleSize} font-extrabold tracking-tight text-white font-sans leading-none`}>
            SHIRIKANO
          </h1>
          <h2 className={`${textSubSize} font-bold text-white uppercase mt-1 leading-none`}>
            TRAINING
          </h2>
          <p className={`${taglineSize} text-[#22b0a8] font-medium mt-2`}>
            Formons l'avenir numérique
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {brainIcon}
      <div className="flex flex-col justify-center">
        <h1 className={`${textTitleSize} font-extrabold tracking-tight text-white font-sans leading-none`}>
          SHIRIKANO
        </h1>
        <h2 className={`${textSubSize} font-bold text-white uppercase mt-1 leading-none`}>
          TRAINING
        </h2>
        <p className={`${taglineSize} text-[#22b0a8] font-medium mt-1.5 leading-none`}>
          Formons l'avenir numérique
        </p>
      </div>
    </div>
  );
}
