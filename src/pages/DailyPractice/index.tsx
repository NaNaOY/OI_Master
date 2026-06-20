import { motion } from 'framer-motion';
import { Calendar, Target, Clock, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/store/useUserStore';
import { getDifficultyColor, getKnowledgePointName } from '@/utils/analysis';
import { problems } from '@/data/problems';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">每日推荐</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Calendar size={18} />
            {today}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{completedToday.length}</p>
            <p className="text-xs text-gray-500">已完成</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{correctToday}</p>
            <p className="text-xs text-gray-500">正确</p>
          </div>
        </div>
      </div>
      
      <Card className="p-4 md:p-6 mb-4 md:mb-6 bg-gradient-to-r from-primary-600 to-accent-500 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-yellow-300" />
              <span className="font-medium">今日学习目标</span>
            </div>
            <p className="text-white/80">完成{dailyProblems.length}道推荐题目，巩固薄弱知识点</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{completedToday.length}/{dailyProblems.length}</p>
            <p className="text-sm text-white/60">进度</p>
          </div>
        </div>
      </Card>
      
      {allCompleted ? (
        <Card className="p-6 md:p-8 text-center">
          <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">今日任务已完成！</h3>
          <p className="text-gray-500 mb-4">您已经完成了所有推荐题目，明天再来吧！</p>
          <Link to="/mistakes">
            <Button variant="outline">复习错题</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyProblems.map((problem, index) => {
            const completed = isProblemCompleted(problem.id);
            const completedRecord = completedToday.find(cp => cp.problemId === problem.id);
            const isCorrect = completedRecord?.status === 'accepted';
            
            return (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className={`p-4 md:p-5 cursor-pointer ${completed ? 'bg-green-50 border-green-200' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between mb-3 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{problem.title}</h3>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: `${getDifficultyColor(problem.difficulty)}15`, color: getDifficultyColor(problem.difficulty) }}
                      >
                        {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                      {completed && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {isCorrect ? '已完成 ✓' : '需重做'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {problem.timeLimit / 1000}秒
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{problem.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.knowledgePoints.map(kpId => (
                      <span
                        key={kpId}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {getKnowledgePointName(kpId)}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      预计 {Math.ceil(problem.difficulty === 'easy' ? 5 : problem.difficulty === 'medium' ? 15 : 30)} 分钟
                    </div>
                    {completed ? (
                      <span className="text-sm text-green-600 font-medium">
                        {isCorrect ? '已完成' : '点击重做'}
                      </span>
                    ) : (
                      <Link to={`/daily/problem/${problem.id}`}>
                        <Button variant="outline" size="sm">
                          开始练习
                          <ArrowRight size={16} className="ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {dailyProblems.length === 0 && !allCompleted && (
        <Card className="p-6 md:p-8 text-center">
          <Target size={48} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无推荐题目</h3>
          <p className="text-gray-500 mb-4">请先完成诊断测试，获取个性化推荐</p>
          <Link to="/diagnosis">
            <Button>开始诊断</Button>
          </Link>
        </Card>
      )}
      
      <Card className="p-4 md:p-6 mt-4 md:mt-6">
        <h3 className="font-semibold text-gray-800 mb-4">学习小贴士</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-800 mb-1">先看题再思考</p>
            <p className="text-sm text-blue-600">仔细阅读题目描述，理解问题后再动手</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="font-medium text-green-800 mb-1">测试样例</p>
            <p className="text-sm text-green-600">先通过样例测试，再提交代码</p>
          </div>
          <div className="p-4 bg-accent-50 rounded-lg">
            <p className="font-medium text-accent-800 mb-1">遇到难题</p>
            <p className="text-sm text-accent-600">不要轻易放弃，尝试不同的思路</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};