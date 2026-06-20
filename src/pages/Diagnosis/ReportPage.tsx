import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Award, BookOpen, CheckCircle, Sparkles, Star, Target, TrendingUp } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { RadarChart } from '@/components/charts/RadarChart';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { knowledgePoints } from '@/data/knowledgePoints';
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

export const DiagnosisReport = () => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useUserStore();
  const navigate = useNavigate();
  const latestDiagnosis = userData.diagnosisHistory[userData.diagnosisHistory.length - 1];
  
  const diagnosis = id === 'latest' ? latestDiagnosis : userData.diagnosisHistory.find(d => d.id === id) || latestDiagnosis;
  
  if (!diagnosis) {
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
          <h3 className="text-xl font-bold text-neutral-800 mb-3">还没有诊断记录</h3>
          <p className="text-neutral-500 mb-8">完成诊断测试后，您将在这里看到详细的诊断报告</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/diagnosis">
              <Button className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-8 py-3 rounded-xl">
                <Sparkles size={18} className="mr-2" />
                开始诊断
              </Button>
            </Link>
          </motion.div>
        </Card>
      </motion.div>
    );
  }
  
  const radarData = Object.entries(diagnosis.scores)
    .map(([kpId, score]) => ({
      name: getKnowledgePointName(kpId),
      value: score,
    }))
    .filter(item => item.value > 0);
  
  const sortedKP = Object.entries(diagnosis.scores)
    .map(([kpId, score]) => ({
      kpId,
      score,
      kp: knowledgePoints.find(k => k.id === kpId),
    }))
    .filter(item => item.kp)
    .sort((a, b) => a.score - b.score);
  
  const strongPoints = sortedKP.filter(item => item.score >= 70);
  const weakPoints = sortedKP.filter(item => item.score < 60);
  
  const avgScore = Math.round(Object.values(diagnosis.scores).reduce((a, b) => a + b, 0) / Object.keys(diagnosis.scores).length);
  
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
            <span className="text-sm text-neutral-500 font-medium">诊断报告</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">诊断结果分析</h1>
          <p className="text-neutral-500 mt-2 font-medium">
            {diagnosis.level} · {new Date(diagnosis.date).toLocaleDateString('zh-CN')}
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => navigate('/learning-path')}
            className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-6 py-3 rounded-xl"
          >
            <BookOpen className="mr-2" size={18} />
            查看学习路径
          </Button>
        </motion.div>
      </motion.div>
      
      {/* 统计卡片 */}
      <motion.div 
        className="grid grid-cols-4 gap-5"
        variants={containerVariants}
      >
        {[
          { value: avgScore, label: '平均掌握度', icon: <Target size={22} />, gradient: 'from-blue-500 to-indigo-600', iconBg: 'bg-gradient-to-br from-blue-50 to-indigo-50' },
          { value: strongPoints.length, label: '优势知识点', icon: <CheckCircle size={22} />, gradient: 'from-emerald-500 to-green-600', iconBg: 'bg-gradient-to-br from-emerald-50 to-green-50' },
          { value: weakPoints.length, label: '薄弱知识点', icon: <AlertTriangle size={22} />, gradient: 'from-red-500 to-rose-600', iconBg: 'bg-gradient-to-br from-red-50 to-rose-50' },
          { value: diagnosis.recommendations.length, label: '学习建议', icon: <Award size={22} />, gradient: 'from-violet-500 to-purple-600', iconBg: 'bg-gradient-to-br from-violet-50 to-purple-50' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 text-center overflow-hidden group relative border border-neutral-100/50 shadow-lg rounded-2xl">
              {/* 动态渐变背景 */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />
              {/* 顶部装饰线 */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-80`} />
              
              <motion.div 
                className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center mx-auto mb-4 shadow-md`}
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
              >
                {stat.icon}
              </motion.div>
              <motion.p 
                className="text-3xl font-bold text-neutral-800 tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-sm text-neutral-500 mt-1 font-medium">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* 图表区域 */}
      <motion.div 
        className="grid grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-2xl opacity-50" />
            
            <motion.h3 
              className="font-bold text-neutral-800 mb-6 flex items-center gap-3 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp size={22} className="text-blue-500" />
              </motion.div>
              知识点掌握度雷达图
            </motion.h3>
            <RadarChart data={radarData} />
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100/50 to-transparent rounded-full blur-2xl opacity-50" />
            
            <motion.h3 
              className="font-bold text-neutral-800 mb-6 flex items-center gap-3 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle size={22} className="text-red-500" />
              </motion.div>
              薄弱知识点
            </motion.h3>
            
            {weakPoints.length > 0 ? (
              <motion.div 
                className="space-y-5"
                variants={containerVariants}
              >
                {weakPoints.map((item) => (
                  <motion.div
                    key={item.kpId}
                    variants={itemVariants}
                    className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-transparent border border-red-100/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-neutral-700">{item.kp?.name}</span>
                      <motion.span 
                        className="text-sm font-bold text-red-600"
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.score}%
                      </motion.span>
                    </div>
                    <ProgressBar
                      value={item.score}
                      color={getMasteryColor(item.score)}
                      className="h-3 rounded-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mx-auto mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp size={32} className="text-emerald-500" />
                </motion.div>
                <p className="text-emerald-600 font-semibold text-lg">太棒了！没有明显的薄弱项</p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </motion.div>
      
      {/* 学习建议 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-100/50 to-transparent rounded-full blur-2xl opacity-50" />
          
          <motion.h3 
            className="font-bold text-neutral-800 mb-6 flex items-center gap-3 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen size={22} className="text-violet-500" />
            </motion.div>
            学习建议
          </motion.h3>
          
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
          >
            {diagnosis.recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-5 bg-gradient-to-r from-primary-50 to-transparent rounded-2xl border border-primary-100/50 group"
              >
                <motion.span 
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 text-white text-sm font-bold flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  {index + 1}
                </motion.span>
                <span className="text-neutral-700 font-medium leading-relaxed">{recommendation}</span>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>
      
      {/* 知识点详细分析 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-neutral-100/50 to-transparent rounded-full blur-2xl opacity-50" />
          
          <motion.h3 
            className="font-bold text-neutral-800 mb-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            知识点详细分析
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-2 gap-5"
            variants={containerVariants}
          >
            {sortedKP.map((item) => (
              <motion.div
                key={item.kpId}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-5 rounded-2xl border border-neutral-100/50 bg-gradient-to-br from-white to-neutral-50/30 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-neutral-700">{item.kp?.name}</span>
                  <motion.span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: `${getMasteryColor(item.score)}15`,
                      color: getMasteryColor(item.score),
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {getMasteryLevel(item.score)}
                  </motion.span>
                </div>
                <div className="flex items-center gap-4">
                  <ProgressBar
                    value={item.score}
                    color={getMasteryColor(item.score)}
                    className="flex-1 h-3 rounded-full"
                  />
                  <motion.span 
                    className="text-sm font-bold text-neutral-600 w-14 text-right tabular-nums"
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.score}%
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>
      
      {/* 底部按钮 */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-center pt-4"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/learning-path">
            <Button size="lg" className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-xl px-10 py-4 rounded-xl font-semibold">
              根据诊断结果规划学习路径
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={22} className="ml-3" />
              </motion.div>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};