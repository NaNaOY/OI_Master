import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BarChart3, BookOpen, ChevronRight, ClipboardList, Clock, Sparkles, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 数字动画组件
const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{displayValue}{suffix}</span>;
};

const statCards = [
  { icon: <Target size={24} />, label: '已完成题目', key: 'completedProblems', color: '#3b82f6', gradient: 'from-blue-500 to-indigo-500', iconBg: 'bg-blue-100' },
  { icon: <TrendingUp size={24} />, label: '正确率', key: 'correctRate', color: '#22c55e', gradient: 'from-green-500 to-emerald-500', iconBg: 'bg-green-100', suffix: '%' },
  { icon: <Clock size={24} />, label: '学习天数', key: 'studyDays', color: '#f59e0b', gradient: 'from-amber-500 to-orange-500', iconBg: 'bg-amber-100' },
  { icon: <Award size={24} />, label: '连续学习', key: 'streakDays', color: '#8b5cf6', gradient: 'from-violet-500 to-purple-500', iconBg: 'bg-violet-100', suffix: '天' },
];

const quickActions = [
  { id: 'diagnosis', icon: <BarChart3 size={28} />, title: '开始诊断', description: '评估当前水平', path: '/diagnosis', gradient: 'from-blue-500 to-cyan-500', iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100' },
  { id: 'daily', icon: <ClipboardList size={28} />, title: '今日推荐', description: '个性化练习', path: '/daily', gradient: 'from-green-500 to-teal-500', iconBg: 'bg-gradient-to-br from-green-100 to-teal-100' },
  { id: 'mistakes', icon: <Trophy size={28} />, title: '错题复习', description: '巩固薄弱项', path: '/mistakes', gradient: 'from-amber-500 to-yellow-500', iconBg: 'bg-gradient-to-br from-amber-100 to-yellow-100' },
  { id: 'learning-path', icon: <BookOpen size={28} />, title: '学习路径', description: '规划学习路线', path: '/learning-path', gradient: 'from-violet-500 to-pink-500', iconBg: 'bg-gradient-to-br from-violet-100 to-pink-100' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const Home = () => {
  const { userData } = useUserStore();
  const navigate = useNavigate();
  
  const stats = {
    completedProblems: userData.completedProblems.length,
    correctRate: userData.completedProblems.length > 0
      ? Math.round((userData.completedProblems.filter(cp => cp.status === 'accepted').length / userData.completedProblems.length) * 100)
      : 0,
    studyDays: userData.statistics.streakDays || 1,
    streakDays: userData.statistics.streakDays || 1,
  };
  
  const recentProgress = userData.learningProgress.slice(0, 5);
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* 欢迎横幅 */}
      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl">
          {/* 渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-indigo-500" />
          {/* 光效 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-300/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-8 md:p-12 text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-amber-300" size={24} />
                <span className="text-white/80 text-sm">信奥赛智能学习系统</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                欢迎回来，{userData.name}
              </h1>
              <p className="text-white/90 text-lg mb-8 max-w-md">
                今天也要继续加油，离目标更近一步！每一次练习都是进步的阶梯。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-white text-primary-600 hover:bg-white/90 shadow-lg shadow-primary-500/20 px-8"
                    onClick={() => navigate('/diagnosis')}
                  >
                    <Zap className="mr-2" size={20} />
                    开始诊断
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm px-8"
                    onClick={() => navigate('/daily')}
                  >
                    <BookOpen className="mr-2" size={20} />
                    继续学习
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* 数据概览 */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-primary-500" />
          <h2 className="text-lg font-semibold text-neutral-800">学习数据概览</h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          {statCards.map((card) => (
            <motion.div
              key={card.key}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="p-5 overflow-hidden group">
                {/* 卡片背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative flex items-center gap-4">
                  <motion.div 
                    className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center shadow-sm`}
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    style={{ color: card.color }}
                  >
                    {card.icon}
                  </motion.div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-800">
                      <AnimatedNumber 
                        value={card.key === 'correctRate' ? stats.correctRate : 
                               card.key === 'completedProblems' ? stats.completedProblems : 
                               stats.studyDays} 
                        suffix={card.suffix || ''} 
                      />
                    </p>
                    <p className="text-sm text-neutral-500">{card.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      {/* 快速入口 */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={20} className="text-amber-500" />
          <h2 className="text-lg font-semibold text-neutral-800">快速入口</h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          {quickActions.map((action) => (
            <motion.div
              key={action.id}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <Link to={action.path}>
                <Card hover className="p-6 cursor-pointer group relative overflow-hidden">
                  {/* Hover 渐变背景 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <motion.div 
                      className={`w-16 h-16 rounded-xl ${action.iconBg} flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                      style={{ color: action.gradient.includes('blue') ? '#3b82f6' : 
                              action.gradient.includes('green') ? '#22c55e' : 
                              action.gradient.includes('amber') ? '#f59e0b' : '#8b5cf6' }}
                    >
                      {action.icon}
                    </motion.div>
                    <h3 className="font-semibold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-neutral-500">{action.description}</p>
                    
                    {/* Hover 显示箭头 */}
                    <motion.div 
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <ChevronRight size={20} className="text-primary-500" />
                    </motion.div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      {/* 知识点掌握度 */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-violet-500" />
          <h2 className="text-lg font-semibold text-neutral-800">知识点掌握度</h2>
        </div>
        
        <Card className="p-6">
          <AnimatePresence mode="wait">
            {recentProgress.length > 0 ? (
              <motion.div 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {recentProgress.map((progress) => (
                  <motion.div
                    key={progress.knowledgePointId}
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: getMasteryColor(progress.masteryLevel) }}
                        whileHover={{ scale: 1.3 }}
                      />
                      <span className="font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">
                        {getKnowledgePointName(progress.knowledgePointId)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                        {getMasteryLevel(progress.masteryLevel)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <motion.span 
                        className="text-sm font-semibold w-16 text-right"
                        style={{ color: getMasteryColor(progress.masteryLevel) }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {progress.masteryLevel}%
                      </motion.span>
                      <div className="flex-1 sm:w-48">
                        <ProgressBar
                          value={progress.masteryLevel}
                          color={getMasteryColor(progress.masteryLevel)}
                          className="h-2.5 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center mx-auto mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen size={40} className="text-primary-500" />
                </motion.div>
                <p className="text-neutral-500 mb-6">还没有学习记录，快去开始诊断吧！</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/diagnosis">
                    <Button className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 text-white shadow-lg shadow-primary-500/20">
                      <Sparkles size={18} className="mr-2" />
                      开始诊断
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.section>
    </motion.div>
  );
};