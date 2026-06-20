import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useDiagnosisStore } from '@/store/useDiagnosisStore';
import { useUserStore } from '@/store/useUserStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BookOpen, ChevronRight, Clock, FileText, Sparkles, Star, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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

const levelConfig = {
  'CSP-J': {
    gradient: 'from-blue-500 via-indigo-500 to-violet-600',
    bgGradient: 'from-blue-50 via-indigo-50 to-violet-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '适合初中及以下学生',
    features: ['基础语法与数据结构', '简单算法（排序、查找）', '基础数学知识'],
    duration: '30分钟',
    questions: '10题',
    accentColor: 'text-blue-500',
    ringColor: 'ring-blue-200',
  },
  'CSP-S': {
    gradient: 'from-purple-500 via-pink-500 to-rose-600',
    bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: '适合高中及以上学生',
    features: ['高级数据结构（树、图）', '动态规划与图论算法', '复杂数学与数论'],
    duration: '45分钟',
    questions: '14题',
    accentColor: 'text-purple-500',
    ringColor: 'ring-purple-200',
  }
};

export const Diagnosis = () => {
  const { startDiagnosis } = useDiagnosisStore();
  const { userData } = useUserStore();
  const navigate = useNavigate();
  
  const handleStartDiagnosis = (level: 'CSP-J' | 'CSP-S') => {
    startDiagnosis(level);
    navigate(`/diagnosis/test/${level}`);
  };
  
  const hasDiagnosisHistory = userData.diagnosisHistory.length > 0;
  
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
                  <Target className="text-yellow-300" size={28} />
                </motion.div>
                <span className="text-white/80 text-sm font-medium tracking-wide">诊断中心</span>
              </motion.div>
              
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                评估您的信奥赛水平
              </motion.h1>
              
              <motion.p 
                className="text-white/90 text-lg mb-8 max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                通过专业诊断测试，精准评估您的知识掌握情况，为您定制个性化学习路径
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* 诊断卡片 */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        {(['CSP-J', 'CSP-S'] as const).map((level) => {
          const config = levelConfig[level];
          
          return (
            <motion.div
              key={level}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`p-8 border-2 ${config.borderColor} overflow-hidden group relative shadow-xl rounded-2xl`}>
                {/* 动态背景渐变 */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                {/* 顶部装饰线 */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.gradient}`} />
                
                {/* 背景装饰 */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${config.bgGradient} rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                
                <div className="relative">
                  {/* 头部 */}
                  <div className="flex items-center gap-5 mb-6">
                    <motion.div 
                      className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-xl`}
                      whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                      style={{ width: '72px', height: '72px' }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-white font-bold text-3xl">{level === 'CSP-J' ? 'J' : 'S'}</span>
                      </motion.div>
                    </motion.div>
                    <div>
                      <motion.h3 
                        className="text-xl font-bold text-neutral-800 group-hover:text-primary-600 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        {level} {level === 'CSP-J' ? '入门组' : '提高组'}
                      </motion.h3>
                      <motion.p 
                        className="text-neutral-500 text-sm mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {config.description}
                      </motion.p>
                    </div>
                  </div>
                  
                  {/* 特性列表 */}
                  <motion.div 
                    className="space-y-3 mb-8"
                    variants={containerVariants}
                  >
                    {config.features.map((feature, i) => (
                      <motion.div 
                        key={i}
                        variants={itemVariants}
                        className="flex items-center gap-3 text-sm text-neutral-600 group-hover:text-neutral-700 transition-colors"
                      >
                        <motion.div 
                          className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${config.gradient}`}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        />
                        <span className="font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {/* 信息与按钮 */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-neutral-100 group-hover:border-neutral-200 transition-colors">
                    <div className="flex gap-6">
                      <motion.div 
                        className="flex items-center gap-2 text-sm text-neutral-500"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Clock size={16} className={config.accentColor} />
                        </motion.div>
                        <span className="font-medium">{config.duration}</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-2 text-sm text-neutral-500"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FileText size={16} className={config.accentColor} />
                        </motion.div>
                        <span className="font-medium">{config.questions}</span>
                      </motion.div>
                    </div>
                    <motion.div whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => handleStartDiagnosis(level)}
                        className={`bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white shadow-lg px-8 py-3 rounded-xl font-semibold`}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Zap size={18} className="mr-2" />
                        </motion.div>
                        开始测试
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ChevronRight size={18} className="ml-2" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* 历史记录 */}
      <AnimatePresence>
        {hasDiagnosisHistory && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 border-2 border-green-200 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 overflow-hidden relative shadow-lg rounded-2xl">
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-100/50 to-transparent rounded-full blur-2xl opacity-50" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <motion.div 
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Award className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="font-semibold text-neutral-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      诊断报告
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-neutral-500 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      上次诊断：{new Date(userData.diagnosisHistory[userData.diagnosisHistory.length - 1].date).toLocaleDateString('zh-CN')}
                    </motion.p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.08, x: 3 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/diagnosis/report/latest')} 
                    className="border-green-300 text-green-700 hover:bg-green-100 px-6 py-3 rounded-xl font-semibold"
                  >
                    查看报告
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight size={18} className="ml-2" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 诊断说明 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full blur-2xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-blue-100/30 to-transparent rounded-full blur-2xl opacity-50" />
          
          <motion.div 
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={24} className="text-amber-500" />
            </motion.div>
            <h3 className="font-bold text-neutral-800 text-lg">诊断说明</h3>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {[
              { step: 1, title: '选择级别', desc: '根据当前水平选择合适的测试级别', icon: <Target size={28} />, color: 'from-blue-500 via-indigo-500 to-violet-500' },
              { step: 2, title: '完成测试', desc: '认真作答，系统将评估您的掌握情况', icon: <BookOpen size={28} />, color: 'from-green-500 via-emerald-500 to-teal-500' },
              { step: 3, title: '获取报告', desc: '查看诊断报告和个性化学习建议', icon: <Award size={28} />, color: 'from-amber-500 via-orange-500 to-yellow-500' },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-neutral-50 to-white border border-neutral-100 group hover:border-neutral-200 transition-all"
              >
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-xl`}
                  whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                  style={{ color: 'white' }}
                >
                  {item.icon}
                </motion.div>
                <motion.div 
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 text-white font-bold shadow-md`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {item.step}
                </motion.div>
                <p className="font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">{item.title}</p>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  );
};