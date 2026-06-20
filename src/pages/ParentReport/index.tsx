import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Target, BookOpen, Award, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor, getMasteryLevel } from '@/utils/analysis';

export const ParentReport = () => {
  const { userData } = useUserStore();
  
  const stats = {
    totalProblems: userData.completedProblems.length,
    correctProblems: userData.completedProblems.filter(cp => cp.status === 'accepted').length,
    correctRate: userData.completedProblems.length > 0
      ? Math.round((userData.completedProblems.filter(cp => cp.status === 'accepted').length / userData.completedProblems.length) * 100)
      : 0,
    streakDays: userData.statistics.streakDays,
    totalStudyTime: userData.statistics.totalStudyTime,
    mistakeCount: userData.mistakes.length,
  };
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayStr = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    
    const problems = userData.completedProblems.filter(cp => cp.completedAt.startsWith(dateStr));
    
    return { date: dayStr, value: problems.length };
  });
  
  const knowledgeData = userData.learningProgress
    .map(p => ({
      name: getKnowledgePointName(p.knowledgePointId),
      value: p.masteryLevel,
      color: getMasteryColor(p.masteryLevel),
    }))
    .sort((a, b) => a.value - b.value);
  
  const weakPoints = knowledgeData.filter(k => k.value < 60);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">家长报告</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Calendar size={18} />
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 md:p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{stats.totalProblems}</p>
            <p className="text-sm text-gray-500">总完成题目数</p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 md:p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-600 mb-1">{stats.correctRate}%</p>
            <p className="text-sm text-gray-500">正确率</p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 md:p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-accent-600" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-accent-600 mb-1">{stats.streakDays}</p>
            <p className="text-sm text-gray-500">连续学习天数</p>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="p-4 md:p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            近7天学习情况
          </h3>
          <LineChart data={last7Days} yAxisLabel="完成题目数" />
        </Card>
        
        <Card className="p-4 md:p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen size={20} />
            知识点掌握度
          </h3>
          <BarChart data={knowledgeData} yAxisLabel="掌握度 (%)" />
        </Card>
      </div>
      
      {weakPoints.length > 0 && (
        <Card className="p-4 md:p-6 mb-4 md:mb-6 border-l-4 border-red-500">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            需要关注的薄弱知识点
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {weakPoints.map((kp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-red-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{kp.name}</span>
                  <span className="text-sm text-red-600">{kp.value}%</span>
                </div>
                <ProgressBar
                  value={kp.value}
                  color={kp.color}
                />
              </motion.div>
            ))}
          </div>
        </Card>
      )}
      
      <Card className="p-4 md:p-6 mb-4 md:mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">知识点详细进度</h3>
        <div className="space-y-4">
          {knowledgeData.map((kp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: kp.color }}
                />
                <span className="font-medium text-gray-700">{kp.name}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${kp.color}15`, color: kp.color }}
                >
                  {getMasteryLevel(kp.value)}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm text-gray-500 w-12 text-right">{kp.value}%</span>
                <ProgressBar
                  value={kp.value}
                  color={kp.color}
                  className="flex-1 sm:w-40"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
      
      <Card className="p-4 md:p-6">
        <h3 className="font-semibold text-gray-800 mb-4">学习建议</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-800 mb-1">保持学习节奏</p>
            <p className="text-sm text-blue-600">孩子已经连续学习{stats.streakDays}天，继续鼓励保持！</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="font-medium text-green-800 mb-1">正确率情况</p>
            <p className="text-sm text-green-600">当前正确率{stats.correctRate}%，{stats.correctRate >= 80 ? '表现优秀！' : '建议加强练习'}。</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="font-medium text-yellow-800 mb-1">错题复习</p>
            <p className="text-sm text-yellow-600">还有{stats.mistakeCount}道错题待复习，建议定期回顾。</p>
          </div>
        </div>
        
        {weakPoints.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>重点关注：</strong>建议孩子加强以下知识点的学习：
              {weakPoints.map(kp => kp.name).join('、')}
            </p>
          </div>
        )}
      </Card>
      
      <div className="mt-6 md:mt-8 text-center">
        <p className="text-sm text-gray-500">
          报告生成时间：{new Date().toLocaleString('zh-CN')}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          本报告仅供参考，请结合孩子的实际情况进行引导
        </p>
      </div>
    </motion.div>
  );
};
