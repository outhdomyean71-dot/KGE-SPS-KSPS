import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { LessonPlan, SchoolInfo, GradeLevel, Semester, SubjectType } from './types';
import { getSavedCurriculum, saveCurriculum, getSavedSchoolInfo, saveSchoolInfo } from './data/storage';
import { MoEYSHeader } from './components/MoEYSHeader';
import { CurriculumTable } from './components/CurriculumTable';
import { AILessonGeneratorModal } from './components/AILessonGeneratorModal';
import { LessonDetailModal } from './components/LessonDetailModal';
import { PrintPlannerView } from './components/PrintPlannerView';
import { AnalyticsOverview } from './components/AnalyticsOverview';
import { SchoolInfoModal } from './components/SchoolInfoModal';
import { AddLessonModal } from './components/AddLessonModal';
import { WeeklyTimetableModal } from './components/WeeklyTimetableModal';
import { SlowLearnersModal } from './components/SlowLearnersModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import {
  initAuth,
  syncLessonToCloud,
  syncAllLessonsToCloud,
  listenToCloudLessons,
  syncSchoolInfoToCloud,
  listenToCloudSchoolInfo
} from './lib/firebase';
import { BookOpen, Sparkles, CheckCircle2, Clock, Calendar, Download, AlertCircle, CheckCircle, X, Keyboard } from 'lucide-react';

