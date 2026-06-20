import type { DiagnosisAnswer, DiagnosisResult, DiagnosisRecord } from '@/types/diagnosis';
import type { KnowledgeProgress } from '@/types/knowledge';
import type { Problem } from '@/types/problem';
import type { UserLearningData } from '@/types/user';
import { knowledgePoints } from '@/data/knowledgePoints';
import { problems } from '@/data/problems';

export const analyzeDiagnosis = (answers: DiagnosisAnswer[]): DiagnosisResult => {
  const knowledgeScores: Record<string, number> = {};
  const totalByKP: Record<string, number> = {};

  knowledgePoints.forEach(kp => {
    knowledgeScores[kp.id] = 0;
    totalByKP[kp.id] = 0;
  });

  answers.forEach(answer => {
    const kpId = answer.questionId.startsWith('dq') 
      ? knowledgePoints.find(kp => kp.id === answer.questionId.replace('dq', 'kp'))?.id || 'kp1'
      : 'kp1';
    
    totalByKP[kpId] = (totalByKP[kpId] || 0) + 1;
    if (answer.isCorrect) {
      knowledgeScores[kpId] = (knowledgeScores[kpId] || 0) + 1;
    }
  });

  const normalizedScores: Record<string, number> = {};
  Object.entries(totalByKP).forEach(([kpId, total]) => {
    if (total > 0) {
      normalizedScores[kpId] = Math.round((knowledgeScores[kpId] / total) * 100);
    } else {
      normalizedScores[kpId] = 0;
    }
  });

  const weakPoints = Object.entries(normalizedScores)
    .filter(([_, score]) => score < 60)
    .map(([id]) => id);

  const recommendations = weakPoints.map(kpId => {
    const kp = knowledgePoints.find(k => k.id === kpId);
    return kp ? `加强「${kp.name}」的学习` : '';
  }).filter(Boolean);

  return { scores: normalizedScores, weakPoints, recommendations };
};

export const generateDiagnosisRecord = (level: 'CSP-J' | 'CSP-S', result: DiagnosisResult): DiagnosisRecord => {
  return {
    id: `d_${Date.now()}`,
    date: new Date().toISOString(),
    level,
    scores: result.scores,
    weakPoints: result.weakPoints,
    recommendations: result.recommendations,
  };
};

export const updateLearningProgress = (
  progress: KnowledgeProgress[],
  problem: Problem,
  isCorrect: boolean
): KnowledgeProgress[] => {
  const updatedProgress = [...progress];
  
  problem.knowledgePoints.forEach(kpId => {
    const existingIndex = updatedProgress.findIndex(p => p.knowledgePointId === kpId);
    
    if (existingIndex >= 0) {
      const current = updatedProgress[existingIndex];
      const newCompleted = current.completedProblems + 1;
      const newCorrect = current.correctProblems + (isCorrect ? 1 : 0);
      const newMastery = Math.round((newCorrect / newCompleted) * 100);
      
      updatedProgress[existingIndex] = {
        ...current,
        completedProblems: newCompleted,
        correctProblems: newCorrect,
        masteryLevel: newMastery,
        lastPracticeDate: new Date().toISOString(),
      };
    } else {
      updatedProgress.push({
        knowledgePointId: kpId,
        masteryLevel: isCorrect ? 100 : 0,
        completedProblems: 1,
        correctProblems: isCorrect ? 1 : 0,
        lastPracticeDate: new Date().toISOString(),
      });
    }
  });
  
  return updatedProgress;
};

export const recommendDailyProblems = (userData: UserLearningData): Problem[] => {
  const { learningProgress, completedProblems, mistakes } = userData;
  
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
  
  const recommendedProblems = problems
    .filter(p => {
      if (completedIds.has(p.id)) return false;
      return p.knowledgePoints.some(kp => targetKnowledgePoints.includes(kp));
    })
    .sort((a, b) => {
      const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    })
    .slice(0, 5);
  
  if (recommendedProblems.length === 0) {
    return problems
      .filter(p => !completedIds.has(p.id))
      .sort((a, b) => {
        const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      })
      .slice(0, 5);
  }
  
  return recommendedProblems;
};

export const calculateStats = (userData: UserLearningData) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const completedToday = userData.completedProblems.filter(
    cp => cp.completedAt.startsWith(today)
  );
  
  let streakDays = userData.statistics.streakDays;
  if (userData.statistics.lastStudyDate === yesterday) {
    streakDays += 1;
  } else if (userData.statistics.lastStudyDate !== today) {
    streakDays = completedToday.length > 0 ? 1 : 0;
  }
  
  return {
    totalStudyTime: userData.statistics.totalStudyTime + (completedToday.length * 15),
    streakDays,
    totalProblems: userData.completedProblems.length,
    correctProblems: userData.completedProblems.filter(cp => cp.status === 'accepted').length,
    lastStudyDate: completedToday.length > 0 ? today : userData.statistics.lastStudyDate,
  };
};

export const getKnowledgePointName = (id: string): string => {
  const kp = knowledgePoints.find(k => k.id === id);
  return kp?.name || id;
};

export const getProblemTitle = (id: string): string => {
  const problem = problems.find(p => p.id === id);
  return problem?.title || id;
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    '基础语法': '#3b82f6',
    '数据结构': '#10b981',
    '算法': '#f59e0b',
    '数学': '#8b5cf6',
    '图论': '#ec4899',
    '动态规划': '#ef4444',
  };
  return colors[category] || '#6b7280';
};

export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  const colors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
  };
  return colors[difficulty];
};

export const getMasteryLevel = (mastery: number): string => {
  if (mastery >= 90) return '已掌握';
  if (mastery >= 70) return '熟练';
  if (mastery >= 50) return '学习中';
  return '薄弱';
};

export const getMasteryColor = (mastery: number): string => {
  if (mastery >= 90) return '#10b981';
  if (mastery >= 70) return '#3b82f6';
  if (mastery >= 50) return '#f59e0b';
  return '#ef4444';
};