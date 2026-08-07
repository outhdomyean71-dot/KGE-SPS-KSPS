import React from 'react';

interface KingdomMottoHeaderProps {
  className?: string;
  align?: 'center' | 'right' | 'left';
}

/**
 * Official Cambodian Kingdom Motto Header (គំរូរដ្ឋបាលកម្ពុជា)
 * Follows official Cambodian government administrative standards:
 *   ព្រះរាជាណាចក្រកម្ពុជា (Khmer Moul font)
 *  ជាតិ សាសនា ព្រះមហាក្សត្រ (Khmer Moul font)
 *  ────── 🕁 ────── (Administrative Flourish Ornament Divider)
 */
export const KingdomMottoHeader: React.FC<KingdomMottoHeaderProps> = ({
  className = '',
  align = 'center',
}) => {
  const alignClass =
    align === 'right'
      ? 'items-end text-right'
      : align === 'left'
      ? 'items-start text-left'
      : 'items-center text-center';

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      {/* Line 1: Kingdom Name in Moul Font */}
      <p className="font-moul text-xs sm:text-sm text-slate-900 font-normal leading-relaxed tracking-wide select-none">
        ព្រះរាជាណាចក្រកម្ពុជា
      </p>

      {/* Line 2: National Motto in Moul Font */}
      <p className="font-moul text-xs sm:text-sm text-slate-900 font-normal leading-relaxed tracking-wide mt-0.5 select-none">
        ជាតិ សាសនា ព្រះមហាក្សត្រ
      </p>

      {/* Line 3: Official Cambodian Administrative Ornamental Flourish Line */}
      <div className="flex items-center justify-center w-36 sm:w-44 my-1.5 text-slate-900">
        <svg
          viewBox="0 0 200 20"
          className="w-full h-4 fill-current text-slate-900 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left horizontal line tapering */}
          <path d="M 8 10 L 72 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 22 13 L 68 13" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />

          {/* Right horizontal line tapering */}
          <path d="M 128 10 L 192 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 132 13 L 178 13" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />

          {/* Center Decorative Filigree / Flourish Emblem Motif */}
          <g transform="translate(100, 10)">
            {/* Central Diamond / Lotus Leaf Motif */}
            <path d="M 0 -8 L 5.5 -2.5 L 9 0 L 5.5 2.5 L 0 8 L -5.5 2.5 L -9 0 L -5.5 -2.5 Z" fill="currentColor" />
            {/* Inner negative space detail */}
            <circle cx="0" cy="0" r="2" fill="#ffffff" />
            {/* Side dots / scroll flourishes */}
            <circle cx="-14" cy="0" r="1.8" fill="currentColor" />
            <circle cx="14" cy="0" r="1.8" fill="currentColor" />
            <circle cx="-21" cy="0" r="1.2" fill="currentColor" />
            <circle cx="21" cy="0" r="1.2" fill="currentColor" />
            {/* Top/bottom accent tips */}
            <path d="M 0 -9.5 L 1.5 -7.5 L -1.5 -7.5 Z" fill="currentColor" />
            <path d="M 0 9.5 L 1.5 7.5 L -1.5 7.5 Z" fill="currentColor" />
          </g>
        </svg>
      </div>
    </div>
  );
};
