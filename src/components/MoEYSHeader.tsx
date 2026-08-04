import React from 'react';
import { SchoolInfo, GradeLevel, Semester, SubjectType } from '../types';
import { School, Calendar, BookOpen, Printer, Sparkles, PieChart, Filter, Plus, FileSpreadsheet, Download, Upload, Clock, UserCheck } from 'lucide-react';
import { SovannaphumiLogo } from './SovannaphumiLogo';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  onOpenSchoolModal: () => void;
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  selectedSemester: Semester | 'ALL';
  setSelectedSemester: (semester: Semester | 'ALL') => void;
  selectedSubject: SubjectType | 'ALL';
  setSelectedSubject: (subject: SubjectType | 'ALL') => void;
  activeView: 'table' | 'print' | 'ai' | 'analytics';
  setActiveView: (view: 'table' | 'print' | 'ai' | 'analytics') => void;
  onOpenAddLessonModal: () => void;
  onOpenTimetableModal: () => void;
  onOpenSlowLearnersModal: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GRADES: GradeLevel[] = ['ថ្នាក់ទី១', 'ថ្នាក់ទី២', 'ថ្នាក់ទី៣', 'ថ្នាក់ទី៤', 'ថ្នាក់ទី៥', 'ថ្នាក់ទី៦'];
const SUBJECTS: (SubjectType | 'ALL')[] = [
  'ALL',
  'ភាសាខ្មែរ',
  'គណិតវិទ្យា',
  'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
  'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
  'ភាសាអង់គ្លេស'
];

export const MoEYSHeader: React.FC<HeaderProps> = ({
  schoolInfo,
  onOpenSchoolModal,
  selectedGrade,
  setSelectedGrade,
  selectedSemester,
  setSelectedSemester,
  selectedSubject,
  setSelectedSubject,
  activeView,
  setActiveView,
  onOpenAddLessonModal,
  onOpenTimetableModal,
  onOpenSlowLearnersModal,
  searchTerm,
  setSearchTerm,
  onExportData,
  onImportData,
}) => {
  return (
    <header className="bg-white border-b border-amber-200/80 shadow-sm sticky top-0 z-30">
      {/* Official Sovannaphumi School Header Banner */}
      <div className="bg-gradient-to-r from-[#b12c1b] via-[#d85822] to-[#ea9c28] text-white py-2.5 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-3">
            {/* Sovannaphumi Emblem badge logo */}
            <div className="shrink-0 transform hover:scale-105 transition-transform duration-200">
              <SovannaphumiLogo className="w-12 h-12" size={48} />
            </div>
            <div>
              <p className="text-xs md:text-sm font-extrabold text-amber-100 uppercase tracking-widest drop-shadow-xs">
                សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ
              </p>
              <h1 className="text-sm md:text-base font-bold text-white tracking-wide mt-0.5">
                ផែនការបង្រៀនប្រចាំឆ្នាំ (ថ្នាក់ទី១ ដល់ទី៦)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-200/30 text-amber-50">
            <School className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold text-amber-200">{schoolInfo.schoolName}</span>
            <span className="text-amber-200/60">|</span>
            <span>ឆ្នាំសិក្សា៖ {schoolInfo.academicYear}</span>
            <button
              onClick={onOpenSchoolModal}
              className="ml-1 text-xs text-amber-300 hover:text-white underline font-bold cursor-pointer transition-colors"
            >
              កែប្រែ
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation & View Selector */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Grade Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-gray-500 uppercase mr-1 shrink-0 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-700" /> កម្រិតថ្នាក់៖
            </span>
            {GRADES.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20 ring-2 ring-blue-600 ring-offset-1'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          {/* View Toggle Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start lg:self-auto">
            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'table'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              តារាងផែនការ
            </button>

            <button
              onClick={() => setActiveView('ai')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'ai'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              ជំនួយការ AI (កិច្ចតែងការ ៥ជំហាន)
            </button>

            <button
              onClick={() => setActiveView('print')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'print'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              ទម្រង់បោះពុម្ព PDF
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'analytics'
                  ? 'bg-white text-amber-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-amber-600" />
              របាយការណ៍
            </button>
          </div>
        </div>

        {/* Secondary Filter Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Semester & Subject Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Semester Filter */}
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg p-0.5">
              <Calendar className="w-3.5 h-3.5 text-amber-700 ml-2" />
              <button
                onClick={() => setSelectedSemester('ALL')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  selectedSemester === 'ALL'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-900 hover:bg-amber-100'
                }`}
              >
                ពេញមួយឆ្នាំ (១០ខែ)
              </button>
              <button
                onClick={() => setSelectedSemester('ឆមាសទី១')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  selectedSemester === 'ឆមាសទី១'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-900 hover:bg-amber-100'
                }`}
              >
                ឆមាសទី១ (ខែ១-៥)
              </button>
              <button
                onClick={() => setSelectedSemester('ឆមាសទី២')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  selectedSemester === 'ឆមាសទី២'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-900 hover:bg-amber-100'
                }`}
              >
                ឆមាសទី២ (ខែ៦-១០)
              </button>
            </div>

            {/* Subject Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-600 font-medium">មុខវិជ្ជា៖</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-blue-900 focus:outline-none cursor-pointer"
              >
                {SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj === 'ALL' ? 'មុខវិជ្ជាទាំងអស់' : subj}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Input, Export/Import & Add Lesson Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 md:w-36">
              <input
                type="text"
                placeholder="ស្វែងរកមេរៀន..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Timetable & Hours Modal Button */}
            <button
              onClick={onOpenTimetableModal}
              title="មើលស្តង់ដារម៉ោងសិក្សា & កាលវិភាគប្រចាំសប្តាហ៍"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>ម៉ោងសិក្សា & កាលវិភាគ</span>
            </button>

            {/* Slow Learners Tracker Button */}
            <button
              onClick={onOpenSlowLearnersModal}
              title="បណ្ណតាមដាន និង ជួយសិស្សរៀនយឺត (EGRA / EGMA)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>សិស្សរៀនយឺត</span>
            </button>

            {/* Export JSON Button */}
            <button
              onClick={onExportData}
              title="រក្សាទុកផែនការបង្រៀនជាឯកសារ JSON"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>នាំចេញ JSON</span>
            </button>

            {/* Import JSON Button */}
            <label
              title="ជ្រើសរើសឯកសារ JSON ដើម្បីនាំចូលផែនការបង្រៀន"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-purple-600" />
              <span>នាំចូល JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportData}
                className="hidden"
                onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
              />
            </label>

            <button
              onClick={onOpenAddLessonModal}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              បន្ថែមមេរៀន
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
