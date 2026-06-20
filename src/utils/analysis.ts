import { getDiagnosisQuestionById } from '@/data/diagnosisQuestions';
import { knowledgePoints } from '@/data/knowledgePoints';
import { problems } from '@/data/problems';
import type { DiagnosisAnswer, DiagnosisRecord, DiagnosisResult } from '@/types/diagnosis';
import type { KnowledgeProgress } from '@/types/knowledge';
import type { Problem } from '@/types/problem';
import type { UserLearningData } from '@/types/user';

// 分析诊断答案，计算每个知识点的掌握度
export const analyzeDiagnosis = (answers: DiagnosisAnswer[]): DiagnosisResult => {
  const knowledgeScores: Record<string, number> = {};
  const totalByKP: Record<string, number> = {};

  // 初始化所有知识点
  knowledgePoints.forEach(kp => {
    knowledgeScores[kp.id] = 0;
    totalByKP[kp.id] = 0;
  });

  // 遍历答案，统计每个知识点的得分
  answers.forEach(answer => {
    // 从诊断题目中获取对应的知识点
    const diagnosisQuestion = getDiagnosisQuestionById(answer.questionId);
    const kpId = diagnosisQuestion?.knowledgePoint || 'kp1';
    
    totalByKP[kpId] = (totalByKP[kpId] || 0) + 1;
    if (answer.isCorrect) {
      knowledgeScores[kpId] = (knowledgeScores[kpId] || 0) + 1;
    }
  });

  // 计算每个知识点的掌握度百分比
  const normalizedScores: Record<string, number> = {};
  Object.entries(totalByKP).forEach(([kpId, total]) => {
    if (total > 0) {
      normalizedScores[kpId] = Math.round((knowledgeScores[kpId] / total) * 100);
    } else {
      normalizedScores[kpId] = 0;
    }
  });

  // 找出薄弱知识点（得分低于60%）
  const weakPoints = Object.entries(normalizedScores)
    .filter(([_, score]) => score < 60)
    .map(([id]) => id);

  // 生成学习建议
  const recommendations = weakPoints.map(kpId => {
    const kp = knowledgePoints.find(k => k.id === kpId);
    return kp ? `加强「${kp.name}」的学习` : '';
  }).filter(Boolean);

  return { scores: normalizedScores, weakPoints, recommendations };
};

// 生成诊断记录
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

// 更新学习进度
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

// 每日题目推荐
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
    
    recommendedProblems = [...recommendedProblems, ...additionalProblems].slice(0, 5);
  }
  
  return recommendedProblems;
};

// 计算统计数据
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

// 获取知识点名称
export const getKnowledgePointName = (id: string): string => {
  const kp = knowledgePoints.find(k => k.id === id);
  return kp?.name || id;
};

// 获取题目标题
export const getProblemTitle = (id: string): string => {
  const problem = problems.find(p => p.id === id);
  return problem?.title || id;
};

// 获取分类颜色
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    '程序设计基础': '#3b82f6',
    '基础数据结构': '#10b981',
    '基础算法': '#f59e0b',
    '数学基础': '#8b5cf6',
    '进阶数据结构': '#ec4899',
    '进阶算法': '#ef4444',
    '图论': '#14b8a6',
    '数学进阶': '#a855f7',
  };
  return colors[category] || '#6b7280';
};

// 获取难度颜色
export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  const colors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
  };
  return colors[difficulty];
};

// 获取掌握度标签
export const getMasteryLevel = (mastery: number): string => {
  if (mastery >= 90) return '已掌握';
  if (mastery >= 70) return '熟练';
  if (mastery >= 50) return '学习中';
  return '薄弱';
};

// 获取掌握度颜色
export const getMasteryColor = (mastery: number): string => {
  if (mastery >= 90) return '#10b981';
  if (mastery >= 70) return '#3b82f6';
  if (mastery >= 50) return '#f59e0b';
  return '#ef4444';
};
