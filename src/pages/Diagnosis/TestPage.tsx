import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useDiagnosisStore } from '@/store/useDiagnosisStore';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const DiagnosisTest = () => {
  const { level } = useParams<{ level: 'CSP-J' | 'CSP-S' }>();
  const navigate = useNavigate();
  const { questions, currentQuestionIndex, answers, submitAnswer, prevQuestion, nextQuestion, completeDiagnosis } = useDiagnosisStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  
  const currentQuestion = questions[currentQuestionIndex];
  
  useEffect(() => {
    if (questions.length === 0 && level) {
      navigate('/diagnosis');
      return;
    }
    
    const savedAnswer = answers[currentQuestionIndex];
    if (savedAnswer) {
      setSelectedAnswer(Array.isArray(savedAnswer.answer) ? savedAnswer.answer.join(',') : savedAnswer.answer);
    } else {
      setSelectedAnswer('');
    }
  }, [currentQuestionIndex, questions, level, navigate, answers]);
  
  const handleSelectOption = (option: string) => {
    setSelectedAnswer(option);
    submitAnswer(option);
  };
  
  const handleComplete = () => {
    const allAnswered = questions.every((_, index) => answers[index]);
    if (!allAnswered) {
      alert('请先完成所有题目！');
      return;
    }
    completeDiagnosis();
    navigate('/diagnosis/report/test');
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }
  
  const optionLabels = ['A', 'B', 'C', 'D'];
  const allAnswered = questions.every((_, index) => answers[index]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${level === 'CSP-J' ? 'bg-primary-100 text-primary-600' : 'bg-accent-100 text-accent-600'}`}>
            {level}
          </span>
          <span className="text-gray-500">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={18} />
          <span>{formatTime(0)}</span>
        </div>
      </div>
      
      <div className="flex gap-2 mb-6">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${
              index === currentQuestionIndex
                ? 'bg-primary-600 text-white'
                : answers[index]
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => {
              if (answers[index]) {
                for (let i = 0; i < questions.length; i++) {
                  if (i === index) break;
                  nextQuestion();
                }
              }
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>
      
      <Card className="p-6 mb-6">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {currentQuestion.difficulty === 'easy' ? '简单' : currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
            </span>
          </div>
          
          <div className="prose prose-lg mb-6">
            <p className="text-gray-800 whitespace-pre-line">{currentQuestion.question}</p>
          </div>
          
          {currentQuestion.type === 'choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === optionLabels[index];
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(optionLabels[index])}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                        isSelected
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {optionLabels[index]}
                      </span>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      </Card>
      
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft size={20} />
          上一题
        </Button>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={nextQuestion} disabled={!selectedAnswer}>
            下一题
            <ChevronRight size={20} className="ml-2" />
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={!allAnswered}>
            {allAnswered ? '提交答案' : '请完成所有题目'}
            <CheckCircle size={20} className="ml-2" />
          </Button>
        )}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        已完成 {answers.filter(Boolean).length} / {questions.length} 题
      </div>
    </motion.div>
  );
};
