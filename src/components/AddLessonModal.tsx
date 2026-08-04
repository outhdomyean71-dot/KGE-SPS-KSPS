import React, { useState } from 'react';
import { LessonPlan, GradeLevel, Semester, SubjectType } from '../types';
import { Plus, X, Save } from 'lucide-react';

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLesson: (newLesson: LessonPlan) => void;
  selectedGrade: GradeLevel;
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  isOpen,
  onClose,
  onAddLesson,
  selectedGrade,
}) => {
  const [grade, setGrade] = useState<GradeLevel>(selectedGrade);
  const [semester, setSemester] = useState<Semester>('ឆមាសទី១');
  const [monthNumber, setMonthNumber] = useState<number>(1);
  const [subject, setSubject] = useState<SubjectType>('ភាសាខ្មែរ');
  const [chapterTitle, setChapterTitle] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [hoursAllocated, setHoursAllocated] = useState<number>(10);

  const [knowledge, setKnowledge] = useState<string>('');
  const [skills, setSkills] = useState<string>('');
  const [attitude, setAttitude] = useState<string>('');

  const [teachingAids, setTeachingAids] = useState<string>('សៀវភៅសិក្សាគោល, ប័ណ្ណរូបភាព');
  const [assessmentMethods, setAssessmentMethods] = useState<string>('ការសង្កេត, ការធ្វើលំហាត់');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const monthNames: Record<number, string> = {
      1: 'ខែទី១ (វិច្ឆិកា)',
      2: 'ខែទី២ (ធ្នូ)',
      3: 'ខែទី៣ (មករា)',
      4: 'ខែទី៤ (កុម្ភៈ)',
      5: 'ខែទី៥ (មីនា)',
      6: 'ខែទី៦ (មេសា)',
      7: 'ខែទី៧ (ឧសភា)',
      8: 'ខែទី៨ (មិថុនា)',
      9: 'ខែទី៩ (កក្កដា)',
      10: 'ខែទី១០ (សីហា)',
    };

    const newLesson: LessonPlan = {
      id: `custom-${Date.now()}`,
      grade,
      semester,
      monthNumber,
      monthName: monthNames[monthNumber] || `ខែទី${monthNumber}`,
      subject,
      chapterTitle: chapterTitle || 'ជំពូកបន្ថែម',
      lessonTitle,
      hoursAllocated: Number(hoursAllocated) || 8,
      objectives: {
        knowledge: knowledge || 'យល់ដឹងខ្លឹមសារមេរៀនបានត្រឹមត្រូវ។',
        skills: skills || 'អនុវត្តដោះស្រាយលំហាត់បានស្ទាត់ជំនាញ។',
        attitude: attitude || 'មានស្មារតីប្រុងប្រយ័ត្ន និងស្រឡាញ់ការរៀន។',
      },
      teachingActivities: ['ការអានអត្ថបទរួមគ្នា', 'ការធ្វើលំហាត់បុគ្គល និងក្រុម'],
      teachingAids: teachingAids.split(',').map((s) => s.trim()),
      assessmentMethods: assessmentMethods.split(',').map((s) => s.trim()),
    };

    onAddLesson(newLesson);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-300" />
            <h2 className="text-sm font-bold text-white">បន្ថែមមេរៀនថ្មីចូលក្នុងផែនការ</h2>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800 flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">កម្រិតថ្នាក់៖</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              >
                {['ថ្នាក់ទី១', 'ថ្នាក់ទី២', 'ថ្នាក់ទី៣', 'ថ្នាក់ទី៤', 'ថ្នាក់ទី៥', 'ថ្នាក់ទី៦'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">មុខវិជ្ជា៖</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectType)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              >
                {['ភាសាខ្មែរ', 'គណិតវិទ្យា', 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម', 'សីលធម៌ និងពលរដ្ឋវិជ្ជា', 'ភាសាអង់គ្លេស'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold block mb-1">ឆមាស៖</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as Semester)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="ឆមាសទី១">ឆមាសទី១</option>
                <option value="ឆមាសទី២">ឆមាសទី២</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">ខែទី (១-១០)៖</label>
              <input
                type="number"
                min={1}
                max={10}
                value={monthNumber}
                onChange={(e) => setMonthNumber(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="font-bold block mb-1">ម៉ោងបង្រៀន៖</label>
              <input
                type="number"
                value={hoursAllocated}
                onChange={(e) => setHoursAllocated(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">ជំពូក ឬ ផ្នែកសំខាន់៖</label>
            <input
              type="text"
              placeholder="ឧ. ជំពូកទី១៖ ចំនួន..."
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="font-bold block mb-1">ចំណងជើងមេរៀន៖</label>
            <input
              type="text"
              placeholder="ឧ. មេរៀនទី១៖ ..."
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-blue-900"
              required
            />
          </div>

          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold block text-slate-900">វត្ថុបំណងនៃមេរៀន (Objectives)៖</span>
            
            <div>
              <label className="text-[11px] font-bold text-blue-900 block">១. ចំណេះដឹង (Knowledge)៖</label>
              <input
                type="text"
                value={knowledge}
                onChange={(e) => setKnowledge(e.target.value)}
                placeholder="សិស្សយល់ដឹងពី..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg mt-0.5"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-emerald-900 block">២. បំណិន (Skills)៖</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="សិស្សអាចចេះ..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg mt-0.5"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-amber-900 block">៣. ឥរិយាបថ (Attitude)៖</label>
              <input
                type="text"
                value={attitude}
                onChange={(e) => setAttitude(e.target.value)}
                placeholder="សិស្សមានស្មារតី..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg mt-0.5"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">សម្ភារឧបទេស (បំបែកដោយសញ្ញាក្បៀស)៖</label>
            <input
              type="text"
              value={teachingAids}
              onChange={(e) => setTeachingAids(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
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
              className="flex items-center gap-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer"
            >
              <Save className="w-4 h-4" /> រក្សាទុកមេរៀន
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
