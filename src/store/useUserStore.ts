import { create } from 'zustand';
import type { UserLearningData, MistakeRecord } from '@/types/user';
import type { DiagnosisAnswer, DiagnosisRecord } from '@/types/diagnosis';
import type { ProblemRecord } from '@/types/problem';
import { saveUserData, loadUserData, initializeUserData } from '@/utils/storage';
import { analyzeDiagnosis, generateDiagnosisRecord, updateLearningProgress, calculateStats } from '@/utils/analysis';
import { generateUUID } from '@/utils/storage';
import { getProblemById } from '@/data/problems';

interface UserState {
  userData: UserLearningData;
  loadUser: () => void;
  saveUser: () => void;
  updateUserName: (name: string) => void;
  addDiagnosisAnswer: (answer: DiagnosisAnswer) => void;
  completeDiagnosis: (level: 'CSP-J' | 'CSP-S') => DiagnosisRecord | null;
  addProblemRecord: (record: ProblemRecord) => void;
  addMistake: (problemId: string, code: string, errorType: string, aiAnalysis: string) => void;
  markMistakeReviewed: (mistakeId: string) => void;
  updateStatistics: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  userData: initializeUserData(),
  
  loadUser: () => {
    const saved = loadUserData();
    if (saved) {
      set({ userData: saved });
    }
  },
  
  saveUser: () => {
    saveUserData(get().userData);
  },
  
  updateUserName: (name) => {
    set(state => ({
      userData: { ...state.userData, name },
    }));
    get().saveUser();
  },
  
  addDiagnosisAnswer: (_answer) => {
    set(state => ({
      userData: {
        ...state.userData,
        diagnosisHistory: [
          ...state.userData.diagnosisHistory,
          {
            id: `temp_${Date.now()}`,
            date: new Date().toISOString(),
            level: 'CSP-J',
            scores: {},
            weakPoints: [],
            recommendations: [],
          },
        ],
      },
    }));
  },
  
  completeDiagnosis: (level) => {
    const answers: DiagnosisAnswer[] = [];
    
    const result = analyzeDiagnosis(answers);
    const record = generateDiagnosisRecord(level, result);
    
    set(state => ({
      userData: {
        ...state.userData,
        diagnosisHistory: [...state.userData.diagnosisHistory, record],
      },
    }));
    
    get().saveUser();
    return record;
  },
  
  addProblemRecord: (record) => {
    const problem = getProblemById(record.problemId);
    if (!problem) return;
    
    set(state => {
      const updatedProgress = updateLearningProgress(
        state.userData.learningProgress,
        problem,
        record.status === 'accepted'
      );
      
      return {
        userData: {
          ...state.userData,
          completedProblems: [...state.userData.completedProblems, record],
          learningProgress: updatedProgress,
        },
      };
    });
    
    get().updateStatistics();
    get().saveUser();
  },
  
  addMistake: (problemId, code, errorType, aiAnalysis) => {
    const newMistake: MistakeRecord = {
      id: generateUUID(),
      problemId,
      date: new Date().toISOString(),
      code,
      errorType,
      aiAnalysis,
      reviewed: false,
    };
    
    set(state => ({
      userData: {
        ...state.userData,
        mistakes: [...state.userData.mistakes, newMistake],
      },
    }));
    
    get().saveUser();
    return newMistake;
  },
  
  markMistakeReviewed: (mistakeId) => {
    set(state => ({
      userData: {
        ...state.userData,
        mistakes: state.userData.mistakes.map(m =>
          m.id === mistakeId ? { ...m, reviewed: true, reviewedAt: new Date().toISOString() } : m
        ),
      },
    }));
    
    get().saveUser();
  },
  
  updateStatistics: () => {
    set(state => ({
      userData: {
        ...state.userData,
        statistics: calculateStats(state.userData),
      },
    }));
  },
}));