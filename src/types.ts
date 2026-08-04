export type GradeLevel = 'ថ្នាក់ទី១' | 'ថ្នាក់ទី២' | 'ថ្នាក់ទី៣' | 'ថ្នាក់ទី៤' | 'ថ្នាក់ទី៥' | 'ថ្នាក់ទី៦';

export type Semester = 'ឆមាសទី១' | 'ឆមាសទី២';

export type SubjectType =
  | 'ភាសាខ្មែរ'
  | 'គណិតវិទ្យា'
  | 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម'
  | 'សីលធម៌ និងពលរដ្ឋវិជ្ជា'
  | 'ភាសាអង់គ្លេស';

export interface Objective {
  knowledge: string; // ចំណេះដឹង
  skills: string; // បំណិន
  attitude: string; // ឥរិយាបថ
}

export interface LessonPlan {
  id: string;
  monthNumber: number; // 1 to 10
  monthName: string; // e.g. "ខែទី១ (វិច្ឆិកា)"
  semester: Semester; // "ឆមាសទី១" | "ឆមាសទី២"
  grade: GradeLevel;
  subject: SubjectType;
  chapterTitle: string; // ជំពូក ឬផ្នែកធំ
  lessonTitle: string; // ចំណងជើងមេរៀន
  hoursAllocated: number; // ចំនួនម៉ោងបង្រៀន
  objectives: Objective; // វត្ថុបំណង ៣ យ៉ាង
  teachingActivities: string[]; // សកម្មភាពបង្រៀនគំរូ
  teachingAids: string[]; // សម្ភារឧបទេស
  assessmentMethods: string[]; // ការវាយតម្លៃ
  completed?: boolean;
  customNotes?: string;
}

export interface FiveStepLessonPlan {
  title: string;
  grade: string;
  subject: string;
  duration: string;
  teachingAids: string[];
  objectives: {
    knowledge: string;
    skills: string;
    attitudes: string;
  };
  steps: {
    stepNumber: number;
    title: string;
    duration: string;
    teacherActivities: string;
    studentActivities: string;
  }[];
  pedagogicalAdvice?: string;
}

export interface StudentQuestion {
  id: number;
  question: string;
  type: 'multiple_choice' | 'short_answer' | 'fill_blank';
  options?: string[];
  answerKey: string;
  points: number;
}

export interface StudentWorksheet {
  title: string;
  instructions: string;
  questions: StudentQuestion[];
  totalPoints: number;
  timeAllowed: string;
}

export interface SchoolInfo {
  schoolName: string;
  provinceDistrict: string;
  teacherName: string;
  academicYear: string;
  clusterSchool?: string;
}
