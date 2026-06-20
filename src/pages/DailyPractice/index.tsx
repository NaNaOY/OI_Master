import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { problems } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getDifficultyColor, getKnowledgePointName } from '@/utils/analysis';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle, Clock, Sparkles, Star, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import { useEffect } from 'react';
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
      className="space-y-8"
    >
      {/* 头部横幅 */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary-500/10">
          {/* 多层渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-indigo-600 to-violet-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* 动态光效 */}
          <motion.div 
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"
            variants={floatVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-400/20 rounded-full blur-2xl"
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
            <Sparkles size={28} className="text-yellow-300/60" />
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
                  <Calendar className="text-yellow-300" size={28} />
                </motion.div>
                <span className="text-white/80 text-sm font-medium tracking-wide">每日推荐</span>
              </motion.div>
              
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {today}
              </motion.h1>
              
              <motion.p 
                className="text-white/90 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                完成今日推荐题目，持续提升编程能力
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* 进度横幅 */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-indigo-500" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-6 md:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <motion.div 
                  className="flex items-center gap-3 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="text-amber-300" size={24} />
                  </motion.div>
                  <span className="font-medium text-lg">今日学习目标</span>
                </motion.div>
                <motion.p 
                  className="text-white/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  完成 {dailyProblems.length} 道推荐题目，巩固薄弱知识点
                </motion.p>
              </div>
              
              {/* 统计数据 */}
              <motion.div 
                className="flex items-center gap-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div 
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-1 shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-white font-bold text-xl">{completedToday.length}</span>
                  </motion.div>
                  <p className="text-xs text-white/70 font-medium">已完成</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div 
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-1 shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-white font-bold text-xl">{correctToday}</span>
                  </motion.div>
                  <p className="text-xs text-white/70 font-medium">正确</p>
                </motion.div>
                <motion.div 
                  className="text-right"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.p 
                    className="text-4xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {completedToday.length}/{dailyProblems.length}
                  </motion.p>
                  <p className="text-sm text-white/60 font-medium">进度</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* 题目列表 */}
      <AnimatePresence mode="wait">
        {allCompleted ? (
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
                今日任务已完成！
              </motion.h3>
              <motion.p 
                className="text-neutral-500 mb-8 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                您已经完成了所有推荐题目，明天再来吧！
              </motion.p>
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Link to="/mistakes">
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-xl px-10 py-4 rounded-xl font-semibold">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Trophy size={20} className="mr-2" />
                    </motion.div>
                    复习错题
                  </Button>
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {dailyProblems.map((problem) => {
              const completed = isProblemCompleted(problem.id);
              const completedRecord = completedToday.find(cp => cp.problemId === problem.id);
              const isCorrect = completedRecord?.status === 'accepted';
              
              const difficultyConfig = {
                easy: { label: '简单', gradient: 'from-emerald-500 to-green-600', bg: 'bg-gradient-to-br from-emerald-50 to-green-50' },
                medium: { label: '中等', gradient: 'from-amber-500 to-orange-600', bg: 'bg-gradient-to-br from-amber-50 to-orange-50' },
                hard: { label: '困难', gradient: 'from-red-500 to-rose-600', bg: 'bg-gradient-to-br from-red-50 to-rose-50' },
              };
              
              const diffConfig = difficultyConfig[problem.difficulty];
              
              return (
                <motion.div
                  key={problem.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={`/daily/problem/${problem.id}`}>
                    <Card 
                      hover 
                      className={`p-6 cursor-pointer overflow-hidden group relative shadow-lg rounded-2xl border border-neutral-100/50 ${
                        completed 
                          ? isCorrect 
                            ? 'border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50' 
                            : 'border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50'
                          : ''
                      }`}
                    >
                      {/* 动态背景渐变 */}
                      {!completed && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-primary-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}
                      
                      {/* 顶部装饰线 */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${completed ? (isCorrect ? 'from-emerald-500 to-green-600' : 'from-amber-500 to-orange-600') : diffConfig.gradient}`} />
                      
                      {/* 背景装饰 */}
                      <div className={`absolute top-0 right-0 w-48 h-48 ${completed ? (isCorrect ? 'from-emerald-100/50' : 'from-amber-100/50') : diffConfig.bg.replace('bg-', '')} bg-gradient-to-br to-transparent rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                      
                      <div className="relative">
                        {/* 头部 */}
                        <div className="flex flex-wrap items-start justify-between mb-4 gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <motion.h3 
                              className="font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors text-lg"
                              whileHover={{ scale: 1.02 }}
                            >
                              {problem.title}
                            </motion.h3>
                            <motion.span
                              className="px-3 py-1 rounded-xl text-xs font-bold shadow-md bg-gradient-to-r"
                              style={{ 
                                backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                                backgroundColor: `${getDifficultyColor(problem.difficulty)}20`,
                                color: getDifficultyColor(problem.difficulty) 
                              }}
                              whileHover={{ scale: 1.1 }}
                            >
                              {diffConfig.label}
                            </motion.span>
                            <AnimatePresence>
                              {completed && (
                                <motion.div 
                                  className={`px-3 py-1 rounded-xl text-xs font-medium ${
                                    isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                  }`}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ type: 'spring' }}
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="flex items-center gap-1"
                                  >
                                    {isCorrect ? <CheckCircle size={14} /> : <Target size={14} />}
                                    {isCorrect ? '已完成 ✓' : '需重做'}
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <motion.div 
                            className="flex items-center gap-2 text-xs text-neutral-400"
                            whileHover={{ scale: 1.05 }}
                          >
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Clock size={16} />
                            </motion.div>
                            <span className="font-medium">{problem.timeLimit / 1000}秒</span>
                          </motion.div>
                        </div>
                        
                        {/* 描述 */}
                        <motion.p 
                          className="text-sm text-neutral-500 mb-4 line-clamp-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {problem.description}
                        </motion.p>
                        
                        {/* 知识点 */}
                        <motion.div 
                          className="flex flex-wrap gap-2 mb-5"
                          variants={containerVariants}
                        >
                          {problem.knowledgePoints.map(kpId => (
                            <motion.span
                              key={kpId}
                              variants={itemVariants}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl text-xs font-medium border border-blue-100/50"
                            >
                              {getKnowledgePointName(kpId)}
                            </motion.span>
                          ))}
                        </motion.div>
                        
                        {/* 底部 */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-neutral-100 group-hover:border-neutral-200 transition-colors">
                          <motion.div 
                            className="flex items-center gap-2 text-sm text-neutral-500"
                            whileHover={{ scale: 1.05 }}
                          >
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Zap size={16} className="text-amber-500" />
                            </motion.div>
                            <span className="font-medium">预计 {Math.ceil(problem.difficulty === 'easy' ? 5 : problem.difficulty === 'medium' ? 15 : 30)} 分钟</span>
                          </motion.div>
                          {completed ? (
                            <motion.span 
                              className={`text-sm font-semibold ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {isCorrect ? '点击回顾' : '点击重做'}
                            </motion.span>
                          ) : (
                            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                              <Button variant="outline" size="sm" className="group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-indigo-500 group-hover:text-white group-hover:border-transparent transition-all px-5 py-2.5 rounded-xl font-medium border-neutral-200">
                                开始练习
                                <motion.div
                                  animate={{ x: [0, 3, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <ArrowRight size={16} className="ml-2" />
                                </motion.div>
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
      </AnimatePresence>
      
      {/* 空状态 */}
      <AnimatePresence>
        {dailyProblems.length === 0 && !allCompleted && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="p-12 md:p-16 text-center border border-neutral-100/50 shadow-xl rounded-3xl overflow-hidden relative">
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-indigo-100/30 to-transparent rounded-full blur-2xl opacity-50" />
              
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center mx-auto mb-6 shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Target size={48} className="text-primary-500" />
              </motion.div>
              <motion.h3 
                className="text-2xl font-bold text-neutral-800 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                暂无推荐题目
              </motion.h3>
              <motion.p 
                className="text-neutral-500 mb-8 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                请先完成诊断测试，获取个性化推荐
              </motion.p>
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Link to="/diagnosis">
                  <Button className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 text-white shadow-xl px-10 py-4 rounded-xl font-semibold">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Sparkles size={20} className="mr-2" />
                    </motion.div>
                    开始诊断
                  </Button>
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 学习小贴士 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-2xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-indigo-100/30 to-transparent rounded-full blur-2xl opacity-50" />
          
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp size={24} className="text-primary-500" />
            </motion.div>
            <h3 className="font-bold text-neutral-800 text-lg">学习小贴士</h3>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            variants={containerVariants}
          >
            {[
              { title: '先看题再思考', desc: '仔细阅读题目描述，理解问题后再动手', icon: <Target size={24} />, color: 'from-blue-500 via-indigo-500 to-violet-500' },
              { title: '测试样例', desc: '先通过样例测试，再提交代码', icon: <CheckCircle size={24} />, color: 'from-green-500 via-emerald-500 to-teal-500' },
              { title: '遇到难题', desc: '不要轻易放弃，尝试不同的思路', icon: <Zap size={24} />, color: 'from-amber-500 via-orange-500 to-yellow-500' },
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
    </motion.div>
  );
};