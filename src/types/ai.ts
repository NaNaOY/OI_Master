export interface AIAnalysis {
  rootCause: string;
  commonMistakes: string[];
  suggestions: string[];
  relatedKnowledgePoints: string[];
  codeExamples: {
    wrongCode: string;
    correctCode: string;
    explanation: string;
  }[];
}

export interface AIResponse {
  errorType: 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'compile_error';
  knowledgePoint: string;
  analysis: AIAnalysis;
}