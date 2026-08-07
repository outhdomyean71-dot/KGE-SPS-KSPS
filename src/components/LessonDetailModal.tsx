import React, { useState, useEffect, useRef } from 'react';
import { LessonPlan, SchoolInfo, OfficePrintConfig } from '../types';
import { X, Sparkles, CheckCircle2, Circle, Edit2, Save, BookOpen, Clock, Layers, Printer, ArrowLeft, School, FileText, Check, RefreshCw, CloudCheck, SlidersHorizontal } from 'lucide-react';
import { SovannaphumiLogo } from './SovannaphumiLogo';
import { OfficialPrintHeader } from './OfficialPrintHeader';
import { OfficePrintLayoutControl } from './OfficePrintLayoutControl';


interface LessonDetailModalProps {
  lesson: LessonPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectLessonForAI: (lesson: LessonPlan) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onToggleComplete: (id: string) => void;
  schoolInfo?: SchoolInfo;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  lesson,
  isOpen,
  onClose,
  onSelectLessonForAI,
  onSaveNotes,
  onToggleComplete,
  schoolInfo,
}) => {
  const [notes, setNotes] = useState<string>(lesson?.customNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [isPrintPreview, setIsPrintPreview] = useState<boolean>(false);
  const [showOfficeControl, setShowOfficeControl] = useState<boolean>(false);
  const [officePrintConfig, setOfficePrintConfig] = useState<OfficePrintConfig>({
    colorMode: 'official',
    spacingMode: 'standard',
    fontSize: 'normal',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');


  const lastSavedNotesRef = useRef<string>(lesson?.customNotes || '');

  // Keep local notes state updated when lesson prop changes
  useEffect(() => {
    if (lesson) {
      setNotes(lesson.customNotes || '');
      lastSavedNotesRef.current = lesson.customNotes || '';
      setSaveStatus('idle');
    }
  }, [lesson?.id, lesson?.customNotes]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!lesson || !isOpen) return;

    if (notes === lastSavedNotesRef.current) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      onSaveNotes(lesson.id, notes);
      lastSavedNotesRef.current = notes;
      setSaveStatus('saved');

      const statusTimer = setTimeout(() => {
        setSaveStatus('idle');
      }, 2500);

      return () => clearTimeout(statusTimer);
    }, 600);

    return () => clearTimeout(timer);
  }, [notes, lesson?.id, isOpen, onSaveNotes]);

  if (!isOpen || !lesson) return null;

  const handleSave = () => {
    onSaveNotes(lesson.id, notes);
    lastSavedNotesRef.current = notes;
    setSaveStatus('saved');
    setIsEditingNotes(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // If Print Preview is active, render the clean A4 Printable Lesson Plan Document
  if (isPrintPreview) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
          
          {/* Print Action Header (Hidden during actual print) */}
          <div className="print:hidden bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <button
              onClick={() => setIsPrintPreview(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ត្រឡប់ទៅពិនិត្យមេរៀនវិញ</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOfficeControl(!showOfficeControl)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  showOfficeControl
                    ? 'bg-amber-500 text-slate-900 border-amber-400'
                    : 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>ទម្រង់បោះពុម្ព (Office Layout)</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>បោះពុម្ព ឬ ទាញយកជា PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Optional Office Print Controls Panel */}
          {showOfficeControl && (
            <div className="print:hidden p-4 bg-slate-900 border-b border-slate-800">
              <OfficePrintLayoutControl config={officePrintConfig} onChange={setOfficePrintConfig} />
            </div>
          )}

          {/* Printable Document Content */}
          <div className="p-6 sm:p-10 overflow-y-auto text-slate-900 space-y-6 print:p-0 print:overflow-visible print:text-black">
            
            {/* Official Header Block */}
            <OfficialPrintHeader
              schoolInfo={schoolInfo}
              printConfig={officePrintConfig}
              title="កិច្ចតែងការបង្រៀន (LESSON PLAN)"
              subTitle1={`កម្រិតថ្នាក់៖ ${lesson.grade} | មុខវិជ្ជា៖ ${lesson.subject} | ឆ្នាំសិក្សា៖ ${schoolInfo?.academicYear || '២០២៦ - ២០២៧'}`}
              subTitle2={`គ្រូបង្រៀន៖ ${schoolInfo?.teacherName || 'លោកគ្រូ / អ្នកគ្រូ'} | ឆមាស/ខែ៖ ${lesson.semester} (${lesson.monthName})`}
            />


            {/* Meta Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs print:bg-white print:border-slate-400">
              <div>
                <span className="text-slate-500 font-medium block">គ្រូបង្រៀន៖</span>
                <span className="font-bold text-slate-900">{schoolInfo?.teacherName || 'លោកគ្រូ / អ្នកគ្រូ'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">កម្រិតថ្នាក់៖</span>
                <span className="font-bold text-slate-900">{lesson.grade}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">មុខវិជ្ជា៖</span>
                <span className="font-bold text-blue-900 print:text-black">{lesson.subject}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">ឆមាស / ខែ៖</span>
                <span className="font-bold text-slate-900">{lesson.semester} ({lesson.monthName})</span>
              </div>
            </div>

            {/* Main Lesson Info */}
            <div className="space-y-1 border-l-4 border-amber-500 pl-4 py-1 bg-amber-50/40 print:bg-white print:border-slate-800">
              <p className="text-xs text-amber-900 font-semibold print:text-black">
                ជំពូក/ផ្នែក៖ <span className="font-bold">{lesson.chapterTitle}</span>
              </p>
              <h2 className="text-base font-extrabold text-slate-900">
                ចំណងជើងមេរៀន៖ {lesson.lessonTitle} ({lesson.hoursAllocated} ម៉ោង)
              </h2>
            </div>

            {/* I. Objectives */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase">
                I. វត្ថុបំណងនៃមេរៀន (Lesson Objectives)
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs leading-relaxed">
                <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 print:bg-white print:border-slate-300">
                  <strong className="text-blue-950 font-bold block mb-0.5 print:text-black">១. ចំណេះដឹង (Knowledge)៖</strong>
                  <p className="text-slate-800 pl-3">{lesson.objectives.knowledge}</p>
                </div>
                <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100 print:bg-white print:border-slate-300">
                  <strong className="text-emerald-950 font-bold block mb-0.5 print:text-black">២. បំណិន (Skills)៖</strong>
                  <p className="text-slate-800 pl-3">{lesson.objectives.skills}</p>
                </div>
                <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100 print:bg-white print:border-slate-300">
                  <strong className="text-amber-950 font-bold block mb-0.5 print:text-black">៣. ឥរិយាបថ (Attitude)៖</strong>
                  <p className="text-slate-800 pl-3">{lesson.objectives.attitude}</p>
                </div>
              </div>
            </div>

            {/* II. Teaching Aids */}
            <div className="space-y-1.5 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase">
                II. សម្ភារឧបទេស និងធនធានបង្រៀន (Teaching Aids & Resources)
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-800">
                {lesson.teachingAids.map((aid, idx) => (
                  <li key={idx}>{aid}</li>
                ))}
              </ul>
            </div>

            {/* III. Teaching Activities */}
            <div className="space-y-1.5 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase">
                III. សកម្មភាពបង្រៀន និងរៀន (Teaching & Learning Activities)
              </h3>
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2 print:bg-white print:border-slate-400">
                <p className="font-bold text-slate-900 mb-1">សកម្មភាពគំរូសម្រាប់ម៉ោងសិក្សា៖</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-800 pl-1">
                  {lesson.teachingActivities.map((act, idx) => (
                    <li key={idx} className="leading-relaxed">{act}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* IV. Assessment */}
            <div className="space-y-1.5 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase">
                IV. ការវាយតម្លៃ និងវាស់វែងផលសិក្សា (Assessment)
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-800">
                {lesson.assessmentMethods?.map((method, idx) => (
                  <li key={idx}>{method}</li>
                )) || <li>ការសង្កេតការចូលរួម និងការធ្វើលំហាត់របស់សិស្សក្នុងថ្នាក់</li>}
              </ul>
            </div>

            {/* V. Teacher Notes */}
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase">
                V. កំណត់ចំណាំ និងការឆ្លុះបញ្ចាំងរបស់គ្រូ (Teacher Notes)
              </h3>
              <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg italic text-slate-700 print:bg-white print:border-slate-300">
                {lesson.customNotes || 'ពុំមានកំណត់ចំណាំបន្ថែមឡើយ។'}
              </p>
            </div>

            {/* Signatures Block */}
            <div className="pt-8 grid grid-cols-2 text-center text-xs font-semibold text-slate-800 gap-6 print:pt-12">
              <div className="space-y-1">
                <p className="font-bold">បានឃើញ និងឯកភាព</p>
                <p className="text-[11px] text-slate-600">នាយក-នាយិកាសាលា</p>
                <div className="h-16"></div>
                <p className="border-t border-slate-300 w-32 mx-auto pt-1 font-normal text-slate-500">ហត្ថលេខា និងត្រា</p>
              </div>

              <div className="space-y-1">
                <p>ថ្ងៃទី......... ខែ......... ឆ្នាំ២០២.....</p>
                <p className="font-bold">គ្រូបង្រៀនទទួលបន្ទុក</p>
                <div className="h-16"></div>
                <p className="border-t border-slate-300 w-32 mx-auto pt-1 font-normal text-slate-800">
                  {schoolInfo?.teacherName || 'លោកគ្រូ / អ្នកគ្រូ'}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                {lesson.grade} | {lesson.monthName}
              </span>
              <h2 className="text-base font-bold text-white">
                {lesson.subject} — {lesson.lessonTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-800">
          
          {/* Chapter & Meta Banner */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">ជំពូក/ផ្នែកសំខាន់៖</p>
              <h3 className="text-xs font-bold text-blue-900">{lesson.chapterTitle}</h3>
            </div>
            <div className="flex items-center gap-3 text-slate-600 font-bold">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> {lesson.hoursAllocated} ម៉ោង
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> {lesson.semester}
              </span>
            </div>
          </div>

          {/* 3 Tier Objectives */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider border-b border-slate-200 pb-1">
              វត្ថុបំណងនៃមេរៀន (Lesson Objectives)
            </h4>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
              <strong className="font-bold text-blue-900 block mb-0.5">១. ចំណេះដឹង (Knowledge)៖</strong>
              <p className="text-slate-700 leading-relaxed">{lesson.objectives.knowledge}</p>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <strong className="font-bold text-emerald-900 block mb-0.5">២. បំណិន (Skills)៖</strong>
              <p className="text-slate-700 leading-relaxed">{lesson.objectives.skills}</p>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
              <strong className="font-bold text-amber-900 block mb-0.5">៣. ឥរិយាបថ (Attitude)៖</strong>
              <p className="text-slate-700 leading-relaxed">{lesson.objectives.attitude}</p>
            </div>
          </div>

          {/* Teaching Activities & Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-900 mb-2">សកម្មភាពបង្រៀនគំរូ៖</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {lesson.teachingActivities.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-900 mb-2">សម្ភារឧបទេស៖</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {lesson.teachingAids.map((aid, i) => (
                  <li key={i}>{aid}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Teacher Custom Notes Section */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="font-bold text-amber-950 text-xs">
                  កំណត់ចំណាំផ្ទាល់ខ្លួនរបស់គ្រូ (Teacher Notes)៖
                </label>
                {saveStatus === 'saving' && (
                  <span className="text-[11px] font-bold text-amber-700 animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-600" /> កំពុងរក្សាទុក...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> បានរក្សាទុកស្វ័យប្រវត្តិ ☁️
                  </span>
                )}
              </div>

              {!isEditingNotes ? (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="flex items-center gap-1 text-xs text-amber-800 font-bold hover:underline cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> កែប្រែ
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  <Save className="w-3 h-3" /> បញ្ចប់កែប្រែ
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ឧ. សិស្សរៀនយឺត ២នាក់ត្រូវណែនាំបន្ថែម, ត្រូវរៀបចំប័ណ្ណរូបភាពបន្ថែម..."
                rows={3}
                className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              />
            ) : (
              <p
                onClick={() => setIsEditingNotes(true)}
                className="text-slate-700 italic cursor-pointer hover:bg-amber-100/50 p-2 rounded-lg transition-colors"
                title="ចុចដើម្បីកែប្រែ"
              >
                {notes || 'មិនទាន់មានកំណត់ចំណាំឡើយ។ ចុច «កែប្រែ» ដើម្បីបន្ថែម...'}
              </p>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onToggleComplete(lesson.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
              lesson.completed
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {lesson.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-slate-400" />}
            <span>{lesson.completed ? 'បានបង្រៀនរួចរាល់' : 'សម្គាល់ថាបានបង្រៀន'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPrintPreview(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-200" />
              <span>បោះពុម្ពកិច្ចតែងការ</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onSelectLessonForAI(lesson);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>បង្កើតកិច្ចតែងការ AI ៥ជំហាន</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

