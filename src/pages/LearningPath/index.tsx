import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { getKnowledgePointById } from '@/data/knowledgePoints';
import { getLearningPathByLevel } from '@/data/learningPath';
import { getProblemsByKnowledgePoint } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Lock, Sparkles, Star, Target, Zap } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

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

const difficultyConfig = {
  1: { label: '入门', gradient: 'from-emerald-500 to-green-600', bg: 'bg-gradient-to-br from-emerald-50 to-green-50', border: 'border-emerald-200', accent: 'text-emerald-500' },
  2: { label: '基础', gradient: 'from-blue-500 to-indigo-600', bg: 'bg-gradient-to-br from-blue-50 to-indigo-50', border: 'border-blue-200', accent: 'text-blue-500' },
  3: { label: '进阶', gradient: 'from-violet-500 to-purple-600', bg: 'bg-gradient-to-br from-violet-50 to-purple-50', border: 'border-violet-200', accent: 'text-violet-500' },
  4: { label: '提高', gradient: 'from-amber-500 to-orange-600', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', border: 'border-amber-200', accent: 'text-amber-500' },
  5: { label: '困难', gradient: 'from-red-500 to-rose-600', bg: 'bg-gradient-to-br from-red-50 to-rose-50', border: 'border-red-200', accent: 'text-red-500' },
  6: { label: '挑战', gradient: 'from-pink-500 to-fuchsia-600', bg: 'bg-gradient-to-br from-pink-50 to-fuchsia-50', border: 'border-pink-200', accent: 'text-pink-500' },
};

export const LearningPath = () => {
  const { level } = useParams<{ level: 'CSP-J' | 'CSP-S' }>();
  const { userData } = useUserStore();
  const pathLevel = level || (userData.diagnosisHistory.length > 0 
    ? userData.diagnosisHistory[userData.diagnosisHistory.length - 1].level 
    : 'CSP-J');
  
  const learningPath = getLearningPathByLevel(pathLevel);
  
  const getProgress = (kpId: string) => {
    return userData.learningProgress.find(p => p.knowledgePointId === kpId);
  };
  
  const isUnlocked = (nodeIndex: number, prerequisites: string[]) => {
    if (prerequisites.length === 0) return true;
    
    const hasDiagnosis = userData.diagnosisHistory.length > 0;
    
    if (hasDiagnosis) {
      const latestDiagnosis = userData.diagnosisHistory[userData.diagnosisHistory.length - 1];
      const diagnosisScore = latestDiagnosis.scores[learningPath?.nodes[nodeIndex].knowledgePointId || ''];
      
      if (diagnosisScore !== undefined) {
        return true;
      }
    }
    
    return prerequisites.every(p => {
      const progress = getProgress(p);
      return progress && (progress.completedProblems > 0 || (progress.masteryLevel >= 60));
    });
  };
  
  if (!learningPath) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <Card className="p-12 text-center max-w-md border border-neutral-100/50 shadow-xl rounded-3xl">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mx-auto mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BookOpen className="w-10 h-10 text-neutral-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-neutral-800 mb-3">学习路径加载失败</h3>
          <p className="text-neutral-500 mb-8">请返回首页重新选择</p>
        </Card>
      </motion.div>
    );
  }
  
  const isCSPJ = pathLevel === 'CSP-J';
  const primaryGradient = isCSPJ ? 'from-blue-500 via-indigo-500 to-violet-600' : 'from-purple-500 via-pink-500 to-rose-600';
  const primaryAccent = isCSPJ ? 'text-blue-500' : 'text-purple-500';
  
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
          <div className={`absolute inset-0 bg-gradient-to-br ${primaryGradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* 动态光效 */}
          <motion.div 
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"
            variants={floatVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/20 rounded-full blur-2xl"
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
                  <BookOpen className="text-yellow-300" size={28} />
                </motion.div>
                <span className="text-white/80 text-sm font-medium tracking-wide">
                  {isCSPJ ? 'CSP-J 入门组' : 'CSP-S 提高组'}
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {learningPath.name}
              </motion.h1>
              
              <motion.p 
                className="text-white/90 text-lg mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                共 {learningPath.nodes.length} 个知识点 · 系统化学习路径
              </motion.p>
              
              {/* 级别切换按钮 */}
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {pathLevel === 'CSP-J' ? (
                  <motion.div 
                    className="px-6 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    CSP-J
                  </motion.div>
                ) : (
                  <Link to="/learning-path/level/CSP-J">
                    <motion.div 
                      className="px-6 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white/80 font-medium hover:bg-white/20 transition-all"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      CSP-J
                    </motion.div>
                  </Link>
                )}
                {pathLevel === 'CSP-S' ? (
                  <motion.div 
                    className="px-6 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    CSP-S
                  </motion.div>
                ) : (
                  <Link to="/learning-path/level/CSP-S">
                    <motion.div 
                      className="px-6 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white/80 font-medium hover:bg-white/20 transition-all"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      CSP-S
                    </motion.div>
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* 学习路径节点 */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        variants={containerVariants}
      >
        {learningPath.nodes.map((node, index) => {
          const kp = getKnowledgePointById(node.knowledgePointId);
          const progress = getProgress(node.knowledgePointId);
          const unlocked = isUnlocked(index, node.prerequisites);
          const mastery = progress?.masteryLevel || 0;
          const completed = progress?.completedProblems || 0;
          const totalProblems = getProblemsByKnowledgePoint(node.knowledgePointId).length;
          const diff = difficultyConfig[kp?.difficulty as keyof typeof difficultyConfig] || difficultyConfig[1];
          const isCompleted = mastery >= 90;
          
          return (
            <motion.div
              key={node.id}
              variants={itemVariants}
              whileHover={unlocked ? { y: -10, scale: 1.02 } : {}}
              transition={{ duration: 0.3 }}
            >
              <Card 
                hover={unlocked}
                className={`p-6 h-full transition-all duration-300 overflow-hidden group relative ${
                  !unlocked ? 'opacity-50' : ''
                } ${isCompleted ? 'ring-2 ring-emerald-400 ring-offset-2' : ''} shadow-lg rounded-2xl border border-neutral-100/50`}
              >
                {/* 动态背景渐变 */}
                {unlocked && (
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${diff.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                )}
                
                {/* 顶部装饰线 */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${diff.gradient}`} />
                
                {/* 背景装饰 */}
                {unlocked && (
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${diff.bg} rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                )}
                
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* 头部 */}
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div 
                        className={`w-10 h-10 rounded-xl ${diff.bg} border ${diff.border} flex items-center justify-center shadow-md`}
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                      >
                        <motion.span 
                          className="text-xs font-bold"
                          style={{ color: diff.gradient.includes('emerald') ? '#10b981' : diff.gradient.includes('blue') ? '#3b82f6' : diff.gradient.includes('violet') ? '#8b5cf6' : diff.gradient.includes('amber') ? '#f59e0b' : diff.gradient.includes('red') ? '#ef4444' : '#ec4899' }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {index + 1}
                        </motion.span>
                      </motion.div>
                      <motion.span 
                        className={`text-xs px-3 py-1 rounded-full ${diff.bg} font-medium`}
                        style={{ color: diff.gradient.includes('emerald') ? '#10b981' : diff.gradient.includes('blue') ? '#3b82f6' : diff.gradient.includes('violet') ? '#8b5cf6' : diff.gradient.includes('amber') ? '#f59e0b' : diff.gradient.includes('red') ? '#ef4444' : '#ec4899' }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {diff.label}
                      </motion.span>
                      <AnimatePresence>
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-1"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <CheckCircle size={16} className="text-emerald-500" />
                            </motion.div>
                            <span className="text-xs text-emerald-600 font-medium">已掌握</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* 知识点名称 */}
                    <motion.h3 
                      className="font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {kp?.name}
                    </motion.h3>
                    
                    {/* 描述 */}
                    <motion.p 
                      className="text-sm text-neutral-500 mb-4 line-clamp-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {kp?.description}
                    </motion.p>
                    
                    {unlocked ? (
                      <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-500 font-medium">掌握度</span>
                          <motion.span 
                            className="font-bold"
                            style={{ color: getMasteryColor(mastery) }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {mastery}%
                          </motion.span>
                        </div>
                        <ProgressBar
                          value={mastery}
                          color={getMasteryColor(mastery)}
                          height={6}
                          className="rounded-full"
                        />
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span className="font-medium">进度 {completed}/{totalProblems} 题</span>
                          <motion.span 
                            className="px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: `${getMasteryColor(mastery)}20`,
                              color: getMasteryColor(mastery),
                            }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {getMasteryLevel(mastery)}
                          </motion.span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="flex items-center gap-3 text-sm text-neutral-400 bg-neutral-50 p-3 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Lock size={16} />
                        </motion.div>
                        <span className="font-medium">需先掌握：{node.prerequisites.map(p => getKnowledgePointName(p)).join('、')}</span>
                      </motion.div>
                    )}
                  </div>
                  
                  {unlocked && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Link to={`/learning-path/kp/${node.knowledgePointId}`}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="shrink-0 px-4 py-2 rounded-xl font-medium"
                        >
                          {isCompleted ? (
                            <motion.div
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ArrowRight size={18} />
                            </motion.div>
                          ) : (
                            <>
                              <BookOpen size={16} className="mr-1" />
                              学习
                            </>
                          )}
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* 学习建议 */}
      <motion.div variants={itemVariants}>
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
              <Target size={24} className={primaryAccent} />
            </motion.div>
            <h3 className="font-bold text-neutral-800 text-lg">学习建议</h3>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            variants={containerVariants}
          >
            {[
              { title: '循序渐进', desc: '按照路径顺序学习，确保每个知识点扎实掌握后再进入下一个', icon: <Zap size={24} />, color: 'from-blue-500 via-indigo-500 to-violet-500' },
              { title: '精做题量', desc: '每个知识点完成足够练习题，理论与实践相结合', icon: <Target size={24} />, color: 'from-green-500 via-emerald-500 to-teal-500' },
              { title: '定期复习', desc: '针对薄弱环节加强练习，形成知识网络', icon: <Sparkles size={24} />, color: 'from-amber-500 via-orange-500 to-yellow-500' },
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