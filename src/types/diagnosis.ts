export interface DiagnosisQuestion {
  id: string;
  level: 'CSP-J' | 'CSP-S';
  knowledgePoint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  type: 'choice' | 'code';
  options?: string[];
  correctAnswer: string | string[];
  codeTemplate?: string;
  testCases?: { input: string; output: string }[];
  explanation: string;
}

export interface DiagnosisAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
}

export interface DiagnosisResult {
  scores: Record<string, number>;
  weakPoints: string[];
  recommendations: string[];
}

export interface DiagnosisRecord {
  id: string;
  date: string;
  level: 'CSP-J' | 'CSP-S';
  scores: Record<string, number>;
  weakPoints: string[];
  recommendations: string[];
}