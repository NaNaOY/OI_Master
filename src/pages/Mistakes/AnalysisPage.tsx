import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Lightbulb, Code, BookOpen, CheckCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { getProblemById } from '@/data/problems';
import { getAIResponse, getGenericAIResponse } from '@/data/aiResponses';
import { getProblemTitle, getKnowledgePointName, getDifficultyColor } from '@/utils/analysis';

export const MistakeAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData, markMistakeReviewed } = useUserStore();
  
  const mistake = userData.mistakes.find(m => m.id === id);
  
  if (!mistake) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">错题记录不存在</p>
      </div>
    );
  }
  
  const problem = getProblemById(mistake.problemId);
  const kpId = problem?.knowledgePoints[0] || '';
  const aiResponse = getAIResponse(mistake.errorType, kpId) || getGenericAIResponse(mistake.errorType);
  
  const getErrorTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      wrong_answer: '答案错误',
      runtime_error: '运行时错误',
      time_limit_exceeded: '超时',
      compile_error: '编译错误',
    };
    return labels[type] || type;
  };
  
  const getErrorTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      wrong_answer: '#ef4444',
      runtime_error: '#f59e0b',
      time_limit_exceeded: '#8b5cf6',
      compile_error: '#6b7280',
    };
    return colors[type] || '#6b7280';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/mistakes')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
          返回错题本
        </button>
        {!mistake.reviewed && (
          <Button onClick={() => markMistakeReviewed(mistake.id)}>
            <CheckCircle size={18} className="mr-2" />
            标记已复习
          </Button>
        )}
      </div>
      
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${getErrorTypeColor(mistake.errorType)}15` }}
          >
            <AlertTriangle size={24} style={{ color: getErrorTypeColor(mistake.errorType) }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{getProblemTitle(mistake.problemId)}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="px-2 py-0.5 rounded text-sm font-medium"
                style={{ backgroundColor: `${getErrorTypeColor(mistake.errorType)}15`, color: getErrorTypeColor(mistake.errorType) }}
              >
                {getErrorTypeLabel(mistake.errorType)}
              </span>
              {problem && (
                <span
                  className="px-2 py-0.5 rounded text-sm font-medium"
                  style={{ backgroundColor: `${getDifficultyColor(problem.difficulty)}15`, color: getDifficultyColor(problem.difficulty) }}
                >
                  {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Code size={18} />
              提交代码
            </h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-[300px] overflow-y-auto">
              {mistake.code}
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} />
              错误原因分析
            </h3>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700">{aiResponse?.analysis.rootCause || mistake.aiAnalysis}</p>
            </div>
          </div>
        </div>
      </Card>
      
      {aiResponse && (
        <>
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="text-yellow-500" />
              常见错误
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {aiResponse.analysis.commonMistakes.map((mistakeItem, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-yellow-700">{mistakeItem}</span>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="text-green-500" />
              改进建议
            </h3>
            <div className="space-y-3">
              {aiResponse.analysis.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
          </Card>
          
          {aiResponse.analysis.codeExamples && aiResponse.analysis.codeExamples.length > 0 && (
            <Card className="p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Code className="text-blue-500" />
                代码对比
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-red-600 mb-2">错误代码</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {aiResponse.analysis.codeExamples[0].wrongCode}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-600 mb-2">正确代码</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {aiResponse.analysis.codeExamples[0].correctCode}
                  </pre>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>说明：</strong>{aiResponse.analysis.codeExamples[0].explanation}
                </p>
              </div>
            </Card>
          )}
        </>
      )}
      
      {aiResponse && aiResponse.analysis.relatedKnowledgePoints && aiResponse.analysis.relatedKnowledgePoints.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4">相关知识点</h3>
          <div className="flex flex-wrap gap-2">
            {aiResponse.analysis.relatedKnowledgePoints.map(kpId => (
              <span
                key={kpId}
                className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm"
              >
                {getKnowledgePointName(kpId)}
              </span>
            ))}
          </div>
        </Card>
      )}
      
      <div className="mt-8 flex justify-center gap-4">
        {problem && (
          <Button onClick={() => navigate(`/daily/problem/${problem.id}`)}>
            重新练习
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate('/daily')}>
          继续刷题
        </Button>
      </div>
    </motion.div>
  );
};