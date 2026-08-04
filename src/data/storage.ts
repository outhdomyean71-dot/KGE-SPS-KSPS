import { LessonPlan, SchoolInfo } from '../types';
import { INITIAL_CURRICULUM } from './curriculumData';

const STORAGE_KEY_CURRICULUM = 'moeys_primary_curriculum_v1';
const STORAGE_KEY_SCHOOL = 'moeys_primary_school_info_v1';

export const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  schoolName: 'សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ',
  provinceDistrict: 'ខេត្តកំពង់ស្ពឺ',
  teacherName: 'លោកគ្រូ / អ្នកគ្រូ',
  academicYear: '២០២៦ - ២០២៧',
  clusterSchool: 'សាលារៀនសុវណ្ណភូមិ'
};

export function getSavedCurriculum(): LessonPlan[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CURRICULUM);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse saved curriculum', e);
  }
  return INITIAL_CURRICULUM;
}

export function saveCurriculum(data: LessonPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CURRICULUM, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save curriculum', e);
  }
}

export function getSavedSchoolInfo(): SchoolInfo {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SCHOOL);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to get school info', e);
  }
  return DEFAULT_SCHOOL_INFO;
}

export function saveSchoolInfo(info: SchoolInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(info));
  } catch (e) {
    console.error('Failed to save school info', e);
  }
}
