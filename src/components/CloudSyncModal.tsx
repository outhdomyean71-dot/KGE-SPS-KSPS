import React, { useState } from 'react';
import { Cloud, CloudCheck, RefreshCw, Copy, Check, X, ShieldCheck, Key, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { LessonPlan, SchoolInfo } from '../types';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncUserId: string;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  onManualSyncUp: () => Promise<void>;
  onManualSyncDown: () => Promise<void>;
  onConnectCustomSyncCode: (code: string) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  syncUserId,
  isSyncing,
  lastSyncedAt,
  onManualSyncUp,
  onManualSyncDown,
  onConnectCustomSyncCode,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(syncUserId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectCode = () => {
    if (!inputCode.trim()) return;
    onConnectCustomSyncCode(inputCode.trim());
    setActionMessage('បានភ្ជាប់ទៅកាន់លេខកូដឧបករណ៍ថ្មីដោយជោគជ័យ!');
    setInputCode('');
    setTimeout(() => setActionMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <CloudCheck className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                ប្រព័ន្ធសមកាលកម្មពពក (Firebase Cloud Sync)
              </h3>
              <p className="text-xs text-sky-200">
                រក្សាទុកចំណាំ និងវឌ្ឍនភាពបង្រៀនលើគ្រប់ឧបករណ៍ (Laptops, Tablets, Phones)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Status Badge Box */}
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              <div>
                <p className="text-xs font-bold text-sky-950">
                  {isSyncing ? 'កំពុងភ្ជាប់ និងសមកាលកម្ម...' : 'ពពកទិន្នន័យ Firebase មានដំណើរការជានិច្ច'}
                </p>
                <p className="text-[11px] text-sky-700">
                  {lastSyncedAt
                    ? `សមកាលកម្មចុងក្រោយ៖ ${lastSyncedAt.toLocaleTimeString('km-KH')} (${lastSyncedAt.toLocaleDateString('km-KH')})`
                    : 'សមកាលកម្មស្វ័យប្រវត្តិក្នុង Real-Time'}
                </p>
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-sky-600" />
          </div>

          {/* Sync Key / Teacher ID Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span>លេខកូដសមកាលកម្មឧបករណ៍ (Your Teacher Sync Code):</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={syncUserId}
                className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2 font-mono text-xs font-bold text-slate-800 focus:outline-none select-all"
              />
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'បានចម្លង!' : 'ចម្លងកូដ'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              💡 ប្រើប្រាស់លេខកូដនេះនៅលើទូរស័ព្ទ ឬកុំព្យូទ័រផ្សេងទៀត ដើម្បីទាញយកកំណត់ចំណាំ និងកិច្ចតែងការរបស់អ្នកភ្លាមៗ!
            </p>
          </div>

          {/* Pair with standard Sync Code */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-blue-600" />
              <span>ភ្ជាប់ទិន្នន័យពីឧបករណ៍ផ្សេង (Connect another device):</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="បញ្ចូលលេខកូដ (Sync Code / UID)..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleConnectCode}
                disabled={!inputCode.trim()}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                ភ្ជាប់ & សមកាលកម្ម
              </button>
            </div>
          </div>

          {/* Action Success Alert */}
          {actionMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold text-center animate-in fade-in duration-150">
              {actionMessage}
            </div>
          )}

          {/* Manual Trigger Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={async () => {
                await onManualSyncUp();
                setActionMessage('បានបញ្ជូន និងរក្សាទុកទិន្នន័យលើ Cloud ដោយជោគជ័យ!');
                setTimeout(() => setActionMessage(null), 3000);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>បញ្ជូនទៅ Cloud ឥឡូវនេះ</span>
            </button>

            <button
              onClick={async () => {
                await onManualSyncDown();
                setActionMessage('បានទាញយកទិន្នន័យចុងក្រោយពី Cloud មកវិញ!');
                setTimeout(() => setActionMessage(null), 3000);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>ទាញយកពី Cloud</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            បិទ
          </button>
        </div>

      </div>
    </div>
  );
};
