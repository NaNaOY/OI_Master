export interface LearningResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'practice';
}

export interface KnowledgePoint {
  id: string;
  name: string;
  category: string;
  difficulty: number;
  description: string;
  prerequisites: string[];
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
