import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { problems } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getDifficultyColor, getKnowledgePointName } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle, Clock, Sparkles, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import { useEffect } from 'react';
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

export const DailyPractice = () => {
  const { userData, updateDailyRecommendations } = useUserStore();
  
  const todayStr = new Date().toISOString().split('T')[0];
  
  useEffect(() => {
    if (userData.dailyRecommendDate !== todayStr) {
      updateDailyRecommendations();
    }
  }, [userData.dailyRecommendDate, todayStr, updateDailyRecommendations]);
  
  const dailyProblems = userData.dailyRecommendedProblems
    .map(id => problems.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);
  
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  
  const completedToday = userData.completedProblems.filter(
    cp => cp.completedAt.startsWith(todayStr)
  );
  
  const correctToday = completedToday.filter(cp => cp.status === 'accepted').length;
  
  const isProblemCompleted = (problemId: string) => {
    return completedToday.some(cp => cp.problemId === problemId);
  };
  
  const allCompleted = dailyProblems.length > 0 && dailyProblems.every(p => isProblemCompleted(p.id));
  
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
            <Calendar size={24} className="text-primary-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">每日推荐</h1>
          </div>
          <p className="text-neutral-500">{today}</p>
        </div>
        
        <motion.div 
          className="flex items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-1 shadow-md"
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-white font-bold text-lg">{completedToday.length}</span>
            </motion.div>
            <p className="text-xs text-neutral-500">已完成</p>
          </div>
          <div className="text-center">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-1 shadow-md"
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-white font-bold text-lg">{correctToday}</span>
            </motion.div>
            <p className="text-xs text-neutral-500">正确</p>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Progress Banner */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-indigo-500" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative p-6 md:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="text-amber-300" size={24} />
                  </motion.div>
                  <span className="font-medium text-lg">今日学习目标</span>
                </div>
                <p className="text-white/80">完成 {dailyProblems.length} 道推荐题目，巩固薄弱知识点</p>
              </div>
              <div className="text-right">
                <motion.p 
                  className="text-4xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {completedToday.length}/{dailyProblems.length}
                </motion.p>
                <p className="text-sm text-white/60">进度</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Problems */}
      {allCompleted ? (
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
            <h3 className="text-xl font-bold text-neutral-800 mb-2">今日任务已完成！</h3>
            <p className="text-neutral-500 mb-6">您已经完成了所有推荐题目，明天再来吧！</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/mistakes">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  <Trophy size={18} className="mr-2" />
                  复习错题
                </Button>
              </Link>
            </motion.div>
          </Card>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
        >
          {dailyProblems.map((problem) => {
            const completed = isProblemCompleted(problem.id);
            const completedRecord = completedToday.find(cp => cp.problemId === problem.id);
            const isCorrect = completedRecord?.status === 'accepted';
            
            return (
              <motion.div
                key={problem.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Link to={`/daily/problem/${problem.id}`}>
                  <Card 
                    hover 
                    className={`p-5 cursor-pointer overflow-hidden group relative ${
                      completed 
                        ? isCorrect 
                          ? 'border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                          : 'border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50'
                        : ''
                    }`}
                  >
                    {/* Hover 渐变 */}
                    {!completed && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    
                    <div className="relative">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between mb-3 gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                            {problem.title}
                          </h3>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${getDifficultyColor(problem.difficulty)}20`, 
                              color: getDifficultyColor(problem.difficulty) 
                            }}
                          >
                            {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                          </span>
                          {completed && (
                            <motion.span 
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                isCorrect ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              {isCorrect ? '已完成 ✓' : '需重做'}
                            </motion.span>
                          )}
                        </div>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock size={14} />
                          {problem.timeLimit / 1000}秒
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{problem.description}</p>
                      
                      {/* Knowledge Points */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {problem.knowledgePoints.map(kpId => (
                          <span
                            key={kpId}
                            className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-xs"
                          >
                            {getKnowledgePointName(kpId)}
                          </span>
                        ))}
                      </div>
                      
                      {/* Footer */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100">
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Zap size={14} className="text-amber-500" />
                          预计 {Math.ceil(problem.difficulty === 'easy' ? 5 : problem.difficulty === 'medium' ? 15 : 30)} 分钟
                        </div>
                        {completed ? (
                          <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-amber-600'}`}>
                            {isCorrect ? '点击回顾' : '点击重做'}
                          </span>
                        ) : (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" className="group-hover:bg-primary-500 group-hover:text-white transition-colors">
                              开始练习
                              <ArrowRight size={16} className="ml-1" />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
      
      {/* Empty State */}
      {dailyProblems.length === 0 && !allCompleted && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 md:p-12 text-center">
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Target size={40} className="text-primary-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">暂无推荐题目</h3>
            <p className="text-neutral-500 mb-6">请先完成诊断测试，获取个性化推荐</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/diagnosis">
                <Button className="bg-gradient-to-r from-primary-500 to-indigo-500 text-white shadow-lg">
                  <Sparkles size={18} className="mr-2" />
                  开始诊断
                </Button>
              </Link>
            </motion.div>
          </Card>
        </motion.div>
      )}
      
      {/* Tips */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary-500" />
            <h3 className="font-semibold text-neutral-800">学习小贴士</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: '先看题再思考', desc: '仔细阅读题目描述，理解问题后再动手', color: 'from-blue-500 to-cyan-500' },
              { title: '测试样例', desc: '先通过样例测试，再提交代码', color: 'from-green-500 to-teal-500' },
              { title: '遇到难题', desc: '不要轻易放弃，尝试不同的思路', color: 'from-amber-500 to-orange-500' },
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
    </motion.div>
  );
};