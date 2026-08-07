import React, { useState, useEffect, useRef } from 'react';
import { LessonPlan, FiveStepLessonPlan, StudentWorksheet } from '../types';
import { Sparkles, X, Printer, Copy, Check, RefreshCw, FileText, BookOpen, AlertCircle, FileCode, Presentation, FileDown, Upload, FileJson, CheckCircle2, Users, Target, HelpCircle, Gamepad2, GraduationCap, Compass, Eye, EyeOff, Share2, Send, Mail, Link2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { exportToHTML, exportToPowerPoint, exportToJSON, printDocument } from '../utils/exportUtils';
import { SovannaphumiLogo } from './SovannaphumiLogo';
import { KingdomMottoHeader } from './KingdomMottoHeader';

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
  const [copiedJSON, setCopiedJSON] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedShareText, setCopiedShareText] = useState<boolean>(false);

  // Khmer Spell Checker State
  const [spellChecking, setSpellChecking] = useState<boolean>(false);
  const [spellCheckSuccessMsg, setSpellCheckSuccessMsg] = useState<string | null>(null);
  const [spellCheckResult, setSpellCheckResult] = useState<{
    totalIssuesFound: number;
    accuracyScore: number;
    summary: string;
    corrections: Array<{
      originalWord: string;
      correctedWord: string;
      context: string;
      explanation: string;
    }>;
    correctedData: any;
  } | null>(null);
  
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [teachingStyle, setTeachingStyle] = useState<string>('interactive');
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [fiveStepPlan, setFiveStepPlan] = useState<FiveStepLessonPlan | null>(null);
  const [worksheet, setWorksheet] = useState<StudentWorksheet | null>(null);
  const [imageGenerating, setImageGenerating] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleRegenerateImage = async () => {
    if (!lesson) return;
    setImageGenerating(true);
    setImageError(null);
    try {
      const step3Activity = fiveStepPlan?.steps?.find(s => s.stepNumber === 3)?.teacherActivities 
        || fiveStepPlan?.steps?.[2]?.teacherActivities || '';
      const studentActivity = fiveStepPlan?.steps?.find(s => s.stepNumber === 3)?.studentActivities
        || fiveStepPlan?.steps?.[2]?.studentActivities || '';
      const questionsList = worksheet?.questions?.map(q => q.question).filter(Boolean).slice(0, 4).join('; ') || '';
      const objectivesText = fiveStepPlan?.objectives?.knowledge || lesson.objectives?.knowledge || '';

      const activitiesText = [step3Activity, studentActivity, objectivesText].filter(Boolean).join('. ');

      const res = await fetch('/api/gemini/generate-activity-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: lesson.lessonTitle,
          subject: lesson.subject,
          grade: lesson.grade,
          customPrompt: customPrompt || '',
          activitiesText,
          questionsText: questionsList,
        }),
      });

      let data: any;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        // Fallback gracefully to dynamic prompt image if server returns non-JSON or HTML
        const promptStr = `Cambodian primary school children learning ${lesson.subject} ${lesson.lessonTitle}, educational illustration`;
        const encodedPrompt = encodeURIComponent(promptStr);
        const fallbackUrl = `https://pollinations.ai/prompt/${encodedPrompt}?width=800&height=450&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;
        data = { success: true, imageUrl: fallbackUrl };
      }

      if (data.success && data.imageUrl) {
        setFiveStepPlan((prev) => (prev ? { ...prev, activityImageUrl: data.imageUrl } : {
          title: lesson.lessonTitle,
          grade: lesson.grade,
          subject: lesson.subject,
          duration: '២ ម៉ោង (៨០ នាទី)',
          teachingAids: lesson.teachingAids || ['សៀវភៅសិក្សាគោល'],
          objectives: {
            knowledge: lesson.objectives.knowledge,
            skills: lesson.objectives.skills,
            attitudes: lesson.objectives.attitude,
          },
          steps: [],
          activityImageUrl: data.imageUrl,
        }));
      } else {
        setImageError(data.error || 'មិនអាចបង្កើតរូបភាពបានទេ');
      }
    } catch (err: any) {
      // Fallback gracefully on network error
      const promptStr = `Cambodian primary school children learning ${lesson.subject} ${lesson.lessonTitle}, educational illustration`;
      const encodedPrompt = encodeURIComponent(promptStr);
      const fallbackUrl = `https://pollinations.ai/prompt/${encodedPrompt}?width=800&height=450&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;
      
      setFiveStepPlan((prev) => (prev ? { ...prev, activityImageUrl: fallbackUrl } : {
        title: lesson.lessonTitle,
        grade: lesson.grade,
        subject: lesson.subject,
        duration: '២ ម៉ោង (៨០ នាទី)',
        teachingAids: lesson.teachingAids || ['សៀវភៅសិក្សាគោល'],
        objectives: {
          knowledge: lesson.objectives.knowledge,
          skills: lesson.objectives.skills,
          attitudes: lesson.objectives.attitude,
        },
        steps: [],
        activityImageUrl: fallbackUrl,
      }));
    } finally {
      setImageGenerating(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Teaching style presets definition
  const teachingStyles = [
    {
      id: 'interactive',
      label: 'អន្តរកម្ម & សកម្ម',
      desc: 'Interactive & Student-Centered',
      icon: Target,
      color: 'border-purple-300 bg-purple-50 text-purple-900 active:bg-purple-100',
      activeColor: 'bg-purple-700 text-white border-purple-800 shadow-xs',
    },
    {
      id: 'group',
      label: 'ការងារក្រុម & ពិភាក្សា',
      desc: 'Group Activity & Peer Discussion',
      icon: Users,
      color: 'border-blue-300 bg-blue-50 text-blue-900 active:bg-blue-100',
      activeColor: 'bg-blue-700 text-white border-blue-800 shadow-xs',
    },
    {
      id: 'inquiry',
      label: 'ស៊ើបសួរ & ដោះស្រាយ',
      desc: 'Inquiry-Based & Problem Solving',
      icon: Compass,
      color: 'border-emerald-300 bg-emerald-50 text-emerald-900 active:bg-emerald-100',
      activeColor: 'bg-emerald-700 text-white border-emerald-800 shadow-xs',
    },
    {
      id: 'lecture',
      label: 'ពន្យល់ & បង្ហាញផ្ទាល់',
      desc: 'Lecture & Direct Instruction',
      icon: GraduationCap,
      color: 'border-amber-300 bg-amber-50 text-amber-900 active:bg-amber-100',
      activeColor: 'bg-amber-700 text-white border-amber-800 shadow-xs',
    },
    {
      id: 'gamified',
      label: 'ល្បែងសិក្សា & កម្សាន្ត',
      desc: 'Gamified & Play-Based',
      icon: Gamepad2,
      color: 'border-rose-300 bg-rose-50 text-rose-900 active:bg-rose-100',
      activeColor: 'bg-rose-700 text-white border-rose-800 shadow-xs',
    },
  ];

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
          teachingStyle: teachingStyle,
        }),
      });

      let data: any;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text && text.length < 200 ? text : `មានបញ្ហាតភ្ជាប់ទៅកាន់ Server (Status: ${res.status})`);
      }

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
          teachingStyle: teachingStyle,
          promptText: customPrompt,
        }),
      });

      let data: any;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text && text.length < 200 ? text : `មានបញ្ហាតភ្ជាប់ទៅកាន់ Server (Status: ${res.status})`);
      }

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
${showAnswers ? `* ចម្លើយ៖ ${q.answerKey}` : '* ចម្លើយសិស្ស៖ ....................................'}
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
      lesson,
      showAnswers
    );
  };

  const handleExportPowerPoint = async () => {
    await exportToPowerPoint(
      lesson.lessonTitle,
      activeTab,
      fiveStepPlan,
      worksheet,
      showAnswers
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

  const handleCopyJSON = () => {
    let exportData: any = null;
    if (activeTab === 'plan' && fiveStepPlan) {
      exportData = {
        type: 'fiveStepPlan',
        lessonTitle: lesson.lessonTitle,
        grade: lesson.grade,
        subject: lesson.subject,
        chapterTitle: lesson.chapterTitle,
        monthName: lesson.monthName,
        fiveStepPlan,
        exportedAt: new Date().toISOString(),
      };
    } else if (activeTab === 'worksheet' && worksheet) {
      exportData = {
        type: 'worksheet',
        lessonTitle: lesson.lessonTitle,
        grade: lesson.grade,
        subject: lesson.subject,
        worksheet,
        exportedAt: new Date().toISOString(),
      };
    }

    if (exportData) {
      const jsonStr = JSON.stringify(exportData, null, 2);
      navigator.clipboard.writeText(jsonStr);
      setCopiedJSON(true);
      setTimeout(() => setCopiedJSON(false), 2000);
    }
  };

  const handleCheckSpelling = async () => {
    const currentContent = activeTab === 'plan' ? fiveStepPlan : worksheet;
    if (!currentContent) return;

    setSpellChecking(true);
    setError(null);
    setSpellCheckResult(null);
    setSpellCheckSuccessMsg(null);

    try {
      const res = await fetch('/api/gemini/check-spelling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: activeTab,
          content: currentContent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSpellCheckResult({
          totalIssuesFound: data.totalIssuesFound || 0,
          accuracyScore: data.accuracyScore || 100,
          summary: data.summary || 'បានពិនិត្យអក្ខរាវិរុទ្ធរួចរាល់។',
          corrections: data.corrections || [],
          correctedData: data.correctedData,
        });
      } else {
        setError(data.error || 'មិនអាចពិនិត្យអក្ខរាវិរុទ្ធបានទេ');
      }
    } catch (_err) {
      setError('កំហុសបណ្តាញក្នុងការពិនិត្យអក្ខរាវិរុទ្ធ');
    } finally {
      setSpellChecking(false);
    }
  };

  const handleApplySpellCheckCorrections = () => {
    if (!spellCheckResult?.correctedData) return;

    if (activeTab === 'plan') {
      setFiveStepPlan(spellCheckResult.correctedData);
    } else {
      setWorksheet(spellCheckResult.correctedData);
    }

    setSpellCheckSuccessMsg('បានអនុវត្តការកែតម្រូវអក្ខរាវិរុទ្ធទាំងអស់រួចរាល់ដោយជោគជ័យ!');
    setTimeout(() => setSpellCheckSuccessMsg(null), 4000);
    setSpellCheckResult(null);
  };

  const getShareSummaryText = () => {
    if (!lesson) return '';
    const currentAppUrl = window.location.href;
    if (activeTab === 'plan' && fiveStepPlan) {
      return `📚 [កិច្ចតែងការបង្រៀន ៥ជំហាន - AI Generated]
--------------------------------
• មុខវិជ្ជា៖ ${lesson.subject} (${lesson.grade})
• មេរៀន/ជំពូក៖ ${lesson.lessonTitle} (${lesson.chapterTitle})
• គោលបំណង៖ ${fiveStepPlan.objectivesSummary || lesson.objectives.knowledge}
• រយៈពេល៖ ${fiveStepPlan.durationMinutes || 45} នាទី

🔗 បើកមើល ឬកែសម្រួលបន្ថែមតាមតំណនេះ៖
${currentAppUrl}`;
    } else if (activeTab === 'worksheet' && worksheet) {
      return `📝 [សន្លឹកកិច្ចការសិស្សអនុវត្ត / កម្រងសំណួរ]
--------------------------------
• ប្រធានបទ៖ ${worksheet.title}
• មុខវិជ្ជា៖ ${lesson.subject} (${lesson.grade})
• រយៈពេល៖ ${worksheet.timeAllowed} | ពិន្ទុសរុប៖ ${worksheet.totalPoints}
• ចំនួនសំណួរ៖ ${worksheet.questions.length} សំណួរ

🔗 បើកមើល ឬទាញយកតាមតំណនេះ៖
${currentAppUrl}`;
    }
    return `📚 កិច្ចតែងការបង្រៀន៖ ${lesson.lessonTitle} (${lesson.subject} - ${lesson.grade})\n🔗 ${currentAppUrl}`;
  };

  const handleShareTelegram = () => {
    const text = getShareSummaryText();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleShareEmail = () => {
    if (!lesson) return;
    const text = getShareSummaryText();
    const subject = `${activeTab === 'plan' ? 'កិច្ចតែងការបង្រៀន' : 'សន្លឹកកិច្ចការ'}៖ ${lesson.lessonTitle}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyShareLink = () => {
    const text = getShareSummaryText();
    navigator.clipboard.writeText(text);
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!lesson) return;
    const text = getShareSummaryText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: lesson.lessonTitle,
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Native share cancelled or failed', err);
      }
    } else {
      handleCopyShareLink();
    }
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
            {/* Khmer Spell Checker Button */}
            <button
              onClick={handleCheckSpelling}
              disabled={spellChecking || loading || (!fiveStepPlan && !worksheet)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              title="ពិនិត្យអក្ខរាវិរុទ្ធភាសាខ្មែរតាមស្តង់ដារវចនានុក្រមជួនណាត"
            >
              <CheckCircle2 className={`w-3.5 h-3.5 text-teal-100 ${spellChecking ? 'animate-spin' : ''}`} />
              <span>{spellChecking ? 'កំពុងពិនិត្យ...' : 'ពិនិត្យអក្ខរាវិរុទ្ធមេរៀន'}</span>
            </button>

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
              title="ទាញយកជា JSON (Download JSON)"
            >
              <FileJson className="w-3.5 h-3.5 text-purple-700" />
              <span>ទាញយក JSON</span>
            </button>

            {/* Copy Lesson Data as JSON */}
            <button
              onClick={handleCopyJSON}
              disabled={loading || (!fiveStepPlan && !worksheet)}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-100/90 border border-purple-300 hover:bg-purple-200 text-purple-950 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
              title="ចម្លងទិន្នន័យមេរៀនជា JSON ទៅកាន់ Clipboard"
            >
              {copiedJSON ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-purple-700" />
              )}
              <span>{copiedJSON ? 'បានចម្លង JSON!' : 'ចម្លងទិន្នន័យមេរៀនជា JSON'}</span>
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

            {/* Share Button */}
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              disabled={loading || (!fiveStepPlan && !worksheet)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              title="ចែករំលែកកិច្ចតែងការទៅកាន់ Telegram / Email / Link"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-200" />
              <span>ចែករំលែក (Share)</span>
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

          {/* Spell Check Success Toast Banner */}
          {spellCheckSuccessMsg && (
            <div className="p-3 bg-teal-50 border border-teal-300 rounded-xl flex items-center justify-between text-teal-950 text-xs font-bold shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{spellCheckSuccessMsg}</span>
              </div>
              <button
                onClick={() => setSpellCheckSuccessMsg(null)}
                className="p-1 hover:bg-teal-100 rounded text-teal-800 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Spell Check Results Box */}
          {spellCheckResult && (
            <div className="p-4 bg-teal-50/90 border-2 border-teal-300 rounded-xl space-y-3 text-slate-800 shadow-sm">
              <div className="flex items-center justify-between border-b border-teal-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-teal-600 text-white rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-teal-950 flex items-center gap-2">
                      <span>លទ្ធផលនៃការពិនិត្យអក្ខរាវិរុទ្ធភាសាខ្មែរ</span>
                      <span className="px-2 py-0.5 bg-teal-200 text-teal-900 rounded-full text-[11px] font-bold">
                        ភាពត្រឹមត្រូវ {spellCheckResult.accuracyScore}%
                      </span>
                    </h3>
                    <p className="text-xs text-teal-800 font-medium mt-0.5">
                      {spellCheckResult.summary}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSpellCheckResult(null)}
                  className="p-1.5 text-teal-700 hover:text-teal-950 hover:bg-teal-200/60 rounded-lg cursor-pointer transition-colors"
                  title="បិទ"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Corrections List */}
              {spellCheckResult.corrections && spellCheckResult.corrections.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  <p className="text-xs font-bold text-teal-950">បញ្ជីពាក្យដែលបានរកឃើញ និងសំណើកែតម្រូវ (តាមស្តង់ដារវចនានុក្រមជួនណាត)៖</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {spellCheckResult.corrections.map((corr, idx) => (
                      <div key={idx} className="p-2.5 bg-white border border-teal-200 rounded-lg space-y-1 text-xs shadow-2xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="line-through text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
                            {corr.originalWord}
                          </span>
                          <span className="text-slate-400">➔</span>
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                            {corr.correctedWord}
                          </span>
                        </div>
                        {corr.context && (
                          <p className="text-[11px] text-slate-600 italic">
                            « {corr.context} »
                          </p>
                        )}
                        {corr.explanation && (
                          <p className="text-[11px] text-teal-800 font-medium">
                            • {corr.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>អបអរសាទរ! មិនមានពាក្យខុសអក្ខរាវិរុទ្ធនៅក្នុងមេរៀននេះទេ (អក្ខរាវិរុទ្ធត្រឹមត្រូវ ១០០%)។</span>
                </div>
              )}

              {/* Footer Action Buttons */}
              {spellCheckResult.corrections && spellCheckResult.corrections.length > 0 && (
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-teal-200">
                  <button
                    onClick={() => setSpellCheckResult(null)}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    រំលង
                  </button>
                  <button
                    onClick={handleApplySpellCheckCorrections}
                    className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-200" />
                    <span>អនុវត្តការកែប្រែទាំងអស់ (Apply All Corrections)</span>
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Custom Prompt & Teaching Style Selector Box */}
          <div className="bg-gradient-to-br from-purple-50/80 via-indigo-50/40 to-sky-50/50 p-4 rounded-xl border border-purple-200/80 space-y-3 shadow-xs">
            
            {/* Teaching Style Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-purple-700" />
                  <span>ជ្រើសរើសរចនាប័ទ្ម/វិធីសាស្ត្របង្រៀន (Teaching Style)៖</span>
                </label>
                <span className="text-[11px] text-purple-700 font-medium hidden sm:inline">
                  កំណត់ទម្រង់សកម្មភាពគ្រូ-សិស្សសម្រាប់ Gemini AI
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {teachingStyles.map((style) => {
                  const StyleIcon = style.icon;
                  const isSelected = teachingStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setTeachingStyle(style.id)}
                      className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? style.activeColor
                          : `${style.color} hover:bg-white hover:border-purple-300`
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <StyleIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : ''}`} />
                        <span className="text-xs font-bold leading-tight">{style.label}</span>
                      </div>
                      <span className={`text-[10px] leading-tight opacity-80 ${isSelected ? 'text-purple-100' : 'text-slate-600'}`}>
                        {style.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Input & Generate Button */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-1">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-purple-900 block mb-1">
                  បន្ថែមសំណូមពរពិសេស (Custom Prompt Note)៖
                </label>
                <input
                  type="text"
                  placeholder="ឧ. បន្ថែមល្បែងសិក្សាសម្រាប់សិស្សរៀនយឺត, បន្ថែមលំហាត់ប្រកួតប្រជែង..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-purple-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                />
              </div>
              <button
                onClick={activeTab === 'plan' ? handleGenerateLessonPlan : handleGenerateWorksheet}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-50 self-end md:self-auto"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{activeTab === 'plan' ? 'បង្កើតកិច្ចតែងការឡើងវិញ' : 'បង្កើតសន្លឹកកិច្ចការឡើងវិញ'}</span>
              </button>
            </div>

            {/* Worksheet Answer Key Toggle */}
            {activeTab === 'worksheet' && (
              <div className="pt-2 border-t border-purple-200/60 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>ការបង្ហាញចម្លើយ (Answer Key Setting)៖</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-purple-200">
                  <button
                    type="button"
                    onClick={() => setShowAnswers(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      !showAnswers
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>មិនបង្ហាញចម្លើយ (សម្រាប់សិស្ស)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAnswers(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      showAnswers
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>បង្ហាញចម្លើយ (សម្រាប់គ្រូ)</span>
                  </button>
                </div>
              </div>
            )}
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
                  onClick={activeTab === 'plan' ? handleGenerateLessonPlan : handleGenerateWorksheet}
                  className="mt-2 text-xs text-red-700 underline font-bold cursor-pointer"
                >
                  ព្យាយាមម្ដងទៀត
                </button>
              </div>
            </div>
          )}

          {/* Generated 5-Step Lesson Plan Display */}
          {!loading && !error && activeTab === 'plan' && fiveStepPlan && (
            <div id="printable-lesson-plan" className="space-y-6 bg-white p-2 sm:p-4 rounded-xl">
              
              {/* MoEYS Official Kingdom Header for Print */}
              <div className="mb-6 space-y-4 border-b-2 border-slate-900 pb-4">
                <div className="flex flex-row items-start justify-between text-xs font-semibold text-slate-900 leading-relaxed gap-2">
                  {/* Left Column: Ministry and School Info */}
                  <div className="text-left space-y-0.5 shrink-0">
                    <p className="font-moul text-xs text-slate-900">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
                    <p className="font-bold text-slate-800">មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកំពង់ស្ពឺ</p>
                    <p className="font-bold text-amber-900">សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ</p>
                  </div>

                  {/* Center: School Logo */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <SovannaphumiLogo className="w-14 h-14" size={56} />
                  </div>

                  {/* Right Column: Kingdom Motto */}
                  <div className="shrink-0">
                    <KingdomMottoHeader align="center" />
                  </div>
                </div>

                <div className="text-center pt-2">
                  <h1 className="font-moul text-base md:text-lg text-slate-900 uppercase">
                    កិច្ចតែងការបង្រៀន (ទម្រង់ ៥ជំហាន) — {fiveStepPlan.title || lesson.lessonTitle}
                  </h1>
                  <p className="text-xs text-slate-700 font-bold mt-1">
                    កម្រិតថ្នាក់៖ {fiveStepPlan.grade || lesson.grade} | ឆ្នាំសិក្សា ២០២៦ - ២០២៧ | គ្រូបន្ទុកថ្នាក់៖ លោកគ្រូ / អ្នកគ្រូ
                  </p>
                </div>
              </div>

              {/* Lesson Metadata Banner */}
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-900">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div><strong>កម្រិតថ្នាក់៖</strong> {fiveStepPlan.grade || lesson.grade}</div>
                  <div><strong>មុខវិជ្ជា៖</strong> {fiveStepPlan.subject || lesson.subject}</div>
                  <div><strong>រយៈពេល៖</strong> {fiveStepPlan.duration || '២ ម៉ោង (៨០ នាទី)'}</div>
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
                    <p className="text-slate-700">{fiveStepPlan.objectives?.knowledge || lesson.objectives?.knowledge || 'យល់ដឹងពីខ្លឹមសារមេរៀន'}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-900 block mb-0.5">២. បំណិន៖</span>
                    <p className="text-slate-700">{fiveStepPlan.objectives?.skills || lesson.objectives?.skills || 'អនុវត្ត និងដោះស្រាយលំហាត់បានត្រឹមត្រូវ'}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-amber-900 block mb-0.5">៣. ឥរិយាបថ៖</span>
                    <p className="text-slate-700">{fiveStepPlan.objectives?.attitudes || lesson.objectives?.attitude || 'មានស្មារតីប្រុងប្រយ័ត្ន និងស្រឡាញ់ការសិក្សា'}</p>
                  </div>
                </div>

                <div className="pt-2 text-slate-700">
                  <span className="font-bold text-slate-900">សម្ភារឧបទេស៖</span> {Array.isArray(fiveStepPlan.teachingAids) ? fiveStepPlan.teachingAids.join(', ') : (fiveStepPlan.teachingAids || 'សៀវភៅសិក្សាគោល, ក្តារខៀន')}
                </div>
              </div>



              {/* 5 Steps Accordion/Table */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-blue-950 border-b-2 border-blue-900 pb-1">
                  សកម្មភាពបង្រៀន ៥ ជំហាន (5-Step Pedagogical Process)
                </h4>

                {(fiveStepPlan.steps || []).map((step, idx) => (
                  <div key={step.stepNumber || idx + 1} className="step-card bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">
                        {step.title || `ជំហានទី${idx + 1}`}
                      </span>
                      <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                        {step.duration || '៥ នាទី'}
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

              {/* Signature Sign-off Block for Print */}
              <div className="pt-8 border-t border-slate-300 mt-8 grid grid-cols-2 text-center text-xs text-slate-900 font-bold signature-block">
                <div className="space-y-12">
                  <div>
                    <p>បានឃើញ និងឯកភាព</p>
                    <p className="uppercase mt-0.5">នាយកសាលាបឋមសិក្សា</p>
                  </div>
                  <p>...................................................</p>
                </div>

                <div className="space-y-12">
                  <div>
                    <p>ថ្ងៃ................ ខែ........... ឆ្នាំ២០២៦</p>
                    <p className="mt-0.5">គ្រូបន្ទុកថ្នាក់</p>
                  </div>
                  <p>...................................................</p>
                </div>
              </div>
            </div>
          )}

          {/* Generated Student Worksheet Display */}
          {!loading && !error && activeTab === 'worksheet' && worksheet && (
            <div id="printable-worksheet" className="space-y-6 bg-white p-2 sm:p-4 rounded-xl">
              
              {/* MoEYS Official Kingdom Header for Print */}
              <div className="mb-6 space-y-4 border-b-2 border-slate-900 pb-4">
                <div className="flex flex-row items-start justify-between text-xs font-semibold text-slate-900 leading-relaxed gap-2">
                  {/* Left Column: Ministry and School Info */}
                  <div className="text-left space-y-0.5 shrink-0">
                    <p className="font-moul text-xs text-slate-900">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
                    <p className="font-bold text-slate-800">មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកំពង់ស្ពឺ</p>
                    <p className="font-bold text-amber-900">សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ</p>
                  </div>

                  {/* Center: School Logo */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <SovannaphumiLogo className="w-14 h-14" size={56} />
                  </div>

                  {/* Right Column: Kingdom Motto */}
                  <div className="shrink-0">
                    <KingdomMottoHeader align="center" />
                  </div>
                </div>

                <div className="text-center pt-2">
                  <h2 className="font-moul text-base md:text-lg text-slate-900 uppercase">
                    {worksheet.title}
                  </h2>
                  <p className="text-xs text-slate-700 font-bold mt-1">
                    កម្រិតថ្នាក់៖ {lesson.grade} | មុខវិជ្ជា៖ {lesson.subject} | ឆ្នាំសិក្សា ២០២៦ - ២០២៧
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-emerald-900 font-bold">
                    ការណែនាំ៖ {worksheet.instructions}
                  </p>
                  <p className="text-xs text-emerald-800 mt-1">
                    រយៈពេល៖ <strong>{worksheet.timeAllowed}</strong> | ពិន្ទុសរុប៖ <strong>{worksheet.totalPoints} ពិន្ទុ</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAnswers(!showAnswers)}
                  className={`no-print flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs border shrink-0 ${
                    showAnswers
                      ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                      : 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700'
                  }`}
                  title="ចុចដើម្បីផ្លាស់ប្ដូរការបង្ហាញចម្លើយ"
                >
                  {showAnswers ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>កំពុងបង្ហាញចម្លើយ (Teacher Mode)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>កំពុងលាក់ចម្លើយ (Student Mode)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {worksheet.questions.map((q, idx) => (
                  <div key={q.id || idx} className="question-card p-4 bg-white rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
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

                    {showAnswers ? (
                      <div className="pt-2 border-t border-slate-100 bg-emerald-50/50 p-2.5 rounded-lg text-emerald-900 font-medium border border-emerald-200/60">
                        <strong>ចម្លើយត្រឹមត្រូវ និងការបកស្រាយ៖</strong> {q.answerKey}
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-slate-100 text-slate-400 font-medium flex items-center gap-2">
                        <span className="shrink-0 text-slate-500 font-semibold">ចម្លើយសិស្ស៖</span>
                        <div className="border-b-2 border-dotted border-slate-300 flex-1 h-4"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Signature Sign-off Block for Print */}
              <div className="pt-8 border-t border-slate-300 mt-8 grid grid-cols-2 text-center text-xs text-slate-900 font-bold signature-block">
                <div className="space-y-12">
                  <div>
                    <p>បានឃើញ និងឯកភាព</p>
                    <p className="uppercase mt-0.5">នាយកសាលាបឋមសិក្សា</p>
                  </div>
                  <p>...................................................</p>
                </div>

                <div className="space-y-12">
                  <div>
                    <p>ថ្ងៃ................ ខែ........... ឆ្នាំ២០២៦</p>
                    <p className="mt-0.5">គ្រូបន្ទុកថ្នាក់</p>
                  </div>
                  <p>...................................................</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Share Modal Dialog Overlay */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    ចែករំលែក{activeTab === 'plan' ? 'កិច្ចតែងការ' : 'សន្លឹកកិច្ចការ'} (Share)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ផ្ញើទៅកាន់ Telegram, Email ឬចម្លងតំណភ្ជាប់
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Quick Share Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                ជ្រើសរើសវេទិកាចែករំលែក៖
              </label>
              
              <div className="grid grid-cols-2 gap-2.5">
                {/* Telegram Share Button */}
                <button
                  type="button"
                  onClick={handleShareTelegram}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#229ED9] hover:bg-[#1d8cb3] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </button>

                {/* Email Share Button */}
                <button
                  type="button"
                  onClick={handleShareEmail}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Email</span>
                </button>
              </div>

              {/* Device System Share (Mobile/Supported Browser) */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs rounded-xl border border-indigo-200 transition-all cursor-pointer mt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                  <span>ចែករំលែកតាមកម្មវិធីផ្សេងៗ (System Share)</span>
                </button>
              )}
            </div>

            {/* Summary Text Preview & Copy Link */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  ខ្លឹមសារសង្ខេប & តំណភ្ជាប់៖
                </label>
                {copiedShareText && (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> បានចម្លងរួចរាល់!
                  </span>
                )}
              </div>

              <textarea
                readOnly
                rows={4}
                value={getShareSummaryText()}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono resize-none focus:outline-none"
              />

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                {copiedShareText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>បានចម្លងខ្លឹមសារ & តំណភ្ជាប់</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 text-amber-300" />
                    <span>ចម្លងខ្លឹមសារ & តំណភ្ជាប់ (Copy Text & Link)</span>
                  </>
                )}
              </button>
            </div>

            {/* Footer Close Button */}
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
