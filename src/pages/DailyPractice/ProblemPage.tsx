import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { getAIResponse, getGenericAIResponse } from '@/data/aiResponses';
import { getProblemById, getProblemsByKnowledgePoint } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName } from '@/utils/analysis';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, Copy, Lightbulb, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const defaultCode = `#include <iostream>
using namespace std;

int main() {
    // 在这里编写你的代码
    return 0;
}`;

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
  
  // 获取下一题（仅在当前知识点范围内）
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
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <motion.button
          onClick={() => navigate('/daily')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={20} />
          <span>返回</span>
        </motion.button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={18} />
            <span>{problem.timeLimit / 1000}秒</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>尝试次数: {attempts}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 题目描述 */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-dark-600/50 backdrop-blur-xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-xl font-bold text-white">{problem.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  problem.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  problem.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {problem.knowledgePoints.map(kpId => (
                  <span
                    key={kpId}
                    className="px-3 py-1 bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-full text-sm"
                  >
                    {getKnowledgePointName(kpId)}
                  </span>
                ))}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white/90 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary-500 rounded-full" />
                    题目描述
                  </h3>
                  <p className="text-gray-300 whitespace-pre-line">{problem.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white/90 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                    输入格式
                  </h3>
                  <pre className="bg-dark-700/80 p-4 rounded-xl text-sm text-gray-300 border border-white/5">{problem.inputFormat}</pre>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white/90 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-amber-500 rounded-full" />
                    输出格式
                  </h3>
                  <pre className="bg-dark-700/80 p-4 rounded-xl text-sm text-gray-300 border border-white/5">{problem.outputFormat}</pre>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white/90 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-violet-500 rounded-full" />
                    样例输入
                  </h3>
                  <pre className="bg-dark-700/80 p-4 rounded-xl text-sm text-gray-300 border border-white/5 font-mono">{problem.sampleInput}</pre>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white/90 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-pink-500 rounded-full" />
                    样例输出
                  </h3>
                  <pre className="bg-dark-700/80 p-4 rounded-xl text-sm text-gray-300 border border-white/5 font-mono">{problem.sampleOutput}</pre>
                </div>
              </div>
              
              {showHint && problem.hints.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="text-amber-400" size={20} />
                    <span className="font-medium text-amber-300">提示</span>
                  </div>
                  <ul className="space-y-2">
                    {problem.hints.map((hint, index) => (
                      <li key={index} className="text-sm text-amber-200/80">• {hint}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
        
        {/* 代码编辑器 */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-dark-600/50 backdrop-blur-xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <h3 className="font-semibold text-white/80 text-sm">main.cpp</h3>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setCode(defaultCode)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="重置代码"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <RotateCcw size={16} />
                  </motion.button>
                  <motion.button
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="复制代码"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Copy size={16} />
                  </motion.button>
                </div>
              </div>
              
              {/* 终端风格边框 */}
              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-500/10">
                {/* 顶部渐变边框 */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-accent-500" />
                
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
              </div>
              
              <div className="flex gap-3 mt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                    className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    <Lightbulb size={16} className="mr-1" />
                    {showHint ? '隐藏提示' : '查看提示'}
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button 
                    onClick={simulateCodeRun} 
                    disabled={status === 'running'}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-400 hover:to-indigo-400 border-0"
                  >
                    {/* 脉冲动画 */}
                    {status !== 'running' && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                    )}
                    <span className="relative z-10">
                      {status === 'running' ? (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          运行中...
                        </motion.span>
                      ) : '提交代码'}
                    </span>
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
          
          {/* 运行结果 */}
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className={`p-4 border ${
                status === 'accepted' ? 'bg-emerald-500/10 border-emerald-500/50' :
                status === 'wrong_answer' ? 'bg-red-500/10 border-red-500/50' :
                'bg-amber-500/10 border-amber-500/50'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  {status === 'accepted' ? (
                    <><CheckCircle className="text-emerald-400" size={20} /><span className="font-medium text-emerald-300">答案正确</span></>
                  ) : status === 'wrong_answer' ? (
                    <><AlertCircle className="text-red-400" size={20} /><span className="font-medium text-red-300">答案错误</span></>
                  ) : (
                    <><AlertCircle className="text-amber-400" size={20} /><span className="font-medium text-amber-300">运行时错误</span></>
                  )}
                </div>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-dark-700/50 p-3 rounded-lg border border-white/5">{output}</pre>
                
                {status !== 'accepted' && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Link to="/mistakes">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button variant="outline" size="sm" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                          查看AI归因分析
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                )}
                
                {status === 'accepted' && nextProblem && (
                  <div className="mt-4 pt-4 border-t border-emerald-500/20">
                    <Link to={`/daily/problem/${nextProblem.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button size="sm" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 border-0">
                          下一题：{nextProblem.title}
                          <ArrowRight size={16} className="ml-1" />
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                )}
                
                {status === 'accepted' && !nextProblem && (
                  <div className="mt-4 pt-4 border-t border-emerald-500/20">
                    <Link to="/daily">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button variant="outline" size="sm" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                          返回每日推荐
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
