import React, { useState, useRef, useEffect } from 'react';
import { SchoolInfo, GradeLevel, Semester, SubjectType } from '../types';
import { School, Calendar, BookOpen, Printer, Sparkles, PieChart, Filter, Plus, FileSpreadsheet, Download, Upload, Clock, UserCheck, CloudCheck, Check, ChevronDown, Keyboard } from 'lucide-react';
import { SovannaphumiLogo } from './SovannaphumiLogo';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  onOpenSchoolModal: () => void;
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  selectedSemester: Semester | 'ALL' | 'CUSTOM';
  setSelectedSemester: (semester: Semester | 'ALL' | 'CUSTOM') => void;
  selectedSubjects: SubjectType[];
  setSelectedSubjects: (subjects: SubjectType[]) => void;
  selectedMonths: number[];
  setSelectedMonths: (months: number[]) => void;
  activeView: 'table' | 'print' | 'ai' | 'analytics';
  setActiveView: (view: 'table' | 'print' | 'ai' | 'analytics') => void;
  onOpenAddLessonModal: () => void;
  onOpenTimetableModal: () => void;
  onOpenSlowLearnersModal: () => void;
  onOpenCloudSyncModal: () => void;
  onOpenShortcutsModal: () => void;
  isCloudSynced: boolean;
  isSyncing: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

const GRADES: GradeLevel[] = ['ថ្នាក់ទី១', 'ថ្នាក់ទី២', 'ថ្នាក់ទី៣', 'ថ្នាក់ទី៤', 'ថ្នាក់ទី៥', 'ថ្នាក់ទី៦'];

export const ALL_SUBJECTS: SubjectType[] = [
  'ភាសាខ្មែរ',
  'គណិតវិទ្យា',
  'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
  'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
  'ភាសាអង់គ្លេស',
];

export const ACADEMIC_MONTHS = [
  { number: 1, label: 'ខែទី១ (វិច្ឆិកា)' },
  { number: 2, label: 'ខែទី២ (ធ្នូ)' },
  { number: 3, label: 'ខែទី៣ (មករា)' },
  { number: 4, label: 'ខែទី៤ (កុម្ភៈ)' },
  { number: 5, label: 'ខែទី៥ (មីនា)' },
  { number: 6, label: 'ខែទី៦ (មេសា)' },
  { number: 7, label: 'ខែទី៧ (ឧសភា)' },
  { number: 8, label: 'ខែទី៨ (មិថុនា)' },
  { number: 9, label: 'ខែទី៩ (កក្កដា)' },
  { number: 10, label: 'ខែទី១០ (សីហា)' },
];

