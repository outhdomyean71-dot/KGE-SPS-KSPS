import React, { useState } from 'react';
import { GradeLevel, SchoolInfo } from '../types';
import { X, Calendar, Clock, Printer, CheckCircle, Info } from 'lucide-react';

interface WeeklyTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGrade: GradeLevel;
  schoolInfo: SchoolInfo;
}

// MoEYS Standard Weekly Hour Allocations
const MOEYS_HOURS_MATRIX: Record<GradeLevel, { subject: string; hours: number; color: string }[]> = {
  'ថ្នាក់ទី១': [
    { subject: 'ភាសាខ្មែរ', hours: 13, color: 'bg-red-50 text-red-700 border-red-200' },
    { subject: 'គណិតវិទ្យា', hours: 7, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម', hours: 4, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា', hours: 2, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { subject: 'ភាសាអង់គ្លេស / ឌីជីថល', hours: 2, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ],
  'ថ្នាក់ទី២': [
    { subject: 'ភាសាខ្មែរ', hours: 12, color: 'bg-red-50 text-red-700 border-red-200' },
    { subject: 'គណិតវិទ្យា', hours: 7, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម', hours: 4, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា', hours: 2, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { subject: 'ភាសាអង់គ្លេស / ឌីជីថល', hours: 2, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ],
  'ថ្នាក់ទី៣': [
    { subject: 'ភាសាខ្មែរ', hours: 12, color: 'bg-red-50 text-red-700 border-red-200' },
    { subject: 'គណិតវិទ្យា', hours: 6, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម', hours: 5, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា', hours: 2, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { subject: 'ភាសាអង់គ្លេស / ឌីជីថល', hours: 2, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ],
  'ថ្នាក់ទី៤': [
    { subject: 'ភាសាខ្មែរ', hours: 10, color: 'bg-red-50 text-red-700 border-red-200' },
    { subject: 'គណិតវិទ្យា', hours: 6, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម', hours: 6, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា', hours: 2, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { subject: 'ភាសាអង់គ្លេស', hours: 3, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { subject: 'បច្ចេកវិទ្យាឌីជីថល / STEAM', hours: 2, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  ],
  'ថ្នាក់ទី៥': [
    { subject: 'ភាសាខ្មែរ', hours: 10, color: 'bg-red-50 text-red-700 border-red-200' },
    { subject: 'គណិតវិទ្យា', hours: 6, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម', hours: 6, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា', hours: 2, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { subject: 'ភាសាអង់គ្លេស', hours: 3, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { subject: 'បច្ចេកវិទ្យាឌីជីថល / STEAM', hours: 2, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  ],
  'ថ្នាក់ទី៦': [
    { subject: 'ភាសាខ្មែរ', hours: 10, color: 'bg-red-50 text-red-700 border-red-200' },
    { subject: 'គណិតវិទ្យា', hours: 6, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម', hours: 6, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា', hours: 2, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { subject: 'ភាសាអង់គ្លេស', hours: 3, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { subject: 'បច្ចេកវិទ្យាឌីជីថល / STEAM', hours: 2, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  ],
};

const DEFAULT_TIMETABLE: Record<string, string[]> = {
  'ចន្ទ': ['ភាសាខ្មែរ', 'ភាសាខ្មែរ', 'គណិតវិទ្យា', 'វិទ្យាសាស្ត្រ', 'សីលធម៌'],
  'អង្គារ': ['ភាសាខ្មែរ', 'ភាសាខ្មែរ', 'គណិតវិទ្យា', 'ភាសាអង់គ្លេស', 'សិក្សាសង្គម'],
  'ពុធ': ['ភាសាខ្មែរ', 'គណិតវិទ្យា', 'គណិតវិទ្យា', 'វិទ្យាសាស្ត្រ', 'ឌីជីថល / STEAM'],
  'ព្រហស្បតិ៍': ['ភាសាខ្មែរ', 'ភាសាខ្មែរ', 'គណិតវិទ្យា', 'ភាសាអង់គ្លេស', 'សិក្សាសង្គម'],
  'សុក្រ': ['ភាសាខ្មែរ', 'គណិតវិទ្យា', 'វិទ្យាសាស្ត្រ', 'សីលធម៌', 'កាយអប់រំ / សិល្បៈ'],
};

export const WeeklyTimetableModal: React.FC<WeeklyTimetableModalProps> = ({
  isOpen,
  onClose,
  selectedGrade,
  schoolInfo,
}) => {
  const [activeTab, setActiveTab] = useState<'HOURS' | 'TIMETABLE'>('HOURS');

  if (!isOpen) return null;

  const hoursData = MOEYS_HOURS_MATRIX[selectedGrade] || [];
  const totalWeeklyHours = hoursData.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400 text-blue-950 rounded-lg shadow font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                ស្តង់ដារម៉ោងសិក្សា & កាលវិភាគប្រចាំសប្តាហ៍ ឆ្នាំ២០២៦
              </h2>
              <p className="text-xs text-amber-300 font-medium">
                {selectedGrade} | {schoolInfo.schoolName || 'សាលារៀន'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('HOURS')}
            className={`px-4 py-2 font-bold text-xs rounded-t-lg transition-all cursor-pointer border-t border-x ${
              activeTab === 'HOURS'
                ? 'bg-white border-slate-200 text-blue-900 border-b-transparent shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            📊 តារាងម៉ោងសិក្សាតាមមុខវិជ្ជា (MoEYS Matrix)
          </button>

          <button
            onClick={() => setActiveTab('TIMETABLE')}
            className={`px-4 py-2 font-bold text-xs rounded-t-lg transition-all cursor-pointer border-t border-x ${
              activeTab === 'TIMETABLE'
                ? 'bg-white border-slate-200 text-blue-900 border-b-transparent shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            📅 កាលវិភាគបង្រៀនគំរូប្រចាំសប្តាហ៍
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800 flex-1">
          {activeTab === 'HOURS' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-blue-900 leading-relaxed text-xs">
                  តារាងខាងក្រោមបង្ហាញពីចំនួនម៉ោងសិក្សាតាមមុខវិជ្ជានីមួយៗប្រចាំសប្តាហ៍ ផ្អែកតាមកម្មវិធីសិក្សាលម្អិតថ្នាក់ជាតិរបស់ក្រសួងអប់រំ យុវជន និងកីឡា សម្រាប់កម្រិត <strong>{selectedGrade}</strong>។
                </p>
              </div>

              {/* Matrix Table */}
              <div className="overflow-hidden border border-slate-200 rounded-xl shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 text-xs font-bold border-b border-slate-200">
                      <th className="py-3 px-4">មុខវិជ្ជាចំណេះទូទៅ</th>
                      <th className="py-3 px-4 text-center">ម៉ោង/សប្តាហ៍</th>
                      <th className="py-3 px-4 text-center">ភាគរយកម្មវិធី</th>
                      <th className="py-3 px-4">សម្គាល់</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {hoursData.map((item, idx) => {
                      const percentage = Math.round((item.hours / totalWeeklyHours) * 100);
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <span className={`px-2.5 py-1 rounded-md border text-xs font-bold ${item.color}`}>
                              {item.subject}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-900">
                            {item.hours} ម៉ោង
                          </td>
                          <td className="py-3 px-4 text-center text-slate-600">
                            {percentage}%
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {item.subject.includes('ខ្មែរ') ? 'មុខវិជ្ជាស្នូល (ការអាន និង សរសេរ)' :
                             item.subject.includes('គណិត') ? 'គណិតវិទ្យា និង បំណិនគណនា' :
                             item.subject.includes('ឌីជីថល') ? 'បច្ចេកវិទ្យា និង STEM/STEAM' : 'មុខវិជ្ជាបន្ថែម'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-amber-100/70 border-t-2 border-amber-300 font-bold text-amber-950 text-xs">
                      <td className="py-3 px-4">ម៉ោងសិក្សាសរុបប្រចាំសប្តាហ៍៖</td>
                      <td className="py-3 px-4 text-center text-amber-900 text-sm">{totalWeeklyHours} ម៉ោង</td>
                      <td className="py-3 px-4 text-center">100%</td>
                      <td className="py-3 px-4 text-amber-900">ស្តង់ដារក្រសួងអប់រំ ២០២៦</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 font-medium">
                  កាលវិភាគបង្រៀនគំរូសម្រាប់ <strong>{selectedGrade}</strong> (ចន្ទ - សុក្រ)៖
                </p>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>បោះពុម្ពកាលវិភាគ</span>
                </button>
              </div>

              {/* Timetable Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white text-xs font-bold border-b border-slate-700">
                      <th className="py-3 px-3 w-20 border-r border-slate-700">ម៉ោង/ថ្ងៃ</th>
                      <th className="py-3 px-3 border-r border-slate-700">ចន្ទ</th>
                      <th className="py-3 px-3 border-r border-slate-700">អង្គារ</th>
                      <th className="py-3 px-3 border-r border-slate-700">ពុធ</th>
                      <th className="py-3 px-3 border-r border-slate-700">ព្រហស្បតិ៍</th>
                      <th className="py-3 px-3">សុក្រ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-bold text-xs">
                    {['ម៉ោងទី១', 'ម៉ោងទី២', 'ម៉ោងទី៣', 'ម៉ោងទី៤', 'ម៉ោងទី៥'].map((period, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-2 bg-slate-100 text-slate-700 border-r border-slate-200 font-bold">
                          {period}
                        </td>
                        {['ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ'].map((day) => {
                          const subj = DEFAULT_TIMETABLE[day]?.[idx] || 'ស្វ័យសិក្សា';
                          return (
                            <td key={day} className="py-3 px-2 border-r border-slate-200 text-slate-800">
                              <span className="px-2 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200 inline-block text-[11px]">
                                {subj}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg cursor-pointer transition-all"
          >
            បិទ
          </button>
        </div>

      </div>
    </div>
  );
};
