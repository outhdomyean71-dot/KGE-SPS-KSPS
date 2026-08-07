import React from 'react';
import { SlidersHorizontal, Palette, AlignJustify, Type, Sparkles, Check } from 'lucide-react';
import { OfficePrintConfig, OfficePrintColorMode, OfficePrintSpacingMode, OfficePrintFontSize } from '../types';

interface OfficePrintLayoutControlProps {
  config: OfficePrintConfig;
  onChange: (newConfig: OfficePrintConfig) => void;
  className?: string;
}

export const OfficePrintLayoutControl: React.FC<OfficePrintLayoutControlProps> = ({
  config,
  onChange,
  className = '',
}) => {
  return (
    <div className={`bg-slate-900 text-white p-4 rounded-xl border border-slate-700 shadow-md ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              ទម្រង់បោះពុម្ពតាមការិយាល័យ (Office Print Layout)
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full font-normal">
                ស្តង់ដារក្រសួងអប់រំ
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              កំណត់ទម្រង់ពណ៌ គម្លាតអក្សរ និងទំហំពុម្ពអក្សរឱ្យត្រូវតាមស្តង់ដាររដ្ឋបាលផ្លូវការ
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* 1. Color Profile Selector */}
        <div className="space-y-2 bg-slate-800/60 p-3 rounded-lg border border-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Palette className="w-3.5 h-3.5" />
            <span>១. ទម្រង់ពណ៌ឯកសារ (Color Mode)</span>
          </div>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onChange({ ...config, colorMode: 'official' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                config.colorMode === 'official'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>ពណ៌ផ្លូវការក្រសួង (MoEYS Official)</span>
              </div>
              {config.colorMode === 'official' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...config, colorMode: 'monochrome' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                config.colorMode === 'monochrome'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-900 inline-block"></span>
                <span>សខ្មៅការិយាល័យ (Laser Print B&W)</span>
              </div>
              {config.colorMode === 'monochrome' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...config, colorMode: 'navy' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                config.colorMode === 'navy'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                <span>ពណ៌ខៀវរដ្ឋបាល (Royal Blue)</span>
              </div>
              {config.colorMode === 'navy' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* 2. Spacing / Line Density Selector */}
        <div className="space-y-2 bg-slate-800/60 p-3 rounded-lg border border-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <AlignJustify className="w-3.5 h-3.5" />
            <span>២. គម្លាតបន្ទាត់អក្សរ (Line Spacing)</span>
          </div>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onChange({ ...config, spacingMode: 'standard' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                config.spacingMode === 'standard'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <span>ស្តង់ដាររដ្ឋបាល (1.5 Line Spacing)</span>
              {config.spacingMode === 'standard' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...config, spacingMode: 'compact' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                config.spacingMode === 'compact'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <span>បង្រួមទំព័រ (1.2 Compact - សន្សំក្រដាស)</span>
              {config.spacingMode === 'compact' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...config, spacingMode: 'spacious' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                config.spacingMode === 'spacious'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <span>ទូលាយ (1.8 Spacious - ស្រួលពិនិត្យ)</span>
              {config.spacingMode === 'spacious' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* 3. Font Size Scaling */}
        <div className="space-y-2 bg-slate-800/60 p-3 rounded-lg border border-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Type className="w-3.5 h-3.5" />
            <span>៣. ទំហំពុម្ពអក្សរ (Font Scale)</span>
          </div>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onChange({ ...config, fontSize: 'normal' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                config.fontSize === 'normal'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <span>ធម្មតា 100% (Standard Font)</span>
              {config.fontSize === 'normal' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...config, fontSize: 'small' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                config.fontSize === 'small'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <span>តូច 85% (Small - ទិន្នន័យច្រើន)</span>
              {config.fontSize === 'small' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...config, fontSize: 'large' })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                config.fontSize === 'large'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <span>ធំ 115% (Large - អានច្បាស់)</span>
              {config.fontSize === 'large' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
