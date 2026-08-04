import React, { useState, useEffect, useRef } from 'react';
import { LessonPlan, FiveStepLessonPlan, StudentWorksheet } from '../types';
import { Sparkles, X, Printer, Copy, Check, RefreshCw, FileText, BookOpen, AlertCircle, FileCode, Presentation, FileDown, Upload, FileJson, CheckCircle2 } from 'lucide-react';
import { exportToHTML, exportToPowerPoint, exportToJSON, printDocument } from '../utils/exportUtils';

interface AILessonGeneratorModalProps {
  lesson: LessonPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AILessonGeneratorModal: React.FC<AILessonGeneratorModalProps> = ({
  lesson,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'worksheet'>('plan');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [fiveStepPlan, setFiveStepPlan] = useState<FiveStepLessonPlan | null>(null);
  const [worksheet, setWorksheet] = useState<StudentWorksheet | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate lesson plan when modal opens for a selected lesson
  useEffect(() => {
    if (isOpen && lesson && !fiveStepPlan && !loading) {
      handleGenerateLessonPlan();
    }
  }, [isOpen, lesson]);

  if (!isOpen || !lesson) return null;

  const handleGenerateLessonPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: lesson.grade,
          subject: lesson.subject,
          lessonTitle: lesson.lessonTitle,
          month: lesson.monthName,
          objectives: lesson.objectives,
          promptText: customPrompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.lessonPlan) {
        setFiveStepPlan(data.lessonPlan);
      } else {
        throw new Error(data.error || 'មិនអាចបង្កើតកិច្ចតែងការបង្រៀនបានទេ');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'មានបញ្ហាបច្ចេកទេស ក្នុងការតភ្ជាប់ទៅកាន់ Gemini AI');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorksheet = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: lesson.grade,
          subject: lesson.subject,
          lessonTitle: lesson.lessonTitle,
          type: 'worksheet',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setWorksheet(data.data);
      } else {
        throw new Error(data.error || 'មិនអាចបង្កើតសន្លឹកកិច្ចការបានទេ');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'មានបញ្ហាបច្ចេកទេស');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    let contentText = '';
    if (activeTab === 'plan' && fiveStepPlan) {
      contentText = `
កិច្ចតែងការបង្រៀន ៥ជំហាន (MoEYS Standard)
កម្រិតថ្នាក់៖ ${fiveStepPlan.grade} | មុខវិជ្ជា៖ ${fiveStepPlan.subject}
ចំណងជើង៖ ${fiveStepPlan.title}
រយៈពេល៖ ${fiveStepPlan.duration}

វត្ថុបំណង៖
- ចំណេះដឹង៖ ${fiveStepPlan.objectives.knowledge}
- បំណិន៖ ${fiveStepPlan.objectives.skills}
- ឥរិយាបថ៖ ${fiveStepPlan.objectives.attitudes}

សម្ភារឧបទេស៖ ${fiveStepPlan.teachingAids.join(', ')}

សកម្មភាពបង្រៀន ៥ជំហាន៖
${fiveStepPlan.steps
  .map(
    (s) => `
[${s.title}] (${s.duration})
- សកម្មភាពគ្រូ៖ ${s.teacherActivities}
- សកម្មភាពសិស្ស៖ ${s.studentActivities}
`
  )
  .join('\n')}

ការណែនាំគរុកោសល្យ៖ ${fiveStepPlan.pedagogicalAdvice || ''}
      `;
    } else if (activeTab === 'worksheet' && worksheet) {
      contentText = `
${worksheet.title}
ការណែនាំ៖ ${worksheet.instructions}
រយៈពេល៖ ${worksheet.timeAllowed} | ពិន្ទុសរុប៖ ${worksheet.totalPoints}

សំណួរ៖
${worksheet.questions
  .map(
    (q, i) => `
${i + 1}. ${q.question} (${q.points} ពិន្ទុ)
${q.options ? q.options.map((o) => `   - ${o}`).join('\n') : ''}
* ចម្លើយ៖ ${q.answerKey}
`
  )
  .join('\n')}
      `;
    }

    navigator.clipboard.writeText(contentText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const targetId = activeTab === 'plan' ? 'printable-lesson-plan' : 'printable-worksheet';
    const docTitle = `${lesson.lessonTitle} - ${activeTab === 'plan' ? 'កិច្ចតែងការបង្រៀន' : 'សន្លឹកកិច្ចការ'}`;
    printDocument(targetId, docTitle);
  };

