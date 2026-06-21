import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { getRecommendedProblemsByWeakPoints } from '@/data/problemList';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Calendar, Clock, ExternalLink, Sparkles, Star, Target, Trophy, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
  }
};

export const DailyPractice = () => {
  const { userData } = useUserStore();
  const navigate = useNavigate();
  
  // 获取薄弱知识点
  const weakPoints = userData.learningProgress
    .filter(p => p.masteryLevel < 70)
    .sort((a, b) => a.masteryLevel - b.masteryLevel)
    .slice(0, 5);
  
  // 获取推荐的题目
  const recommendedProblems = getRecommendedProblemsByWeakPoints(
    weakPoints.map(p => p.knowledgePointId)
  );
  
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
  
  // 统计数据
  const streakDays = userData.statistics.streakDays;
  const diagnosisCount = userData.diagnosisHistory.length;
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 头部横幅 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-xl rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/50 to-teal-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-100/50 to-indigo-100/30 rounded-full blur-3xl" />
          
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Star size={20} className="text-emerald-500" />
                </motion.div>
                <span className="text-sm text-neutral-500 font-medium">每日推荐</span>
              </div>
              <h1 className="text-3xl font-bold text-neutral-800 tracking-tight mb-2">AI 智能题目推荐</h1>
              <p className="text-neutral-600">根据诊断结果，智能匹配最适合你的练习题目</p>
            </div>
            
            <motion.div 
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Calendar size={36} />
            </motion.div>
          </div>
        </Card>
      </motion.div>
      
      {/* 学习进度统计 */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Target size={24} className="text-emerald-600" />
              </motion.div>
              <div>
                <span className="text-xs text-neutral-500">诊断次数</span>
                <span className="block text-2xl font-bold text-emerald-600">{diagnosisCount}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Clock size={24} className="text-blue-600" />
              </motion.div>
              <div>
                <span className="text-xs text-neutral-500">连续学习</span>
                <span className="block text-2xl font-bold text-blue-600">{streakDays}天</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Trophy size={24} className="text-violet-600" />
              </motion.div>
              <div>
                <span className="text-xs text-neutral-500">薄弱知识点</span>
                <span className="block text-2xl font-bold text-violet-600">{weakPoints.length}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* 薄弱知识点提示 */}
      {weakPoints.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 border border-amber-100/50 shadow-lg rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3 mb-4">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Zap size={20} className="text-amber-500" />
              </motion.div>
              <h3 className="font-bold text-amber-800">需要加强的知识点</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {weakPoints.map((p, index) => (
                <motion.div
                  key={p.knowledgePointId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-xl bg-white/80 border border-amber-200 text-amber-700 text-sm font-medium cursor-pointer"
                  onClick={() => navigate(`/learning-path/kp/${p.knowledgePointId}`)}
                >
                  {getKnowledgePointName(p.knowledgePointId)}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* 推荐题目列表 */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <Sparkles size={20} className="text-violet-500" />
            </motion.div>
            <h3 className="font-bold text-neutral-800">推荐练习题目</h3>
            <span className="text-sm text-neutral-500">基于薄弱知识点匹配</span>
          </div>
          
          {recommendedProblems.length > 0 ? (
            <div className="space-y-3">
              {recommendedProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
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
              <p className="text-neutral-500 mb-2">暂无推荐的题目</p>
              <p className="text-sm text-neutral-400">请先完成诊断测试以获取个性化推荐</p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                <Link to="/diagnosis">
                  <Button className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-6 py-3 rounded-xl">
                    <ArrowRight size={18} className="mr-2" />
                    开始诊断
                  </Button>
                </Link>
              </motion.div>
            </div>
          )}
        </Card>
      </motion.div>
      
      {/* 学习提示 */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen size={24} />
            </motion.div>
            <div>
              <h4 className="font-bold text-blue-800 mb-1">学习提示</h4>
              <p className="text-sm text-blue-600">
                点击"去做题"按钮将跳转到对应平台的题目页面。建议每天至少完成 3-5 道题目，保持学习节奏。
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};