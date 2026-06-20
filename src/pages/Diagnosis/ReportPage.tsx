import { motion } from 'framer-motion';
import { TrendingUp, Target, AlertTriangle, BookOpen, ArrowRight } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { RadarChart } from '@/components/charts/RadarChart';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { knowledgePoints } from '@/data/knowledgePoints';
import { Link, useNavigate } from 'react-router-dom';

export const DiagnosisReport = () => {
  const { userData } = useUserStore();
  const navigate = useNavigate();
  const latestDiagnosis = userData.diagnosisHistory[userData.diagnosisHistory.length - 1];
  
  if (!latestDiagnosis) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">还没有诊断记录</h3>
          <p className="text-gray-500 mb-6">完成诊断测试后，您将在这里看到详细的诊断报告</p>
          <Link to="/diagnosis">
            <Button>开始诊断</Button>
          </Link>
        </Card>
      </motion.div>
    );
  }
  
  const radarData = Object.entries(latestDiagnosis.scores)
    .map(([kpId, score]) => ({
      name: getKnowledgePointName(kpId),
      value: score,
    }))
    .filter(item => item.value > 0);
  
  const sortedKP = Object.entries(latestDiagnosis.scores)
    .map(([kpId, score]) => ({
      kpId,
      score,
      kp: knowledgePoints.find(k => k.id === kpId),
    }))
    .filter(item => item.kp)
    .sort((a, b) => a.score - b.score);
  
  const strongPoints = sortedKP.filter(item => item.score >= 70);
  const weakPoints = sortedKP.filter(item => item.score < 60);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">诊断报告</h1>
          <p className="text-gray-500 mt-1">
            {latestDiagnosis.level} · {new Date(latestDiagnosis.date).toLocaleDateString('zh-CN')}
          </p>
        </div>
        <Button onClick={() => navigate('/learning-path')}>
          <BookOpen className="mr-2" size={18} />
          查看学习路径
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {Math.round(Object.values(latestDiagnosis.scores).reduce((a, b) => a + b, 0) / Object.keys(latestDiagnosis.scores).length)}
            </div>
            <p className="text-sm text-gray-500">平均掌握度</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {strongPoints.length}
            </div>
            <p className="text-sm text-gray-500">优势知识点</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-red-500 mb-1">
              {weakPoints.length}
            </div>
            <p className="text-sm text-gray-500">薄弱知识点</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-accent-500 mb-1">
              {latestDiagnosis.recommendations.length}
            </div>
            <p className="text-sm text-gray-500">学习建议</p>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            知识点掌握度
          </h3>
          <RadarChart data={radarData} />
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            薄弱知识点
          </h3>
          {weakPoints.length > 0 ? (
            <div className="space-y-4">
              {weakPoints.map((item, index) => (
                <motion.div
                  key={item.kpId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">{item.kp?.name}</span>
                    <span className="text-sm text-gray-500">{item.score}%</span>
                  </div>
                  <ProgressBar
                    value={item.score}
                    color={getMasteryColor(item.score)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-green-500">
              <TrendingUp size={48} className="mx-auto mb-2" />
              <p>太棒了！没有明显的薄弱项</p>
            </div>
          )}
        </Card>
      </div>
      
      <Card className="p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          学习建议
        </h3>
        <div className="space-y-3">
          {latestDiagnosis.recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white text-sm flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-gray-700">{recommendation}</span>
            </motion.div>
          ))}
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4">知识点详细分析</h3>
        <div className="grid grid-cols-2 gap-4">
          {sortedKP.map((item, index) => (
            <motion.div
              key={item.kpId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{item.kp?.name}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
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
                  className="flex-1"
                />
                <span className="text-sm text-gray-500 w-12 text-right">{item.score}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
      
      <div className="mt-8 flex justify-center">
        <Link to="/learning-path">
          <Button size="lg">
            根据诊断结果规划学习路径
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};