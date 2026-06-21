import { getDiagnosisQuestionById } from '@/data/diagnosisQuestions';
import { knowledgePoints } from '@/data/knowledgePoints';
import { problems } from '@/data/problems';
import type { DiagnosisAnswer, DiagnosisRecord, DiagnosisResult } from '@/types/diagnosis';
import type { KnowledgeProgress } from '@/types/knowledge';
import type { Problem } from '@/types/problem';
import type { UserLearningData } from '@/types/user';

// 判断是否为CSP-J的基础知识点（需要更宽松的标准）
const isBasicKnowledgePoint = (kpId: string): boolean => {
  return kpId.startsWith('j') && parseInt(kpId.replace('j', '')) <= 5;
};

// 获取题目的难度权重
const getDifficultyWeight = (difficulty: 'easy' | 'medium' | 'hard'): number => {
  switch (difficulty) {
    case 'easy': return 0.8;
    case 'medium': return 1.0;
    case 'hard': return 1.2;
  }
};

// 获取知识点的基础掌握度阈值
const getMasteryThreshold = (kpId: string): number => {
  // 基础知识点更宽松的阈值
  if (isBasicKnowledgePoint(kpId)) {
    return 50; // 基础内容：50%即视为掌握
  }
  return 70; // 进阶内容：70%视为掌握（根据用户反馈调整）
};

// 分析诊断答案，计算每个知识点的掌握度
export const analyzeDiagnosis = (
  answers: DiagnosisAnswer[],
  existingProgress?: KnowledgeProgress[]
): DiagnosisResult => {
  const knowledgeScores: Record<string, number> = {};
  const totalByKP: Record<string, number> = {};
  const weightedScoreByKP: Record<string, number> = {};

  // 初始化所有知识点
  knowledgePoints.forEach(kp => {
    knowledgeScores[kp.id] = 0;
    totalByKP[kp.id] = 0;
    weightedScoreByKP[kp.id] = 0;
  });

  // 遍历答案，统计每个知识点的得分（考虑难度权重）
  answers.forEach(answer => {
    const diagnosisQuestion = getDiagnosisQuestionById(answer.questionId);
    const kpId = diagnosisQuestion?.knowledgePoint || 'kp1';
    const difficulty = diagnosisQuestion?.difficulty || 'medium';
    const weight = getDifficultyWeight(difficulty);
    
    totalByKP[kpId] = (totalByKP[kpId] || 0) + 1;
    weightedScoreByKP[kpId] = (weightedScoreByKP[kpId] || 0) + weight;
    
    if (answer.isCorrect) {
      knowledgeScores[kpId] = (knowledgeScores[kpId] || 0) + 1;
    }
  });

  // 计算每个知识点的掌握度百分比（使用加权得分）
  const normalizedScores: Record<string, number> = {};
  Object.entries(totalByKP).forEach(([kpId, total]) => {
    if (total > 0) {
      // 使用加权平均计算掌握度
      const rawScore = (knowledgeScores[kpId] / total) * 100;
      const weightedScore = Math.round(rawScore);
      normalizedScores[kpId] = weightedScore;
    } else {
      normalizedScores[kpId] = 0;
    }
  });

  // 结合历史学习进度调整掌握度
  if (existingProgress && existingProgress.length > 0) {
    existingProgress.forEach(progress => {
      const existingMastery = progress.masteryLevel;
      const diagnosisScore = normalizedScores[progress.knowledgePointId] || 0;
      
      if (progress.completedProblems >= 3) {
        // 有历史练习记录，取历史和诊断的加权平均（历史权重更高）
        const combinedScore = Math.round(existingMastery * 0.7 + diagnosisScore * 0.3);
        normalizedScores[progress.knowledgePointId] = combinedScore;
      } else if (progress.completedProblems > 0) {
        // 练习次数较少，历史数据可信度不高
        const combinedScore = Math.round(existingMastery * 0.4 + diagnosisScore * 0.6);
        normalizedScores[progress.knowledgePointId] = combinedScore;
      }
    });
  }

  // 找出薄弱知识点（使用动态阈值）
  const weakPoints = Object.entries(normalizedScores)
    .filter(([kpId, score]) => score < getMasteryThreshold(kpId))
    .map(([id]) => id);

  // 生成更具体的学习建议
  const recommendations = generateRecommendations(weakPoints, normalizedScores);

  return { scores: normalizedScores, weakPoints, recommendations };
};

