import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, FileText } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useDiagnosisStore } from '@/store/useDiagnosisStore';
import { useUserStore } from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">诊断中心</h1>
          <p className="text-gray-500 mt-1">评估您的信奥赛水平，为您定制学习路径</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 md:p-6 border-t-4 border-primary-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg md:text-xl">J</span>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">CSP-J 入门组</h3>
                <p className="text-gray-500 text-sm">适合初中及以下学生</p>
              </div>
            </div>
            
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                基础语法与数据结构
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                简单算法（排序、查找）
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                基础数学知识
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">测试时长</p>
                <p className="font-semibold text-gray-800">30分钟</p>
              </div>
              <Button onClick={() => handleStartDiagnosis('CSP-J')}>
                开始测试
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 md:p-6 border-t-4 border-accent-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-accent-100 flex items-center justify-center">
                <span className="text-accent-600 font-bold text-lg md:text-xl">S</span>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">CSP-S 提高组</h3>
                <p className="text-gray-500 text-sm">适合高中及以上学生</p>
              </div>
            </div>
            
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                高级数据结构（树、图）
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                动态规划与图论算法
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                复杂数学与数论
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">测试时长</p>
                <p className="font-semibold text-gray-800">45分钟</p>
              </div>
              <Button variant="secondary" onClick={() => handleStartDiagnosis('CSP-S')}>
                开始测试
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {hasDiagnosisHistory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-8"
        >
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">诊断报告</h3>
                  <p className="text-sm text-gray-500">上次诊断：{new Date(userData.diagnosisHistory[userData.diagnosisHistory.length - 1].date).toLocaleDateString('zh-CN')}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/diagnosis/report/latest')}>
                查看报告
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
      
      <Card className="p-4 md:p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          诊断说明
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <p className="text-sm font-medium text-gray-700">选择级别</p>
            <p className="text-xs text-gray-500 mt-1">根据当前水平选择合适的测试级别</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-accent-600 font-bold">2</span>
            </div>
            <p className="text-sm font-medium text-gray-700">完成测试</p>
            <p className="text-xs text-gray-500 mt-1">认真作答，系统将评估您的掌握情况</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <p className="text-sm font-medium text-gray-700">获取报告</p>
            <p className="text-xs text-gray-500 mt-1">查看诊断报告和个性化学习建议</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
