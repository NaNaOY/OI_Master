import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { getAIResponse, getGenericAIResponse } from '@/data/aiResponses';
import { getProblemById, getProblemsByKnowledgePoint } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName } from '@/utils/analysis';
import Editor from '@monaco-editor/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, Copy, Lightbulb, RotateCcw, Sparkles, Star, Target, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const defaultCode = `#include <iostream>
using namespace std;

int main() {
    // 在这里编写你的代码
    return 0;
}`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
};

export const ProblemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProblemRecord, addMistake, userData } = useUserStore();
  
  const problem = getProblemById(id || '');
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'accepted' | 'wrong_answer' | 'runtime_error'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getNextProblem = () => {
    if (!problem) return null;
    
    const sameKpProblems = getProblemsByKnowledgePoint(problem.knowledgePoints[0]);
    const completedIds = new Set(userData.completedProblems.map(cp => cp.problemId));
    
    const currentIndex = sameKpProblems.findIndex(p => p.id === problem.id);
    
    for (let i = currentIndex + 1; i < sameKpProblems.length; i++) {
      if (!completedIds.has(sameKpProblems[i].id)) {
        return sameKpProblems[i];
      }
    }
    
    return null;
  };
  
  const nextProblem = getNextProblem();
  
  useEffect(() => {
    if (!problem) {
      navigate('/daily');
    }
  }, [problem, navigate]);
  
  const simulateCodeRun = () => {
    setStatus('running');
    setOutput('');

    setTimeout(() => {
      setAttempts(prev => prev + 1);

      const trimmedCode = code.trim();
      const codeLines = trimmedCode.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const bodyLines = codeLines.filter(l => !l.startsWith('#') && !l.startsWith('//') && !l.startsWith('using'));
      const mainBody = bodyLines.slice(bodyLines.indexOf('int main() {') + 1, bodyLines.lastIndexOf('}'));
      const meaningfulLines = mainBody.filter(l => l !== '' && l !== 'return 0;' && !l.startsWith('//'));

      const hasInput = trimmedCode.includes('cin >>');
      const hasOutput = trimmedCode.includes('cout <<');
      const hasLoop = trimmedCode.includes('for (') || trimmedCode.includes('while (');
      const hasCondition = trimmedCode.includes('if (');
      const hasLogic = trimmedCode.includes('sort(') || trimmedCode.includes('swap(') || trimmedCode.includes('+') || trimmedCode.includes('-') || trimmedCode.includes('*') || trimmedCode.includes('/');

      const hasCustomCode = meaningfulLines.length >= 3 && (hasInput || hasOutput || hasLoop || hasCondition || hasLogic);

      const isCorrect = hasCustomCode && Math.random() > 0.4;

      if (!hasCustomCode) {
        setStatus('wrong_answer');
        setOutput('答案错误！\n\n测试用例1: 失败\n测试用例2: 失败\n测试用例3: 失败\n\n原因: 代码没有实现有效的逻辑，请完成题目要求的功能。');

        const kpId = problem!.knowledgePoints[0];
        const aiResponse = getAIResponse('wrong_answer', kpId) || getGenericAIResponse('wrong_answer');

        addMistake(
          problem!.id,
          code,
          'wrong_answer',
          aiResponse?.analysis.rootCause || '代码缺少核心逻辑实现，请根据题目要求编写代码。'
        );
      } else if (isCorrect) {
        setStatus('accepted');
        setOutput('所有测试用例通过！\n\n测试用例1: 通过\n测试用例2: 通过\n测试用例3: 通过');

        addProblemRecord({
          problemId: problem!.id,
          completedAt: new Date().toISOString(),
          code,
          status: 'accepted',
          executionTime: Math.floor(Math.random() * 100) + 50,
          memoryUsage: Math.floor(Math.random() * 5000) + 10000,
        });
      } else {
        const errorType = Math.random() > 0.5 ? 'wrong_answer' : 'runtime_error';
        setStatus(errorType === 'wrong_answer' ? 'wrong_answer' : 'runtime_error');

        if (errorType === 'wrong_answer') {
          setOutput('答案错误！\n\n测试用例1: 通过\n测试用例2: 失败\n期望输出: 10\n实际输出: 8');
        } else {
          setOutput('运行时错误！\n\n程序在执行过程中崩溃，请检查数组越界、空指针等问题。');
        }

        const kpId = problem!.knowledgePoints[0];
        const aiResponse = getAIResponse(errorType, kpId) || getGenericAIResponse(errorType);

        addMistake(
          problem!.id,
          code,
          errorType,
          aiResponse?.analysis.rootCause || '代码存在错误，请检查逻辑。'
        );
      }
    }, 1500);
  };
  
  if (!problem) {
    return null;
  }
  
  const difficultyConfig = {
    easy: { label: '简单', gradient: 'from-emerald-500 to-green-600', bg: 'bg-gradient-to-br from-emerald-100 to-green-100' },
    medium: { label: '中等', gradient: 'from-amber-500 to-orange-600', bg: 'bg-gradient-to-br from-amber-100 to-orange-100' },
    hard: { label: '困难', gradient: 'from-red-500 to-rose-600', bg: 'bg-gradient-to-br from-red-100 to-rose-100' },
  };
  
  const config = difficultyConfig[problem.difficulty];
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 头部导航 */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <motion.button
          onClick={() => navigate('/daily')}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors group"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={20} />
          <span className="font-medium group-hover:text-primary-600">返回</span>
        </motion.button>
        <div className="flex items-center gap-5">
          <motion.div 
            className="flex items-center gap-2 text-neutral-500"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock size={18} />
            </motion.div>
            <span className="font-medium">{formatTime(elapsedTime)}</span>
            <span className="text-xs text-neutral-400 ml-2">限时 {problem.timeLimit / 1000}秒</span>
          </motion.div>
          <motion.div 
            className="text-sm text-neutral-500 font-medium px-4 py-1.5 rounded-full bg-neutral-100"
            whileHover={{ scale: 1.1 }}
          >
            尝试次数: {attempts}
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {/* 题目描述 */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-2xl opacity-50" />
            
            <div className="flex items-center gap-4 mb-5">
              <motion.h1 
                className="text-2xl font-bold text-neutral-800 tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {problem.title}
              </motion.h1>
              <motion.span 
                className={`px-4 py-1.5 rounded-xl text-sm font-bold bg-gradient-to-r ${config.gradient} text-white shadow-md`}
                whileHover={{ scale: 1.1 }}
              >
                {config.label}
              </motion.span>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-3 mb-6"
              variants={containerVariants}
            >
              {problem.knowledgePoints.map(kpId => (
                <motion.span
                  key={kpId}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl text-sm font-medium border border-blue-100/50"
                >
                  {getKnowledgePointName(kpId)}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.div 
              className="space-y-5"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <h3 className="font-semibold text-neutral-700 mb-2 text-base">题目描述</h3>
                <p className="text-neutral-600 whitespace-pre-line leading-relaxed">{problem.description}</p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h3 className="font-semibold text-neutral-700 mb-2 text-base">输入格式</h3>
                <pre className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 rounded-xl text-sm text-neutral-600 border border-neutral-100">{problem.inputFormat}</pre>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h3 className="font-semibold text-neutral-700 mb-2 text-base">输出格式</h3>
                <pre className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 rounded-xl text-sm text-neutral-600 border border-neutral-100">{problem.outputFormat}</pre>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h3 className="font-semibold text-neutral-700 mb-2 text-base">样例输入</h3>
                <pre className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 rounded-xl text-sm text-neutral-600 font-mono border border-neutral-100">{problem.sampleInput}</pre>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h3 className="font-semibold text-neutral-700 mb-2 text-base">样例输出</h3>
                <pre className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 rounded-xl text-sm text-neutral-600 font-mono border border-neutral-100">{problem.sampleOutput}</pre>
              </motion.div>
            </motion.div>
            
            {/* 提示区域 */}
            <AnimatePresence>
              {showHint && problem.hints.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-100"
                >
                  <motion.div 
                    className="flex items-center gap-3 mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lightbulb className="text-amber-600" size={22} />
                    </motion.div>
                    <span className="font-semibold text-amber-700">提示</span>
                  </motion.div>
                  <ul className="space-y-2">
                    {problem.hints.map((hint) => (
                      <motion.li 
                        key={hint}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-amber-700 font-medium"
                      >
                        • {hint}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
        
        {/* 代码编辑器 */}
        <motion.div className="space-y-5" variants={itemVariants}>
          <Card className="p-5 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm" />
                </motion.div>
                <h3 className="font-semibold text-neutral-700 text-sm">main.cpp</h3>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setCode(defaultCode)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-all"
                  title="重置代码"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RotateCcw size={16} />
                </motion.button>
                <motion.button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-all"
                  title="复制代码"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Copy size={16} />
                </motion.button>
              </div>
            </div>
            
            <motion.div 
              className="rounded-xl overflow-hidden border border-neutral-200"
              whileHover={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
            >
              <div className="h-[350px]">
                <Editor
                  height="100%"
                  language="cpp"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => value !== undefined && setCode(value)}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    insertSpaces: true,
                    wordWrap: 'on',
                    padding: { top: 12 },
                  }}
                />
              </div>
            </motion.div>
            
            <motion.div className="flex gap-3 mt-5">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="border-neutral-200 px-5 py-2.5 rounded-xl font-medium"
                >
                  <motion.div
                    animate={{ rotate: showHint ? [0, 15, 0] : [0, -15, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Lightbulb size={16} className="mr-1" />
                  </motion.div>
                  {showHint ? '隐藏提示' : '查看提示'}
                </Button>
              </motion.div>
              
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={simulateCodeRun} 
                  disabled={status === 'running'}
                  className="w-full bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-6 py-2.5 rounded-xl font-semibold"
                >
                  {status === 'running' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Zap size={18} className="mr-2" />
                    </motion.div>
                  ) : (
                    <Sparkles size={18} className="mr-2" />
                  )}
                  {status === 'running' ? '运行中...' : '提交代码'}
                </Button>
              </motion.div>
            </motion.div>
          </Card>
          
          {/* 运行结果 */}
          <AnimatePresence>
            {output && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card className={`p-5 rounded-2xl border shadow-lg overflow-hidden ${
                  status === 'accepted' ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100' :
                  status === 'wrong_answer' ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100' :
                  'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100'
                }`}>
                  <motion.div 
                    className="flex items-center gap-3 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {status === 'accepted' ? (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <CheckCircle className="text-emerald-600" size={22} />
                        </motion.div>
                        <span className="font-semibold text-emerald-700">答案正确</span>
                      </>
                    ) : status === 'wrong_answer' ? (
                      <>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <AlertCircle className="text-red-600" size={22} />
                        </motion.div>
                        <span className="font-semibold text-red-700">答案错误</span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <AlertCircle className="text-amber-600" size={22} />
                        </motion.div>
                        <span className="font-semibold text-amber-700">运行时错误</span>
                      </>
                    )}
                  </motion.div>
                  
                  <pre className="text-sm text-neutral-600 whitespace-pre-wrap font-mono bg-white/50 p-4 rounded-xl">{output}</pre>
                  
                  {status !== 'accepted' && (
                    <motion.div 
                      className="mt-5 pt-5 border-t border-white/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link to="/mistakes">
                          <Button variant="outline" size="sm" className="w-full border-neutral-300 px-5 py-2.5 rounded-xl font-medium">
                            <Target size={16} className="mr-2" />
                            查看AI归因分析
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {status === 'accepted' && nextProblem && (
                    <motion.div 
                      className="mt-5 pt-5 border-t border-emerald-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link to={`/daily/problem/${nextProblem.id}`}>
                          <Button size="sm" className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-md px-5 py-2.5 rounded-xl font-semibold">
                            <Star size={16} className="mr-2" />
                            下一题：{nextProblem.title}
                            <motion.div
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ArrowRight size={16} className="ml-2" />
                            </motion.div>
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {status === 'accepted' && !nextProblem && (
                    <motion.div 
                      className="mt-5 pt-5 border-t border-emerald-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link to="/daily">
                          <Button variant="outline" size="sm" className="w-full border-emerald-200 px-5 py-2.5 rounded-xl font-medium text-emerald-600">
                            <CheckCircle size={16} className="mr-2" />
                            返回每日推荐
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};