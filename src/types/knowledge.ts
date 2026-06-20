export interface LearningResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'practice';
}

export interface KnowledgePoint {
  id: string;
  name: string;
  category: '基础语法' | '数据结构' | '算法' | '数学' | '图论' | '动态规划';
  description: string;
  prerequisites: string[];
  difficultyLevel: number;
  problems: string[];
  learningResources: LearningResource[];
}

export interface KnowledgeProgress {
  knowledgePointId: string;
  masteryLevel: number;
  completedProblems: number;
  correctProblems: number;
  lastPracticeDate: string;
}

export interface LearningNode {
  id: string;
  knowledgePointId: string;
  order: number;
  prerequisites: string[];
  unlockCondition: {
    minMasteryLevel: number;
    requiredProblems: number;
  };
}

export interface LearningPath {
  id: string;
  name: string;
  level: 'CSP-J' | 'CSP-S';
  nodes: LearningNode[];
}