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
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {[
          { value: avgScore, label: '平均掌握度', icon: <Target size={20} />, gradient: 'from-blue-500 to-indigo-600' },
          { value: strongPoints.length, label: '优势知识点', icon: <CheckCircle size={20} />, gradient: 'from-emerald-500 to-green-600' },
          { value: weakPoints.length, label: '薄弱知识点', icon: <AlertTriangle size={20} />, gradient: 'from-red-500 to-rose-600' },
          { value: diagnosis.recommendations.length, label: '学习建议', icon: <Award size={20} />, gradient: 'from-violet-500 to-purple-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-5 text-center overflow-hidden relative border border-neutral-100/50 shadow-md rounded-xl">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
              
              <motion.div 
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-10 flex items-center justify-center mx-auto mb-3`}
                whileHover={{ scale: 1.1 }}
              >
                {stat.icon}
              </motion.div>
              <motion.p 
                className="text-2xl font-bold text-neutral-800 tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
            <motion.h3 
              className="font-bold text-neutral-800 mb-4 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <TrendingUp size={20} className="text-blue-500" />
              知识点掌握度雷达图
            </motion.h3>
            <div className="h-[320px]">
              <RadarChart data={radarData} />
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
            <motion.h3 
              className="font-bold text-neutral-800 mb-4 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertTriangle size={20} className="text-red-500" />
              薄弱知识点
            </motion.h3>
            
            {weakPoints.length > 0 ? (
              <motion.div className="space-y-3">
                {weakPoints.map((item) => (
                  <motion.div
                    key={item.kpId}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    className="p-3 rounded-xl bg-red-50/50 border border-red-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-neutral-700 text-sm">{item.kp?.name}</span>
                      <span className="text-sm font-bold text-red-600">{item.score}%</span>
                    </div>
                    <ProgressBar
                      value={item.score}
                      color={getMasteryColor(item.score)}
                      className="h-2 rounded-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div className="text-center py-8">
                <motion.div
                  className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle size={24} className="text-emerald-500" />
                </motion.div>
                <p className="text-emerald-600 font-semibold">太棒了！没有薄弱项</p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <motion.h3 
            className="font-bold text-neutral-800 mb-4 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BookOpen size={20} className="text-violet-500" />
            学习建议
          </motion.h3>
          
          <motion.div className="space-y-3">
            {diagnosis.recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="flex items-start gap-3 p-4 bg-primary-50/50 rounded-xl border border-primary-100"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 text-white text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-neutral-700 text-sm leading-relaxed">{recommendation}</span>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <motion.h3 
            className="font-bold text-neutral-800 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            知识点详细分析
          </motion.h3>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {sortedKP.map((item) => (
              <motion.div
                key={item.kpId}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl bg-neutral-50/50 border border-neutral-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-700 text-sm">{item.kp?.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium`}
                    style={{
                      backgroundColor: `${getMasteryColor(item.score)}15`,
                      color: getMasteryColor(item.score),
                    }}
                  >
                    {getMasteryLevel(item.score)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar
                    value={item.score}
                    color={getMasteryColor(item.score)}
                    className="flex-1 h-2 rounded-full"
                  />
                  <span className="text-sm font-bold text-neutral-600 w-10 text-right tabular-nums">{item.score}%</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="flex justify-center pt-4"
      >
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