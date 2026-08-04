import React, { useState } from 'react';
import { SchoolInfo } from '../types';
import { School, X, Save } from 'lucide-react';

interface SchoolInfoModalProps {
  schoolInfo: SchoolInfo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (info: SchoolInfo) => void;
}

export const SchoolInfoModal: React.FC<SchoolInfoModalProps> = ({
  schoolInfo,
  isOpen,
  onClose,
  onSave,
}) => {
  const [info, setInfo] = useState<SchoolInfo>(schoolInfo);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(info);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-amber-300" />
            <h2 className="text-sm font-bold text-white">កែប្រែព័ត៌មានសាលារៀន និង គ្រូបង្រៀន</h2>
          </div>
          <button onClick={onClose} className="p-1 text-blue-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-800">
          <div>
            <label className="font-bold block mb-1">ឈ្មោះសាលាបឋមសិក្សា៖</label>
            <input
              type="text"
              value={info.schoolName}
              onChange={(e) => setInfo({ ...info, schoolName: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-bold block mb-1">រាជធានី / ខេត្ត / ខណ្ឌ / ស្រុក៖</label>
            <input
              type="text"
              value={info.provinceDistrict}
              onChange={(e) => setInfo({ ...info, provinceDistrict: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-bold block mb-1">ឈ្មោះគ្រូបន្ទុកថ្នាក់៖</label>
            <input
              type="text"
              value={info.teacherName}
              onChange={(e) => setInfo({ ...info, teacherName: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-bold block mb-1">ឆ្នាំសិក្សា៖</label>
            <input
              type="text"
              value={info.academicYear}
              onChange={(e) => setInfo({ ...info, academicYear: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg cursor-pointer"
            >
              <Save className="w-4 h-4" /> រក្សាទុក
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