  const handleExportHTML = () => {
    exportToHTML(
      lesson.lessonTitle,
      activeTab,
      fiveStepPlan,
      worksheet,
      lesson
    );
  };

  const handleExportPowerPoint = async () => {
    await exportToPowerPoint(
      lesson.lessonTitle,
      activeTab,
      fiveStepPlan,
      worksheet
    );
  };

  const handleExportPDF = () => {
    handlePrint();
  };

  const handleExportJSON = () => {
    exportToJSON(
      lesson.lessonTitle,
      activeTab,
      fiveStepPlan,
      worksheet
    );
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (!content) return;

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (parsed.fiveStepPlan || parsed.type === 'fiveStepPlan') {
            const planData = parsed.fiveStepPlan || parsed.planData || parsed;
            setFiveStepPlan(planData);
            setActiveTab('plan');
            setImportSuccess(`បាននាំចូលកិច្ចតែងការពី "${file.name}" ដោយជោគជ័យ!`);
          } else if (parsed.worksheet || parsed.type === 'worksheet' || parsed.questions) {
            const worksheetData = parsed.worksheet || parsed.worksheetData || parsed;
            setWorksheet(worksheetData);
            setActiveTab('worksheet');
            setImportSuccess(`បាននាំចូលសន្លឹកកិច្ចការពី "${file.name}" ដោយជោគជ័យ!`);
          } else if (parsed.title && (parsed.steps || parsed.objectives)) {
            setFiveStepPlan(parsed);
            setActiveTab('plan');
            setImportSuccess(`បាននាំចូលកិច្ចតែងការពី "${file.name}" ដោយជោគជ័យ!`);
          } else {
            throw new Error('ទម្រង់ JSON មិនត្រឹមត្រូវ');
          }
        } else {
          // TXT, HTML, MD
          if (activeTab === 'plan') {
            setFiveStepPlan(prev => prev ? { ...prev, pedagogicalAdvice: content } : {
              title: lesson.lessonTitle,
              grade: lesson.grade,
              subject: lesson.subject,
              duration: '២ ម៉ោង',
              objectives: {
                knowledge: lesson.objectives.knowledge,
                skills: lesson.objectives.skills,
                attitudes: lesson.objectives.attitude,
              },
              teachingAids: lesson.teachingAids,
              steps: [
                { stepNumber: 1, title: 'ជំហានទី១៖ រៀបចំថ្នាក់', duration: '៥ នាទី', teacherActivities: 'ពិនិត្យអវត្តមាន និងវិន័យ', studentActivities: 'ឆ្លើយវត្តមាន' },
                { stepNumber: 2, title: 'ជំហានទី២៖ រំលឹកមេរៀនចាស់', duration: '១០ នាទី', teacherActivities: 'សួរសំណួរមេរៀនមុន', studentActivities: 'ឡើងដោះស្រាយ' },
                { stepNumber: 3, title: 'ជំហានទី៣៖ មេរៀនថ្មី', duration: '៤៥ នាទី', teacherActivities: content.slice(0, 800), studentActivities: 'ស្ដាប់ និងកត់ត្រា' },
                { stepNumber: 4, title: 'ជំហានទី៤៖ ពង្រឹងចំណេះដឹង', duration: '១៥ នាទី', teacherActivities: 'ឱ្យធ្វើលំហាត់', studentActivities: 'ធ្វើលំហាត់' },
                { stepNumber: 5, title: 'ជំហានទី៥៖ កិច្ចការផ្ទះ', duration: '៥ នាទី', teacherActivities: 'ដាក់កិច្ចការផ្ទះ', studentActivities: 'កត់ត្រាកិច្ចការផ្ទះ' },
              ],
              pedagogicalAdvice: 'ខ្លឹមសារបាននាំចូលពីឯកសារ៖ ' + file.name
            });
            setImportSuccess(`បាននាំចូលខ្លឹមសារអត្ថបទចូលក្នុងកិច្ចតែងការពី "${file.name}"!`);
          } else {
            setWorksheet(prev => prev ? { ...prev, instructions: content.slice(0, 300) } : {
              title: `សន្លឹកកិច្ចការ៖ ${lesson.lessonTitle}`,
              instructions: content.slice(0, 300),
              timeAllowed: '៣០ នាទី',
              totalPoints: 20,
              questions: [
                { id: 'q1', question: 'សំណួរដែលបាននាំចូលពីឯកសារ', points: 10, answerKey: 'ចម្លើយតាមឯកសារ' }
              ]
            });
            setImportSuccess(`បាននាំចូលខ្លឹមសារអត្ថបទចូលក្នុងសន្លឹកកិច្ចការពី "${file.name}"!`);
          }
        }
      } catch (err: any) {
        setError(`បរាជ័យក្នុងការនាំចូលឯកសារ៖ ${err.message || 'ពុំអាចអានបាន'}`);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 px-6 py-4 text-white flex items-center justify-between border-b border-purple-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400/20 rounded-lg text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                ជំនួយការ AI គរុកោសល្យ — កិច្ចតែងការបង្រៀន ៥ជំហាន
              </h2>
              <p className="text-xs text-purple-200">
                {lesson.grade} | {lesson.subject} | {lesson.lessonTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Action Controls */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('plan')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'plan'
                  ? 'bg-purple-700 text-white shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              កិច្ចតែងការ ៥ជំហាន (5-Step Lesson Plan)
            </button>

            <button
              onClick={() => {
                setActiveTab('worksheet');
                if (!worksheet && !loading) handleGenerateWorksheet();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'worksheet'
                  ? 'bg-purple-700 text-white shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              សន្លឹកកិច្ចការសិស្ស (Worksheet)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Import File Button */}
            <button
              onClick={handleImportClick}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 text-xs font-bold rounded-lg transition-all cursor-pointer"
              title="នាំចូលឯកសារ (.json, .txt, .html)"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-700" />
              <span>នាំចូលឯកសារ (Import)</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json,.txt,.html,.md"
              className="hidden"
            />

            {/* Export JSON */}
            <button
              onClick={handleExportJSON}
              disabled={loading || (!fiveStepPlan && !worksheet)}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
              title="ទាញយកជា JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-purple-700" />
              <span>JSON</span>
            </button>

            {/* Copy Text */}
            <button
              onClick={handleCopyText}
              disabled={loading || (!fiveStepPlan && !worksheet)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
              title="ចម្លងជាអត្ថបទ"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'បានចម្លង!' : 'ចម្លង'}</span>
            </button>

            {/* Export HTML */}
            <button
              onClick={handleExportHTML}
              disabled={loading || (!fiveStepPlan && !worksheet)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
              title="ទាញយកជាឯកសារ HTML"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-700" />
              <span>HTML</span>
            </button>

            {/* Export PowerPoint */}
            <button
              onClick={handleExportPowerPoint}
              disabled={loading || (!fiveStepPlan && !worksheet)}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
              title="ទាញយកជាស្លាយ PowerPoint (.pptx)"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-700" />
              <span>PowerPoint</span>
            </button>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              disabled={loading || (!fiveStepPlan && !worksheet)}
              className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-900 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
              title="រក្សាទុកជា PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-700" />
              <span>PDF</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              disabled={loading || (!fiveStepPlan && !worksheet)}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="បោះពុម្ពឯកសារ"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ព</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Generated Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Import Success Banner */}
          {importSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 text-xs font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importSuccess}</span>
              </div>
              <button
                onClick={() => setImportSuccess(null)}
                className="p-1 hover:bg-emerald-100 rounded text-emerald-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          {/* Custom Prompt Box */}
          <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-200 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-purple-900 block mb-1">
                បន្ថែមសំណូមពរពិសេសសម្រាប់គ្រូ (Custom Prompt)៖
              </label>
              <input
                type="text"
                placeholder="ឧ. បន្ថែមល្បែងសិក្សាសម្រាប់សិស្សរៀនយឺត, បន្ថែមលំហាត់ក្រុមប្រកួតប្រជែង..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-purple-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={activeTab === 'plan' ? handleGenerateLessonPlan : handleGenerateWorksheet}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-50 self-end md:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>បង្កើតឡើងវិញ</span>
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-bold text-purple-900 animate-pulse">
                Gemini AI កំពុងរៀបចំ {activeTab === 'plan' ? 'កិច្ចតែងការបង្រៀន ៥ជំហាន' : 'សន្លឹកកិច្ចការសិស្ស'} ស្របតាមស្តង់ដារក្រសួង...
              </p>
              <p className="text-xs text-slate-500">សូមរង់ចាំបន្តិច...</p>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-sm mb-0.5">ការបង្កើតបរាជ័យ</strong>
                <p>{error}</p>
                <button
                  onClick={handleGenerateLessonPlan}
                  className="mt-2 text-xs text-red-700 underline font-bold cursor-pointer"
                >
                  ព្យាយាមម្ដងទៀត
                </button>
              </div>
            </div>
          )}

          {/* Generated 5-Step Lesson Plan Display */}
          {!loading && !error && activeTab === 'plan' && fiveStepPlan && (
            <div id="printable-lesson-plan" className="space-y-6">
              
              {/* Lesson Metadata Banner */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <h3 className="text-base font-bold text-amber-950 mb-2">
                  {fiveStepPlan.title}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div><strong>កម្រិតថ្នាក់៖</strong> {fiveStepPlan.grade}</div>
                  <div><strong>មុខវិជ្ជា៖</strong> {fiveStepPlan.subject}</div>
                  <div><strong>រយៈពេល៖</strong> {fiveStepPlan.duration}</div>
                  <div><strong>ខែសិក្សា៖</strong> {lesson.monthName}</div>
                </div>
              </div>

              {/* Objectives Grid */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide mb-1 border-b border-slate-200 pb-1">
                  វត្ថុបំណងនៃមេរៀន (Objectives)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-900 block mb-0.5">១. ចំណេះដឹង៖</span>
                    <p className="text-slate-700">{fiveStepPlan.objectives.knowledge}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-900 block mb-0.5">២. បំណិន៖</span>
                    <p className="text-slate-700">{fiveStepPlan.objectives.skills}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-amber-900 block mb-0.5">៣. ឥរិយាបថ៖</span>
                    <p className="text-slate-700">{fiveStepPlan.objectives.attitudes}</p>
                  </div>
                </div>

                <div className="pt-2 text-slate-700">
                  <span className="font-bold text-slate-900">សម្ភារឧបទេស៖</span> {fiveStepPlan.teachingAids.join(', ')}
                </div>
              </div>

              {/* 5 Steps Accordion/Table */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-blue-950 border-b-2 border-blue-900 pb-1">
                  សកម្មភាពបង្រៀន ៥ ជំហាន (5-Step Pedagogical Process)
                </h4>

                {fiveStepPlan.steps.map((step) => (
                  <div key={step.stepNumber} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">
                        {step.title}
                      </span>
                      <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                        {step.duration}
                      </span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <strong className="font-bold text-blue-900 block mb-1">
                          សកម្មភាពគ្រូ (Teacher Activities)៖
                        </strong>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {step.teacherActivities}
                        </p>
                      </div>

                      <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                        <strong className="font-bold text-emerald-900 block mb-1">
                          សកម្មភាពសិស្ស (Student Activities)៖
                        </strong>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {step.studentActivities}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pedagogical Advice */}
              {fiveStepPlan.pedagogicalAdvice && (
                <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 space-y-1">
                  <strong className="font-bold block text-indigo-900">
                    💡 ការណែនាំគរុកោសល្យបន្ថែម៖
                  </strong>
                  <p className="leading-relaxed">{fiveStepPlan.pedagogicalAdvice}</p>
                </div>
              )}
            </div>
          )}

          {/* Generated Student Worksheet Display */}
          {!loading && !error && activeTab === 'worksheet' && worksheet && (
            <div id="printable-worksheet" className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                <h3 className="text-base font-bold mb-1">{worksheet.title}</h3>
                <p className="text-xs text-emerald-800">
                  ការណែនាំ៖ {worksheet.instructions} | រយៈពេល៖ {worksheet.timeAllowed} | ពិន្ទុសរុប៖ {worksheet.totalPoints}
                </p>
              </div>

              <div className="space-y-4">
                {worksheet.questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900">
                        {idx + 1}. {q.question}
                      </h4>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold shrink-0">
                        {q.points} ពិន្ទុ
                      </span>
                    </div>

                    {q.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4 py-1">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="bg-slate-50 p-2 rounded border border-slate-200 text-slate-700">
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 bg-emerald-50/50 p-2 rounded text-emerald-900 font-medium">
                      <strong>ចម្លើយត្រឹមត្រូវ និងការបកស្រាយ៖</strong> {q.answerKey}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
