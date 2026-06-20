export interface MistakeRecord {
  id: string;
  problemId: string;
  date: string;
  code: string;
  errorType: string;
  aiAnalysis: string;
  reviewed: boolean;
  reviewedAt?: string;
}

export interface UserLearningData {
  userId: string;
  name: string;
  createdAt: string;
  lastLoginAt: string;
  diagnosisHistory: {
    id: string;
    date: string;
    level: 'CSP-J' | 'CSP-S';
    scores: Record<string, number>;
    weakPoints: string[];
    recommendations: string[];
  }[];
  learningProgress: {
    knowledgePointId: string;
    masteryLevel: number;
    completedProblems: number;
    correctProblems: number;
    lastPracticeDate: string;
  }[];
  completedProblems: {
    problemId: string;
    completedAt: string;
    code: string;
    status: 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded' | 'compile_error';
    executionTime: number;
    memoryUsage: number;
  }[];
  mistakes: MistakeRecord[];
  statistics: {
    totalStudyTime: number;
    streakDays: number;
    totalProblems: number;
    correctProblems: number;
    lastStudyDate: string;
  };
}