import { motion } from 'framer-motion';
import { Lock, CheckCircle, ArrowRight, Target } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useUserStore } from '@/store/useUserStore';
import { getLearningPathByLevel } from '@/data/learningPath';
import { getKnowledgePointById } from '@/data/knowledgePoints';
import { getMasteryColor, getMasteryLevel, getKnowledgePointName } from '@/utils/analysis';
import { Link, useParams } from 'react-router-dom';

export const LearningPath = () => {
  const { level } = useParams<{ level: 'CSP-J' | 'CSP-S' }>();
  const { userData } = useUserStore();
  const pathLevel = level || (userData.diagnosisHistory.length > 0 
    ? userData.diagnosisHistory[userData.diagnosisHistory.length - 1].level 
    : 'CSP-J');
  
  const learningPath = getLearningPathByLevel(pathLevel);
  
  const getProgress = (kpId: string) => {
    return userData.learningProgress.find(p => p.knowledgePointId === kpId);
  };
  
  const isUnlocked = (_nodeId: string, prerequisites: string[]) => {
    if (prerequisites.length === 0) return true;
    return prerequisites.every(p => {
      const progress = getProgress(p);
      return progress && progress.masteryLevel >= 60;
    });
  };
  
  if (!learningPath) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">学习路径加载失败</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">学习路径</h1>
          <p className="text-gray-500 mt-1">{learningPath.name}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/learning-path/CSP-J">
            <Button variant={pathLevel === 'CSP-J' ? 'primary' : 'outline'} size="sm">
              CSP-J
            </Button>
          </Link>
          <Link to="/learning-path/CSP-S">
            <Button variant={pathLevel === 'CSP-S' ? 'primary' : 'outline'} size="sm">
              CSP-S
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="relative mb-6 md:mb-8">
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-200" />
        
        <div className="space-y-4 md:space-y-6">
          {learningPath.nodes.map((node, index) => {
            const kp = getKnowledgePointById(node.knowledgePointId);
            const progress = getProgress(node.knowledgePointId);
            const unlocked = isUnlocked(node.id, node.prerequisites);
            const mastery = progress?.masteryLevel || 0;
            const completed = progress?.completedProblems || 0;
            const required = node.unlockCondition.requiredProblems;
            
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12 md:pl-16"
              >
                <div
                  className={`absolute left-2 md:left-4 w-4 md:w-5 h-4 md:h-5 rounded-full flex items-center justify-center ${
                    mastery >= 90
                      ? 'bg-green-500 text-white'
                      : unlocked
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {mastery >= 90 ? (
                    <CheckCircle size={10} />
                  ) : unlocked ? (
                    <span className="text-xs font-bold">{index + 1}</span>
                  ) : (
                    <Lock size={8} />
                  )}
                </div>
                
                <Card className={`p-4 md:p-5 ${!unlocked ? 'opacity-60' : ''}`}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{kp?.name}</h3>
                        {unlocked && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${getMasteryColor(mastery)}15`,
                              color: getMasteryColor(mastery),
                            }}
                          >
                            {getMasteryLevel(mastery)}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-3">{kp?.description}</p>
                      
                      {unlocked ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">掌握度</span>
                              <span className="text-xs font-medium">{mastery}%</span>
                            </div>
                            <ProgressBar
                              value={mastery}
                              color={getMasteryColor(mastery)}
                              height={6}
                            />
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">
                              {completed}/{required} 题
                            </p>
                            <p className="text-xs text-gray-500">完成进度</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          <Lock size={14} />
                          <span>需要先掌握：{node.prerequisites.map(p => getKnowledgePointName(p)).join('、')}</span>
                        </div>
                      )}
                    </div>
                    
                    {unlocked && (
                      <Link to={`/learning-path/${node.knowledgePointId}`}>
                        <Button variant="outline" size="sm">
                          学习
                          <ArrowRight size={16} className="ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <Card className="p-4 md:p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target size={20} />
          学习建议
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-800 mb-1">按顺序学习</p>
            <p className="text-sm text-blue-600">建议按照路径顺序学习，每个知识点掌握后再进入下一个</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="font-medium text-green-800 mb-1">多做练习</p>
            <p className="text-sm text-green-600">每个知识点至少完成{learningPath.nodes[0].unlockCondition.requiredProblems}道练习题</p>
          </div>
          <div className="p-4 bg-accent-50 rounded-lg">
            <p className="font-medium text-accent-800 mb-1">定期回顾</p>
            <p className="text-sm text-accent-600">薄弱知识点建议每周回顾一次，巩固记忆</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
