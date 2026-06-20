import { create } from 'zustand';
import type { UserLearningData, MistakeRecord } from '@/types/user';
import type { DiagnosisAnswer, DiagnosisRecord } from '@/types/diagnosis';
import type { ProblemRecord } from '@/types/problem';
import { saveUserData, loadUserData, initializeUserData } from '@/utils/storage';
import { analyzeDiagnosis, generateDiagnosisRecord, updateLearningProgress, calculateStats } from '@/utils/analysis';
import { generateUUID } from '@/utils/storage';
import { getProblemById, problems } from '@/data/problems';

interface UserState {
  userData: UserLearningData;
  loadUser: () => void;
  saveUser: () => void;
  updateUserName: (name: string) => void;
  addDiagnosisAnswer: (answer: DiagnosisAnswer) => void;
  completeDiagnosis: (level: 'CSP-J' | 'CSP-S', answers: DiagnosisAnswer[]) => DiagnosisRecord | null;
  addProblemRecord: (record: ProblemRecord) => void;
  addMistake: (problemId: string, code: string, errorType: string, aiAnalysis: string) => void;
  markMistakeReviewed: (mistakeId: string) => void;
  updateStatistics: () => void;
  updateDailyRecommendations: () => void;
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
  
  completeDiagnosis: (level: 'CSP-J' | 'CSP-S', answers: DiagnosisAnswer[]): DiagnosisRecord | null => {
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
  
  updateDailyRecommendations: () => {
    const { learningProgress, mistakes, completedProblems } = get().userData;
    
    const weakKnowledgePoints = learningProgress
      .filter(p => p.masteryLevel < 80)
      .map(p => p.knowledgePointId);
    
    const mistakeKnowledgePoints = [...new Set(
      mistakes.map(m => {
        const problem = problems.find(p => p.id === m.problemId);
        return problem?.knowledgePoints[0];
      }).filter((k): k is string => !!k)
    )];
    
    const targetKnowledgePoints = [...new Set([...weakKnowledgePoints, ...mistakeKnowledgePoints])];
    
    const completedIds = new Set(completedProblems.map(cp => cp.problemId));
    
    let recommendedProblems = problems
      .filter(p => {
        if (completedIds.has(p.id)) return false;
        return p.knowledgePoints.some(kp => targetKnowledgePoints.includes(kp));
      })
      .sort((a, b) => {
        const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      });
    
    if (recommendedProblems.length < 5) {
      const additionalProblems = problems
        .filter(p => !completedIds.has(p.id) && !recommendedProblems.find(rp => rp.id === p.id))
        .sort((a, b) => {
          const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
      recommendedProblems = [...recommendedProblems, ...additionalProblems.slice(0, 5 - recommendedProblems.length)];
    }
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    set(state => ({
      userData: {
        ...state.userData,
        dailyRecommendedProblems: recommendedProblems.slice(0, 5).map(p => p.id),
        dailyRecommendDate: todayStr,
      },
    }));
    
    get().saveUser();
  },
}));