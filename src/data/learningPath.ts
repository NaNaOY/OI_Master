import type { LearningPath } from '@/types/knowledge';

export const learningPaths: LearningPath[] = [
  {
    id: 'lp-j',
    name: 'CSP-J 入门组学习路径',
    level: 'CSP-J',
    nodes: [
      {
        id: 'lpj1',
        knowledgePointId: 'kp1',
        order: 1,
        prerequisites: [],
        unlockCondition: { minMasteryLevel: 0, requiredProblems: 0 },
      },
      {
        id: 'lpj2',
        knowledgePointId: 'kp2',
        order: 2,
        prerequisites: ['kp1'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 2 },
      },
      {
        id: 'lpj3',
        knowledgePointId: 'kp5',
        order: 3,
        prerequisites: ['kp2'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 },
      },
      {
        id: 'lpj4',
        knowledgePointId: 'kp6',
        order: 4,
        prerequisites: ['kp5'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 },
      },
      {
        id: 'lpj5',
        knowledgePointId: 'kp10',
        order: 5,
        prerequisites: ['kp1'],
        unlockCondition: { minMasteryLevel: 60, requiredProblems: 1 },
      },
      {
        id: 'lpj6',
        knowledgePointId: 'kp7',
        order: 6,
        prerequisites: ['kp5', 'kp6'],
        unlockCondition: { minMasteryLevel: 70, requiredProblems: 2 },
      },
    ],
  },
  {
    id: 'lp-s',
    name: 'CSP-S 提高组学习路径',
    level: 'CSP-S',
    nodes: [
      {
        id: 'lps1',
        knowledgePointId: 'kp1',
        order: 1,
        prerequisites: [],
        unlockCondition: { minMasteryLevel: 0, requiredProblems: 0 },
      },
      {
        id: 'lps2',
        knowledgePointId: 'kp2',
        order: 2,
        prerequisites: ['kp1'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 3 },
      },
      {
        id: 'lps3',
        knowledgePointId: 'kp5',
        order: 3,
        prerequisites: ['kp2'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 2 },
      },
      {
        id: 'lps4',
        knowledgePointId: 'kp6',
        order: 4,
        prerequisites: ['kp5'],
        unlockCondition: { minMasteryLevel: 80, requiredProblems: 2 },
      },
      {
        id: 'lps5',
        knowledgePointId: 'kp8',
        order: 5,
        prerequisites: ['kp1'],
        unlockCondition: { minMasteryLevel: 70, requiredProblems: 2 },
      },
      {
        id: 'lps6',
        knowledgePointId: 'kp3',
        order: 6,
        prerequisites: ['kp2', 'kp8'],
        unlockCondition: { minMasteryLevel: 70, requiredProblems: 1 },
      },
      {
        id: 'lps7',
        knowledgePointId: 'kp4',
        order: 7,
        prerequisites: ['kp3'],
        unlockCondition: { minMasteryLevel: 70, requiredProblems: 1 },
      },
      {
        id: 'lps8',
        knowledgePointId: 'kp9',
        order: 8,
        prerequisites: ['kp4'],
        unlockCondition: { minMasteryLevel: 70, requiredProblems: 1 },
      },
      {
        id: 'lps9',
        knowledgePointId: 'kp7',
        order: 9,
        prerequisites: ['kp5', 'kp6', 'kp8'],
        unlockCondition: { minMasteryLevel: 70, requiredProblems: 3 },
      },
      {
        id: 'lps10',
        knowledgePointId: 'kp10',
        order: 10,
        prerequisites: ['kp1'],
        unlockCondition: { minMasteryLevel: 70, requiredProblems: 2 },
      },
    ],
  },
];

export const getLearningPathByLevel = (level: 'CSP-J' | 'CSP-S'): LearningPath | undefined => {
  return learningPaths.find(lp => lp.level === level);
};