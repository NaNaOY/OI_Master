import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { Award, BarChart3, BookOpen, ChevronRight, ClipboardList, Clock, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
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
  
  return <span className="tabular-nums">{displayValue}{suffix}</span>;
};

const statCards = [
  { icon: <Target size={24} />, label: '诊断次数', key: 'diagnosisCount', gradient: 'from-blue-500 via-blue-600 to-indigo-600', iconBg: 'bg-gradient-to-br from-blue-50 to-indigo-50' },
  { icon: <TrendingUp size={24} />, label: '薄弱知识点', key: 'weakCount', gradient: 'from-emerald-500 via-green-500 to-teal-600', iconBg: 'bg-gradient-to-br from-emerald-50 to-teal-50' },
  { icon: <Award size={24} />, label: '连续学习', key: 'streakDays', gradient: 'from-violet-500 via-purple-500 to-fuchsia-600', iconBg: 'bg-gradient-to-br from-violet-50 to-fuchsia-50', suffix: '天' },
];

const quickActions = [
  { id: 'diagnosis', icon: <BarChart3 size={28} />, title: '开始诊断', description: '评估当前水平', path: '/diagnosis', gradient: 'from-blue-500 via-cyan-500 to-teal-500', iconBg: 'bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100' },
  { id: 'daily', icon: <ClipboardList size={28} />, title: '今日推荐', description: '个性化练习', path: '/daily', gradient: 'from-emerald-500 via-green-500 to-teal-500', iconBg: 'bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100' },
  { id: 'learning-path', icon: <BookOpen size={28} />, title: '学习路径', description: '规划学习路线', path: '/learning-path', gradient: 'from-violet-500 via-purple-500 to-pink-500', iconBg: 'bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100' },
];

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

export const Home = () => {
  const { userData } = useUserStore();
  const navigate = useNavigate();
  
  const stats = {
    diagnosisCount: userData.diagnosisHistory.length,
    weakCount: userData.learningProgress.filter(p => p.masteryLevel < 70).length,
    streakDays: userData.statistics.streakDays || 0,
  };
  
  const hasDiagnosis = userData.diagnosisHistory.length > 0;
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-indigo-600 to-violet-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          <motion.div 
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"
            variants={floatVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-400/20 rounded-full blur-2xl"
            variants={floatVariants}
            initial="initial"
            animate="animate"
            style={{ animationDelay: '1s' }}
          />
          
          <motion.div 
            className="absolute top-10 right-20"
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={32} className="text-yellow-300/60" />
          </motion.div>
          
          <div className="relative p-10 md:p-16 text-white">
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
                  <Sparkles className="text-yellow-300" size={28} />
                </motion.div>
                <span className="text-white/80 text-sm font-medium tracking-wide">OI Path · 信奥赛AI教练</span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                欢迎回来，{userData.name}
              </motion.h1>
              
              <motion.p 
                className="text-white/90 text-lg mb-10 max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {hasDiagnosis 
                  ? '今天也要继续加油，根据诊断结果提升薄弱知识点！' 
                  : '还没有进行诊断，快来评估一下你的水平吧！'
                }
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="ghost"
                    size="lg" 
                    className="bg-white text-primary-700 hover:bg-white/95 shadow-xl px-10 py-4 rounded-xl font-semibold"
                    onClick={() => navigate('/diagnosis')}
                  >
                    <Zap className="mr-2" size={22} />
                    {hasDiagnosis ? '重新诊断' : '开始诊断'}
                  </Button>
                </motion.div>
                
                {hasDiagnosis && (
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="text-white border-2 border-white/40 hover:bg-white/15 backdrop-blur-sm px-10 py-4 rounded-xl font-semibold"
                      onClick={() => navigate('/daily')}
                    >
                      <BookOpen className="mr-2" size={22} />
                      今日推荐
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      <motion.section variants={itemVariants}>
        <motion.div 
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp size={22} className="text-primary-500" />
          </motion.div>
          <h2 className="text-xl font-bold text-neutral-800 tracking-tight">学习数据概览</h2>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          variants={containerVariants}
        >
          {statCards.map((card) => (
            <motion.div
              key={card.key}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 overflow-hidden group relative border border-neutral-100/50 shadow-lg shadow-neutral-200/50">
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  initial={false}
                />
                
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-80`} />
                
                <div className="relative flex items-center gap-5">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-md`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {card.icon}
                    </motion.div>
                  </motion.div>
                  <div className="flex-1">
                    <motion.p 
                      className="text-3xl font-bold text-neutral-800 tabular-nums"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <AnimatedNumber 
                        value={card.key === 'diagnosisCount' ? stats.diagnosisCount : 
                               card.key === 'weakCount' ? stats.weakCount : 
                               stats.streakDays} 
                        suffix={card.suffix || ''} 
                      />
                    </motion.p>
                    <p className="text-sm text-neutral-500 mt-1 font-medium">{card.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      <motion.section variants={itemVariants}>
        <motion.div 
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap size={22} className="text-amber-500" />
          </motion.div>
          <h2 className="text-xl font-bold text-neutral-800 tracking-tight">快速入口</h2>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          variants={containerVariants}
        >
          {quickActions.map((action) => (
            <motion.div
              key={action.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={action.path}>
                <Card hover className="p-7 cursor-pointer group relative overflow-hidden border border-neutral-100/50 shadow-lg shadow-neutral-200/50 rounded-2xl">
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
                  />
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-80 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <motion.div 
                      className={`w-18 h-18 rounded-2xl ${action.iconBg} flex items-center justify-center mb-5 shadow-md`}
                      whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.4 }}
                      style={{ width: '72px', height: '72px' }}
                    >
                      {action.icon}
                    </motion.div>
                    
                    <h3 className="font-bold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors text-lg">
                      {action.title}
                    </h3>
                    <p className="text-sm text-neutral-500 font-medium">{action.description}</p>
                    
                    <motion.div 
                      className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                      initial={{ x: -15 }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={24} className="text-primary-500" />
                    </motion.div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      {hasDiagnosis && (
        <motion.section variants={itemVariants}>
          <Card className="p-8 overflow-hidden relative border border-neutral-100/50 shadow-lg shadow-neutral-200/50 rounded-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-2xl opacity-50" />
            
            <div className="relative">
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock size={22} className="text-primary-500" />
                </motion.div>
                <h2 className="text-xl font-bold text-neutral-800 tracking-tight">最近诊断</h2>
              </motion.div>
              
              {userData.diagnosisHistory.length > 0 && (
                <div className="space-y-4">
                  {userData.diagnosisHistory.slice(-1).map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-gradient-to-r from-neutral-50 to-transparent border border-neutral-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                            {record.level}
                          </span>
                          <span className="text-sm text-neutral-500">
                            {new Date(record.date).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <Link to={`/diagnosis/report/${record.id}`}>
                          <Button variant="ghost" size="sm" className="text-primary-600">
                            查看详情
                          </Button>
                        </Link>
                      </div>
                      
                      {record.weakPoints.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-neutral-500">薄弱知识点：</span>
                          {record.weakPoints.slice(0, 5).map((kp, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium"
                            >
                              {getKnowledgePointName(kp)}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.section>
      )}
    </motion.div>
  );
};