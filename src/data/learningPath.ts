import type { LearningPath } from '@/types/knowledge';

// NOI大纲学习路径 - 按照知识点依赖关系线性排列
export const learningPaths: LearningPath[] = [
  {
    id: 'lp-j',
    name: 'CSP-J 入门组学习路径',
    level: 'CSP-J',
    nodes: [
      // 第1章：程序设计基础
      {
        id: 'lpj1',
        knowledgePointId: 'kp1',
        order: 1,
        prerequisites: [],
        unlockCondition: { minMasteryLevel: 0, requiredProblems: 2 },
      },
      // 第2章：条件语句与循环
      {
        id: 'lpj2',
        knowledgePointId: 'kp2',
        order: 2,
        prerequisites: ['kp1'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 2 },
      },
      // 第3章：函数基础
      {
        id: 'lpj3',
        knowledgePointId: 'kp3',
        order: 3,
        prerequisites: ['kp2'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 },
      },
      // 第4章：数组
      {
        id: 'lpj4',
        knowledgePointId: 'kp4',
        order: 4,
        prerequisites: ['kp2'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 2 },
      },
      // 第5章：字符串
      {
        id: 'lpj5',
        knowledgePointId: 'kp5',
        order: 5,
        prerequisites: ['kp4'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 },
      },
      // 第6章：排序算法
      {
        id: 'lpj6',
        knowledgePointId: 'kp6',
        order: 6,
        prerequisites: ['kp4'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 },
      },
      // 第7章：查找算法
      {
        id: 'lpj7',
        knowledgePointId: 'kp7',
        order: 7,
        prerequisites: ['kp6'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 },
      },
      // 第8章：基础数论
      {
        id: 'lpj8',
        knowledgePointId: 'kp8',
        order: 8,
        prerequisites: ['kp2'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 },
      },
      // 第9章：模拟与枚举
      {
        id: 'lpj9',
        knowledgePointId: 'kp9',
        order: 9,
        prerequisites: ['kp2', 'kp4'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 },
      },
    ],
  },
  {
    id: 'lp-s',
    name: 'CSP-S 提高组学习路径',
    level: 'CSP-S',
    nodes: [
      // CSP-J基础（作为CSP-S的前置）
      {
        id: 'lps1',
        knowledgePointId: 'kp1',
        order: 1,
        prerequisites: [],
        unlockCondition: { minMasteryLevel: 0, requiredProblems: 2 },
      },
      {
        id: 'lps2',
        knowledgePointId: 'kp2',
        order: 2,
        prerequisites: ['kp1'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 2 },
      },
      {
        id: 'lps3',
        knowledgePointId: 'kp3',
        order: 3,
        prerequisites: ['kp2'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      {
        id: 'lps4',
        knowledgePointId: 'kp4',
        order: 4,
        prerequisites: ['kp2'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 2 },
      },
      {
        id: 'lps5',
        knowledgePointId: 'kp8',
        order: 5,
        prerequisites: ['kp2'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      {
        id: 'lps6',
        knowledgePointId: 'kp9',
        order: 6,
        prerequisites: ['kp2', 'kp4'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      // CSP-S进阶内容
      // 第1章：递归与分治
      {
        id: 'lps7',
        knowledgePointId: 'kp10',
        order: 7,
        prerequisites: ['kp3'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      // 第2章：栈与队列
      {
        id: 'lps8',
        knowledgePointId: 'kp11',
        order: 8,
        prerequisites: ['kp3'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      // 第3章：链表
      {
        id: 'lps9',
        knowledgePointId: 'kp12',
        order: 9,
        prerequisites: ['kp11'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      // 第4章：二叉树
      {
        id: 'lps10',
        knowledgePointId: 'kp13',
        order: 10,
        prerequisites: ['kp12'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      // 第5章：图的基础
      {
        id: 'lps11',
        knowledgePointId: 'kp14',
        order: 11,
        prerequisites: ['kp11'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      // 第6章：最短路径
      {
        id: 'lps12',
        knowledgePointId: 'kp15',
        order: 12,
        prerequisites: ['kp14'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      // 第7章：最小生成树
      {
        id: 'lps13',
        knowledgePointId: 'kp16',
        order: 13,
        prerequisites: ['kp14'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      // 第8章：动态规划
      {
        id: 'lps14',
        knowledgePointId: 'kp17',
        order: 14,
        prerequisites: ['kp10', 'kp9'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 2 },
      },
      // 第9章：贪心算法
      {
        id: 'lps15',
        knowledgePointId: 'kp18',
        order: 15,
        prerequisites: ['kp9'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      // 第10章：搜索与剪枝
      {
        id: 'lps16',
        knowledgePointId: 'kp19',
        order: 16,
        prerequisites: ['kp10', 'kp14'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
      // 第11章：组合数学基础
      {
        id: 'lps17',
        knowledgePointId: 'kp20',
        order: 17,
        prerequisites: ['kp8'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 1 },
      },
    ],
  },
];

export const getLearningPathByLevel = (level: 'CSP-J' | 'CSP-S'): LearningPath | undefined => {
  return learningPaths.find(lp => lp.level === level);
};

// 获取学习路径中所有知识点ID
export const getAllKnowledgePointIds = (level: 'CSP-J' | 'CSP-S'): string[] => {
  const path = learningPaths.find(lp => lp.level === level);
  return path?.nodes.map(node => node.knowledgePointId) || [];
};

// 获取推荐学习的下一个知识点（在诊断后解锁）
export const getNextRecommendedKnowledgePoint = (
  level: 'CSP-J' | 'CSP-S',
  completedKnowledgePoints: string[]
): string | null => {
  const path = learningPaths.find(lp => lp.level === level);
  if (!path) return null;

  // 按顺序找到第一个未完成的知识点
  for (const node of path.nodes) {
    if (!completedKnowledgePoints.includes(node.knowledgePointId)) {
      return node.knowledgePointId;
    }
  }
  return null; // 全部完成
};

// 获取某个知识点之前的所有前置知识点（用于诊断后批量解锁）
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
