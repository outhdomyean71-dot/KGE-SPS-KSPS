import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { LessonPlan, SchoolInfo } from '../types';

// Initialize Firebase App & Firestore with database ID
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

/**
 * Initialize anonymous auth for initial session, or allow explicit sync code
 */
export function initAuth(onUserReady: (user: User) => void): () => void {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      onUserReady(currentUser);
    } else {
      try {
        const cred = await signInAnonymously(auth);
        onUserReady(cred.user);
      } catch (err: any) {
        console.warn('Firebase Anonymous Auth unavailable or restricted, using persistent local session UID:', err?.message || err);
        let localUid = localStorage.getItem('firebase_sync_uid');
        if (!localUid) {
          localUid = 'teacher_' + Math.random().toString(36).substring(2, 11);
          localStorage.setItem('firebase_sync_uid', localUid);
        }
        onUserReady({ uid: localUid } as User);
      }
    }
  });

  return unsubscribe;
}

/**
 * Sync a single lesson's custom notes & completion status to Firestore
 */
export async function syncLessonToCloud(userId: string, lesson: LessonPlan): Promise<void> {
  if (!userId || !lesson.id) return;
  try {
    const docRef = doc(db, 'lessons', `${userId}_${lesson.id}`);
    await setDoc(
      docRef,
      {
        id: lesson.id,
        userId: userId,
        completed: !!lesson.completed,
        needReinforcement: !!lesson.needReinforcement,
        customNotes: lesson.customNotes || '',
        grade: lesson.grade,
        subject: lesson.subject,
        lessonTitle: lesson.lessonTitle,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error syncing lesson to Firestore:', err);
  }
}

/**
 * Sync all lessons progress to Firestore in batch
 */
export async function syncAllLessonsToCloud(userId: string, lessons: LessonPlan[]): Promise<void> {
  if (!userId || lessons.length === 0) return;
  try {
    const batch = writeBatch(db);
    lessons.forEach((lesson) => {
      const docRef = doc(db, 'lessons', `${userId}_${lesson.id}`);
      batch.set(
        docRef,
        {
          id: lesson.id,
          userId: userId,
          completed: !!lesson.completed,
          needReinforcement: !!lesson.needReinforcement,
          customNotes: lesson.customNotes || '',
          grade: lesson.grade,
          subject: lesson.subject,
          lessonTitle: lesson.lessonTitle,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    });
    await batch.commit();
  } catch (err) {
    console.error('Error batch syncing lessons to Firestore:', err);
  }
}

/**
 * Real-time listener for user's lessons notes & completed progress
 */
export function listenToCloudLessons(
  userId: string,
  onData: (remoteLessons: Record<string, { completed?: boolean; needReinforcement?: boolean; customNotes?: string }>) => void
): () => void {
  if (!userId) return () => {};

  const q = query(collection(db, 'lessons'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const updates: Record<string, { completed?: boolean; needReinforcement?: boolean; customNotes?: string }> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.id) {
          updates[data.id] = {
            completed: data.completed,
            needReinforcement: data.needReinforcement,
            customNotes: data.customNotes,
          };
        }
      });
      onData(updates);
    },
    (err) => {
      console.error('Snapshot error listening to lessons:', err);
    }
  );
}

/**
 * Sync school information to Firestore
 */
export async function syncSchoolInfoToCloud(userId: string, schoolInfo: SchoolInfo): Promise<void> {
  if (!userId) return;
  try {
    const docRef = doc(db, 'school_info', userId);
    await setDoc(
      docRef,
      {
        userId,
        ...schoolInfo,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error syncing school info to Firestore:', err);
  }
}

/**
 * Real-time listener for school info
 */
export function listenToCloudSchoolInfo(
  userId: string,
  onData: (info: SchoolInfo) => void
): () => void {
  if (!userId) return () => {};

  const docRef = doc(db, 'school_info', userId);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SchoolInfo;
        onData(data);
      }
    },
    (err) => {
      console.error('Snapshot error listening to school info:', err);
    }
  );
}
