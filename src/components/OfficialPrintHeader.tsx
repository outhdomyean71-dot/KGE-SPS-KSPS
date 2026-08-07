import React from 'react';
import { SchoolInfo } from '../types';
import { SovannaphumiLogo } from './SovannaphumiLogo';
import { KingdomMottoHeader } from './KingdomMottoHeader';

interface OfficialPrintHeaderProps {
  schoolInfo?: Partial<SchoolInfo>;
  title: string;
  subTitle1?: string;
  subTitle2?: string;
  showLogo?: boolean;
  className?: string;
}

/**
 * Standard Official Cambodian MoEYS Administrative Header for PDF & Print documents.
 * Exactly matches the Ministry of Education, Youth and Sport official layout:
 * - Left: Ministry, Province & School Name
 * - Center: School / MoEYS Emblem Badge Logo
 * - Right: Cambodian Kingdom Name & Motto with Administrative Ornament
 * - Center Bottom: Main Document Title & Subtitles
 */
export const OfficialPrintHeader: React.FC<OfficialPrintHeaderProps> = ({
  schoolInfo,
  title,
  subTitle1,
  subTitle2,
  showLogo = true,
  className = '',
}) => {
  const province = schoolInfo?.provinceDistrict || 'ខេត្តកំពង់ស្ពឺ';
  const schoolName = schoolInfo?.schoolName || 'សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ';

  return (
    <div className={`mb-6 space-y-3 border-b-2 border-slate-900 pb-4 ${className}`}>
      {/* Top Row: 3 Columns (Left Ministry/School, Center Logo, Right Kingdom Motto) */}
      <div className="flex flex-row items-center justify-between text-xs font-semibold text-slate-900 leading-relaxed gap-4 w-full">
        {/* Left Column: Ministry & Province & School Info */}
        <div className="text-left space-y-0.5 shrink-0">
          <p className="font-moul text-xs text-slate-900 leading-normal">
            ក្រសួងអប់រំ យុវជន និងកីឡា
          </p>
          <p className="font-bold text-slate-800 leading-normal">
            មន្ទីរអប់រំ យុវជន និងកីឡា {province}
          </p>
          <p className="font-bold text-amber-900 leading-normal">
            {schoolName}
          </p>
        </div>

        {/* Center Column: School / MoEYS Emblem Badge Logo */}
        {showLogo && (
          <div className="flex flex-col items-center justify-center shrink-0 my-auto">
            <SovannaphumiLogo className="w-14 h-14" size={56} />
          </div>
        )}

        {/* Right Column: Kingdom Name & Motto & Flourish Line */}
        <div className="shrink-0 text-center flex flex-col items-center">
          <KingdomMottoHeader align="center" />
        </div>
      </div>

      {/* Centered Document Title & Subtitles */}
      <div className="text-center pt-2">
        <h1 className="font-moul text-base md:text-lg text-slate-900 uppercase leading-snug">
          {title}
        </h1>
        {subTitle1 && (
          <p className="text-xs text-slate-900 font-bold mt-1">
            {subTitle1}
          </p>
        )}
        {subTitle2 && (
          <p className="text-[11px] text-slate-700 font-medium mt-0.5">
            {subTitle2}
          </p>
        )}
      </div>
    </div>
  );
};
