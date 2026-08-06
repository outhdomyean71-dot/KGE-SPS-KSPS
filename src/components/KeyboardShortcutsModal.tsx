import React from 'react';
import { Keyboard, X, Sparkles, Printer, Save, Search, Plus, Calendar, UserCheck, BookOpen, Layers } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcutGroups = [
    {
      title: 'សកម្មភាពសំខាន់ៗ (Core Workflow)',
      icon: <Save className="w-4 h-4 text-amber-600" />,
      items: [
        {
          keys: [`${modKey}`, 'S'],
          label: 'រក្សាទុក & សមកាលកម្មទិន្នន័យ (Save & Cloud Sync)',
        },
        {
          keys: [`${modKey}`, 'P'],
          label: 'បើកទម្រង់បោះពុម្ព / បោះពុម្ព PDF (Print / PDF View)',
        },
        {
          keys: [`${modKey}`, 'K'],
          altKeys: ['/'],
          label: 'ស្វែងរកមេរៀន (Focus Search)',
        },
        {
          keys: ['Esc'],
          label: 'បិទផ្ទាំង Pop-up ទាំងអស់ (Close Modals)',
        },
      ],
    },
    {
      title: 'ការផ្លាស់ប្តូរទិដ្ឋភាព (Navigation Views)',
      icon: <Layers className="w-4 h-4 text-blue-600" />,
      items: [
        {
          keys: [`${modKey}`, 'Shift', 'A'],
          label: 'បើកជំនួយការ AI កិច្ចតែងការ (AI Lesson Assistant)',
        },
        {
          keys: ['Alt', '1 - 6'],
          label: 'ផ្លាស់ប្តូរកម្រិតថ្នាក់ទី១ ដល់ទី៦ (Switch Grade Level)',
        },
        {
          keys: [`${modKey}`, 'Shift', 'H'],
          altKeys: ['?'],
          label: 'បង្ហាញបញ្ជីគ្រាប់ចុចកាត់ (Keyboard Shortcuts)',
        },
      ],
    },
    {
      title: 'ឧបករណ៍បង្រៀន & កិច្ចការ (Teaching Tools)',
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      items: [
        {
          keys: ['Alt', 'N'],
          label: 'បន្ថែមមេរៀនថ្មី (Add New Lesson)',
        },
        {
          keys: ['Alt', 'T'],
          label: 'កាលវិភាគបង្រៀន & ម៉ោងសិក្សា (Timetable & Hours)',
        },
        {
          keys: ['Alt', 'S'],
          label: 'ផែនការសិស្សរៀនយឺត (Slow Learners Plan)',
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white p-4 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <Keyboard className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                គ្រាប់ចុចកាត់សម្រួលការងារលោកគ្រូ អ្នកគ្រូ
              </h2>
              <p className="text-xs text-amber-200/90 font-medium">
                Keyboard Shortcuts for Faster Lesson Planning & Printing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              ប្រើប្រាស់គ្រាប់ចុចកាត់ (Hotkeys) នៅលើ Keyboard ដើម្បីបង្កើនល្បឿនក្នុងការរៀបចំផែនការបង្រៀន រក្សាទុកទិន្នន័យ និងបោះពុម្ពឯកសារបានយ៉ាងរហ័សទាន់ចិត្ត!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcutGroups.map((group, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3 ${
                  idx === 0 ? 'md:col-span-2 bg-gradient-to-br from-amber-50/30 to-slate-50' : ''
                }`}
              >
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  {group.icon}
                  <h3 className="text-xs font-bold text-slate-900">{group.title}</h3>
                </div>

                <div className="space-y-2">
                  {group.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between gap-3 text-xs bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs"
                    >
                      <span className="font-semibold text-slate-700">{item.label}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            <kbd className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 rounded font-mono font-bold text-[11px] shadow-2xs">
                              {k}
                            </kbd>
                            {kIdx < item.keys.length - 1 && <span className="text-slate-400 font-bold text-[10px]">+</span>}
                          </React.Fragment>
                        ))}
                        {item.altKeys && (
                          <>
                            <span className="text-slate-400 font-normal mx-0.5 text-[10px]">ឬ</span>
                            {item.altKeys.map((ak, akIdx) => (
                              <kbd key={akIdx} className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 rounded font-mono font-bold text-[11px] shadow-2xs">
                                {ak}
                              </kbd>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            ចុច <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono">Esc</kbd> គ្រប់ពេលដើម្បីបិទផ្ទាំងនេះ
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            យល់ព្រម
          </button>
        </div>

      </div>
    </div>
  );
};
