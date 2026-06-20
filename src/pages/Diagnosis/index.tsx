import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useDiagnosisStore } from '@/store/useDiagnosisStore';
import { useUserStore } from '@/store/useUserStore';
import { motion } from 'framer-motion';
import { Award, BookOpen, ChevronRight, Clock, FileText, Sparkles, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const levelConfig = {
  'CSP-J': {
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '适合初中及以下学生',
    features: ['基础语法与数据结构', '简单算法（排序、查找）', '基础数学知识'],
    duration: '30分钟',
    questions: '10题'
  },
  'CSP-S': {
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: '适合高中及以上学生',
    features: ['高级数据结构（树、图）', '动态规划与图论算法', '复杂数学与数论'],
    duration: '45分钟',
    questions: '14题'
  }
};

export const Diagnosis = () => {
  const { startDiagnosis } = useDiagnosisStore();
  const { userData } = useUserStore();
  const navigate = useNavigate();
  
  const handleStartDiagnosis = (level: 'CSP-J' | 'CSP-S') => {
    startDiagnosis(level);
    navigate(`/diagnosis/test/${level}`);
  };
  
  const hasDiagnosisHistory = userData.diagnosisHistory.length > 0;
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Target size={24} className="text-primary-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">诊断中心</h1>
        </div>
        <p className="text-neutral-500">评估您的信奥赛水平，为您定制个性化学习路径</p>
      </motion.div>
      
      {/* Diagnosis Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        variants={containerVariants}
      >
        {(['CSP-J', 'CSP-S'] as const).map((level) => {
          const config = levelConfig[level];
          
          return (
            <motion.div
              key={level}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className={`p-6 border-2 ${config.borderColor} overflow-hidden group relative`}>
                {/* Hover 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <motion.div 
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-white font-bold text-2xl">{level === 'CSP-J' ? 'J' : 'S'}</span>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-800">{level} {level === 'CSP-J' ? '入门组' : '提高组'}</h3>
                      <p className="text-neutral-500 text-sm">{config.description}</p>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {config.features.map((feature, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-center gap-2 text-sm text-neutral-600"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient}`} />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Info & Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Clock size={16} />
                        <span>{config.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <FileText size={16} />
                        <span>{config.questions}</span>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => handleStartDiagnosis(level)}
                        className={`bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white shadow-lg`}
                      >
                        <Zap size={18} className="mr-2" />
                        开始测试
                        <ChevronRight size={18} className="ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* History */}
      {hasDiagnosisHistory && (
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <Card className="p-5 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-neutral-800">诊断报告</h3>
                  <p className="text-sm text-neutral-500">
                    上次诊断：{new Date(userData.diagnosisHistory[userData.diagnosisHistory.length - 1].date).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={() => navigate('/diagnosis/report/latest')} className="border-green-300 text-green-700 hover:bg-green-100">
                  查看报告
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* Instructions */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-amber-500" />
            <h3 className="font-semibold text-neutral-800">诊断说明</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: 1, title: '选择级别', desc: '根据当前水平选择合适的测试级别', icon: <Target size={24} />, color: 'from-blue-500 to-cyan-500' },
              { step: 2, title: '完成测试', desc: '认真作答，系统将评估您的掌握情况', icon: <BookOpen size={24} />, color: 'from-green-500 to-teal-500' },
              { step: 3, title: '获取报告', desc: '查看诊断报告和个性化学习建议', icon: <Award size={24} />, color: 'from-amber-500 to-orange-500' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                <motion.div 
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                  whileHover={{ scale: 1.15 }}
                  style={{ color: 'white' }}
                >
                  {item.icon}
                </motion.div>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm shadow-md`}>
                  {item.step}
                </div>
                <p className="text-sm font-medium text-neutral-700 mb-1">{item.title}</p>
                <p className="text-xs text-neutral-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};