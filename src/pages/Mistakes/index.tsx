import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { getProblemById } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getDifficultyColor, getProblemTitle } from '@/utils/analysis';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Calendar, CheckCircle, Filter, Sparkles, Star, Target, Trophy, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
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

const floatVariants = {
  initial: { y: 0 },
  animate: { 
    y: [-5, 5, -5], 
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } 
  }
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
      wrong_answer: 'from-red-500 via-rose-500 to-pink-600',
      runtime_error: 'from-amber-500 via-orange-500 to-yellow-600',
      time_limit_exceeded: 'from-violet-500 via-purple-500 to-fuchsia-600',
      compile_error: 'from-neutral-500 via-gray-500 to-slate-600',
    };
    return gradients[type] || 'from-neutral-500 via-gray-500 to-slate-600';
  };
  
  const getErrorTypeBgGradient = (type: string) => {
    const gradients: Record<string, string> = {
      wrong_answer: 'from-red-50 via-rose-50 to-pink-50',
      runtime_error: 'from-amber-50 via-orange-50 to-yellow-50',
      time_limit_exceeded: 'from-violet-50 via-purple-50 to-fuchsia-50',
      compile_error: 'from-neutral-50 via-gray-50 to-slate-50',
    };
    return gradients[type] || 'from-neutral-50 via-gray-50 to-slate-50';
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* 头部横幅 */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary-500/10">
          {/* 多层渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* 动态光效 */}
          <motion.div 
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"
            variants={floatVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-400/20 rounded-full blur-2xl"
            variants={floatVariants}
            initial="initial"
            animate="animate"
            style={{ animationDelay: '1s' }}
          />
          
          {/* 星星装饰 */}
          <motion.div 
            className="absolute top-10 right-20"
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={28} className="text-yellow-200/60" />
          </motion.div>
          <motion.div 
            className="absolute bottom-15 left-25"
            animate={{ rotate: [0, -360], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            <Star size={20} className="text-white/40" />
          </motion.div>
          
          {/* 内容区域 */}
          <div className="relative p-10 md:p-14 text-white">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="text-yellow-200" size={28} />
                </motion.div>
                <span className="text-white/80 text-sm font-medium tracking-wide">错题归因</span>
              </motion.div>
              
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                AI 错题深度归因
              </motion.h1>
              
              <motion.p 
                className="text-white/90 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                智能分析错误根源，提供针对性改进建议，快速提升解题能力
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* 筛选器和统计 */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
      >
        {/* 筛选按钮 */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Filter size={20} className="text-neutral-400" />
          </motion.div>
          {[
            { key: 'all', label: '全部', gradient: 'from-blue-500 to-indigo-600' },
            { key: 'unreviewed', label: '未复习', gradient: 'from-amber-500 to-orange-600' },
            { key: 'reviewed', label: '已复习', gradient: 'from-emerald-500 to-green-600' },
          ].map((f) => (
            <motion.div 
              key={f.key} 
              whileHover={{ scale: 1.08, y: -2 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter(f.key as typeof filter)}
                className={`${filter === f.key ? `bg-gradient-to-r ${f.gradient} text-white border-transparent shadow-lg` : 'border-neutral-200'} px-5 py-2.5 rounded-xl font-medium transition-all`}
              >
                {f.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>
        
        {/* 统计数据 */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { value: userData.mistakes.length, label: '总错题', gradient: 'from-blue-500 to-indigo-600' },
            { value: userData.mistakes.filter(m => !m.reviewed).length, label: '未复习', gradient: 'from-amber-500 to-orange-600' },
            { value: userData.mistakes.filter(m => m.reviewed).length, label: '已复习', gradient: 'from-emerald-500 to-green-600' },
          ].map((stat) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.1, y: -3 }}
            >
              <motion.div 
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-1 shadow-lg`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white font-bold text-lg">{stat.value}</span>
              </motion.div>
              <p className="text-xs text-neutral-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* 错题列表 */}
      <AnimatePresence mode="wait">
        {filteredMistakes.length > 0 ? (
          <motion.div 
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {filteredMistakes.map((mistake) => {
              const problem = getProblemById(mistake.problemId);
              const errorGradient = getErrorTypeGradient(mistake.errorType);
              const errorBgGradient = getErrorTypeBgGradient(mistake.errorType);
              
              return (
                <motion.div
                  key={mistake.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`p-6 overflow-hidden group relative ${mistake.reviewed ? 'opacity-70' : ''} shadow-lg rounded-2xl border border-neutral-100/50`}>
                    {/* 动态背景渐变 */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-r ${errorBgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    
                    {/* 顶部装饰线 */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${errorGradient}`} />
                    
                    {/* 背景装饰 */}
                    <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${errorBgGradient} rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                    
                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                      <div className="flex-1">
                        {/* 头部 */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <Link to={`/mistakes/${mistake.id}`}>
                            <motion.h3 
                              className="font-semibold text-neutral-800 hover:text-primary-600 transition-colors cursor-pointer text-lg"
                              whileHover={{ scale: 1.02 }}
                            >
                              {getProblemTitle(mistake.problemId)}
                            </motion.h3>
                          </Link>
                          {problem && (
                            <motion.span
                              className="px-3 py-1 rounded-xl text-xs font-bold shadow-md"
                              style={{ 
                                backgroundColor: `${getDifficultyColor(problem.difficulty)}20`, 
                                color: getDifficultyColor(problem.difficulty) 
                              }}
                              whileHover={{ scale: 1.1 }}
                            >
                              {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                            </motion.span>
                          )}
                          <AnimatePresence>
                            {mistake.reviewed && (
                              <motion.div 
                                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <CheckCircle size={14} />
                                </motion.div>
                                <span className="text-xs font-medium">已复习</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* 元信息 */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-4">
                          <motion.div 
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                            style={{ backgroundColor: `${getErrorTypeColor(mistake.errorType)}15` }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <AlertCircle size={16} style={{ color: getErrorTypeColor(mistake.errorType) }} />
                            </motion.div>
                            <span style={{ color: getErrorTypeColor(mistake.errorType) }} className="font-semibold">
                              {getErrorTypeLabel(mistake.errorType)}
                            </span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                          >
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Calendar size={16} className="text-neutral-400" />
                            </motion.div>
                            <span className="font-medium">{new Date(mistake.date).toLocaleDateString('zh-CN')}</span>
                          </motion.div>
                        </div>
                        
                        {/* AI分析 */}
                        <motion.div 
                          className="bg-gradient-to-r from-neutral-50 to-transparent p-4 rounded-xl border border-neutral-100"
                          whileHover={{ scale: 1.01 }}
                        >
                          <p className="text-sm text-neutral-600 line-clamp-2 font-medium">{mistake.aiAnalysis}</p>
                        </motion.div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex flex-wrap items-center gap-3">
                        <AnimatePresence>
                          {!mistake.reviewed && (
                            <motion.div 
                              whileHover={{ scale: 1.08, y: -2 }} 
                              whileTap={{ scale: 0.95 }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markMistakeReviewed(mistake.id)}
                                className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-medium"
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <CheckCircle size={16} className="mr-1" />
                                </motion.div>
                                标记已复习
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <motion.div whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}>
                          <Link to={`/mistakes/${mistake.id}`}>
                            <Button size="sm" className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 text-white shadow-lg px-6 py-2.5 rounded-xl font-semibold">
                              查看分析
                              <motion.div
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight size={16} className="ml-2" />
                              </motion.div>
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
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="p-12 md:p-16 text-center border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-hidden relative shadow-xl rounded-3xl">
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-green-100/30 to-transparent rounded-full blur-2xl opacity-50" />
              
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle size={48} className="text-white" />
                </motion.div>
              </motion.div>
              <motion.h3 
                className="text-2xl font-bold text-neutral-800 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                太棒了！没有错题
              </motion.h3>
              <motion.p 
                className="text-neutral-500 mb-8 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                继续保持，多做练习巩固知识
              </motion.p>
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Link to="/daily">
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-xl px-10 py-4 rounded-xl font-semibold">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Zap size={20} className="mr-2" />
                    </motion.div>
                    继续练习
                  </Button>
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 复习建议 */}
      <AnimatePresence>
        {filteredMistakes.length > 0 && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full blur-2xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-blue-100/30 to-transparent rounded-full blur-2xl opacity-50" />
              
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={24} className="text-amber-500" />
                </motion.div>
                <h3 className="font-bold text-neutral-800 text-lg">复习建议</h3>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
                variants={containerVariants}
              >
                {[
                  { title: '先看错误类型', desc: '根据错误类型快速定位问题所在', icon: <AlertCircle size={24} />, color: 'from-red-500 via-rose-500 to-pink-600' },
                  { title: '理解错误原因', desc: '仔细阅读AI分析，理解根本原因', icon: <Target size={24} />, color: 'from-amber-500 via-orange-500 to-yellow-600' },
                  { title: '重做练习题', desc: '找到同类题目，强化练习', icon: <Zap size={24} />, color: 'from-emerald-500 via-green-500 to-teal-600' },
                ].map((tip, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-neutral-50 to-white border border-neutral-100 group hover:border-neutral-200 transition-all"
                  >
                    <motion.div 
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tip.color} flex items-center justify-center mb-4 shadow-xl`}
                      whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                      style={{ color: 'white' }}
                    >
                      {tip.icon}
                    </motion.div>
                    <motion.div 
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center mb-3 text-white font-bold shadow-md`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {i + 1}
                    </motion.div>
                    <p className="font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">{tip.title}</p>
                    <p className="text-sm text-neutral-500">{tip.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};