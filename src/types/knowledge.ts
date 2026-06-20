export interface LearningResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'practice';
}

export interface KnowledgePoint {
  id: string;
  name: string;
  category: '程序设计基础' | '基础数据结构' | '基础算法' | '数学基础' | '进阶数据结构' | '进阶算法' | '图论' | '数学进阶';
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