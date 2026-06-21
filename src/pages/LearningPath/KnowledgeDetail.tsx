import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { getKnowledgePointById } from '@/data/knowledgePoints';
import { getRecommendedProblemsByKnowledgePoint } from '@/data/problemList';
import { useUserStore } from '@/store/useUserStore';
import { getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, Sparkles, Star, Target, Trophy } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const kp = getKnowledgePointById(nodeId || '');
  const recommendedProblems = getRecommendedProblemsByKnowledgePoint(nodeId || '');
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
            <Target className="w-10 h-10 text-neutral-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-neutral-800 mb-3">知识点不存在</h3>
          <p className="text-neutral-500 mb-8">请返回学习路径选择有效的知识点</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/learning-path">
              <Button className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-8 py-3 rounded-xl">
                返回学习路径
              </Button>
            </Link>
          </motion.div>
        </Card>
      </motion.div>
    );
  }
  
  const masteryColor = getMasteryColor(mastery);
  const masteryLevel = getMasteryLevel(mastery);
  
  // 根据平台获取题目链接
  const getProblemLink = (platform: string, problemId: string): string => {
    switch (platform) {
      case '洛谷':
        return `https://www.luogu.com.cn/problem/${problemId}`;
      case '蓝桥杯':
        return `https://www.lanqiao.cn/problems/${problemId}/learning/`;
      case 'LeetCode':
        return `https://leetcode.cn/problems/${problemId}/`;
      case '杭电OJ':
      case '杭电 OJ':
        return `http://acm.hdu.edu.cn/showproblem.php?pid=${problemId}`;
      default:
        return '#';
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 头部导航 */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <motion.button
          onClick={() => navigate('/learning-path')}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors group"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={20} />
          <span className="font-medium group-hover:text-primary-600">返回学习路径</span>
        </motion.button>
        
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-100/50"
          whileHover={{ scale: 1.05 }}
        >
          <Star size={16} className="text-primary-500" />
          <span className="text-sm font-medium text-primary-700">{kp.category}</span>
        </motion.div>
      </motion.div>
      
      {/* 知识点概览 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-xl rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/50 to-indigo-100/30 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-white shadow-lg"
                whileHover={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <BookOpen size={28} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-800 tracking-tight">{kp.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-neutral-500">难度等级：{kp.difficulty}</span>
                  <span className="text-sm text-neutral-400">|</span>
                  <span className="text-sm text-neutral-500">{kp.category}</span>
                </div>
              </div>
            </div>
            
            <p className="text-neutral-600 leading-relaxed mb-6">{kp.description}</p>
            
            {/* 掌握度展示 */}
            <div className="flex items-center gap-6 p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100/50 border border-neutral-100">
              <div className="flex items-center gap-3">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Trophy size={20} className={mastery >= 70 ? 'text-emerald-500' : mastery >= 50 ? 'text-amber-500' : 'text-red-500'} />
                </motion.div>
                <div>
                  <span className="text-xs text-neutral-500">当前掌握度</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg" style={{ color: masteryColor }}>{mastery}%</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      mastery >= 70 ? 'bg-emerald-100 text-emerald-600' : 
                      mastery >= 50 ? 'bg-amber-100 text-amber-600' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {masteryLevel}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 max-w-[200px]">
                <ProgressBar value={mastery} color={masteryColor} className="h-2 rounded-full" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* 推荐题目列表 */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <Sparkles size={20} className="text-violet-500" />
            </motion.div>
            <h3 className="font-bold text-neutral-800">推荐练习题目</h3>
            <span className="text-sm text-neutral-500">基于知识点匹配的题单</span>
          </div>
          
          {recommendedProblems.length > 0 ? (
            <div className="space-y-3">
              {recommendedProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100/30 border border-neutral-100 hover:border-primary-200 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-neutral-800">{problem.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                        {problem.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">{problem.platform}</span>
                      <span className="text-neutral-400">{problem.problemId}</span>
                    </div>
                  </div>
                  
                  <motion.a
                    href={getProblemLink(problem.platform, problem.problemId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-indigo-500 text-white text-sm font-medium hover:from-primary-600 hover:to-indigo-600 transition-all shadow-md"
                  >
                    <ExternalLink size={14} />
                    去做题
                  </motion.a>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen size={24} className="text-neutral-400" />
              </motion.div>
              <p className="text-neutral-500">暂无匹配的题目推荐</p>
              <p className="text-sm text-neutral-400 mt-2">请先完成诊断测试以获取个性化推荐</p>
            </div>
          )}
        </Card>
      </motion.div>
      
      {/* 学习建议 */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-3">
            <Target size={20} className="text-emerald-500" />
            学习建议
          </h3>
          
          <div className="space-y-3">
            {mastery < 50 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100">
                <p className="text-sm text-red-700">
                  <strong>基础薄弱：</strong>建议先学习该知识点的基础概念，理解核心原理后再进行练习。
                </p>
              </div>
            )}
            {mastery >= 50 && mastery < 70 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                <p className="text-sm text-amber-700">
                  <strong>需要巩固：</strong>建议多做练习题，通过实践加深对该知识点的理解。
                </p>
              </div>
            )}
            {mastery >= 70 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                <p className="text-sm text-emerald-700">
                  <strong>掌握良好：</strong>可以尝试挑战更高难度的题目，进一步提升能力。
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
      
      {/* 返回按钮 */}
      <motion.div variants={itemVariants} className="flex justify-center pt-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => navigate('/learning-path')}
            className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-xl px-10 py-4 rounded-xl font-semibold"
          >
            <ArrowLeft size={20} className="mr-3" />
            返回学习路径
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};