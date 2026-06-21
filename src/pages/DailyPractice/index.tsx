import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { getRecommendedProblemsByWeakPoints } from '@/data/problemList';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Calendar, Check, Clock, ExternalLink, Sparkles, Star, Target, Trophy, Zap } from 'lucide-react';
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
  const { userData, markProblemCompleted } = useUserStore();
  const navigate = useNavigate();
  
  const latestDiagnosis = userData.diagnosisHistory.length > 0 
    ? userData.diagnosisHistory[userData.diagnosisHistory.length - 1]
    : null;
  
  // 获取今天的日期
  const todayStr = new Date().toISOString().split('T')[0];
  
  // 从 localStorage 读取今日固定的推荐题目
  const getTodayRecommended = (): { date: string; problemIds: string[] } => {
    try {
      const stored = localStorage.getItem('dailyRecommended');
      if (stored) {
        const data = JSON.parse(stored);
        return data;
      }
    } catch (e) {
      // ignore
    }
    return { date: '', problemIds: [] };
  };
  
  // 保存今日推荐（固定3道）
  const saveTodayRecommended = (problemIds: string[]) => {
    try {
      localStorage.setItem('dailyRecommended', JSON.stringify({
        date: todayStr,
        problemIds,
      }));
    } catch (e) {
      // ignore
    }
  };
  
  const todayData = getTodayRecommended();
  const completedProblemIds = userData.completedProblems.map(p => p.problemId);
  
  // 获取薄弱知识点列表
  const weakPointsList = latestDiagnosis 
    ? latestDiagnosis.weakPoints.map(kpId => ({ knowledgePointId: kpId }))
    : [];
  
  // 获取所有推荐题目
  const allRecommendedProblems = latestDiagnosis
    ? getRecommendedProblemsByWeakPoints(latestDiagnosis.weakPoints)
    : [];
  
  // 判断是否需要生成新的今日推荐
  let recommendedProblems: typeof allRecommendedProblems = [];
  
  if (todayData.date === todayStr && todayData.problemIds.length > 0) {
    // 今天已有推荐，直接使用（固定不变）
    recommendedProblems = allRecommendedProblems.filter(p => todayData.problemIds.includes(p.id));
  } else if (latestDiagnosis) {
    // 今天没有推荐，生成新的固定3道题目
    // 过滤掉已完成的题目
    const undoneProblems = allRecommendedProblems.filter(p => !completedProblemIds.includes(p.id));
    recommendedProblems = undoneProblems.slice(0, 3);
    
    // 保存到 localStorage
    if (recommendedProblems.length > 0) {
      saveTodayRecommended(recommendedProblems.map(p => p.id));
    }
  }
  
  const handleMarkDone = (problemId: string) => {
    markProblemCompleted(problemId);
  };
  
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
                <span className="block text-2xl font-bold text-violet-600">{weakPointsList.length}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* 薄弱知识点提示 */}
      {weakPointsList.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 border border-amber-100/50 shadow-lg rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3 mb-4">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Zap size={20} className="text-amber-500" />
              </motion.div>
              <h3 className="font-bold text-amber-800">需要加强的知识点</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {weakPointsList.map((p, index) => (
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
              {recommendedProblems.map((problem, index) => {
                const isCompleted = completedProblemIds.includes(problem.id);
                return (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' 
                        : 'bg-gradient-to-r from-neutral-50 to-neutral-100/30 border-neutral-100 hover:border-primary-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600' 
                        : 'bg-gradient-to-br from-primary-100 to-indigo-100 text-primary-600'
                    }`}>
                      {isCompleted ? <Check size={18} /> : index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${isCompleted ? 'text-emerald-700' : 'text-neutral-800'}`}>{problem.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {problem.category}
                        </span>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-200 text-emerald-700">
                            已完成
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">{problem.platform}</span>
                        <span className="text-neutral-400">{problem.problemId}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!isCompleted && (
                        <motion.button
                          onClick={() => handleMarkDone(problem.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-300 text-emerald-600 text-sm font-medium hover:bg-emerald-50 transition-all"
                          title="标记为已做"
                        >
                          <Check size={14} />
                          已做
                        </motion.button>
                      )}
                      
                      <motion.a
                        href={getProblemLink(problem.platform, problem.problemId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md ${
                          isCompleted 
                            ? 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300' 
                            : 'bg-gradient-to-r from-primary-500 to-indigo-500 text-white hover:from-primary-600 hover:to-indigo-600'
                        }`}
                      >
                        <ExternalLink size={14} />
                        {isCompleted ? '再练一次' : '去做题'}
                      </motion.a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : latestDiagnosis ? (
            <div className="text-center py-12">
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Check size={24} className="text-emerald-500" />
              </motion.div>
              <p className="text-emerald-600 font-medium mb-2">今日推荐题目已全部完成</p>
              <p className="text-sm text-neutral-400">太棒了！明天将为你推荐新的题目</p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                <Link to="/diagnosis">
                  <Button className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-6 py-3 rounded-xl">
                    <ArrowRight size={18} className="mr-2" />
                    查看诊断报告
                  </Button>
                </Link>
              </motion.div>
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