export default function App() {
  const [lessons, setLessons] = useState<LessonPlan[]>(getSavedCurriculum);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(getSavedSchoolInfo);

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('ថ្នាក់ទី១');
  const [selectedSemester, setSelectedSemester] = useState<Semester | 'ALL' | 'CUSTOM'>('ALL');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectType[]>([
    'ភាសាខ្មែរ',
    'គណិតវិទ្យា',
    'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    'ភាសាអង់គ្លេស',
  ]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [activeView, setActiveView] = useState<'table' | 'print' | 'ai' | 'analytics'>('table');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals state
  const [selectedLessonForAI, setSelectedLessonForAI] = useState<LessonPlan | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  const [selectedLessonForDetail, setSelectedLessonForDetail] = useState<LessonPlan | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState<boolean>(false);
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState<boolean>(false);
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState<boolean>(false);
  const [isSlowLearnersModalOpen, setIsSlowLearnersModalOpen] = useState<boolean>(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);

  // Search input ref & shortcut toast notification
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [shortcutNotification, setShortcutNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setShortcutNotification(msg);
    setTimeout(() => {
      setShortcutNotification(null);
    }, 2600);
  };

  // Firebase Cloud Sync State
  const [syncUserId, setSyncUserId] = useState<string>(() => localStorage.getItem('firebase_sync_uid') || '');
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Import / Export notification status
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Global Keyboard Shortcuts Event Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInputOrTextArea = targetTag === 'input' || targetTag === 'textarea' || (e.target as HTMLElement)?.isContentEditable;

      // 1. Save & Sync: Ctrl + S / Cmd + S
      if (isCmdOrCtrl && key === 's') {
        e.preventDefault();
        saveCurriculum(lessons);
        saveSchoolInfo(schoolInfo);
        if (syncUserId) {
          syncAllLessonsToCloud(syncUserId, lessons);
          setLastSyncedAt(new Date());
        }
        showNotification('បានរក្សាទុក និងសមកាលកម្មទិន្នន័យលើ Cloud រួចរាល់! (Ctrl+S)');
        return;
      }

      // 2. Print View / Print PDF: Ctrl + P / Cmd + P
      if (isCmdOrCtrl && key === 'p') {
        e.preventDefault();
        if (activeView === 'print') {
          window.print();
        } else {
          setActiveView('print');
          showNotification('បានផ្លាស់ទៅទម្រង់បោះពុម្ព (Ctrl+P) - ចុច Ctrl+P ម្តងទៀតដើម្បីបោះពុម្ព');
        }
        return;
      }

      // 3. Focus Search Input: Ctrl + K, Ctrl + F, or '/' (when not typing in an input)
      if ((isCmdOrCtrl && (key === 'k' || key === 'f')) || (!isInputOrTextArea && key === '/')) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
        return;
      }

      // 4. Open AI Teaching Assistant: Ctrl + Shift + A or Ctrl + Shift + G
      if (isCmdOrCtrl && e.shiftKey && (key === 'a' || key === 'g')) {
        e.preventDefault();
        setActiveView('ai');
        showNotification('បានបើកជំនួយការ AI កិច្ចតែងការ');
        return;
      }

      // 5. Open Shortcuts Help Dialog: Ctrl + / or ?
      if ((isCmdOrCtrl && key === '/') || (!isInputOrTextArea && e.shiftKey && key === '?')) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        return;
      }

      // 6. Add Lesson Modal: Alt + N or Ctrl + Shift + N
      if ((e.altKey && key === 'n') || (isCmdOrCtrl && e.shiftKey && key === 'n')) {
        e.preventDefault();
        setIsAddLessonModalOpen(true);
        return;
      }

      // 7. Weekly Timetable Modal: Alt + T
      if (e.altKey && key === 't') {
        e.preventDefault();
        setIsTimetableModalOpen(true);
        return;
      }

      // 8. Slow Learners Modal: Alt + S
      if (e.altKey && key === 's') {
        e.preventDefault();
        setIsSlowLearnersModalOpen(true);
        return;
      }

      // 9. Switch Grade Level: Alt + 1 to Alt + 6
      if (e.altKey && ['1', '2', '3', '4', '5', '6'].includes(key)) {
        e.preventDefault();
        const gradeMap: Record<string, GradeLevel> = {
          '1': 'ថ្នាក់ទី១',
          '2': 'ថ្នាក់ទី២',
          '3': 'ថ្នាក់ទី៣',
          '4': 'ថ្នាក់ទី៤',
          '5': 'ថ្នាក់ទី៥',
          '6': 'ថ្នាក់ទី៦',
        };
        const targetGrade = gradeMap[key];
        if (targetGrade) {
          setSelectedGrade(targetGrade);
          showNotification(`បានផ្លាស់ទៅកម្រិតថ្នាក់៖ ${targetGrade}`);
        }
        return;
      }

      // 10. Escape key: Close any active modal or blur search
      if (key === 'escape') {
        setIsAIModalOpen(false);
        setIsDetailModalOpen(false);
        setIsSchoolModalOpen(false);
        setIsAddLessonModalOpen(false);
        setIsTimetableModalOpen(false);
        setIsSlowLearnersModalOpen(false);
        setIsCloudModalOpen(false);
        setIsShortcutsModalOpen(false);
        setImportStatus(null);
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lessons, schoolInfo, syncUserId, activeView]);

  // Save changes to local storage
  useEffect(() => {
    saveCurriculum(lessons);
  }, [lessons]);

  useEffect(() => {
    saveSchoolInfo(schoolInfo);
  }, [schoolInfo]);

  // Firebase Auth Initialization & Real-Time Listeners
  useEffect(() => {
    const unsubAuth = initAuth((user) => {
      const activeUid = user.uid;
      setSyncUserId(activeUid);
      localStorage.setItem('firebase_sync_uid', activeUid);
      setIsCloudSynced(true);
    });

    return () => unsubAuth();
  }, []);

  // Real-time listener for cloud lesson notes & progress
  useEffect(() => {
    if (!syncUserId) return;

    setIsSyncing(true);
    const unsubLessons = listenToCloudLessons(syncUserId, (remoteMap) => {
      if (Object.keys(remoteMap).length > 0) {
        setLessons((prevLessons) =>
          prevLessons.map((l) => {
            const remoteData = remoteMap[l.id];
            if (remoteData) {
              return {
                ...l,
                completed: remoteData.completed !== undefined ? remoteData.completed : l.completed,
                needReinforcement: remoteData.needReinforcement !== undefined ? remoteData.needReinforcement : l.needReinforcement,
                customNotes: remoteData.customNotes !== undefined ? remoteData.customNotes : l.customNotes,
              };
            }
            return l;
          })
        );
      }
      setIsSyncing(false);
      setIsCloudSynced(true);
      setLastSyncedAt(new Date());
    });

    const unsubSchool = listenToCloudSchoolInfo(syncUserId, (remoteSchool) => {
      if (remoteSchool && remoteSchool.schoolName) {
        setSchoolInfo(remoteSchool);
      }
    });

    return () => {
      unsubLessons();
      unsubSchool();
    };
  }, [syncUserId]);

  // Handlers for data updates + Cloud Sync
  const handleToggleComplete = (id: string) => {
    setLessons((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, completed: !l.completed } : l));
      const targetLesson = updated.find((l) => l.id === id);
      if (targetLesson && syncUserId) {
        syncLessonToCloud(syncUserId, targetLesson);
        setLastSyncedAt(new Date());
      }
      return updated;
    });
  };

  const handleToggleReinforcement = (id: string) => {
    setLessons((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, needReinforcement: !l.needReinforcement } : l));
      const targetLesson = updated.find((l) => l.id === id);
      if (targetLesson && syncUserId) {
        syncLessonToCloud(syncUserId, targetLesson);
        setLastSyncedAt(new Date());
      }
      return updated;
    });
  };

  const handleSaveNotes = (id: string, notes: string) => {
    setLessons((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, customNotes: notes } : l));
      const targetLesson = updated.find((l) => l.id === id);
      if (targetLesson && syncUserId) {
        syncLessonToCloud(syncUserId, targetLesson);
        setLastSyncedAt(new Date());
      }
      return updated;
    });
  };

  const handleAddLesson = (newLesson: LessonPlan) => {
    setLessons((prev) => [newLesson, ...prev]);
    if (syncUserId) {
      syncLessonToCloud(syncUserId, newLesson);
      setLastSyncedAt(new Date());
    }
  };

  const handleSaveSchoolInfo = (info: SchoolInfo) => {
    setSchoolInfo(info);
    saveSchoolInfo(info);
    if (syncUserId) {
      syncSchoolInfoToCloud(syncUserId, info);
      setLastSyncedAt(new Date());
    }
  };

  // Manual Upload / Download Cloud Sync
  const handleManualSyncUp = useCallback(async () => {
    if (!syncUserId) return;
    setIsSyncing(true);
    await syncAllLessonsToCloud(syncUserId, lessons);
    await syncSchoolInfoToCloud(syncUserId, schoolInfo);
    setIsSyncing(false);
    setIsCloudSynced(true);
    setLastSyncedAt(new Date());
  }, [syncUserId, lessons, schoolInfo]);

  const handleManualSyncDown = useCallback(async () => {
    if (!syncUserId) return;
    setIsSyncing(true);
    // Listeners automatically reflect changes
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedAt(new Date());
    }, 1000);
  }, [syncUserId]);

  const handleConnectCustomSyncCode = (code: string) => {
    setSyncUserId(code);
    localStorage.setItem('firebase_sync_uid', code);
    setIsCloudSynced(true);
  };

  // Filter lessons based on grade, multi-select subjects, selected months interval, and search term
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      // Grade filter
      if (lesson.grade !== selectedGrade) return false;

      // Multi-Select Subjects filter
      if (selectedSubjects.length > 0 && !selectedSubjects.includes(lesson.subject)) {
        return false;
      }
      if (selectedSubjects.length === 0) {
        return false;
      }

      // Specific Monthly Interval filter
      if (selectedMonths.length > 0 && !selectedMonths.includes(lesson.monthNumber)) {
        return false;
      }
      if (selectedMonths.length === 0) {
        return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const inTitle = lesson.lessonTitle.toLowerCase().includes(term);
        const inChapter = lesson.chapterTitle.toLowerCase().includes(term);
        const inKnowledge = lesson.objectives.knowledge.toLowerCase().includes(term);
        const inSkills = lesson.objectives.skills.toLowerCase().includes(term);
        if (!inTitle && !inChapter && !inKnowledge && !inSkills) return false;
      }

      return true;
    });
  }, [lessons, selectedGrade, selectedSubjects, selectedMonths, searchTerm]);

  // Reset all filters to default full view
  const handleResetFilters = () => {
    setSelectedSubjects([
      'ភាសាខ្មែរ',
      'គណិតវិទ្យា',
      'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
      'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
      'ភាសាអង់គ្លេស',
    ]);
    setSelectedMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    setSelectedSemester('ALL');
    setSearchTerm('');
  };

  // Handlers for modal actions
  const handleOpenAIForLesson = (lesson: LessonPlan) => {
    setSelectedLessonForAI(lesson);
    setIsAIModalOpen(true);
  };

  const handleOpenDetailForLesson = (lesson: LessonPlan) => {
    setSelectedLessonForDetail(lesson);
    setIsDetailModalOpen(true);
  };

  // Export Data as JSON
  const handleExportData = () => {
    try {
      const dataPackage = {
        app: 'MoEYS Primary Curriculum Planner',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        schoolInfo,
        lessons,
      };

      const jsonStr = JSON.stringify(dataPackage, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const fileName = `ផែនការបង្រៀន_${schoolInfo.schoolName ? schoolInfo.schoolName.replace(/\s+/g, '_') : 'សាលារៀន'}_${new Date().toISOString().slice(0, 10)}.json`;

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      setImportStatus({
        type: 'error',
        message: 'មានបញ្ហាក្នុងការនាំចេញទិន្នន័យ។ សូមព្យាយាមម្ដងទៀត!'
      });
    }
  };

  // Import Data from JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        let importedLessons: LessonPlan[] = [];
        let importedSchoolInfo: SchoolInfo | null = null;

        if (Array.isArray(parsed)) {
          importedLessons = parsed;
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.lessons)) {
            importedLessons = parsed.lessons;
          }
          if (parsed.schoolInfo && typeof parsed.schoolInfo === 'object') {
            importedSchoolInfo = parsed.schoolInfo;
          }
        }

        if (!importedLessons || importedLessons.length === 0) {
          throw new Error('ពុំមានទិន្នន័យមេរៀនត្រឹមត្រូវទេ');
        }

        // Validate basic properties
        const sample = importedLessons[0];
        if (!sample || !sample.lessonTitle || !sample.grade) {
          throw new Error('ទម្រង់ទិន្នន័យមេរៀនមិនត្រឹមត្រូវតាមស្តង់ដារ');
        }

        setLessons(importedLessons);
        saveCurriculum(importedLessons);

        if (importedSchoolInfo) {
          setSchoolInfo(importedSchoolInfo);
          saveSchoolInfo(importedSchoolInfo);
        }

        setImportStatus({
          type: 'success',
          message: `បាននាំចូលទិន្នន័យដោយជោគជ័យ! សរុប ${importedLessons.length} មេរៀន ត្រូវបានបញ្ចូលក្នុងប្រព័ន្ធ។`
        });
      } catch (err) {
        console.error('Import error:', err);
        setImportStatus({
          type: 'error',
          message: 'ការនាំចូលបរាជ័យ! ឯកសារ JSON មិនត្រឹមត្រូវ ឬខូចខាត។'
        });
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 flex flex-col antialiased">
      
      {/* Top MoEYS Standard Header & Controls */}
      <MoEYSHeader
        schoolInfo={schoolInfo}
        onOpenSchoolModal={() => setIsSchoolModalOpen(true)}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
        selectedSubjects={selectedSubjects}
        setSelectedSubjects={setSelectedSubjects}
        selectedMonths={selectedMonths}
        setSelectedMonths={setSelectedMonths}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAddLessonModal={() => setIsAddLessonModalOpen(true)}
        onOpenTimetableModal={() => setIsTimetableModalOpen(true)}
        onOpenSlowLearnersModal={() => setIsSlowLearnersModalOpen(true)}
        onOpenCloudSyncModal={() => setIsCloudModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        isCloudSynced={isCloudSynced}
        isSyncing={isSyncing}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onExportData={handleExportData}
        onImportData={handleImportData}
        searchInputRef={searchInputRef}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pb-12">
        
        {/* VIEW 1: Interactive Curriculum Table */}
        {activeView === 'table' && (
          <div>
            {/* Quick Summary Pill Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>បង្ហាញ៖ <strong className="text-blue-900 font-extrabold">{selectedGrade}</strong></span>
                <span className="text-slate-300">|</span>
                <span>
                  ចន្លោះខែ៖ <strong className="text-amber-800">{selectedMonths.length === 10 ? '១០ខែពេញ' : `ខែទី${Math.min(...selectedMonths)}..${Math.max(...selectedMonths)} (${selectedMonths.length}ខែ)`}</strong>
                </span>
                <span className="text-slate-300">|</span>
                <span>
                  មុខវិជ្ជា ({selectedSubjects.length}/5)៖{' '}
                  <strong className="text-blue-900 font-extrabold">
                    {selectedSubjects.length === 5 ? 'គ្រប់មុខវិជ្ជា' : selectedSubjects.join(', ')}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" /> សរុប {filteredLessons.length} មេរៀន
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> បានបង្រៀន {filteredLessons.filter(l => l.completed).length} មេរៀន
                </span>
              </div>
            </div>

            {/* Curriculum Table View */}
            <CurriculumTable
              lessons={filteredLessons}
              selectedGrade={selectedGrade}
              selectedSemester={selectedSemester}
              selectedSubjects={selectedSubjects}
              selectedMonths={selectedMonths}
              onSelectLessonForAI={handleOpenAIForLesson}
              onOpenLessonDetail={handleOpenDetailForLesson}
              onToggleComplete={handleToggleComplete}
              onToggleReinforcement={handleToggleReinforcement}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* VIEW 2: AI Assistant Full Screen View */}
        {activeView === 'ai' && (
          <div className="my-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              ជំនួយការ AI គរុកោសល្យ — បង្កើតកិច្ចតែងការ ៥ជំហាន
            </h2>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              សូមជ្រើសរើសមេរៀនណាមួយក្នុងតារាងខាងក្រោម ឬ ចុចប៊ូតុង «កិច្ចតែងការ AI» នៅលើមេរៀននីមួយៗ ដើម្បីឱ្យ Gemini AI រៀបចំកិច្ចតែងការ ៥ជំហាន និងសន្លឹកកិច្ចការសិស្សភ្លាមៗ!
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-left">
              {filteredLessons.slice(0, 6).map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => handleOpenAIForLesson(lesson)}
                  className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl hover:bg-purple-100/80 transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-200/80 px-2 py-0.5 rounded">
                    {lesson.monthName}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-2 group-hover:text-purple-900">
                    {lesson.subject} — {lesson.lessonTitle}
                  </h4>
                  <p className="text-[11px] text-purple-700 mt-1 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3" /> បង្កើតកិច្ចតែងការ ៥ជំហាន
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: Print / PDF Export Layout */}
        {activeView === 'print' && (
          <PrintPlannerView
            lessons={filteredLessons}
            schoolInfo={schoolInfo}
            selectedGrade={selectedGrade}
            selectedSemester={selectedSemester}
            selectedSubjects={selectedSubjects}
            selectedMonths={selectedMonths}
            onBackToTable={() => setActiveView('table')}
          />
        )}

        {/* VIEW 4: Analytics Overview */}
        {activeView === 'analytics' && (
          <AnalyticsOverview
            lessons={lessons}
            selectedGrade={selectedGrade}
          />
        )}

      </main>

      {/* Modals */}
      <AILessonGeneratorModal
        lesson={selectedLessonForAI}
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        schoolInfo={schoolInfo}
      />

      <LessonDetailModal
        lesson={selectedLessonForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSelectLessonForAI={handleOpenAIForLesson}
        onSaveNotes={handleSaveNotes}
        onToggleComplete={handleToggleComplete}
        schoolInfo={schoolInfo}
      />

      <SchoolInfoModal
        schoolInfo={schoolInfo}
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        onSave={handleSaveSchoolInfo}
      />

      <AddLessonModal
        isOpen={isAddLessonModalOpen}
        onClose={() => setIsAddLessonModalOpen(false)}
        onAddLesson={handleAddLesson}
        selectedGrade={selectedGrade}
      />

      <WeeklyTimetableModal
        isOpen={isTimetableModalOpen}
        onClose={() => setIsTimetableModalOpen(false)}
        selectedGrade={selectedGrade}
        schoolInfo={schoolInfo}
      />

      <SlowLearnersModal
        isOpen={isSlowLearnersModalOpen}
        onClose={() => setIsSlowLearnersModalOpen(false)}
        selectedGrade={selectedGrade}
        schoolInfo={schoolInfo}
      />

      <CloudSyncModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        syncUserId={syncUserId}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncedAt}
        onManualSyncUp={handleManualSyncUp}
        onManualSyncDown={handleManualSyncDown}
        onConnectCustomSyncCode={handleConnectCustomSyncCode}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Shortcut Quick Toast Notification */}
      {shortcutNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Keyboard className="w-4 h-4 text-amber-400" />
          <span>{shortcutNotification}</span>
        </div>
      )}

      {/* Import / Export Notification Modal */}
      {importStatus && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in duration-150">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
              importStatus.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}>
              {importStatus.type === 'success' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>

            <div>
              <h3 className={`text-base font-bold ${
                importStatus.type === 'success' ? 'text-emerald-900' : 'text-rose-900'
              }`}>
                {importStatus.type === 'success' ? 'នាំចូលជោគជ័យ' : 'បរាជ័យ'}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {importStatus.message}
              </p>
            </div>

            <button
              onClick={() => setImportStatus(null)}
              className={`w-full py-2 px-4 rounded-xl text-xs font-bold text-white shadow-sm transition-all cursor-pointer ${
                importStatus.type === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-800 hover:bg-slate-900'
              }`}
            >
              យល់ព្រម
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#f5b335] via-[#ea9c28] to-[#f3a82c] text-slate-950 py-5 px-4 text-center text-xs border-t-2 border-amber-300 shadow-md mt-auto">
        <div className="max-w-7xl mx-auto space-y-1">
          <p className="font-extrabold text-amber-950 text-xs md:text-sm">
            @2026 សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ
          </p>
          <p className="text-[15px] font-bold text-amber-900/90">
            រក្សាសិទ្ធិដោយ៖ លោកគ្រូ យៀន ឧត្តម
          </p>
        </div>
      </footer>

    </div>
  );
}
