import type { UserLearningData } from '@/types/user';

const STORAGE_KEY = 'oi_user_data';

export const saveUserData = (data: UserLearningData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadUserData = (): UserLearningData | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const initializeUserData = (): UserLearningData => {
  return {
    userId: generateUUID(),
    name: '学生',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    diagnosisHistory: [],
    learningProgress: [],
    completedProblems: [],
    mistakes: [],
    statistics: {
      totalStudyTime: 0,
      streakDays: 0,
      totalProblems: 0,
      correctProblems: 0,
      lastStudyDate: new Date().toISOString().split('T')[0],
    },
  };
};