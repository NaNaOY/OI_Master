import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { getKnowledgePointById } from '@/data/knowledgePoints';
import { getProblemsByKnowledgePoint } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getDifficultyColor, getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, ClipboardList, Code, FileText, Sparkles, Star, Video } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

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

export const KnowledgeDetail = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const { userData } = useUserStore();
  
  const kp = getKnowledgePointById(nodeId || '');
  const problems = getProblemsByKnowledgePoint(nodeId || '');
  const progress = userData.learningProgress.find(p => p.knowledgePointId === nodeId);
  
  const mastery = progress?.masteryLevel || 0;
  
  if (!kp) {
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
          <h3 className="text-xl font-bold text-neutral-800 mb-3">知识点不存在</h3>
          <p className="text-neutral-500 mb-8">请返回学习路径选择正确的知识点</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/learning-path">
              <Button className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-8 py-3 rounded-xl">
                <ArrowRight size={18} className="mr-2" />
                返回学习路径
              </Button>
            </Link>
          </motion.div>
        </Card>
      </motion.div>
    );
  }
  
  const resourceTypeIcons = {
    video: <Video size={18} />,
    article: <FileText size={18} />,
    practice: <ClipboardList size={18} />,
  };
  
  const resourceTypeLabels = {
    video: '视频',
    article: '文章',
    practice: '练习',
  };
  
  const resourceTypeColors = {
    video: 'from-red-500 to-rose-600',
    article: 'from-blue-500 to-indigo-600',
    practice: 'from-emerald-500 to-green-600',
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* 头部区域 */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <motion.div 
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star size={20} className="text-amber-500" />
            </motion.div>
            <Link to="/learning-path" className="text-neutral-500 hover:text-neutral-700 font-medium transition-colors">
              ← 返回学习路径
            </Link>
          </motion.div>
          <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">{kp.name}</h1>
          <p className="text-neutral-500 mt-2 font-medium">{kp.category}</p>
        </div>
        
        <motion.div 
          className="text-right"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-sm text-neutral-500 mb-2 font-medium">掌握度</p>
          <motion.p 
            className="text-4xl font-bold tabular-nums"
            style={{ color: getMasteryColor(mastery) }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {mastery}%
          </motion.p>
          <motion.span 
            className="inline-block mt-2 text-sm px-4 py-1.5 rounded-full font-medium"
            style={{
              backgroundColor: `${getMasteryColor(mastery)}15`,
              color: getMasteryColor(mastery),
            }}
            whileHover={{ scale: 1.1 }}
          >
            {getMasteryLevel(mastery)}
          </motion.span>
        </motion.div>
      </motion.div>
      
      {/* 知识点介绍 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-2xl opacity-50" />
          
          <motion.h3 
            className="font-bold text-neutral-800 mb-5 flex items-center gap-3 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen size={22} className="text-blue-500" />
            </motion.div>
            知识点介绍
          </motion.h3>
          
          <p className="text-neutral-600 leading-relaxed text-base">{kp.description}</p>
          
          {kp.prerequisites.length > 0 && (
            <motion.div 
              className="mt-6 pt-6 border-t border-neutral-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-neutral-500 mb-3 font-medium">前置知识：</p>
              <div className="flex flex-wrap gap-3">
                {kp.prerequisites.map(prereq => {
                  const prereqKp = getKnowledgePointById(prereq);
                  return (
                    <motion.span
                      key={prereq}
                      className="px-4 py-2 bg-gradient-to-r from-neutral-50 to-neutral-100 text-neutral-600 rounded-xl text-sm font-medium border border-neutral-100"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {prereqKp?.name || prereq}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
      
      {/* 学习资源 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-emerald-100/50 to-transparent rounded-full blur-2xl opacity-50" />
          
          <motion.h3 
            className="font-bold text-neutral-800 mb-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            学习资源
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-3 gap-5"
            variants={containerVariants}
          >
            {kp.learningResources.map((resource) => (
              <motion.div
                key={resource.title}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-5 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div 
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${resourceTypeColors[resource.type]} flex items-center justify-center text-white shadow-md`}
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                  >
                    {resourceTypeIcons[resource.type]}
                  </motion.div>
                  <motion.span 
                    className="text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 font-medium"
                    whileHover={{ scale: 1.1 }}
                  >
                    {resourceTypeLabels[resource.type]}
                  </motion.span>
                </div>
                <p className="font-semibold text-neutral-700 text-sm group-hover:text-primary-600 transition-colors">{resource.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>
      
      {/* 相关题目 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-100/50 to-transparent rounded-full blur-2xl opacity-50" />
          
          <div className="flex items-center justify-between mb-6">
            <motion.h3 
              className="font-bold text-neutral-800 flex items-center gap-3 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Code size={22} className="text-violet-500" />
              </motion.div>
              相关题目
            </motion.h3>
            <motion.span 
              className="text-sm text-neutral-500 font-medium px-4 py-1.5 rounded-full bg-neutral-100"
              whileHover={{ scale: 1.1 }}
            >
              {problems.length} 道
            </motion.span>
          </div>
          
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
          >
            {problems.map((problem) => {
              const completedRecord = userData.completedProblems.find(cp => cp.problemId === problem.id);
              const isCompleted = completedRecord?.status === 'accepted';
              
              const difficultyConfig = {
                easy: { label: '简单', gradient: 'from-emerald-500 to-green-600', bg: 'bg-gradient-to-br from-emerald-50 to-green-50' },
                medium: { label: '中等', gradient: 'from-amber-500 to-orange-600', bg: 'bg-gradient-to-br from-amber-50 to-orange-50' },
                hard: { label: '困难', gradient: 'from-red-500 to-rose-600', bg: 'bg-gradient-to-br from-red-50 to-rose-50' },
              };
              
              const config = difficultyConfig[problem.difficulty];
              
              return (
                <motion.div
                  key={problem.id}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  className={`flex items-center justify-between p-5 rounded-2xl transition-all group ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100/50' 
                      : 'bg-gradient-to-r from-neutral-50 to-transparent border border-neutral-100/50 hover:border-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <motion.div 
                      className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center text-sm font-bold shadow-md`}
                      style={{ color: getDifficultyColor(problem.difficulty) }}
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    >
                      {config.label}
                    </motion.div>
                    <div>
                      <p className="font-semibold text-neutral-800 flex items-center gap-2 text-base">
                        {problem.title}
                        {isCompleted && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <CheckCircle size={18} className="text-emerald-500" />
                          </motion.div>
                        )}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">{problem.hints[0]}</p>
                    </div>
                  </div>
                  
                  {isCompleted ? (
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Link to={`/daily/problem/${problem.id}`} className="text-sm text-emerald-600 font-semibold hover:underline">
                        已完成 ✓
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to={`/daily/problem/${problem.id}`}>
                        <Button variant="outline" size="sm" className="border-neutral-200 hover:border-primary-300 px-5 py-2 rounded-xl">
                          开始练习
                          <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight size={16} className="ml-1" />
                          </motion.div>
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </Card>
      </motion.div>
      
      {/* 学习进度 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-primary-100/50 to-transparent rounded-full blur-2xl opacity-50" />
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.p 
                className="text-sm text-neutral-500 mb-3 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                学习进度
              </motion.p>
              <ProgressBar
                value={mastery}
                color={getMasteryColor(mastery)}
                height={14}
                className="w-72 rounded-full"
              />
              <motion.p 
                className="mt-3 text-lg font-bold tabular-nums"
                style={{ color: getMasteryColor(mastery) }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {mastery}% · {getMasteryLevel(mastery)}
              </motion.p>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/daily">
                <Button className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-6 py-3 rounded-xl font-semibold">
                  <Sparkles size={18} className="mr-2" />
                  继续练习
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};