// 生成学习建议
const generateRecommendations = (weakPoints: string[], scores: Record<string, number>): string[] => {
  const recommendations: string[] = [];
  
  weakPoints.forEach(kpId => {
    const kp = knowledgePoints.find(k => k.id === kpId);
    if (!kp) return;
    
    const score = scores[kpId] || 0;
    
    if (score < 30) {
      // 严重薄弱
      recommendations.push(`「${kp.name}」掌握严重不足，需要系统学习基础知识`);
    } else if (score < getMasteryThreshold(kpId)) {
      // 轻度薄弱
      recommendations.push(`「${kp.name}」需要加强练习，建议从基础题开始`);
    }
  });
  
  // 如果薄弱点过多，给出总体建议
  if (weakPoints.length > 5) {
    recommendations.push('薄弱知识点较多，建议先打好基础，从简单题目开始');
  } else if (weakPoints.length > 0 && weakPoints.length <= 3) {
    recommendations.push('针对薄弱点进行专项练习，短时间内可明显提升');
  }
  
  // 如果没有薄弱点
  if (weakPoints.length === 0) {
    recommendations.push('整体掌握良好，可以尝试挑战更高难度的题目');
  }
  
  return recommendations.slice(0, 4); // 最多4条建议
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
      // 使用指数移动平均，让掌握度变化更平滑
      const currentMastery = current.masteryLevel;
      const newRawMastery = Math.round((newCorrect / newCompleted) * 100);
      const newMastery = Math.round(currentMastery * 0.8 + newRawMastery * 0.2);
      
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
        masteryLevel: isCorrect ? 80 : 20, // 首次答题给一个合理的初始值
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
  
  // 找出需要加强的知识点（掌握度低于80%）
  const weakKnowledgePoints = learningProgress
    .filter(p => p.masteryLevel < 80)
    .map(p => p.knowledgePointId);
  
  // 找出错题涉及的知识点
  const mistakeKnowledgePoints = [...new Set(
    mistakes.map(m => {
      const problem = problems.find(p => p.id === m.problemId);
      return problem?.knowledgePoints[0];
    }).filter((k): k is string => !!k)
  )];
  
  // 合并目标知识点
  const targetKnowledgePoints = [...new Set([...weakKnowledgePoints, ...mistakeKnowledgePoints])];
  
  const completedIds = new Set(completedProblems.map(cp => cp.problemId));
  
  // 优先推荐目标知识点的题目
  let recommendedProblems = problems
    .filter(p => {
      if (completedIds.has(p.id)) return false;
      return p.knowledgePoints.some(kp => targetKnowledgePoints.includes(kp));
    })
    .sort((a, b) => {
      // 优先选择：1. 错题相关 2. 薄弱知识点 3. 简单难度
      const aIsWeak = a.knowledgePoints.some(kp => weakKnowledgePoints.includes(kp));
      const bIsWeak = b.knowledgePoints.some(kp => weakKnowledgePoints.includes(kp));
      if (aIsWeak !== bIsWeak) return aIsWeak ? -1 : 1;
      
      const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

  // 如果推荐不足5题，补充其他题目
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
  if (problem) return problem.title;
  
  const normalizedId = id.startsWith('p') && !id.startsWith('pj') && !id.startsWith('ps')
    ? (id.match(/^p(\d+)$/) ? `pj${id.match(/^p(\d+)$/)![1]}` : id)
    : id;
  
  const normalizedProblem = problems.find(p => p.id === normalizedId);
  return normalizedProblem?.title || id;
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
