import type { LearningPath } from '@/types/knowledge';

export const learningPaths: LearningPath[] = [
  // ==================== CSP-J 入门组 ====================
  {
    id: 'lp-j',
    name: 'CSP-J 入门组学习路径',
    level: 'CSP-J',
    nodes: [
      { id: 'lpj1', knowledgePointId: 'j1', order: 1, prerequisites: [], unlockCondition: { minMasteryLevel: 0, requiredProblems: 1 } },
      { id: 'lpj2', knowledgePointId: 'j2', order: 2, prerequisites: ['j1'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lpj3', knowledgePointId: 'j3', order: 3, prerequisites: ['j1'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lpj4', knowledgePointId: 'j4', order: 4, prerequisites: ['j2', 'j3'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lpj5', knowledgePointId: 'j5', order: 5, prerequisites: ['j3'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lpj6', knowledgePointId: 'j6', order: 6, prerequisites: ['j5'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lpj7', knowledgePointId: 'j7', order: 7, prerequisites: ['j5'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lpj8', knowledgePointId: 'j8', order: 8, prerequisites: ['j7'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lpj9', knowledgePointId: 'j9', order: 9, prerequisites: ['j3'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lpj10', knowledgePointId: 'j10', order: 10, prerequisites: ['j5', 'j3'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
    ],
  },
  // ==================== CSP-S 提高组 ====================
  {
    id: 'lp-s',
    name: 'CSP-S 提高组学习路径',
    level: 'CSP-S',
    nodes: [
      { id: 'lps1', knowledgePointId: 's1', order: 1, prerequisites: [], unlockCondition: { minMasteryLevel: 0, requiredProblems: 1 } },
      { id: 'lps2', knowledgePointId: 's2', order: 2, prerequisites: ['s1'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps3', knowledgePointId: 's3', order: 3, prerequisites: ['s2'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps4', knowledgePointId: 's4', order: 4, prerequisites: ['s3'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps5', knowledgePointId: 's5', order: 5, prerequisites: ['s2'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps6', knowledgePointId: 's6', order: 6, prerequisites: ['s5'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps7', knowledgePointId: 's7', order: 7, prerequisites: ['s5'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps8', knowledgePointId: 's8', order: 8, prerequisites: ['s1'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps9', knowledgePointId: 's9', order: 9, prerequisites: ['s8'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps10', knowledgePointId: 's10', order: 10, prerequisites: ['s8'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps11', knowledgePointId: 's11', order: 11, prerequisites: ['s5'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps12', knowledgePointId: 's12', order: 12, prerequisites: ['s1'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps13', knowledgePointId: 's13', order: 13, prerequisites: ['s1'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
      { id: 'lps14', knowledgePointId: 's14', order: 14, prerequisites: ['s2'], unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 } },
    ],
  },
];

export const getLearningPathByLevel = (level: 'CSP-J' | 'CSP-S'): LearningPath | undefined => {
  return learningPaths.find(lp => lp.level === level);
};

export const getAllKnowledgePointIds = (level: 'CSP-J' | 'CSP-S'): string[] => {
  const path = learningPaths.find(lp => lp.level === level);
  return path?.nodes.map(node => node.knowledgePointId) || [];
};

export const getNextRecommendedKnowledgePoint = (
  level: 'CSP-J' | 'CSP-S',
  completedKnowledgePoints: string[]
): string | null => {
  const path = learningPaths.find(lp => lp.level === level);
  if (!path) return null;

  for (const node of path.nodes) {
    if (!completedKnowledgePoints.includes(node.knowledgePointId)) {
      return node.knowledgePointId;
    }
  }
  return null;
};

export const getPrerequisiteKnowledgePoints = (
  level: 'CSP-J' | 'CSP-S',
  targetKnowledgePointId: string
): string[] => {
  const path = learningPaths.find(lp => lp.level === level);
  if (!path) return [];

  const result: string[] = [];

  for (const node of path.nodes) {
    if (node.knowledgePointId === targetKnowledgePointId) {
      break;
    }
    result.push(node.knowledgePointId);
  }

  return result;
};
