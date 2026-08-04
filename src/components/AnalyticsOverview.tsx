import React from 'react';
import { LessonPlan, GradeLevel, SubjectType } from '../types';
import { PieChart, CheckCircle2, Clock, BookOpen, Trophy, BarChart3 } from 'lucide-react';

interface AnalyticsOverviewProps {
  lessons: LessonPlan[];
  selectedGrade: GradeLevel;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  lessons,
  selectedGrade,
}) => {
  const gradeLessons = lessons.filter((l) => l.grade === selectedGrade);
  const completedLessons = gradeLessons.filter((l) => l.completed);
  const completionPercentage = gradeLessons.length
    ? Math.round((completedLessons.length / gradeLessons.length) * 100)
    : 0;

  const totalHours = gradeLessons.reduce((sum, l) => sum + l.hoursAllocated, 0);

  // Subject breakdown
  const subjects: SubjectType[] = [
    'ភាសាខ្មែរ',
    'គណិតវិទ្យា',
    'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    'ភាសាអង់គ្លេស',
  ];

  const subjectStats = subjects.map((subj) => {
    const subjLessons = gradeLessons.filter((l) => l.subject === subj);
    const completed = subjLessons.filter((l) => l.completed).length;
    const hours = subjLessons.reduce((sum, l) => sum + l.hoursAllocated, 0);
    return {
      subject: subj,
      totalCount: subjLessons.length,
      completedCount: completed,
      hours,
      percent: subjLessons.length ? Math.round((completed / subjLessons.length) * 100) : 0,
    };
  });

  return (
    <div className="max-w-7xl mx-auto my-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#b12c1b] via-[#d85822] to-[#ea9c28] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="px-3 py-1 bg-amber-300 text-red-950 font-bold text-xs rounded-full inline-block mb-1 shadow-2xs">
              {selectedGrade}
            </span>
            <h2 className="text-xl font-bold text-white">
              របាយការណ៍វឌ្ឍនភាពបង្រៀនប្រចាំឆ្នាំ — សាលារៀនសុវណ្ណភូមិ
            </h2>
            <p className="text-xs text-amber-100">
              សរុបលទ្ធផលបង្រៀនជាក់ស្តែងប្រៀបធៀបនឹងកម្មវិធីសិក្សាគោល
            </p>
          </div>

          <div className="flex items-center gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <span className="text-2xl font-black text-amber-300 block">{completionPercentage}%</span>
              <span className="text-xs text-slate-200 font-medium">ភាគរយបង្រៀនបញ្ចប់</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <span className="text-2xl font-black text-emerald-300 block">
                {completedLessons.length} / {gradeLessons.length}
              </span>
              <span className="text-xs text-slate-200 font-medium">មេរៀនបង្រៀនរួច</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <span className="text-2xl font-black text-blue-300 block">{totalHours}</span>
              <span className="text-xs text-slate-200 font-medium">ម៉ោងសិក្សាសរុប</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>វឌ្ឍនភាពទូទៅពេញមួយឆ្នាំ ({selectedGrade})</span>
            <span className="text-amber-300">{completionPercentage}% បញ្ចប់</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectStats.map((stat) => (
          <div key={stat.subject} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-700" />
                {stat.subject}
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200">
                {stat.hours} ម៉ោង
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>មេរៀនបង្រៀនរួច៖</span>
              <strong className="text-slate-900 font-bold">{stat.completedCount} / {stat.totalCount}</strong>
            </div>

            <div className="space-y-1">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${stat.percent}%` }}
                ></div>
              </div>
              <div className="text-right text-[10px] font-bold text-blue-900">
                {stat.percent}% សម្រេចបាន
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
