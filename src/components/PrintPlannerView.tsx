import React, { useState } from 'react';
import { LessonPlan, SchoolInfo, GradeLevel, Semester, SubjectType } from '../types';
import { Printer, Download, ArrowLeft, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { SovannaphumiLogo } from './SovannaphumiLogo';
import { printDocument } from '../utils/exportUtils';

interface PrintPlannerViewProps {
  lessons: LessonPlan[];
  schoolInfo: SchoolInfo;
  selectedGrade: GradeLevel;
  selectedSemester: Semester | 'ALL' | 'CUSTOM';
  selectedSubjects: SubjectType[];
  selectedMonths: number[];
  onBackToTable: () => void;
}

export const PrintPlannerView: React.FC<PrintPlannerViewProps> = ({
  lessons,
  schoolInfo,
  selectedGrade,
  selectedSemester,
  selectedSubjects,
  selectedMonths,
  onBackToTable,
}) => {
  // Section toggle states
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [showObjectives, setShowObjectives] = useState<boolean>(true);
  const [showTeachingAids, setShowTeachingAids] = useState<boolean>(true);
  const [showAssessment, setShowAssessment] = useState<boolean>(true);
  const [showCustomNotes, setShowCustomNotes] = useState<boolean>(true);
  const [showSignatures, setShowSignatures] = useState<boolean>(true);

  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(true);

  const handlePrint = () => {
    printDocument('printable-annual-planner', `ផែនការបង្រៀនប្រចាំឆ្នាំ - ${selectedGrade}`);
  };

  const handleResetToggles = () => {
    setShowLogo(true);
    setShowObjectives(true);
    setShowTeachingAids(true);
    setShowAssessment(true);
    setShowCustomNotes(true);
    setShowSignatures(true);
  };

  return (
    <div className="max-w-5xl mx-auto my-6 p-4">
      {/* Top Action Bar (hidden when printing) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={onBackToTable}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          ត្រឡប់ទៅតារាងវិញ
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              isConfigOpen
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-700" />
            <span>កែតម្រូវផ្នែកបោះពុម្ព (Config)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            បោះពុម្ព ឬ ទាញយកជា PDF
          </button>
        </div>
      </div>

      {/* Print Configuration Panel (hidden when printing) */}
      {isConfigOpen && (
        <div className="print:hidden mb-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-xl border border-indigo-900 shadow-md animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-indigo-800/80 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-300" />
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                កំណត់ត្រាផ្នែកត្រូវបង្ហាញក្នុងឯកសារបោះពុម្ព (Print Sections Toggle)
              </h3>
            </div>
            <button
              onClick={handleResetToggles}
              className="flex items-center gap-1 text-[11px] text-indigo-200 hover:text-white underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> កំណត់ឡើងវិញ
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            {/* Toggle Logo */}
            <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
              showLogo ? 'bg-indigo-900/80 border-amber-400 text-white font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={showLogo}
                onChange={(e) => setShowLogo(e.target.checked)}
                className="rounded accent-amber-400 cursor-pointer"
              />
              <span>ឡូហ្គោសាលា</span>
            </label>

            {/* Toggle Objectives */}
            <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
              showObjectives ? 'bg-indigo-900/80 border-amber-400 text-white font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={showObjectives}
                onChange={(e) => setShowObjectives(e.target.checked)}
                className="rounded accent-amber-400 cursor-pointer"
              />
              <span>វត្ថុបំណង</span>
            </label>

            {/* Toggle Teaching Aids */}
            <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
              showTeachingAids ? 'bg-indigo-900/80 border-amber-400 text-white font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={showTeachingAids}
                onChange={(e) => setShowTeachingAids(e.target.checked)}
                className="rounded accent-amber-400 cursor-pointer"
              />
              <span>សម្ភារឧបទេស</span>
            </label>

            {/* Toggle Assessment */}
            <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
              showAssessment ? 'bg-indigo-900/80 border-amber-400 text-white font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={showAssessment}
                onChange={(e) => setShowAssessment(e.target.checked)}
                className="rounded accent-amber-400 cursor-pointer"
              />
              <span>ការវាយតម្លៃ</span>
            </label>

            {/* Toggle Custom Notes */}
            <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
              showCustomNotes ? 'bg-indigo-900/80 border-amber-400 text-white font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={showCustomNotes}
                onChange={(e) => setShowCustomNotes(e.target.checked)}
                className="rounded accent-amber-400 cursor-pointer"
              />
              <span>កំណត់ចំណាំ</span>
            </label>

            {/* Toggle Signatures */}
            <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
              showSignatures ? 'bg-indigo-900/80 border-amber-400 text-white font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={showSignatures}
                onChange={(e) => setShowSignatures(e.target.checked)}
                className="rounded accent-amber-400 cursor-pointer"
              />
              <span>ប្លុកហត្ថលេខា</span>
            </label>
          </div>
        </div>
      )}

      {/* Official Print Preview Container */}
      <div id="printable-annual-planner" className="bg-white p-8 md:p-12 shadow-lg rounded-xl border border-slate-200 print:shadow-none print:border-none print:p-0">
        
        {/* National Header Block matching official template */}
        <div className="mb-6 space-y-4">
          {/* Top Center: Logo and School Name */}
          <div className="text-center space-y-1">
            {showLogo && (
              <div className="flex justify-center mb-2">
                <SovannaphumiLogo className="w-16 h-16" size={64} />
              </div>
            )}
            <h2 className="text-base md:text-lg font-bold text-slate-900 tracking-wide">
              សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ
            </h2>
            <div className="w-28 h-0.5 bg-amber-500 mx-auto my-1.5"></div>
          </div>

          {/* Left and Right Info Columns */}
          <div className="flex flex-row items-start justify-between text-xs font-semibold text-slate-800 pt-2 leading-relaxed">
            <div className="text-left space-y-0.5">
              <p>ក្រសួងអប់រំ យុវជន និងកីឡា</p>
              <p>មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកំពង់ស្ពឺ</p>
              <p>{schoolInfo.schoolName || 'សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ'}</p>
            </div>
            
            <div className="text-right space-y-0.5">
              <p>កម្រិតថ្នាក់៖ <strong className="font-bold">{selectedGrade}</strong></p>
              <p>ឆ្នាំសិក្សា៖ <strong className="font-bold">{schoolInfo.academicYear || '២០២៦ - ២០២៧'}</strong></p>
              <p>គ្រូបន្ទុកថ្នាក់៖ <strong className="font-bold">{schoolInfo.teacherName || 'លោកគ្រូ / អ្នកគ្រូ'}</strong></p>
            </div>
          </div>

          {/* Centered Document Title */}
          <div className="text-center pt-4 pb-2 border-b border-slate-300">
            <h1 className="text-base md:text-xl font-bold text-slate-900">
              ផែនការបង្រៀនប្រចាំឆ្នាំ (១ឆ្នាំពេញ)
            </h1>
            <p className="text-xs text-slate-700 font-bold mt-1">
              សម្រាប់មុខវិជ្ជា៖ {selectedSubjects.length === 5 ? 'គ្រប់មុខវិជ្ជាទាំងអស់' : selectedSubjects.join(', ')} | {selectedMonths.length === 10 ? '១០ខែពេញ' : `ចន្លោះខែទី${Math.min(...selectedMonths, 1)} ដល់ ខែទី${Math.max(...selectedMonths, 10)}`}
            </p>
          </div>
        </div>

        {/* Printable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-900 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900 text-[11px]">
                <th className="border border-slate-900 p-2 text-center w-20">ខែសិក្សា</th>
                <th className="border border-slate-900 p-2 w-28">មុខវិជ្ជា</th>
                <th className="border border-slate-900 p-2 w-44">ចំណងជើងមេរៀន / ជំពូក</th>
                {showObjectives && (
                  <th className="border border-slate-900 p-2">វត្ថុបំណងនៃមេរៀន (គោលដៅសិស្សត្រូវចេះ)</th>
                )}
                {showTeachingAids && (
                  <th className="border border-slate-900 p-2 w-32">សម្ភារឧបទេស</th>
                )}
                {showAssessment && (
                  <th className="border border-slate-900 p-2 w-32">ការវាយតម្លៃ</th>
                )}
                {showCustomNotes && (
                  <th className="border border-slate-900 p-2 w-32">កំណត់ចំណាំ</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-[11px] text-slate-900">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="align-top">
                  <td className="border border-slate-900 p-2 text-center font-bold">
                    {lesson.monthName}
                    <div className="text-[10px] text-slate-600 font-normal">({lesson.hoursAllocated} ម៉ោង)</div>
                  </td>
                  <td className="border border-slate-900 p-2 font-bold">
                    {lesson.subject}
                  </td>
                  <td className="border border-slate-900 p-2">
                    <p className="font-bold">{lesson.chapterTitle}</p>
                    <p className="mt-0.5">{lesson.lessonTitle}</p>
                  </td>
                  {showObjectives && (
                    <td className="border border-slate-900 p-2 space-y-1">
                      <p><strong>• ចំណេះដឹង៖</strong> {lesson.objectives.knowledge}</p>
                      <p><strong>• បំណិន៖</strong> {lesson.objectives.skills}</p>
                      <p><strong>• ឥរិយាបថ៖</strong> {lesson.objectives.attitude}</p>
                    </td>
                  )}
                  {showTeachingAids && (
                    <td className="border border-slate-900 p-2">
                      <ul className="list-disc list-inside">
                        {lesson.teachingAids.map((aid, idx) => (
                          <li key={idx}>{aid}</li>
                        ))}
                      </ul>
                    </td>
                  )}
                  {showAssessment && (
                    <td className="border border-slate-900 p-2">
                      <ul className="list-disc list-inside">
                        {lesson.assessmentMethods?.map((method, idx) => (
                          <li key={idx}>{method}</li>
                        )) || <li>ការសង្កេត & លំហាត់</li>}
                      </ul>
                    </td>
                  )}
                  {showCustomNotes && (
                    <td className="border border-slate-900 p-2 italic text-slate-700">
                      {lesson.customNotes || '-'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature Sign-off Block */}
        {showSignatures && (
          <div className="mt-12 grid grid-cols-2 text-center text-xs text-slate-900 font-bold pt-4">
            <div className="space-y-16">
              <div>
                <p>បានឃើញ និងឯកភាព</p>
                <p className="uppercase mt-0.5">នាយកសាលាបឋមសិក្សា</p>
              </div>
              <p className="pt-8">...................................................</p>
            </div>

            <div className="space-y-16">
              <div>
                <p>ថ្ងៃ................ ខែ........... ឆ្នាំ២០២៦</p>
                <p className="mt-0.5">គ្រូបន្ទុកថ្នាក់</p>
              </div>
              <p className="pt-8">{schoolInfo.teacherName}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
