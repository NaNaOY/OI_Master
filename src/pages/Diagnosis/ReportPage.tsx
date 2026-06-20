import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Award, BookOpen, CheckCircle, Sparkles, Star, Target, TrendingUp, Zap } from 'lucide-react';
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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
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
  
  const getRecommendationsWithStrategy = () => {
    const strategies = [
      { type: 'practice', title: '专项练习', desc: '针对薄弱知识点进行集中训练', icon: <Target size={20} /> },
      { type: 'review', title: '复习巩固', desc: '回顾相关课程视频和笔记', icon: <BookOpen size={20} /> },
      { type: 'code', title: '代码实践', desc: '编写代码实现相关算法', icon: <Zap size={20} /> },
      { type: 'mistake', title: '错题重做', desc: '回顾错题本中的相关错题', icon: <AlertTriangle size={20} /> },
    ];
    
    return weakPoints.slice(0, 4).map((item, index) => ({
      kp: item.kp,
      score: item.score,
      strategy: strategies[index % strategies.length],
    }));
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
          <motion.div 
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
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
          <motion.div key={stat.label} variants={itemVariants} whileHover={{ y: -6, scale: 1.02 }}>
            <Card className="p-5 text-center overflow-hidden relative border border-neutral-100/50 shadow-md rounded-xl">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
              <motion.div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-10 flex items-center justify-center mx-auto mb-3`} whileHover={{ scale: 1.1 }}>
                {stat.icon}
              </motion.div>
              <motion.p className="text-2xl font-bold text-neutral-800 tabular-nums" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + index * 0.1 }}>
                {stat.value}
              </motion.p>
              <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
            <motion.h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <TrendingUp size={20} className="text-blue-500" />
              知识点掌握度雷达图
            </motion.h3>
            <div className="h-[280px]">
              <RadarChart data={radarData} />
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl h-full flex flex-col">
            <motion.h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertTriangle size={20} className="text-red-500" />
              薄弱知识点
            </motion.h3>
            
            {weakPoints.length > 0 ? (
              <div className="flex-1 space-y-3">
                {weakPoints.map((item, index) => (
                  <motion.div
                    key={item.kpId}
                    variants={itemVariants}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100"
                  >
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-md"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {index + 1}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-neutral-700">{item.kp?.name}</span>
                        <span className="text-sm font-bold text-red-600">{item.score}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={item.score} color={getMasteryColor(item.score)} className="flex-1 h-2 rounded-full" />
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600">
                          需加强
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <motion.div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mb-4" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <CheckCircle size={32} className="text-emerald-500" />
                </motion.div>
                <p className="text-emerald-600 font-semibold">太棒了！没有薄弱项</p>
                <p className="text-neutral-500 text-sm mt-2">继续保持，挑战更高难度</p>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <motion.h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BookOpen size={20} className="text-violet-500" />
            学习建议
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {getRecommendationsWithStrategy().map((item) => (
              <motion.div
                key={item.kp?.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50/50 border border-violet-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white">
                    {item.strategy.icon}
                  </div>
                  <span className="text-sm font-semibold text-violet-700">{item.strategy.title}</span>
                </div>
                <p className="text-sm text-neutral-600 mb-3">{item.strategy.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-violet-100">
                  <span className="text-xs text-neutral-500">针对: {item.kp?.name}</span>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Button variant="ghost" size="sm" className="text-violet-600 hover:bg-violet-100 p-1">
                      <ArrowRight size={16} />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
            
            {diagnosis.recommendations.slice(0, 2).map((rec, index) => (
              <motion.div
                key={`rec-${index}`}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                    <Award size={16} />
                  </div>
                  <span className="text-sm font-semibold text-amber-700">通用建议</span>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">{rec}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <motion.h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TrendingUp size={20} className="text-blue-500" />
            知识点详细分析
          </motion.h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">知识点</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-600 text-sm">难度</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-600 text-sm">掌握度</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-600 text-sm">状态</th>
                </tr>
              </thead>
              <tbody>
                {sortedKP.map((item) => (
                  <motion.tr 
                    key={item.kpId} 
                    variants={itemVariants}
                    className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-50 to-indigo-50 flex items-center justify-center">
                          <Star size={14} className="text-primary-500" />
                        </div>
                        <span className="font-medium text-neutral-700">{item.kp?.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                        item.kp?.difficulty === 1 ? 'bg-emerald-100 text-emerald-600' :
                        item.kp?.difficulty === 2 ? 'bg-blue-100 text-blue-600' :
                        item.kp?.difficulty === 3 ? 'bg-violet-100 text-violet-600' :
                        item.kp?.difficulty === 4 ? 'bg-amber-100 text-amber-600' :
                        item.kp?.difficulty === 5 ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-600'
                      }`}>
                        {item.kp?.difficulty === 1 ? '入门' :
                         item.kp?.difficulty === 2 ? '基础' :
                         item.kp?.difficulty === 3 ? '进阶' :
                         item.kp?.difficulty === 4 ? '提高' :
                         item.kp?.difficulty === 5 ? '困难' : '挑战'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[150px]">
                          <ProgressBar value={item.score} color={getMasteryColor(item.score)} className="h-2 rounded-full" />
                        </div>
                        <span className="font-bold text-neutral-600 tabular-nums w-12 text-right">{item.score}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium`}
                        style={{
                          backgroundColor: `${getMasteryColor(item.score)}15`,
                          color: getMasteryColor(item.score),
                        }}
                      >
                        {getMasteryLevel(item.score)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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