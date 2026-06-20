import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { Award, BarChart3, BookOpen, ClipboardList, Clock, Target, TrendingUp, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const statCards = [
  { icon: <Target size={24} />, label: '已完成题目', color: '#0ea5e9', gradient: 'from-blue-50 to-blue-100' },
  { icon: <TrendingUp size={24} />, label: '正确率', color: '#22c55e', gradient: 'from-green-50 to-green-100', suffix: '%' },
  { icon: <Clock size={24} />, label: '学习天数', color: '#f59e0b', gradient: 'from-amber-50 to-amber-100' },
  { icon: <Award size={24} />, label: '连续学习', color: '#8b5cf6', gradient: 'from-violet-50 to-violet-100', suffix: '天' },
];

const quickActions = [
  { id: 'diagnosis', icon: <BarChart3 size={24} />, title: '开始诊断', description: '评估当前水平', path: '/diagnosis', bgColor: 'bg-blue-50', accentColor: 'text-blue-500' },
  { id: 'daily', icon: <ClipboardList size={24} />, title: '今日推荐', description: '个性化练习', path: '/daily', bgColor: 'bg-green-50', accentColor: 'text-green-500' },
  { id: 'mistakes', icon: <Trophy size={24} />, title: '错题复习', description: '巩固薄弱项', path: '/mistakes', bgColor: 'bg-amber-50', accentColor: 'text-amber-500' },
  { id: 'learning-path', icon: <BookOpen size={24} />, title: '学习路径', description: '规划学习路线', path: '/learning-path', bgColor: 'bg-violet-50', accentColor: 'text-violet-500' },
];

export const Home = () => {
  const { userData } = useUserStore();
  const navigate = useNavigate();
  
  const stats = {
    completedProblems: userData.completedProblems.length,
    correctRate: userData.completedProblems.length > 0
      ? Math.round((userData.completedProblems.filter(cp => cp.status === 'accepted').length / userData.completedProblems.length) * 100)
      : 0,
    studyDays: userData.statistics.streakDays || 1,
    streakDays: userData.statistics.streakDays || 1,
  };
  
  const recentProgress = userData.learningProgress.slice(0, 5);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* 欢迎横幅 */}
      <section>
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              欢迎回来，{userData.name}
            </h1>
            <p className="text-white/90 text-lg mb-6">
              今天也要继续加油，离目标更近一步！
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-white/90 shadow-lg"
                onClick={() => navigate('/diagnosis')}
              >
                <BarChart3 className="mr-2" size={20} />
                开始诊断
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white/50 hover:bg-white/10"
                onClick={() => navigate('/daily')}
              >
                <BookOpen className="mr-2" size={20} />
                继续学习
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* 数据概览 */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">学习数据概览</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-5 bg-gradient-to-br ${card.gradient} border-0`}>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm"
                    style={{ color: card.color }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-800">
                      {card.suffix === '%' ? `${stats.correctRate}%` : 
                       card.suffix === '天' ? `${stats.streakDays}天` : 
                       card.label === '已完成题目' ? stats.completedProblems : stats.studyDays}
                    </p>
                    <p className="text-sm text-neutral-500">{card.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* 快速入口 */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">快速入口</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link to={action.path}>
                <Card hover className="p-5 cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-4 ${action.accentColor} group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-neutral-800 mb-1">{action.title}</h3>
                  <p className="text-sm text-neutral-500">{action.description}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* 知识点掌握度 */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">知识点掌握度</h2>
        
        <Card className="p-6">
          {recentProgress.length > 0 ? (
            <div className="space-y-4">
              {recentProgress.map((progress, index) => (
                <motion.div
                  key={progress.knowledgePointId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMasteryColor(progress.masteryLevel) }}
                    />
                    <span className="font-medium text-neutral-700">
                      {getKnowledgePointName(progress.knowledgePointId)}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600"
                    >
                      {getMasteryLevel(progress.masteryLevel)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-sm text-neutral-500 w-16 text-right">
                      {progress.masteryLevel}%
                    </span>
                    <div className="flex-1 sm:w-40">
                      <ProgressBar
                        value={progress.masteryLevel}
                        color={getMasteryColor(progress.masteryLevel)}
                        className="h-2"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto mb-4 text-neutral-300" />
              <p className="text-neutral-500 mb-4">还没有学习记录，快去开始诊断吧！</p>
              <Link to="/diagnosis">
                <Button className="bg-primary-500 hover:bg-primary-600">
                  开始诊断
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </section>
    </motion.div>
  );
};
