import React, { useState, useMemo } from 'react';
import { LessonPlan, GradeLevel, Semester, SubjectType } from '../types';
import { Sparkles, CheckCircle2, Circle, Eye, Edit3, BookOpen, Clock, FileText, SlidersHorizontal, AlertTriangle, ArrowUpDown, RotateCcw, Filter } from 'lucide-react';

interface CurriculumTableProps {
  lessons: LessonPlan[];
  selectedGrade: GradeLevel;
  selectedSemester: Semester | 'ALL' | 'CUSTOM';
  selectedSubjects: SubjectType[];
  selectedMonths: number[];
  onSelectLessonForAI: (lesson: LessonPlan) => void;
  onOpenLessonDetail: (lesson: LessonPlan) => void;
  onToggleComplete: (id: string) => void;
  onToggleReinforcement?: (id: string) => void;
  onResetFilters?: () => void;
}

export const CurriculumTable: React.FC<CurriculumTableProps> = ({
  lessons,
  selectedGrade,
  selectedSemester,
  selectedSubjects,
  selectedMonths,
  onSelectLessonForAI,
  onOpenLessonDetail,
  onToggleComplete,
  onToggleReinforcement,
  onResetFilters,
}) => {
  // Advanced Filter & Sort Local States
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  const [reinforcementFilter, setReinforcementFilter] = useState<'ALL' | 'REINFORCE' | 'NORMAL'>('ALL');
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'STATUS_COMPLETED_FIRST' | 'STATUS_PENDING_FIRST' | 'REINFORCE_FIRST' | 'SUBJECT'>('DEFAULT');

  // Helper for Subject Badges
  const getSubjectBadge = (subject: SubjectType) => {
    switch (subject) {
      case 'ភាសាខ្មែរ':
        return <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-md inline-flex items-center gap-1">📘 ភាសាខ្មែរ</span>;
      case 'គណិតវិទ្យា':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-md inline-flex items-center gap-1">📐 គណិតវិទ្យា</span>;
      case 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-md inline-flex items-center gap-1">🔬 វិទ្យាសាស្ត្រ & សង្គម</span>;
      case 'សីលធម៌ និងពលរដ្ឋវិជ្ជា':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-md inline-flex items-center gap-1">🏛️ សីលធម៌ & ពលរដ្ឋ</span>;
      case 'ភាសាអង់គ្លេស':
        return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold rounded-md inline-flex items-center gap-1">🔤 ភាសាអង់គ្លេស</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold rounded-md">{subject}</span>;
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedLessons = useMemo(() => {
    let result = [...lessons];

    // 1. Completion status filter
    if (statusFilter === 'COMPLETED') {
      result = result.filter((l) => l.completed);
    } else if (statusFilter === 'PENDING') {
      result = result.filter((l) => !l.completed);
    }

    // 2. Reinforcement category filter
    if (reinforcementFilter === 'REINFORCE') {
      result = result.filter((l) => l.needReinforcement);
    } else if (reinforcementFilter === 'NORMAL') {
      result = result.filter((l) => !l.needReinforcement);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'STATUS_COMPLETED_FIRST') {
        return (b.completed ? 1 : 0) - (a.completed ? 1 : 0);
      }
      if (sortBy === 'STATUS_PENDING_FIRST') {
        return (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
      }
      if (sortBy === 'REINFORCE_FIRST') {
        return (b.needReinforcement ? 1 : 0) - (a.needReinforcement ? 1 : 0);
      }
      if (sortBy === 'SUBJECT') {
        return a.subject.localeCompare(b.subject, 'km');
      }
      return 0;
    });

    return result;
  }, [lessons, statusFilter, reinforcementFilter, sortBy]);

  const hasLocalActiveFilters = statusFilter !== 'ALL' || reinforcementFilter !== 'ALL' || sortBy !== 'DEFAULT';

  const resetLocalFilters = () => {
    setStatusFilter('ALL');
    setReinforcementFilter('ALL');
    setSortBy('DEFAULT');
  };

  if (lessons.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 my-6 shadow-sm max-w-2xl mx-auto space-y-4">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <BookOpen className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">មិនមានមេរៀនត្រូវគ្នានឹងការស្វែងរកឡើយ</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            សូមសាកល្បងសម្រួលមុខវិជ្ជាជ្រើសរើស ({selectedSubjects.length} មុខវិជ្ជា) ឬ ចន្លោះខែសិក្សា ({selectedMonths.length} ខែ)។
          </p>
        </div>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            កំណត់ការតម្រងឡើងវិញ ( reset filters )
          </button>
        )}
      </div>
    );
  }

  // Group lessons by Semester for clear table separation
  const semestersToDisplay: Semester[] = ['ឆមាសទី១', 'ឆមាសទី២'];

  return (
    <div className="space-y-6 my-6">
      
      {/* Advanced Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900">
                តម្រងកម្រិតខ្ពស់ & ការតម្រៀបមេរៀន (Advanced Filters & Sort)
              </h3>
              <p className="text-[11px] text-slate-500">
                តម្រៀបតាម 'ស្ថានភាពបានបង្រៀន' ឬ 'ចំណាត់ថ្នាក់មេរៀនដែលត្រូវពង្រឹងបន្ថែម'
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>បានបង្រៀន៖ {lessons.filter(l => l.completed).length}</span>
            </span>

            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>ត្រូវពង្រឹង៖ {lessons.filter(l => l.needReinforcement).length}</span>
            </span>

            {hasLocalActiveFilters && (
              <button
                type="button"
                onClick={resetLocalFilters}
                className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-full font-bold text-[11px] transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>សម្អាតតម្រង</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Filter 1: Teaching Status */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Filter className="w-3 h-3 text-blue-600" />
              <span>១. ស្ថានភាពបង្រៀន (Teaching Status)</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-blue-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ទាំងអស់ ({lessons.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('COMPLETED')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                បានបង្រៀន
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('PENDING')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'PENDING'
                    ? 'bg-slate-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                មិនទាន់បង្រៀន
              </button>
            </div>
          </div>

          {/* Filter 2: Reinforcement Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>២. ចំណាត់ថ្នាក់មេរៀនត្រូវពង្រឹង (Reinforcement)</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setReinforcementFilter('ALL')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  reinforcementFilter === 'ALL'
                    ? 'bg-white text-blue-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ទាំងអស់
              </button>
              <button
                type="button"
                onClick={() => setReinforcementFilter('REINFORCE')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  reinforcementFilter === 'REINFORCE'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚠️ ត្រូវពង្រឹង
              </button>
              <button
                type="button"
                onClick={() => setReinforcementFilter('NORMAL')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  reinforcementFilter === 'NORMAL'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ធម្មតា
              </button>
            </div>
          </div>

          {/* Sort Option */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-indigo-600" />
              <span>៣. តម្រៀបតាម (Sort By Order)</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="DEFAULT">📅 តាមលំដាប់ខែសិក្សា (Default)</option>
              <option value="REINFORCE_FIRST">⚠️ មេរៀនត្រូវពង្រឹងបន្ថែមមុនគេ</option>
              <option value="STATUS_COMPLETED_FIRST">✅ បានបង្រៀនរួចមុនគេ</option>
              <option value="STATUS_PENDING_FIRST">⏳ មិនទាន់បង្រៀនមុនគេ</option>
              <option value="SUBJECT">📚 តាមប្រភេទមុខវិជ្ជា</option>
            </select>
          </div>

        </div>
      </div>

      {filteredAndSortedLessons.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 my-4 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-800">
            មិនមានមេរៀនស្របតាមតម្រងកម្រិតខ្ពស់ដែលបានជ្រើសរើសទេ
          </h4>
          <p className="text-[11px] text-slate-500 mt-1">
            សូមចុចប៊ូតុង «សម្អាតតម្រង» ដើម្បីមើលមេរៀនទាំងអស់ឡើងវិញ។
          </p>
          <button
            type="button"
            onClick={resetLocalFilters}
            className="mt-3 px-3 py-1.5 bg-blue-700 text-white text-xs font-bold rounded-lg hover:bg-blue-800 cursor-pointer"
          >
            សម្អាតតម្រង
          </button>
        </div>
      ) : (
        semestersToDisplay.map((sem) => {
          const semLessons = filteredAndSortedLessons.filter((l) => l.semester === sem);
          if (semLessons.length === 0) return null;

          return (
            <div key={sem} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Semester Section Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 py-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-blue-900">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 font-black text-sm flex items-center justify-center shadow">
                    {sem === 'ឆមាសទី១' ? '១' : '២'}
                  </span>
                  <div>
                    <h2 className="text-base font-bold tracking-wide text-amber-300">
                      ផែនការបង្រៀន — {sem} ({selectedGrade})
                    </h2>
                    <p className="text-xs text-slate-300">
                      {sem === 'ឆមាសទី១' ? 'ខែទី១ ដល់ ខែទី៥ (វិច្ឆិកា ដល់ មីនា)' : 'ខែទី៦ ដល់ ខែទី១០ (មេសា ដល់ សីហា)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>ចំនួនមេរៀន៖ <strong className="text-amber-300 font-bold">{semLessons.length}</strong> មេរៀន</span>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 text-slate-800 text-xs font-bold uppercase border-b border-slate-200">
                      <th className="py-3.5 px-4 w-28 text-center border-r border-slate-200">
                        ខែសិក្សា
                      </th>
                      <th className="py-3.5 px-4 w-40 border-r border-slate-200">
                        មុខវិជ្ជា
                      </th>
                      <th className="py-3.5 px-4 w-64 border-r border-slate-200">
                        ជំពូក និង ចំណងជើងមេរៀន
                      </th>
                      <th className="py-3.5 px-4 min-w-[320px] border-r border-slate-200">
                        វត្ថុបំណងនៃមេរៀន (គោលដៅដែលសិស្សត្រូវចេះ)
                      </th>
                      <th className="py-3.5 px-4 w-52 border-r border-slate-200">
                        សម្ភារឧបទេស & ការវាយតម្លៃ
                      </th>
                      <th className="py-3.5 px-4 w-36 text-center">
                        សកម្មភាព
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                    {semLessons.map((lesson) => (
                      <tr
                        key={lesson.id}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          lesson.completed ? 'bg-emerald-50/30' : lesson.needReinforcement ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        {/* Academic Month Column */}
                        <td className="py-4 px-3 text-center border-r border-slate-200 align-top font-bold text-slate-800">
                          <div className="bg-amber-100/70 border border-amber-300 text-amber-900 rounded-lg p-2 shadow-2xs">
                            <p className="text-xs font-black text-amber-900">{lesson.monthName}</p>
                            <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-amber-800 font-normal">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>{lesson.hoursAllocated} ម៉ោង</span>
                            </div>
                          </div>
                        </td>

                        {/* Subject Column */}
                        <td className="py-4 px-4 border-r border-slate-200 align-top">
                          {getSubjectBadge(lesson.subject)}
                          <p className="text-[11px] text-slate-500 mt-2 font-medium">
                            {lesson.grade}
                          </p>
                        </td>

                        {/* Chapter & Lesson Title Column */}
                        <td className="py-4 px-4 border-r border-slate-200 align-top">
                          <p className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1 border border-blue-200">
                            {lesson.chapterTitle}
                          </p>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug mt-1">
                            {lesson.lessonTitle}
                          </h4>

                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {lesson.completed && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3" /> បានបង្រៀនរួច
                              </span>
                            )}

                            {lesson.needReinforcement && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full">
                                <AlertTriangle className="w-3 h-3 text-amber-700" /> ត្រូវពង្រឹងបន្ថែម
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Lesson Objectives (3 Pedagogical Tiers) Column */}
                        <td className="py-4 px-4 border-r border-slate-200 align-top space-y-2">
                          {/* Knowledge */}
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <span className="font-bold text-blue-900 text-[11px] block mb-0.5">
                              ១. ចំណេះដឹង (Knowledge)៖
                            </span>
                            <p className="text-slate-700 leading-relaxed text-[11px]">
                              {lesson.objectives.knowledge}
                            </p>
                          </div>

                          {/* Skills */}
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <span className="font-bold text-emerald-900 text-[11px] block mb-0.5">
                              ២. បំណិន (Skills)៖
                            </span>
                            <p className="text-slate-700 leading-relaxed text-[11px]">
                              {lesson.objectives.skills}
                            </p>
                          </div>

                          {/* Attitudes */}
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <span className="font-bold text-amber-900 text-[11px] block mb-0.5">
                              ៣. ឥរិយាបថ (Attitudes)៖
                            </span>
                            <p className="text-slate-700 leading-relaxed text-[11px]">
                              {lesson.objectives.attitude}
                            </p>
                          </div>
                        </td>

                        {/* Teaching Aids & Materials Column */}
                        <td className="py-4 px-4 border-r border-slate-200 align-top space-y-2">
                          <div>
                            <p className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                              📦 សម្ភារឧបទេស៖
                            </p>
                            <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pl-1">
                              {lesson.teachingAids.map((aid, idx) => (
                                <li key={idx}>{aid}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            <p className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                              📝 ការវាយតម្លៃ៖
                            </p>
                            <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pl-1">
                              {lesson.assessmentMethods.map((method, idx) => (
                                <li key={idx}>{method}</li>
                              ))}
                            </ul>
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="py-4 px-3 text-center align-top space-y-1.5">
                          {/* AI Lesson Plan Button */}
                          <button
                            type="button"
                            onClick={() => onSelectLessonForAI(lesson)}
                            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-all cursor-pointer"
                            title="បង្កើតកិច្ចតែងការ ៥ជំហាន ដោយ AI"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>កិច្ចតែងការ AI</span>
                          </button>

                          {/* View Full Detail Button */}
                          <button
                            type="button"
                            onClick={() => onOpenLessonDetail(lesson)}
                            className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg transition-all cursor-pointer border border-slate-300"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            <span>មើលលម្អិត</span>
                          </button>

                          {/* Completion Status Toggle */}
                          <button
                            type="button"
                            onClick={() => onToggleComplete(lesson.id)}
                            className={`w-full flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                              lesson.completed
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {lesson.completed ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                <span>បានបង្រៀន</span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-3 h-3 text-slate-400" />
                                <span>មិនទាន់បង្រៀន</span>
                              </>
                            )}
                          </button>

                          {/* Reinforcement Priority Toggle Button */}
                          {onToggleReinforcement && (
                            <button
                              type="button"
                              onClick={() => onToggleReinforcement(lesson.id)}
                              className={`w-full flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                                lesson.needReinforcement
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                              title="ចុចដើម្បីកំណត់/លុបការកំណត់ 'ត្រូវពង្រឹងបន្ថែម' សម្រាប់មេរៀននេះ"
                            >
                              <AlertTriangle className={`w-3 h-3 ${lesson.needReinforcement ? 'text-amber-700' : 'text-slate-400'}`} />
                              <span>{lesson.needReinforcement ? 'ត្រូវពង្រឹង' : '+ ពង្រឹង'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
