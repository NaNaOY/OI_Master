import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Lightbulb, Copy, ArrowLeft, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { getProblemById } from '@/data/problems';
import { getAIResponse, getGenericAIResponse } from '@/data/aiResponses';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName } from '@/utils/analysis';

const defaultCode = `#include <iostream>
using namespace std;

int main() {
    // 在这里编写你的代码
    return 0;
}`;

export const ProblemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProblemRecord, addMistake } = useUserStore();
  
  const problem = getProblemById(id || '');
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'accepted' | 'wrong_answer' | 'runtime_error'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
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
      const hasCustomCode = trimmedCode.length > defaultCode.length * 1.2 || 
        (trimmedCode.includes('cin') && trimmedCode.includes('cout')) ||
        trimmedCode.includes('for') || trimmedCode.includes('while') ||
        trimmedCode.includes('if') || trimmedCode.includes('sort') ||
        trimmedCode.includes('swap') || trimmedCode.includes('arr');
      
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
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/daily')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={18} />
            <span>{problem.timeLimit / 1000}秒</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>尝试次数: {attempts}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-xl font-bold text-gray-800">{problem.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                problem.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {problem.knowledgePoints.map(kpId => (
                <span
                  key={kpId}
                  className="px-2 py-1 bg-primary-50 text-primary-600 rounded text-sm"
                >
                  {getKnowledgePointName(kpId)}
                </span>
              ))}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">题目描述</h3>
                <p className="text-gray-600 whitespace-pre-line">{problem.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">输入格式</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm text-gray-600">{problem.inputFormat}</pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">输出格式</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm text-gray-600">{problem.outputFormat}</pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">样例输入</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm text-gray-600">{problem.sampleInput}</pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">样例输出</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm text-gray-600">{problem.sampleOutput}</pre>
              </div>
            </div>
            
            {showHint && problem.hints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-yellow-500" />
                  <span className="font-medium text-yellow-800">提示</span>
                </div>
                <ul className="space-y-2">
                  {problem.hints.map((hint, index) => (
                    <li key={index} className="text-sm text-yellow-700">• {hint}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">代码编辑器</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setCode(defaultCode)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  title="重置代码"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  title="复制代码"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            
            <div className="h-[300px] rounded-lg border border-gray-200 overflow-hidden">
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
                }}
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
              >
                <Lightbulb size={16} className="mr-1" />
                {showHint ? '隐藏提示' : '查看提示'}
              </Button>
              <Button onClick={simulateCodeRun} disabled={status === 'running'}>
                {status === 'running' ? '运行中...' : '提交代码'}
              </Button>
            </div>
          </Card>
          
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={`p-4 ${
                status === 'accepted' ? 'border-green-500' :
                status === 'wrong_answer' ? 'border-red-500' :
                'border-orange-500'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  {status === 'accepted' ? (
                    <><CheckCircle className="text-green-500" /><span className="font-medium text-green-700">答案正确</span></>
                  ) : status === 'wrong_answer' ? (
                    <><AlertCircle className="text-red-500" /><span className="font-medium text-red-700">答案错误</span></>
                  ) : (
                    <><AlertCircle className="text-orange-500" /><span className="font-medium text-orange-700">运行时错误</span></>
                  )}
                </div>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">{output}</pre>
                
                {status !== 'accepted' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link to="/mistakes">
                      <Button variant="outline" size="sm" className="w-full">
                        查看AI归因分析
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