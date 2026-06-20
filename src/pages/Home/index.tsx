import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { motion, useInView } from 'framer-motion';
import { Award, BarChart3, BookOpen, ClipboardList, Clock, Target, TrendingUp, Trophy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 数字滚动动画组件
const CountUpNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (!isInView) return;
    
    const duration = 1500;
    const steps = 60;
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
  }, [isInView, value]);
  
  return <span ref={ref}>{displayValue}{suffix}</span>;
};

// 逐字显示动画
const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

const statCards = [
  { icon: <Target size={24} />, label: '已完成题目', color: '#3b82f6', bgGradient: 'from-blue-500/20 to-blue-600/10' },
  { icon: <TrendingUp size={24} />, label: '正确率', color: '#10b981', bgGradient: 'from-emerald-500/20 to-emerald-600/10', suffix: '%' },
  { icon: <Clock size={24} />, label: '学习天数', color: '#f59e0b', bgGradient: 'from-amber-500/20 to-amber-600/10' },
  { icon: <Award size={24} />, label: '连续学习', color: '#8b5cf6', bgGradient: 'from-violet-500/20 to-violet-600/10', suffix: '天' },
];

const quickActions = [
  { id: 'diagnosis', icon: <BarChart3 size={28} />, title: '开始诊断', description: '评估当前水平', path: '/diagnosis', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'daily', icon: <ClipboardList size={28} />, title: '今日推荐', description: '个性化练习', path: '/daily', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'mistakes', icon: <Trophy size={28} />, title: '错题复习', description: '巩固薄弱项', path: '/mistakes', gradient: 'from-amber-500 to-orange-500' },
  { id: 'learning-path', icon: <BookOpen size={28} />, title: '学习路径', description: '规划学习路线', path: '/learning-path', gradient: 'from-violet-500 to-purple-500' },
];

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* 欢迎横幅 */}
      <section>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden bg-gradient-to-br from-primary-600/90 via-indigo-600/90 to-accent-600/90 rounded-3xl p-8 text-white backdrop-blur-sm border border-white/20 shadow-2xl shadow-primary-500/20"
        >
          {/* 背景光效 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          {/* 装饰线条 */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              <AnimatedText text={`欢迎回来，${userData.name}`} />
            </h1>
            <motion.p 
              className="text-white/80 text-lg mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              今天也要继续加油，离目标更近一步！
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white/20 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 transition-all duration-300 shadow-xl shadow-white/10 hover:shadow-white/20"
                  onClick={() => navigate('/diagnosis')}
                >
                  <BarChart3 className="mr-2" size={20} />
                  开始诊断
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="bg-transparent backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 transition-all duration-300 shadow-xl shadow-white/10"
                  onClick={() => navigate('/daily')}
                >
                  <BookOpen className="mr-2" size={20} />
                  继续学习
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* 数据概览 */}
      <section>
        <motion.h2 
          className="text-xl font-bold text-white/90 mb-4 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="w-1 h-6 bg-gradient-to-b from-primary-400 to-accent-400 rounded-full" />
          学习数据概览
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, type: 'spring', stiffness: 100, damping: 15 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="relative overflow-hidden bg-dark-600/50 backdrop-blur-xl border border-white/10 shadow-xl">
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`} />
                
                {/* 边框光效 */}
                <div className="absolute inset-0 border border-white/5 rounded-xl" />
                
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md"
                      style={{ backgroundColor: `${card.color}20` }}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <span style={{ color: card.color }}>{card.icon}</span>
                    </motion.div>
                    <div>
                      <p className="text-3xl font-bold text-white">
                        <CountUpNumber 
                          value={card.suffix === '%' ? stats.correctRate : 
                                 card.suffix === '天' ? stats.streakDays : 
                                 card.label === '已完成题目' ? stats.completedProblems : stats.studyDays} 
                          suffix={card.suffix} 
                        />
                      </p>
                      <p className="text-sm text-gray-400">{card.label}</p>
                    </div>
                  </div>
                </div>
                
                {/* 底部光条 */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 rounded-b-xl"
                  style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* 快速入口 */}
      <section>
        <motion.h2 
          className="text-xl font-bold text-white/90 mb-4 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full" />
          快速入口
        </motion.h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, type: 'spring', stiffness: 100, damping: 15 }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <Link to={action.path}>
                <Card 
                  hover 
                  className="relative overflow-hidden bg-dark-600/50 backdrop-blur-xl border border-white/10 p-6 cursor-pointer group"
                >
                  {/* Hover glow effect */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />
                  
                  {/* Glow border on hover */}
                  <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/30 transition-colors duration-300 bg-gradient-to-br ${action.gradient} group-hover:opacity-100 opacity-0`} 
                       style={{ background: 'transparent' }} />
                  
                  {/* Animated glow on hover */}
                  <div 
                    className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-glow-pulse"
                    style={{
                      background: `linear-gradient(45deg, ${action.gradient.includes('blue') ? '#3b82f6' : action.gradient.includes('emerald') ? '#10b981' : action.gradient.includes('amber') ? '#f59e0b' : '#8b5cf6'}, transparent, ${action.gradient.includes('blue') ? '#6366f1' : action.gradient.includes('emerald') ? '#14b8a6' : action.gradient.includes('amber') ? '#fbbf24' : '#a855f7'})`,
                      filter: 'blur(8px)'
                    }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white mb-4 shadow-lg`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {action.icon}
                    </motion.div>
                    <h3 className="font-semibold text-white mb-1 group-hover:text-white/90">{action.title}</h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">{action.description}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* 知识点掌握度 */}
      <section>
        <motion.h2 
          className="text-xl font-bold text-white/90 mb-4 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span className="w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-400 rounded-full" />
          知识点掌握度
        </motion.h2>
        
        <Card className="bg-dark-600/50 backdrop-blur-xl border border-white/10 p-6">
          {recentProgress.length > 0 ? (
            <div className="space-y-5">
              {recentProgress.map((progress, index) => (
                <motion.div
                  key={progress.knowledgePointId}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-dark-700/50 hover:bg-dark-700/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMasteryColor(progress.masteryLevel) }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="font-medium text-white/90">
                      {getKnowledgePointName(progress.knowledgePointId)}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: `${getMasteryColor(progress.masteryLevel)}15`,
                        color: getMasteryColor(progress.masteryLevel),
                        borderColor: `${getMasteryColor(progress.masteryLevel)}30`
                      }}
                    >
                      {getMasteryLevel(progress.masteryLevel)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-sm text-gray-400 w-16 text-right">
                      {progress.masteryLevel}%
                    </span>
                    <div className="flex-1 sm:w-40 relative overflow-hidden rounded-full h-2 bg-dark-800">
                      <motion.div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ backgroundColor: getMasteryColor(progress.masteryLevel) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.masteryLevel}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                      />
                      {/* Shine effect */}
                      <motion.div
                        className="absolute top-0 left-0 h-full w-1/2 rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                        animate={{ x: ['-100%', '300%'] }}
                        transition={{ delay: 1.5 + index * 0.1, duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen size={56} className="mx-auto mb-4 text-gray-500" />
              </motion.div>
              <p className="text-gray-400 mb-4">还没有学习记录，快去开始诊断吧！</p>
              <Link to="/diagnosis">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-primary-500 to-accent-500 border-0">
                    开始诊断
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          )}
        </Card>
      </section>
    </motion.div>
  );
};
