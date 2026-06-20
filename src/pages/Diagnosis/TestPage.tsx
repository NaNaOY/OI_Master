import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useDiagnosisStore } from '@/store/useDiagnosisStore';
import { useUserStore } from '@/store/useUserStore';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Clock, Sparkles, Target, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
};

const optionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.4, ease: 'easeOut' } 
  }
};

export const DiagnosisTest = () => {
  const { level } = useParams<{ level: 'CSP-J' | 'CSP-S' }>();
  const navigate = useNavigate();
  const { questions, currentQuestionIndex, answers, submitAnswer, prevQuestion, nextQuestion, completeDiagnosis: resetDiagnosis } = useDiagnosisStore();
  const { completeDiagnosis } = useUserStore();
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
    if (level) {
      const record = completeDiagnosis(level, answers);
      resetDiagnosis();
      navigate(`/diagnosis/report/${record?.id || 'latest'}`);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!currentQuestion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <Card className="p-12 text-center max-w-md border border-neutral-100/50 shadow-xl rounded-3xl">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center mx-auto mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Target className="w-10 h-10 text-primary-500" />
          </motion.div>
          <h3 className="text-xl font-bold text-neutral-800 mb-3">加载中...</h3>
          <p className="text-neutral-500">正在准备诊断题目</p>
        </Card>
      </motion.div>
    );
  }
  
  const optionLabels = ['A', 'B', 'C', 'D'];
  const allAnswered = questions.every((_, index) => answers[index]);
  
  const levelConfig = {
    'CSP-J': {
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    'CSP-S': {
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
    }
  };
  
  const config = levelConfig[level || 'CSP-J'];
  
  const difficultyConfig = {
    easy: { label: '简单', gradient: 'from-emerald-500 to-green-600', bg: 'bg-gradient-to-br from-emerald-50 to-green-50' },
    medium: { label: '中等', gradient: 'from-amber-500 to-orange-600', bg: 'bg-gradient-to-br from-amber-50 to-orange-50' },
    hard: { label: '困难', gradient: 'from-red-500 to-rose-600', bg: 'bg-gradient-to-br from-red-50 to-rose-50' },
  };
  
  const diffConfig = difficultyConfig[currentQuestion.difficulty];
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 头部信息 */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <motion.div 
            className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-bold shadow-lg`}
            whileHover={{ scale: 1.05 }}
          >
            {level}
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 text-neutral-500 font-medium"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Target size={18} className={level === 'CSP-J' ? 'text-blue-500' : 'text-purple-500'} />
            </motion.div>
            <span className="text-lg font-semibold">{currentQuestionIndex + 1} / {questions.length}</span>
          </motion.div>
        </div>
        
        <motion.div 
          className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-neutral-100"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Clock size={20} className="text-neutral-500" />
          </motion.div>
          <span className="font-semibold text-neutral-600">{formatTime(0)}</span>
        </motion.div>
      </motion.div>
      
      {/* 进度指示器 */}
      <motion.div variants={itemVariants}>
        <Card className="p-5 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
          {/* 背景装饰 */}
          <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${config.bgGradient} rounded-full blur-2xl opacity-50`} />
          
          <div className="relative flex gap-3">
            {questions.map((_, index) => {
              const isCurrent = index === currentQuestionIndex;
              const isAnswered = answers[index];
              
              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (isAnswered) {
                      for (let i = 0; i < Math.abs(index - currentQuestionIndex); i++) {
                        if (index > currentQuestionIndex) nextQuestion();
                        else prevQuestion();
                      }
                    }
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold cursor-pointer transition-all shadow-md ${
                    isCurrent
                      ? `bg-gradient-to-br ${config.gradient} text-white ring-4 ring-offset-2 ${level === 'CSP-J' ? 'ring-blue-200' : 'ring-purple-200'}`
                      : isAnswered
                      ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white'
                      : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                  }`}
                >
                  {isAnswered && !isCurrent ? (
                    <CheckCircle size={16} />
                  ) : (
                    index + 1
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
      
      {/* 题目卡片 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="p-8 border border-neutral-100/50 shadow-xl rounded-2xl overflow-hidden relative">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-indigo-100/30 to-transparent rounded-full blur-2xl opacity-50" />
            
            {/* 难度标签 */}
            <motion.div 
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div 
                className={`px-4 py-2 rounded-xl bg-gradient-to-r ${diffConfig.gradient} text-white font-bold shadow-md`}
                whileHover={{ scale: 1.1 }}
              >
                {diffConfig.label}
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={20} className="text-amber-500" />
              </motion.div>
            </motion.div>
            
            {/* 题目内容 */}
            <motion.div 
              className="prose prose-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-neutral-800 whitespace-pre-line leading-relaxed text-lg font-medium">{currentQuestion.question}</p>
            </motion.div>
            
            {/* 选项 */}
            {currentQuestion.type === 'choice' && currentQuestion.options && (
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
              >
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === optionLabels[index];
                  
                  return (
                    <motion.div
                      key={index}
                      variants={optionVariants}
                      whileHover={{ x: 5, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => handleSelectOption(optionLabels[index])}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                          isSelected
                            ? `border-transparent bg-gradient-to-r ${config.bgGradient} ring-2 ring-offset-2 ${level === 'CSP-J' ? 'ring-blue-400' : 'ring-purple-400'}`
                            : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {/* 选中时的动态背景 */}
                        {isSelected && (
                          <motion.div 
                            className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-10`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                          />
                        )}
                        
                        <div className="relative flex items-center gap-4">
                          <motion.div 
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-md ${
                              isSelected
                                ? `bg-gradient-to-br ${config.gradient} text-white`
                                : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
                            }`}
                            whileHover={{ scale: isSelected ? 1 : 1.1 }}
                          >
                            {optionLabels[index]}
                          </motion.div>
                          <span className={`text-base font-medium ${isSelected ? 'text-neutral-800' : 'text-neutral-600'}`}>{option}</span>
                          
                          {isSelected && (
                            <motion.div 
                              className="ml-auto"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              <CheckCircle size={24} className={level === 'CSP-J' ? 'text-blue-500' : 'text-purple-500'} />
                            </motion.div>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
      
      {/* 底部导航 */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <motion.div whileHover={{ scale: 1.05, x: -3 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 rounded-xl font-semibold border-neutral-200 disabled:opacity-40"
          >
            <ChevronLeft size={20} className="mr-1" />
            上一题
          </Button>
        </motion.div>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <motion.div whileHover={{ scale: 1.05, x: 3 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={nextQuestion} 
              disabled={!selectedAnswer}
              className={`bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white shadow-lg px-8 py-3 rounded-xl font-semibold disabled:opacity-40`}
            >
              下一题
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight size={20} className="ml-2" />
              </motion.div>
            </Button>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleComplete} 
              disabled={!allAnswered}
              className={`bg-gradient-to-r ${allAnswered ? 'from-emerald-500 to-green-500' : 'from-neutral-400 to-neutral-500'} text-white shadow-xl px-10 py-3 rounded-xl font-semibold`}
            >
              {allAnswered ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <CheckCircle size={20} className="mr-2" />
                  </motion.div>
                  提交答案
                </>
              ) : (
                <>
                  <AlertCircle size={20} className="mr-2" />
                  请完成所有题目
                </>
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>
      
      {/* 进度统计 */}
      <motion.div 
        variants={itemVariants}
        className="text-center"
      >
        <motion.div 
          className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100 border border-neutral-200"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap size={18} className="text-amber-500" />
          </motion.div>
          <span className="text-neutral-600 font-medium">
            已完成 <span className="font-bold text-neutral-800">{answers.filter(Boolean).length}</span> / {questions.length} 题
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};