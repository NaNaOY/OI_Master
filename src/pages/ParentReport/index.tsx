import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { AlertTriangle, Award, BookOpen, Calendar, Clock, Sparkles, Target, TrendingUp, Users, Zap } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative p-6 md:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Users className="text-pink-300" size={28} />
                  </motion.div>
                  <h1 className="text-2xl md:text-3xl font-bold">家长报告</h1>
                </div>
                <p className="text-white/80 flex items-center gap-2">
                  <Calendar size={18} />
                  {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">学习进度概览</p>
                <motion.p 
                  className="text-4xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {stats.totalProblems}题
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {[
          { value: stats.totalProblems, label: '总完成题目', icon: <Target size={24} />, gradient: 'from-blue-500 to-indigo-500' },
          { value: `${stats.correctRate}%`, label: '正确率', icon: <TrendingUp size={24} />, gradient: 'from-green-500 to-emerald-500' },
          { value: stats.streakDays, label: '连续学习天数', icon: <Award size={24} />, gradient: 'from-amber-500 to-orange-500' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <Card className="p-6 text-center overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <motion.div 
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                style={{ color: 'white' }}
              >
                {stat.icon}
              </motion.div>
              <p className="text-2xl md:text-3xl font-bold text-neutral-800 mb-1">{stat.value}</p>
              <p className="text-sm text-neutral-500">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Charts */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar size={20} className="text-white" />
              </motion.div>
              <h3 className="font-semibold text-neutral-800">近7天学习情况</h3>
            </div>
            <LineChart data={last7Days} yAxisLabel="完成题目数" />
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-md"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen size={20} className="text-white" />
              </motion.div>
              <h3 className="font-semibold text-neutral-800">知识点掌握度</h3>
            </div>
            <BarChart data={knowledgeData} yAxisLabel="掌握度 (%)" />
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Weak Points */}
      {weakPoints.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-rose-50">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-md"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertTriangle size={20} className="text-white" />
              </motion.div>
              <h3 className="font-semibold text-neutral-800">需要关注的薄弱知识点</h3>
            </div>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={containerVariants}
            >
              {weakPoints.map((kp, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-4 bg-white rounded-xl border border-red-200"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-700">{kp.name}</span>
                    <span className="text-sm font-bold text-red-600">{kp.value}%</span>
                  </div>
                  <ProgressBar
                    value={kp.value}
                    color={kp.color}
                    className="h-2.5"
                  />
                </motion.div>
              ))}
            </motion.div>
          </Card>
        </motion.div>
      )}
      
      {/* Knowledge Progress */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-amber-500" />
            <h3 className="font-semibold text-neutral-800">知识点详细进度</h3>
          </div>
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
          >
            {knowledgeData.map((kp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: kp.color }}
                    whileHover={{ scale: 1.3 }}
                  />
                  <span className="font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">{kp.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600"
                  >
                    {getMasteryLevel(kp.value)}
                  </span>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <motion.span 
                    className="text-sm font-semibold w-16 text-right"
                    style={{ color: kp.color }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {kp.value}%
                  </motion.span>
                  <div className="flex-1 sm:w-48">
                    <ProgressBar
                      value={kp.value}
                      color={kp.color}
                      className="h-2.5 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>
      
      {/* Suggestions */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={20} className="text-primary-500" />
            <h3 className="font-semibold text-neutral-800">学习建议</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: '保持学习节奏', desc: `孩子已经连续学习${stats.streakDays}天，继续鼓励保持！`, color: 'from-blue-500 to-cyan-500' },
              { title: '正确率情况', desc: `当前正确率${stats.correctRate}%，${stats.correctRate >= 80 ? '表现优秀！' : '建议加强练习'}。`, color: 'from-green-500 to-teal-500' },
              { title: '错题复习', desc: `还有${stats.mistakeCount}道错题待复习，建议定期回顾。`, color: 'from-amber-500 to-orange-500' },
            ].map((tip, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 group hover:border-primary-200 transition-colors"
                whileHover={{ y: -2 }}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tip.color} flex items-center justify-center mb-2 shadow-md`}>
                  <span className="text-white font-bold">{i + 1}</span>
                </div>
                <p className="font-medium text-neutral-800 mb-1">{tip.title}</p>
                <p className="text-sm text-neutral-500">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
          
          {weakPoints.length > 0 && (
            <motion.div 
              className="mt-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-red-700">
                <strong>重点关注：</strong>建议孩子加强以下知识点的学习：
                {weakPoints.map(kp => kp.name).join('、')}
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>
      
      {/* Footer */}
      <motion.div 
        variants={itemVariants}
        className="text-center py-4"
      >
        <p className="text-sm text-neutral-500 flex items-center justify-center gap-2">
          <Clock size={16} />
          报告生成时间：{new Date().toLocaleString('zh-CN')}
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          本报告仅供参考，请结合孩子的实际情况进行引导
        </p>
      </motion.div>
    </motion.div>
  );
};