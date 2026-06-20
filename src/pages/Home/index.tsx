import { motion } from 'framer-motion';
import { BarChart3, BookOpen, ClipboardList, Trophy, TrendingUp, Target, Clock, Award } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryLevel, getMasteryColor } from '@/utils/analysis';
import { Link, useNavigate } from 'react-router-dom';

const statCards = [
  { icon: <Target size={24} />, label: '已完成题目', color: '#3b82f6' },
  { icon: <TrendingUp size={24} />, label: '正确率', color: '#10b981' },
  { icon: <Clock size={24} />, label: '学习天数', color: '#f59e0b' },
  { icon: <Award size={24} />, label: '连续学习', color: '#8b5cf6' },
];

const quickActions = [
  { id: 'diagnosis', icon: <BarChart3 size={28} />, title: '开始诊断', description: '评估当前水平', path: '/diagnosis' },
  { id: 'daily', icon: <ClipboardList size={28} />, title: '今日推荐', description: '个性化练习', path: '/daily' },
  { id: 'mistakes', icon: <Trophy size={28} />, title: '错题复习', description: '巩固薄弱项', path: '/mistakes' },
  { id: 'learning-path', icon: <BookOpen size={28} />, title: '学习路径', description: '规划学习路线', path: '/learning-path' },
];

export const Home = () => {
  const { userData } = useUserStore();
  const navigate = useNavigate();
  
  const stats = {
    completedProblems: userData.completedProblems.length,
    correctRate: userData.completedProblems.length > 0
      ? Math.round((userData.completedProblems.filter(cp => cp.status === 'accepted').length / userData.completedProblems.length) * 100)
      : 0,
    studyDays: userData.statistics.streakDays,
    streakDays: userData.statistics.streakDays,
  };
  
  const recentProgress = userData.learningProgress.slice(0, 5);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="mb-6 md:mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 rounded-2xl p-6 md:p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">欢迎回来，{userData.name}</h1>
            <p className="text-white/80 mb-6">今天也要继续加油，离目标更近一步！</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate('/diagnosis')}>
                <BarChart3 className="mr-2" size={20} />
                开始诊断
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10" onClick={() => navigate('/daily')}>
                <BookOpen className="mr-2" size={20} />
                继续学习
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">学习数据概览</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}15` }}
                  >
                    <span style={{ color: card.color }}>{card.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {card.label === '正确率' ? `${stats.correctRate}%` : stats[card.label.replace(/\s+/g, '') as keyof typeof stats]}
                    </p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">快速入口</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={action.path}>
                <Card hover className="p-5 cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white mb-3">
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">知识点掌握度</h2>
        <Card className="p-6">
          {recentProgress.length > 0 ? (
            <div className="space-y-4">
              {recentProgress.map((progress, index) => (
                <motion.div
                  key={progress.knowledgePointId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMasteryColor(progress.masteryLevel) }}
                    />
                    <span className="font-medium text-gray-700">
                      {getKnowledgePointName(progress.knowledgePointId)}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${getMasteryColor(progress.masteryLevel)}15`,
                        color: getMasteryColor(progress.masteryLevel),
                      }}
                    >
                      {getMasteryLevel(progress.masteryLevel)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-sm text-gray-500 w-16 text-right">
                      {progress.masteryLevel}%
                    </span>
                    <ProgressBar
                      value={progress.masteryLevel}
                      color={getMasteryColor(progress.masteryLevel)}
                      className="flex-1 sm:w-32"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen size={48} className="mx-auto mb-3 text-gray-300" />
              <p>还没有学习记录，快去开始诊断吧！</p>
              <Link to="/diagnosis">
                <Button className="mt-4">开始诊断</Button>
              </Link>
            </div>
          )}
        </Card>
      </section>
    </motion.div>
  );
};
