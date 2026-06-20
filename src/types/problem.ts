export interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  knowledgePoints: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  testCases: TestCase[];
  hints: string[];
  timeLimit: number;
  memoryLimit: number;
}

export type ProblemStatus = 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded' | 'compile_error';

export interface ProblemRecord {
  problemId: string;
  completedAt: string;
  code: string;
  status: ProblemStatus;
  executionTime: number;
  memoryUsage: number;
}