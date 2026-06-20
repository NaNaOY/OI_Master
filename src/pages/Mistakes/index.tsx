import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { getProblemById } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getDifficultyColor, getProblemTitle } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Calendar, CheckCircle, Filter, Sparkles, Trophy, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

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
  
  const getErrorTypeGradient = (type: string) => {
    const gradients: Record<string, string> = {
      wrong_answer: 'from-red-500 to-rose-500',
      runtime_error: 'from-amber-500 to-orange-500',
      time_limit_exceeded: 'from-violet-500 to-purple-500',
      compile_error: 'from-gray-500 to-slate-500',
    };
    return gradients[type] || 'from-gray-500 to-slate-500';
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={24} className="text-amber-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">错题归因</h1>
          </div>
          <p className="text-neutral-500">分析错误原因，针对性改进</p>
        </div>
        
        <motion.div 
          className="flex flex-wrap items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Filter size={18} className="text-neutral-400" />
          {[
            { key: 'all', label: '全部' },
            { key: 'unreviewed', label: '未复习' },
            { key: 'reviewed', label: '已复习' },
          ].map((f) => (
            <motion.div key={f.key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter(f.key as typeof filter)}
                className={filter === f.key ? 'bg-primary-500 text-white border-primary-500' : ''}
              >
                {f.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {[
          { value: userData.mistakes.length, label: '总错题数', gradient: 'from-blue-500 to-indigo-500' },
          { value: userData.mistakes.filter(m => m.errorType === 'wrong_answer').length, label: '答案错误', gradient: 'from-red-500 to-rose-500' },
          { value: userData.mistakes.filter(m => m.errorType === 'runtime_error').length, label: '运行错误', gradient: 'from-amber-500 to-orange-500' },
          { value: userData.mistakes.filter(m => m.reviewed).length, label: '已复习', gradient: 'from-green-500 to-emerald-500' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <Card className="p-5 text-center overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <motion.div 
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-2 shadow-md`}
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-white font-bold text-lg">{stat.value}</span>
              </motion.div>
              <p className="text-sm text-neutral-500">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Mistakes List */}
      {filteredMistakes.length > 0 ? (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
        >
          {filteredMistakes.map((mistake) => {
            const problem = getProblemById(mistake.problemId);
            
            return (
              <motion.div
                key={mistake.id}
                variants={itemVariants}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <Card className={`p-5 overflow-hidden group relative ${mistake.reviewed ? 'opacity-70' : ''}`}>
                  {/* Hover 渐变 */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getErrorTypeGradient(mistake.errorType)} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  
                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Link to={`/mistakes/${mistake.id}`}>
                          <h3 className="font-semibold text-neutral-800 hover:text-primary-600 transition-colors cursor-pointer">
                            {getProblemTitle(mistake.problemId)}
                          </h3>
                        </Link>
                        {problem && (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${getDifficultyColor(problem.difficulty)}20`, 
                              color: getDifficultyColor(problem.difficulty) 
                            }}
                          >
                            {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                          </span>
                        )}
                        {mistake.reviewed && (
                          <motion.span 
                            className="flex items-center gap-1 text-green-600 text-sm"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <CheckCircle size={14} />
                            已复习
                          </motion.span>
                        )}
                      </div>
                      
                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 mb-3">
                        <motion.div 
                          className="flex items-center gap-1 px-2 py-1 rounded-lg"
                          style={{ backgroundColor: `${getErrorTypeColor(mistake.errorType)}15` }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <AlertCircle size={14} style={{ color: getErrorTypeColor(mistake.errorType) }} />
                          <span style={{ color: getErrorTypeColor(mistake.errorType) }} className="font-medium">
                            {getErrorTypeLabel(mistake.errorType)}
                          </span>
                        </motion.div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(mistake.date).toLocaleDateString('zh-CN')}</span>
                        </div>
                      </div>
                      
                      {/* Analysis */}
                      <p className="text-sm text-neutral-600 line-clamp-2 bg-neutral-50 p-3 rounded-lg">
                        {mistake.aiAnalysis}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {!mistake.reviewed && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markMistakeReviewed(mistake.id)}
                            className="border-green-300 text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle size={16} className="mr-1" />
                            标记已复习
                          </Button>
                        </motion.div>
                      )}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to={`/mistakes/${mistake.id}`}>
                          <Button size="sm" className="bg-gradient-to-r from-primary-500 to-indigo-500 text-white shadow-md">
                            查看分析
                            <ArrowRight size={16} className="ml-1" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 md:p-12 text-center border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <CheckCircle size={40} className="text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">太棒了！没有错题</h3>
            <p className="text-neutral-500 mb-6">继续保持，多做练习巩固知识</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/daily">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  <Zap size={18} className="mr-2" />
                  继续练习
                </Button>
              </Link>
            </motion.div>
          </Card>
        </motion.div>
      )}
      
      {/* Tips */}
      {filteredMistakes.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-amber-500" />
              <h3 className="font-semibold text-neutral-800">复习建议</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: '先看错误类型', desc: '根据错误类型快速定位问题所在', color: 'from-red-500 to-rose-500' },
                { title: '理解错误原因', desc: '仔细阅读AI分析，理解根本原因', color: 'from-amber-500 to-orange-500' },
                { title: '重做练习题', desc: '找到同类题目，强化练习', color: 'from-green-500 to-emerald-500' },
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 group hover:border-primary-200 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tip.color} flex items-center justify-center mb-2 shadow-md`}>
                    <span className="text-white font-bold">{i + 1}</span>
                  </div>
                  <p className="font-medium text-neutral-800 mb-1">{tip.title}</p>
                  <p className="text-sm text-neutral-500">{tip.desc}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};