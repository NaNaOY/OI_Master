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
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/daily')}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>返回</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-neutral-500">
            <Clock size={18} />
            <span>{problem.timeLimit / 1000}秒</span>
          </div>
          <div className="text-sm text-neutral-500">
            尝试次数: {attempts}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 题目描述 */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-xl font-bold text-neutral-800">{problem.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                problem.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                problem.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {problem.knowledgePoints.map(kpId => (
                <span
                  key={kpId}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                >
                  {getKnowledgePointName(kpId)}
                </span>
              ))}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-neutral-700 mb-2">题目描述</h3>
                <p className="text-neutral-600 whitespace-pre-line">{problem.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-700 mb-2">输入格式</h3>
                <pre className="bg-neutral-100 p-4 rounded-xl text-sm text-neutral-600">{problem.inputFormat}</pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-700 mb-2">输出格式</h3>
                <pre className="bg-neutral-100 p-4 rounded-xl text-sm text-neutral-600">{problem.outputFormat}</pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-700 mb-2">样例输入</h3>
                <pre className="bg-neutral-100 p-4 rounded-xl text-sm text-neutral-600 font-mono">{problem.sampleInput}</pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-700 mb-2">样例输出</h3>
                <pre className="bg-neutral-100 p-4 rounded-xl text-sm text-neutral-600 font-mono">{problem.sampleOutput}</pre>
              </div>
            </div>
            
            {showHint && problem.hints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600" size={20} />
                  <span className="font-medium text-amber-700">提示</span>
                </div>
                <ul className="space-y-2">
                  {problem.hints.map((hint, index) => (
                    <li key={index} className="text-sm text-amber-700">• {hint}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </Card>
        </div>
        
        {/* 代码编辑器 */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <h3 className="font-semibold text-neutral-700 text-sm">main.cpp</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCode(defaultCode)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="重置代码"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="复制代码"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-neutral-200">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="border-neutral-200"
              >
                <Lightbulb size={16} className="mr-1" />
                {showHint ? '隐藏提示' : '查看提示'}
              </Button>
              
              <Button 
                onClick={simulateCodeRun} 
                disabled={status === 'running'}
                className="flex-1 bg-primary-500 hover:bg-primary-600"
              >
                {status === 'running' ? '运行中...' : '提交代码'}
              </Button>
            </div>
          </Card>
          
          {/* 运行结果 */}
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={`p-4 ${
                status === 'accepted' ? 'bg-green-50 border-green-200' :
                status === 'wrong_answer' ? 'bg-red-50 border-red-200' :
                'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  {status === 'accepted' ? (
                    <><CheckCircle className="text-green-600" size={20} /><span className="font-medium text-green-700">答案正确</span></>
                  ) : status === 'wrong_answer' ? (
                    <><AlertCircle className="text-red-600" size={20} /><span className="font-medium text-red-700">答案错误</span></>
                  ) : (
                    <><AlertCircle className="text-amber-600" size={20} /><span className="font-medium text-amber-700">运行时错误</span></>
                  )}
                </div>
                <pre className="text-sm text-neutral-600 whitespace-pre-wrap font-mono bg-white/50 p-3 rounded-lg">{output}</pre>
                
                {status !== 'accepted' && (
                  <div className="mt-4 pt-4 border-t border-white/50">
                    <Link to="/mistakes">
                      <Button variant="outline" size="sm" className="w-full border-neutral-300">
                        查看AI归因分析
                      </Button>
                    </Link>
                  </div>
                )}
                
                {status === 'accepted' && nextProblem && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <Link to={`/daily/problem/${nextProblem.id}`}>
                      <Button size="sm" className="w-full bg-green-500 hover:bg-green-600">
                        下一题：{nextProblem.title}
                        <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                  </div>
                )}
                
                {status === 'accepted' && !nextProblem && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <Link to="/daily">
                      <Button variant="outline" size="sm" className="w-full border-neutral-300">
                        返回每日推荐
                      </Button>
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