export const MoEYSHeader: React.FC<HeaderProps> = ({
  schoolInfo,
  onOpenSchoolModal,
  selectedGrade,
  setSelectedGrade,
  selectedSemester,
  setSelectedSemester,
  selectedSubjects,
  setSelectedSubjects,
  selectedMonths,
  setSelectedMonths,
  activeView,
  setActiveView,
  onOpenAddLessonModal,
  onOpenTimetableModal,
  onOpenSlowLearnersModal,
  onOpenCloudSyncModal,
  onOpenShortcutsModal,
  isCloudSynced,
  isSyncing,
  searchTerm,
  setSearchTerm,
  onExportData,
  onImportData,
  searchInputRef,
}) => {
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false);

  const subjectMenuRef = useRef<HTMLDivElement>(null);
  const monthMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (subjectMenuRef.current && !subjectMenuRef.current.contains(event.target as Node)) {
        setIsSubjectMenuOpen(false);
      }
      if (monthMenuRef.current && !monthMenuRef.current.contains(event.target as Node)) {
        setIsMonthMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Subject multi-select helpers
  const handleToggleSubject = (subject: SubjectType) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSelectAllSubjects = () => {
    setSelectedSubjects([...ALL_SUBJECTS]);
  };

  const handleClearSubjects = () => {
    setSelectedSubjects([]);
  };

  // Month selection helpers
  const handleToggleMonth = (monthNum: number) => {
    if (selectedMonths.includes(monthNum)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== monthNum));
    } else {
      setSelectedMonths([...selectedMonths, monthNum].sort((a, b) => a - b));
    }
    setSelectedSemester('CUSTOM');
  };

  const handleSetMonthRange = (start: number, end: number, semesterName?: Semester | 'ALL') => {
    const range: number[] = [];
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    for (let i = min; i <= max; i++) {
      range.push(i);
    }
    setSelectedMonths(range);
    if (semesterName) {
      setSelectedSemester(semesterName);
    } else {
      setSelectedSemester('CUSTOM');
    }
  };

  const currentMinMonth = selectedMonths.length > 0 ? Math.min(...selectedMonths) : 1;
  const currentMaxMonth = selectedMonths.length > 0 ? Math.max(...selectedMonths) : 10;
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

          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
            {/* Keyboard Shortcuts Button */}
            <button
              onClick={onOpenShortcutsModal}
              title="មើលបញ្ជីគ្រាប់ចុចកាត់ (Keyboard Shortcuts - Ctrl+/)"
              className="flex items-center gap-1.5 text-xs bg-black/30 hover:bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-200/40 text-amber-100 cursor-pointer transition-all hover:scale-105"
            >
              <Keyboard className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-bold">គ្រាប់ចុចកាត់</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] bg-white/20 text-white rounded font-mono">
                Ctrl+/
              </kbd>
            </button>

            {/* Cloud Sync Status Badge */}
            <button
              onClick={onOpenCloudSyncModal}
              title="ចុចដើម្បីមើល ឬសមកាលកម្មទិន្នន័យលើឧបករណ៍ផ្សេងទៀត"
              className="flex items-center gap-1.5 text-xs bg-sky-950/40 hover:bg-sky-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-300/40 text-sky-100 cursor-pointer transition-all"
            >
              <CloudCheck className={`w-3.5 h-3.5 ${isSyncing ? 'text-amber-300 animate-spin' : 'text-sky-300'}`} />
              <span className="font-bold text-sky-200">
                {isSyncing ? 'កំពុងសមកាលកម្ម...' : isCloudSynced ? 'ពពកទិន្នន័យបានភ្ជាប់ ☁️' : 'សមកាលកម្ម Cloud'}
              </span>
            </button>

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

        {/* Multi-Select Filters Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Multi-Select Subjects & Specific Monthly Interval Filters */}
          <div className="flex flex-wrap items-center gap-2">

            {/* Monthly Interval Filter Selector */}
            <div className="relative" ref={monthMenuRef}>
              <button
                onClick={() => setIsMonthMenuOpen(!isMonthMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  selectedMonths.length === 10
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-indigo-50 text-indigo-950 border-indigo-300 hover:bg-indigo-100 shadow-2xs'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {selectedMonths.length === 10
                    ? 'ពេញមួយឆ្នាំ (១០ខែ)'
                    : selectedMonths.length === 5 && selectedMonths[0] === 1
                    ? 'ឆមាសទី១ (ខែ១-៥)'
                    : selectedMonths.length === 5 && selectedMonths[0] === 6
                    ? 'ឆមាសទី២ (ខែ៦-១០)'
                    : `ចន្លោះខែ៖ ខែទី${currentMinMonth} - ខែទី${currentMaxMonth} (${selectedMonths.length}ខែ)`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
              </button>

              {/* Month Multi-Select & Range Popover Menu */}
              {isMonthMenuOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40 space-y-3 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      កំណត់ចន្លោះខែសិក្សា (Monthly Intervals)
                    </span>
                    <button
                      onClick={() => handleSetMonthRange(1, 10, 'ALL')}
                      className="text-[11px] text-blue-700 hover:underline font-bold cursor-pointer"
                    >
                      ជ្រើស ១០ខែពេញ
                    </button>
                  </div>

                  {/* Preset Intervals Quick Buttons */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">ចន្លោះខែតាមឆមាស & ត្រីមាស៖</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleSetMonthRange(1, 5, 'ឆមាសទី១')}
                        className={`p-1.5 rounded-lg text-[11px] font-bold border text-left cursor-pointer transition-all ${
                          selectedMonths.length === 5 && selectedMonths[0] === 1
                            ? 'bg-amber-600 text-white border-amber-700'
                            : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        ឆមាសទី១ (ខែ១-៥)
                      </button>
                      <button
                        onClick={() => handleSetMonthRange(6, 10, 'ឆមាសទី២')}
                        className={`p-1.5 rounded-lg text-[11px] font-bold border text-left cursor-pointer transition-all ${
                          selectedMonths.length === 5 && selectedMonths[0] === 6
                            ? 'bg-amber-600 text-white border-amber-700'
                            : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        ឆមាសទី២ (ខែ៦-១០)
                      </button>

                      <button
                        onClick={() => handleSetMonthRange(1, 3)}
                        className="p-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 cursor-pointer"
                      >
                        ត្រីមាសទី១ (ខែ១-៣)
                      </button>
                      <button
                        onClick={() => handleSetMonthRange(4, 6)}
                        className="p-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 cursor-pointer"
                      >
                        ត្រីមាសទី២ (ខែ៤-៦)
                      </button>
                      <button
                        onClick={() => handleSetMonthRange(7, 8)}
                        className="p-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 cursor-pointer"
                      >
                        ត្រីមាសទី៣ (ខែ៧-៨)
                      </button>
                      <button
                        onClick={() => handleSetMonthRange(9, 10)}
                        className="p-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 cursor-pointer"
                      >
                        ត្រីមាសទី៤ (ខែ៩-១០)
                      </button>
                    </div>
                  </div>

                  {/* Start / End Range Selectors */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">ជ្រើសរើសចន្លោះខែផ្ទាល់ខ្លួន (Interval Range)៖</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-500 block">ចាប់ពីខែ៖</label>
                        <select
                          value={currentMinMonth}
                          onChange={(e) => handleSetMonthRange(Number(e.target.value), currentMaxMonth)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-800"
                        >
                          {ACADEMIC_MONTHS.map((m) => (
                            <option key={m.number} value={m.number}>{m.label}</option>
                          ))}
                        </select>
                      </div>
                      <span className="text-slate-400 mt-4">ដល់</span>
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-500 block">ដល់ខែ៖</label>
                        <select
                          value={currentMaxMonth}
                          onChange={(e) => handleSetMonthRange(currentMinMonth, Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-800"
                        >
                          {ACADEMIC_MONTHS.map((m) => (
                            <option key={m.number} value={m.number}>{m.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Checkbox List for Individual Month Toggling */}
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">ជ្រើសរើសខែនីមួយៗ (Individual Months)៖</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {ACADEMIC_MONTHS.map((m) => {
                        const isChecked = selectedMonths.includes(m.number);
                        return (
                          <label
                            key={m.number}
                            className={`flex items-center gap-1.5 p-1.5 rounded-lg border cursor-pointer text-[11px] transition-all ${
                              isChecked
                                ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleMonth(m.number)}
                              className="rounded accent-amber-600 cursor-pointer"
                            />
                            <span className="truncate">{m.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Subject Multi-Select Selector Button & Popover */}
            <div className="relative" ref={subjectMenuRef}>
              <button
                onClick={() => setIsSubjectMenuOpen(!isSubjectMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  selectedSubjects.length === ALL_SUBJECTS.length
                    ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                    : 'bg-indigo-600 text-white border-indigo-700 shadow-2xs hover:bg-indigo-700'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>
                  {selectedSubjects.length === ALL_SUBJECTS.length
                    ? 'មុខវិជ្ជា៖ ទាំងអស់ (៥)'
                    : selectedSubjects.length === 0
                    ? 'មិនបានជ្រើសរើសមុខវិជ្ជា'
                    : `មុខវិជ្ជាជ្រើសរើស (${selectedSubjects.length}/${ALL_SUBJECTS.length})`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {/* Subject Multi-Select Popover Menu */}
              {isSubjectMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3.5 z-40 space-y-3 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Filter className="w-4 h-4 text-blue-600" />
                      តម្រងមុខវិជ្ជាច្រើន (Multi-Subject)
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <button
                        onClick={handleSelectAllSubjects}
                        className="text-blue-700 hover:underline font-bold cursor-pointer"
                      >
                        ជ្រើសទាំងអស់
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={handleClearSubjects}
                        className="text-rose-600 hover:underline font-bold cursor-pointer"
                      >
                        លុបជម្រើស
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {ALL_SUBJECTS.map((subj) => {
                      const isSelected = selectedSubjects.includes(subj);
                      return (
                        <label
                          key={subj}
                          className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold'
                              : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSubject(subj)}
                              className="rounded accent-blue-600 cursor-pointer w-4 h-4"
                            />
                            <span>{subj}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Quick Subject Chips for One-Click Toggling */}
            <div className="hidden xl:flex items-center gap-1 pl-1">
              {ALL_SUBJECTS.map((subj) => {
                const isSelected = selectedSubjects.includes(subj);
                return (
                  <button
                    key={subj}
                    onClick={() => handleToggleSubject(subj)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-100 border-blue-400 text-blue-900'
                        : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {isSelected ? `✓ ${subj}` : `+ ${subj}`}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Search Input, Export/Import & Add Lesson Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 md:w-44">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ស្វែងរកមេរៀន (Ctrl+K)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded pointer-events-none hidden sm:inline-block">
                Ctrl+K
              </kbd>
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
