import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { getKnowledgePointById } from '@/data/knowledgePoints';
import { getLearningPathByLevel } from '@/data/learningPath';
import { getProblemsByKnowledgePoint } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Lock, Target } from 'lucide-react';
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
  
  const isUnlocked = (nodeIndex: number, prerequisites: string[]) => {
    if (prerequisites.length === 0) return true;
    
    const hasDiagnosis = userData.diagnosisHistory.length > 0;
    
    if (hasDiagnosis) {
      const latestDiagnosis = userData.diagnosisHistory[userData.diagnosisHistory.length - 1];
      const diagnosisScore = latestDiagnosis.scores[learningPath?.nodes[nodeIndex].knowledgePointId || ''];
      
      if (diagnosisScore !== undefined) {
        return true;
      }
    }
    
    return prerequisites.every(p => {
      const progress = getProgress(p);
      return progress && (progress.completedProblems > 0 || (progress.masteryLevel >= 60));
    });
  };
  
  if (!learningPath) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">学习路径加载失败</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">学习路径</h1>
          <p className="text-neutral-500 mt-1">{learningPath.name}</p>
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
      
      <div className="relative mb-6">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-neutral-200 rounded" />
        
        <div className="space-y-4">
          {learningPath.nodes.map((node, index) => {
            const kp = getKnowledgePointById(node.knowledgePointId);
            const progress = getProgress(node.knowledgePointId);
            const unlocked = isUnlocked(index, node.prerequisites);
            const mastery = progress?.masteryLevel || 0;
            const completed = progress?.completedProblems || 0;
            const totalProblems = getProblemsByKnowledgePoint(node.knowledgePointId).length;
            
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-12"
              >
                <div
                  className={`absolute left-3 top-5 w-5 h-5 rounded-full flex items-center justify-center ${
                    mastery >= 90
                      ? 'bg-green-500 text-white'
                      : unlocked
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-200 text-neutral-400'
                  }`}
                >
                  {mastery >= 90 ? (
                    <CheckCircle size={12} />
                  ) : unlocked ? (
                    <span className="text-xs font-bold">{index + 1}</span>
                  ) : (
                    <Lock size={10} />
                  )}
                </div>
                
                <Card className={`p-5 ${!unlocked ? 'opacity-60' : ''} hover:shadow-card-hover transition-shadow`}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-neutral-800">{kp?.name}</h3>
                        {unlocked && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600"
                          >
                            {getMasteryLevel(mastery)}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-neutral-500 mb-3">{kp?.description}</p>
                      
                      {unlocked ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-neutral-500">掌握度</span>
                              <span className="text-xs font-medium text-neutral-700">{mastery}%</span>
                            </div>
                            <ProgressBar
                              value={mastery}
                              color={getMasteryColor(mastery)}
                              height={6}
                            />
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <p className="text-sm font-medium text-neutral-700">
                              {completed}/{totalProblems} 题
                            </p>
                            <p className="text-xs text-neutral-500">完成进度</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
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
      
      <Card className="p-5">
        <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <Target size={20} />
          学习建议
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="font-medium text-blue-800 mb-1">按顺序学习</p>
            <p className="text-sm text-blue-600">建议按照路径顺序学习，每个知识点掌握后再进入下一个</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="font-medium text-green-800 mb-1">多做练习</p>
            <p className="text-sm text-green-600">每个知识点至少完成练习题，巩固所学知识</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl">
            <p className="font-medium text-amber-800 mb-1">定期回顾</p>
            <p className="text-sm text-amber-600">薄弱知识点建议每周回顾一次，巩固记忆</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
