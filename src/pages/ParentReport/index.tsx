import { Card } from '@/components/common/Card';
import { useUserStore } from '@/store/useUserStore';
import { motion } from 'framer-motion';
import { Award, Calendar, Clock, Sparkles, Target, TrendingUp, Users, Zap } from 'lucide-react';

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
    diagnosisCount: userData.diagnosisHistory.length,
    streakDays: userData.statistics.streakDays || 0,
    lastDiagnosisDate: userData.diagnosisHistory.length > 0 
      ? userData.diagnosisHistory[userData.diagnosisHistory.length - 1].date 
      : null,
    level: userData.diagnosisHistory.length > 0
      ? userData.diagnosisHistory[userData.diagnosisHistory.length - 1].level
      : null,
  };
  
  const hasDiagnosis = userData.diagnosisHistory.length > 0;
  const latestDiagnosis = hasDiagnosis 
    ? userData.diagnosisHistory[userData.diagnosisHistory.length - 1] 
    : null;
  
  const weakPoints = latestDiagnosis 
    ? latestDiagnosis.weakPoints.slice(0, 5) 
    : [];
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
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
                <p className="text-white/60 text-sm">学习概览</p>
                <motion.p 
                  className="text-4xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {hasDiagnosis ? '已诊断' : '未诊断'}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {[
          { value: stats.diagnosisCount, label: '诊断次数', icon: <Target size={24} />, gradient: 'from-blue-500 to-indigo-500' },
          { value: stats.streakDays, label: '连续学习天数', icon: <Award size={24} />, gradient: 'from-amber-500 to-orange-500' },
          { value: stats.level || '-', label: '当前级别', icon: <TrendingUp size={24} />, gradient: 'from-green-500 to-emerald-500' },
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
      
      {hasDiagnosis && latestDiagnosis && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-white shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={24} />
              </motion.div>
              <div>
                <h3 className="font-bold text-neutral-800">最近诊断结果</h3>
                <p className="text-sm text-neutral-500">
                  级别：{latestDiagnosis.level} · 日期：{new Date(latestDiagnosis.date).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
            
            {weakPoints.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-neutral-600 font-medium">需要加强的知识点：</p>
                <div className="flex flex-wrap gap-2">
                  {weakPoints.map((kp, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 text-sm font-medium"
                    >
                      {kp}
                    </motion.span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Award size={24} className="text-emerald-600" />
                </motion.div>
                <p className="text-emerald-700 font-medium">本次诊断未发现薄弱知识点，继续保持！</p>
              </div>
            )}
          </Card>
        </motion.div>
      )}
      
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={20} className="text-primary-500" />
            <h3 className="font-semibold text-neutral-800">学习建议</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: '定期诊断', desc: '建议定期进行诊断测试，了解学习状态变化', color: 'from-blue-500 to-cyan-500' },
              { title: '按题单练习', desc: '根据诊断推荐的题单，在洛谷等平台练习', color: 'from-green-500 to-teal-500' },
              { title: '关注薄弱点', desc: '针对薄弱知识点加强学习，逐步提升', color: 'from-amber-500 to-orange-500' },
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
        </Card>
      </motion.div>
      
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