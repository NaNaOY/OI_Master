import { generateDynamicDiagnosisQuestions } from '@/data/diagnosisQuestions';
import type { DiagnosisAnswer, DiagnosisQuestion } from '@/types/diagnosis';
import { create } from 'zustand';

interface DiagnosisState {
  currentLevel: 'CSP-J' | 'CSP-S' | null;
  questions: DiagnosisQuestion[];
  currentQuestionIndex: number;
  answers: DiagnosisAnswer[];
  isDiagnosing: boolean;
  timeRemaining: number;
  startDiagnosis: (level: 'CSP-J' | 'CSP-S') => void;
  submitAnswer: (answer: string | string[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeDiagnosis: () => void;
  resetDiagnosis: () => void;
}

export const useDiagnosisStore = create<DiagnosisState>((set) => ({
  currentLevel: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  isDiagnosing: false,
  timeRemaining: 0,
  
  startDiagnosis: (level) => {
    // 使用动态生成的题目，每次诊断题目不同
    const questions = generateDynamicDiagnosisQuestions(level);
    set({
      currentLevel: level,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      isDiagnosing: true,
      timeRemaining: questions.length * 60,
    });
  },
  
  submitAnswer: (answer) => {
    set(state => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = Array.isArray(currentQuestion.correctAnswer)
        ? JSON.stringify(currentQuestion.correctAnswer.sort()) === JSON.stringify((Array.isArray(answer) ? answer : [answer]).sort())
        : currentQuestion.correctAnswer === answer;
      
      const newAnswers = [...state.answers];
      newAnswers[state.currentQuestionIndex] = {
        questionId: currentQuestion.id,
        answer,
        isCorrect,
      };
      
      return { answers: newAnswers };
    });
  },
  
  nextQuestion: () => {
    set(state => ({
      currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
    }));
  },
  
  prevQuestion: () => {
    set(state => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    }));
  },
  
  completeDiagnosis: () => {
    set({
      isDiagnosing: false,
      currentLevel: null,
    });
  },
  
  resetDiagnosis: () => {
    set({
      currentLevel: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      isDiagnosing: false,
      timeRemaining: 0,
    });
  },
}));