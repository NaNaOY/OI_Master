import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { getKnowledgePointById } from '@/data/knowledgePoints';
import { getLearningPathByLevel } from '@/data/learningPath';
import { getProblemsByKnowledgePoint } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getMasteryColor, getMasteryLevel } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Lock, Sparkles, Target, Zap } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const difficultyConfig = {
  1: { label: '入门', color: '#22c55e', bg: 'bg-green-50', border: 'border-green-200' },
  2: { label: '基础', color: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-200' },
  3: { label: '进阶', color: '#8b5cf6', bg: 'bg-violet-50', border: 'border-violet-200' },
  4: { label: '提高', color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200' },
  5: { label: '困难', color: '#ef4444', bg: 'bg-red-50', border: 'border-red-200' },
  6: { label: '挑战', color: '#ec4899', bg: 'bg-pink-50', border: 'border-pink-200' },
};

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
  
  const isCSPJ = pathLevel === 'CSP-J';
  const primaryBg = isCSPJ ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-purple-500 to-pink-500';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="relative mb-8">
        <div className={`absolute inset-0 ${primaryBg} rounded-2xl opacity-10`} />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={isCSPJ ? 'text-blue-500' : 'text-purple-500'} size={20} />
                <span className={`text-sm font-medium ${isCSPJ ? 'text-blue-600' : 'text-purple-600'}`}>
                  {isCSPJ ? 'CSP-J 入门组' : 'CSP-S 提高组'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-1">
                {learningPath.name}
              </h1>
              <p className="text-neutral-500">
                共 {learningPath.nodes.length} 个知识点 · 系统化学习路径
              </p>
            </div>
            <div className="flex gap-2">
              {pathLevel === 'CSP-J' ? (
                <Button variant="primary" size="sm" disabled className={primaryBg}>
                  CSP-J
                </Button>
              ) : (
                <Link to="/learning-path/level/CSP-J">
                  <Button variant="outline" size="sm">
                    CSP-J
                  </Button>
                </Link>
              )}
              {pathLevel === 'CSP-S' ? (
                <Button variant="primary" size="sm" disabled className={primaryBg}>
                  CSP-S
                </Button>
              ) : (
                <Link to="/learning-path/level/CSP-S">
                  <Button variant="outline" size="sm">
                    CSP-S
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Learning Path Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {learningPath.nodes.map((node, index) => {
          const kp = getKnowledgePointById(node.knowledgePointId);
          const progress = getProgress(node.knowledgePointId);
          const unlocked = isUnlocked(index, node.prerequisites);
          const mastery = progress?.masteryLevel || 0;
          const completed = progress?.completedProblems || 0;
          const totalProblems = getProblemsByKnowledgePoint(node.knowledgePointId).length;
          const diff = difficultyConfig[kp?.difficulty as keyof typeof difficultyConfig] || difficultyConfig[1];
          const isCompleted = mastery >= 90;
          
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                hover={unlocked}
                className={`p-5 h-full transition-all duration-300 ${
                  !unlocked ? 'opacity-50' : ''
                } ${isCompleted ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg ${diff.bg} border ${diff.border} flex items-center justify-center`}>
                        <span className="text-xs font-bold" style={{ color: diff.color }}>
                          {index + 1}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${diff.bg}`} style={{ color: diff.color }}>
                        {diff.label}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle size={14} />
                          已掌握
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-neutral-800 mb-1">
                      {kp?.name}
                    </h3>
                    
                    <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
                      {kp?.description}
                    </p>
                    
                    {unlocked ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-500">掌握度</span>
                          <span className="font-medium" style={{ color: getMasteryColor(mastery) }}>
                            {mastery}%
                          </span>
                        </div>
                        <ProgressBar
                          value={mastery}
                          color={getMasteryColor(mastery)}
                          height={4}
                        />
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span>进度 {completed}/{totalProblems} 题</span>
                          <span>{getMasteryLevel(mastery)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Lock size={14} />
                        <span>需先掌握：{node.prerequisites.map(p => getKnowledgePointName(p)).join('、')}</span>
                      </div>
                    )}
                  </div>
                  
                  {unlocked && (
                    <Link to={`/learning-path/kp/${node.knowledgePointId}`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="shrink-0"
                      >
                        {isCompleted ? (
                          <ArrowRight size={18} />
                        ) : (
                          <>
                            <BookOpen size={16} className="mr-1" />
                            学习
                          </>
                        )}
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Tips Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <Target size={20} className={isCSPJ ? 'text-blue-500' : 'text-purple-500'} />
          学习建议
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-blue-500" />
              <p className="font-medium text-blue-800">循序渐进</p>
            </div>
            <p className="text-sm text-blue-600">按照路径顺序学习，确保每个知识点扎实掌握后再进入下一个</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-green-500" />
              <p className="font-medium text-green-800">精做题量</p>
            </div>
            <p className="text-sm text-green-600">每个知识点完成足够练习题，理论与实践相结合</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-amber-500" />
              <p className="font-medium text-amber-800">定期复习</p>
            </div>
            <p className="text-sm text-amber-600">针对薄弱环节加强练习，形成知识网络</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
