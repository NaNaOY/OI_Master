import { motion } from 'framer-motion';
import { Filter, AlertCircle, CheckCircle, ArrowRight, Calendar } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/store/useUserStore';
import { getProblemTitle, getDifficultyColor } from '@/utils/analysis';
import { getProblemById } from '@/data/problems';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Mistakes = () => {
  const { userData, markMistakeReviewed } = useUserStore();
  const [filter, setFilter] = useState<'all' | 'reviewed' | 'unreviewed'>('all');
  
  const filteredMistakes = userData.mistakes.filter(m => {
    if (filter === 'reviewed') return m.reviewed;
    if (filter === 'unreviewed') return !m.reviewed;
    return true;
  });
  
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">错题归因</h1>
          <p className="text-gray-500 mt-1">分析错误原因，针对性改进</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <Button variant="outline" size="sm" onClick={() => setFilter('all')} className={filter === 'all' ? 'bg-primary-50' : ''}>
            全部
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFilter('unreviewed')} className={filter === 'unreviewed' ? 'bg-primary-50' : ''}>
            未复习
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFilter('reviewed')} className={filter === 'reviewed' ? 'bg-primary-50' : ''}>
            已复习
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
        <Card className="p-4 text-center">
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{userData.mistakes.length}</p>
          <p className="text-sm text-gray-500">总错题数</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl md:text-3xl font-bold text-red-500 mb-1">
            {userData.mistakes.filter(m => m.errorType === 'wrong_answer').length}
          </p>
          <p className="text-sm text-gray-500">答案错误</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl md:text-3xl font-bold text-yellow-500 mb-1">
            {userData.mistakes.filter(m => m.errorType === 'runtime_error').length}
          </p>
          <p className="text-sm text-gray-500">运行错误</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl md:text-3xl font-bold text-green-500 mb-1">
            {userData.mistakes.filter(m => m.reviewed).length}
          </p>
          <p className="text-sm text-gray-500">已复习</p>
        </Card>
      </div>
      
      {filteredMistakes.length > 0 ? (
        <div className="space-y-4">
          {filteredMistakes.map((mistake, index) => {
            const problem = getProblemById(mistake.problemId);
            return (
              <motion.div
                key={mistake.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`p-4 md:p-5 ${mistake.reviewed ? 'opacity-70' : ''}`}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Link to={`/mistakes/${mistake.id}`}>
                          <h3 className="font-semibold text-gray-800 hover:text-primary-600 cursor-pointer">
                            {getProblemTitle(mistake.problemId)}
                          </h3>
                        </Link>
                        {problem && (
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{ backgroundColor: `${getDifficultyColor(problem.difficulty)}15`, color: getDifficultyColor(problem.difficulty) }}
                          >
                            {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                          </span>
                        )}
                        {mistake.reviewed && (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle size={14} />
                            已复习
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <AlertCircle size={14} style={{ color: getErrorTypeColor(mistake.errorType) }} />
                          <span style={{ color: getErrorTypeColor(mistake.errorType) }}>
                            {getErrorTypeLabel(mistake.errorType)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(mistake.date).toLocaleDateString('zh-CN')}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {mistake.aiAnalysis}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {!mistake.reviewed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markMistakeReviewed(mistake.id)}
                        >
                          标记已复习
                        </Button>
                      )}
                      <Link to={`/mistakes/${mistake.id}`}>
                        <Button size="sm">
                          查看分析
                          <ArrowRight size={16} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-6 md:p-8 text-center">
          <CheckCircle size={48} className="mx-auto mb-3 text-green-400" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">太棒了！没有错题</h3>
          <p className="text-gray-500 mb-4">继续保持，多做练习巩固知识</p>
          <Link to="/daily">
            <Button>继续练习</Button>
          </Link>
        </Card>
      )}
      
      {filteredMistakes.length > 0 && (
        <Card className="p-4 md:p-6 mt-4 md:mt-6">
          <h3 className="font-semibold text-gray-800 mb-4">复习建议</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="font-medium text-red-800 mb-1">先看错误类型</p>
              <p className="text-sm text-red-600">根据错误类型快速定位问题所在</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-800 mb-1">理解错误原因</p>
              <p className="text-sm text-yellow-600">仔细阅读AI分析，理解根本原因</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800 mb-1">重做练习题</p>
              <p className="text-sm text-green-600">找到同类题目，强化练习</p>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};
