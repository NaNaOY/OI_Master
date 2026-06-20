import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Award, BookOpen, CheckCircle, Sparkles, Star, Target, TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { RadarChart } from '@/components/charts/RadarChart';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor } from '@/utils/analysis';
import { knowledgePoints } from '@/data/knowledgePoints';
import { Link, useNavigate, useParams } from 'react-router-dom';

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

const getGrade = (score: number) => {
  if (score >= 90) return { text: '优秀', color: 'text-emerald-600', bg: 'bg-emerald-100', gradient: 'from-emerald-500 to-green-600' };
  if (score >= 80) return { text: '良好', color: 'text-blue-600', bg: 'bg-blue-100', gradient: 'from-blue-500 to-indigo-600' };
  if (score >= 70) return { text: '中等', color: 'text-amber-600', bg: 'bg-amber-100', gradient: 'from-amber-500 to-orange-600' };
  if (score >= 60) return { text: '及格', color: 'text-violet-600', bg: 'bg-violet-100', gradient: 'from-violet-500 to-purple-600' };
  return { text: '需加强', color: 'text-red-600', bg: 'bg-red-100', gradient: 'from-red-500 to-rose-600' };
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
  const mediumPoints = sortedKP.filter(item => item.score >= 60 && item.score < 70);
  
  const avgScore = Math.round(Object.values(diagnosis.scores).reduce((a, b) => a + b, 0) / Object.keys(diagnosis.scores).length);
  const grade = getGrade(avgScore);
  
  const getActionPlan = (_kpId: string, score: number) => {
    const basePlan = [
      { type: 'video', icon: 'BookOpen', label: '观看教学视频', time: '15分钟' },
      { type: 'practice', icon: 'Target', label: '完成专项练习', time: '30分钟' },
      { type: 'review', icon: 'Zap', label: '代码实践', time: '20分钟' },
    ];
    if (score < 40) {
      return [...basePlan, { type: 'mistake', icon: 'AlertTriangle', label: '回顾错题', time: '15分钟' }];
    }
    return basePlan;
  };
  
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen size={16} />;
      case 'Target': return <Target size={16} />;
      case 'Zap': return <Zap size={16} />;
      case 'AlertTriangle': return <AlertTriangle size={16} />;
      default: return <Target size={16} />;
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Star size={20} className="text-amber-500" />
            </motion.div>
            <span className="text-sm text-neutral-500 font-medium">诊断报告</span>
          </div>
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
            学习路径
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-xl rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/50 to-indigo-100/30 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center gap-6">
              <motion.div 
                className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${grade.gradient} flex flex-col items-center justify-center text-white shadow-lg`}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl font-bold">{avgScore}</span>
                <span className="text-sm opacity-90">平均分</span>
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full font-semibold ${grade.bg} ${grade.color}`}>
                    <Award size={16} />
                    {grade.text}
                  </span>
                  <span className="text-sm text-neutral-500">
                    共测试 {sortedKP.length} 个知识点
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600" />
                    <span className="font-bold text-emerald-600">{strongPoints.length}</span>
                    <span className="text-sm text-neutral-500">已掌握</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-amber-600" />
                    <span className="font-bold text-amber-600">{mediumPoints.length}</span>
                    <span className="text-sm text-neutral-500">需巩固</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-600" />
                    <span className="font-bold text-red-600">{weakPoints.length}</span>
                    <span className="text-sm text-neutral-500">薄弱项</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={containerVariants}>
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
            <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-3">
              <TrendingUp size={20} className="text-blue-500" />
              知识点掌握度分析
            </h3>
            <div className="h-[300px]">
              <RadarChart data={radarData} />
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl h-full flex flex-col">
            <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-500" />
              薄弱知识点
            </h3>
            
            {weakPoints.length > 0 ? (
              <div className="flex-1 space-y-3">
                {weakPoints.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={item.kpId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-neutral-700 text-sm truncate">{item.kp?.name}</span>
                        <span className="text-xs font-bold text-red-600">{item.score}%</span>
                      </div>
                      <ProgressBar value={item.score} color={getMasteryColor(item.score)} className="h-1.5 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <motion.div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mb-3" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <CheckCircle size={28} className="text-emerald-500" />
                </motion.div>
                <p className="text-emerald-600 font-semibold text-sm">太棒了！没有薄弱项</p>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
      
      {weakPoints.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
            <h3 className="font-bold text-neutral-800 mb-6 flex items-center gap-3">
              <Sparkles size={20} className="text-violet-500" />
              针对性学习计划
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {weakPoints.slice(0, 2).map((item) => (
                <motion.div
                  key={item.kpId}
                  whileHover={{ y: -3 }}
                  className="rounded-xl border border-violet-100 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50/50 border-b border-violet-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white">
                          <Target size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-800">{item.kp?.name}</h4>
                          <span className="text-xs text-neutral-500">当前掌握度 {item.score}%</span>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-red-100 text-red-600">
                        优先级高
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {getActionPlan(item.kpId, item.score).map((action, idx) => (
                      <div key={action.type} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                          {renderIcon(action.icon)}
                          <span className="text-sm text-neutral-700">{action.label}</span>
                        </div>
                        <span className="text-xs text-neutral-400">{action.time}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="px-4 pb-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium hover:from-violet-600 hover:to-purple-600 transition-all"
                    >
                      开始学习 →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
      
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-3">
            <BookOpen size={20} className="text-blue-500" />
            学习建议
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagnosis.recommendations.slice(0, 3).map((rec, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">{rec}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <h3 className="font-bold text-neutral-800 mb-4">知识点掌握度列表</h3>
          
          <div className="space-y-2">
            {sortedKP.map((item) => (
              <motion.div
                key={item.kpId}
                whileHover={{ x: 3 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-50 to-indigo-50 flex items-center justify-center">
                  <Star size={12} className="text-primary-500" />
                </div>
                <span className="flex-1 font-medium text-neutral-700 text-sm">{item.kp?.name}</span>
                <div className="flex-1 max-w-[120px]">
                  <ProgressBar value={item.score} color={getMasteryColor(item.score)} className="h-2 rounded-full" />
                </div>
                <span className={`text-sm font-bold w-10 text-right ${
                  item.score >= 70 ? 'text-emerald-600' : item.score >= 60 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {item.score}%
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex justify-center pt-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/learning-path">
            <Button size="lg" className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-xl px-10 py-4 rounded-xl font-semibold">
              根据诊断结果规划学习路径
              <ArrowRight size={20} className="ml-3" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};