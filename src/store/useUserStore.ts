import { knowledgePoints } from '@/data/knowledgePoints';
import { getLearningPathByLevel } from '@/data/learningPath';
import type { DiagnosisAnswer, DiagnosisRecord } from '@/types/diagnosis';
import { analyzeDiagnosis, generateDiagnosisRecord } from '@/utils/analysis';
import { initializeUserData, loadUserData, saveUserData } from '@/utils/storage';
import { create } from 'zustand';

interface UserState {
  userData: ReturnType<typeof initializeUserData>;
  loadUser: () => void;
  saveUser: () => void;
  updateUserName: (name: string) => void;
  completeDiagnosis: (level: 'CSP-J' | 'CSP-S', answers: DiagnosisAnswer[]) => DiagnosisRecord | null;
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
  
  completeDiagnosis: (level: 'CSP-J' | 'CSP-S', answers: DiagnosisAnswer[]): DiagnosisRecord | null => {
    const existingProgress = get().userData.learningProgress;
    const result = analyzeDiagnosis(answers, existingProgress);
    const record = generateDiagnosisRecord(level, result);
    
    // 获取学习路径
    const learningPath = getLearningPathByLevel(level);
    
    // 找出薄弱知识点（得分低于60%）
    const weakPoints = Object.entries(result.scores)
      .filter(([_, score]) => score < 60)
      .map(([kpId]) => kpId);
    
    // 确定要解锁的知识点
    let unlockedKnowledgePoints: string[] = [];
    
    if (weakPoints.length <= 3) {
      // 薄弱点少于等于3个，解锁所有薄弱点及其前置知识点
      unlockedKnowledgePoints = learningPath?.nodes
        .map(node => node.knowledgePointId)
        .filter(kpId => {
          const kp = knowledgePoints.find(k => k.id === kpId);
          if (!kp) return false;
          // CSP-J: difficultyLevel <= 5
          // CSP-S: 所有知识点
          if (level === 'CSP-J') {
            return kp.difficulty <= 5;
          }
          return true;
        }) || [];
    } else {
      // 薄弱点超过3个，只解锁学习路径中最靠前的知识点（最多3个）
      // 按学习路径顺序找出前3个薄弱知识点
      const orderedWeakPoints: string[] = [];
      for (const node of learningPath?.nodes || []) {
        if (weakPoints.includes(node.knowledgePointId)) {
          orderedWeakPoints.push(node.knowledgePointId);
          if (orderedWeakPoints.length >= 3) break;
        }
      }
      // 解锁这些知识点及其前置知识点
      for (const node of learningPath?.nodes || []) {
        if (orderedWeakPoints.includes(node.knowledgePointId)) {
          break; // 找到目标知识点，停止添加
        }
        unlockedKnowledgePoints.push(node.knowledgePointId);
      }
      // 添加目标知识点
      unlockedKnowledgePoints.push(...orderedWeakPoints);
    }
    
    // 根据解锁的知识点初始化学习进度
    const initialLearningProgress = unlockedKnowledgePoints
      .map(kpId => ({
        knowledgePointId: kpId,
        masteryLevel: result.scores[kpId] || 0,
        completedProblems: 0,
        correctProblems: 0,
        lastPracticeDate: new Date().toISOString(),
      }));
    
    set(state => ({
      userData: {
        ...state.userData,
        diagnosisHistory: [...state.userData.diagnosisHistory, record],
        learningProgress: initialLearningProgress,
      },
    }));
    
    // 诊断完成后立即更新每日推荐
    get().updateDailyRecommendations();
    get().saveUser();
    return record;
  },
  
  updateStatistics: () => {
    // 统计数据计算逻辑（简化版）
    set(state => ({
      userData: {
        ...state.userData,
        statistics: {
          ...state.userData.statistics,
        },
      },
    }));
  },
  
  updateDailyRecommendations: () => {
    const { learningProgress } = get().userData;
    
    // 获取薄弱知识点（掌握度低于70%）
    const weakKnowledgePoints = learningProgress
      .filter(p => p.masteryLevel < 70)
      .map(p => p.knowledgePointId);
    
    // 获取推荐题目的知识点（按掌握度从低到高排序，最多5个）
    const targetKnowledgePoints = weakKnowledgePoints.length > 0 
      ? weakKnowledgePoints.slice(0, 5)
      : learningProgress.slice(0, 3).map(p => p.knowledgePointId);
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    set(state => ({
      userData: {
        ...state.userData,
        dailyRecommendedProblems: targetKnowledgePoints,
        dailyRecommendDate: todayStr,
      },
    }));
    
    get().saveUser();
  },
}));