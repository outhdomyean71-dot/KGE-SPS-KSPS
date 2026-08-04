import React, { useState, useEffect } from 'react';
import { GradeLevel, SchoolInfo } from '../types';
import { X, UserCheck, Plus, Trash2, Save, AlertCircle, BookOpen, UserX, CheckCircle } from 'lucide-react';

export interface SlowLearnerRecord {
  id: string;
  studentName: string;
  gender: 'ប្រុស' | 'ស្រី';
  subjectNeeded: string;
  difficultyDetail: string;
  actionTaken: string;
  status: 'ត្រូវការបន្តជួយ' | 'កើនឡើងល្អ' | 'ចេះស្ទាត់ហើយ';
  dateAdded: string;
}

interface SlowLearnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGrade: GradeLevel;
  schoolInfo: SchoolInfo;
}

const STORAGE_KEY = 'moeys_slow_learners_data';

export const SlowLearnersModal: React.FC<SlowLearnersModalProps> = ({
  isOpen,
  onClose,
  selectedGrade,
  schoolInfo,
}) => {
  const [records, setRecords] = useState<SlowLearnerRecord[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState<'ប្រុស' | 'ស្រី'>('ប្រុស');
  const [subjectNeeded, setSubjectNeeded] = useState('ភាសាខ្មែរ');
  const [difficultyDetail, setDifficultyDetail] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [status, setStatus] = useState<'ត្រូវការបន្តជួយ' | 'កើនឡើងល្អ' | 'ចេះស្ទាត់ហើយ'>('ត្រូវការបន្តជួយ');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecords(JSON.parse(saved));
      } else {
        // Initial Sample Demo Data for Teachers
        const sampleRecords: SlowLearnerRecord[] = [
          {
            id: '1',
            studentName: 'សុខ សុភា',
            gender: 'ស្រី',
            subjectNeeded: 'ភាសាខ្មែរ (EGRA)',
            difficultyDetail: 'មិនទាន់ប្រកបពាក្យដែលមានស្រៈផ្សំបានស្ទាត់',
            actionTaken: 'ឱ្យធ្វើលំហាត់អានប័ណ្ណពាក្យ ១០នាទីជៀងរៀងរាល់ថ្ងៃ',
            status: 'កើនឡើងល្អ',
            dateAdded: '2026-08-01',
          },
          {
            id: '2',
            studentName: 'ចាន់ តារា',
            gender: 'ប្រុស',
            subjectNeeded: 'គណិតវិទ្យា (EGMA)',
            difficultyDetail: 'ច្រឡំសញ្ញាបូក (+) និង សញ្ញាគុណ (x)',
            actionTaken: 'ពន្យល់ឡើងវិញដោយប្រើសម្ភាររាប់គ្រាប់ឃ្លី',
            status: 'ត្រូវការបន្តជួយ',
            dateAdded: '2026-08-02',
          },
        ];
        setRecords(sampleRecords);
      }
    } catch (e) {
      console.error('Failed to load slow learners records:', e);
    }
  }, []);

  const saveToStorage = (updated: SlowLearnerRecord[]) => {
    setRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save records:', e);
    }
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !difficultyDetail.trim()) return;

    const newRec: SlowLearnerRecord = {
      id: Date.now().toString(),
      studentName: studentName.trim(),
      gender,
      subjectNeeded,
      difficultyDetail: difficultyDetail.trim(),
      actionTaken: actionTaken.trim() || 'ណែនាំបំប៉នបន្ថែមក្នុងម៉ោងសិក្សា',
      status,
      dateAdded: new Date().toISOString().slice(0, 10),
    };

    const updated = [newRec, ...records];
    saveToStorage(updated);

    // Reset Form
    setStudentName('');
    setDifficultyDetail('');
    setActionTaken('');
    setIsAdding(false);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('តើអ្នកប្រាកដជាចង់លុបទិន្នន័យសិស្សនេះឬ?')) {
      const updated = records.filter((r) => r.id !== id);
      saveToStorage(updated);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400 text-slate-950 rounded-lg shadow font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                បណ្ណតាមដាន និង ជួយសិស្សរៀនយឺត (Slow Learners Support)
              </h2>
              <p className="text-xs text-amber-300 font-medium">
                {selectedGrade} | កម្មវិធីអានឆាប់ចេះ & គណិតឆាប់ចេះ (MoEYS 2026)
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

        {/* Action Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            បញ្ជីសិស្សទទួលបានការបំប៉នបន្ថែម (សរុប៖ {records.length} នាក់)
          </span>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>កត់ត្រាសិស្សថ្មី</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800 flex-1">
          
          {/* Add Form */}
          {isAdding && (
            <form onSubmit={handleAddRecord} className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
              <h3 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                បន្ថែមព័ត៌មានសិស្សរៀនយឺតត្រូវការជំនួយ
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">ឈ្មោះសិស្ស៖</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="ឧ. សុខ ពិសិដ្ឋ"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">ភេទ៖</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="ប្រុស">ប្រុស</option>
                    <option value="ស្រី">ស្រី</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">មុខវិជ្ជាត្រូវការជំនួយ៖</label>
                  <select
                    value={subjectNeeded}
                    onChange={(e) => setSubjectNeeded(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="ភាសាខ្មែរ (EGRA)">ភាសាខ្មែរ (EGRA)</option>
                    <option value="គណិតវិទ្យា (EGMA)">គណិតវិទ្យា (EGMA)</option>
                    <option value="វិទ្យាសាស្ត្រ និង សិក្សាសង្គម">វិទ្យាសាស្ត្រ និង សិក្សាសង្គម</option>
                    <option value="ភាសាអង់គ្លេស">ភាសាអង់គ្លេស</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">ចំណុចប្រឈម / ការលំបាករបស់សិស្ស៖</label>
                <input
                  type="text"
                  required
                  value={difficultyDetail}
                  onChange={(e) => setDifficultyDetail(e.target.value)}
                  placeholder="ឧ. អានពាក្យត្រួតមិនទាន់បាន, មិនទាន់ស្គាល់លេខខ្មែរ..."
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">វិធានការជួយបំប៉ន៖</label>
                <input
                  type="text"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="ឧ. ឱ្យកិច្ចការផ្ទះពិសេស, បំពេញប័ណ្ណរូបភាព..."
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <label className="font-bold">ស្ថានភាព៖</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="p-1.5 bg-white border border-slate-300 rounded-lg font-bold text-xs"
                  >
                    <option value="ត្រូវការបន្តជួយ">ត្រូវការបន្តជួយ</option>
                    <option value="កើនឡើងល្អ">កើនឡើងល្អ</option>
                    <option value="ចេះស្ទាត់ហើយ">ចេះស្ទាត់ហើយ</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg cursor-pointer"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-2xs cursor-pointer"
                  >
                    រក្សាទុក
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Records Table */}
          {records.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-xl">
              <UserX className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-600">មិនទាន់មានទិន្នន័យសិស្សរៀនយឺតឡើយ</p>
              <p className="text-slate-400 mt-1">ចុចប៊ូតុង «កត់ត្រាសិស្សថ្មី» ខាងលើដើម្បីបន្ថែម...</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">ឈ្មោះសិស្ស (ភេទ)</th>
                    <th className="py-2.5 px-3">មុខវិជ្ជា</th>
                    <th className="py-2.5 px-3">ការលំបាក</th>
                    <th className="py-2.5 px-3">វិធានការជួយបំប៉ន</th>
                    <th className="py-2.5 px-3 text-center">ស្ថានភាព</th>
                    <th className="py-2.5 px-3 text-center">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-xs">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {rec.studentName} ({rec.gender})
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-bold text-[11px]">
                          {rec.subjectNeeded}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-[200px]">
                        {rec.difficultyDetail}
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-[200px]">
                        {rec.actionTaken}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          rec.status === 'ចេះស្ទាត់ហើយ'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : rec.status === 'កើនឡើងល្អ'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteRecord(rec.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="លុប"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
