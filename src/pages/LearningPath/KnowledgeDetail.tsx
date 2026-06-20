import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, ClipboardList, ArrowRight, Code, CheckCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ProgressBar } from '@/components/common/ProgressBar';
import { getKnowledgePointById } from '@/data/knowledgePoints';
import { getProblemsByKnowledgePoint } from '@/data/problems';
import { getMasteryColor, getMasteryLevel, getDifficultyColor } from '@/utils/analysis';
import { useParams, Link } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';

export const KnowledgeDetail = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const { userData } = useUserStore();
  
  const kp = getKnowledgePointById(nodeId || '');
  const problems = getProblemsByKnowledgePoint(nodeId || '');
  const progress = userData.learningProgress.find(p => p.knowledgePointId === nodeId);
  
  const mastery = progress?.masteryLevel || 0;
  
  if (!kp) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">知识点不存在</p>
      </div>
    );
  }
  
  const resourceTypeIcons = {
    video: <Video size={16} />,
    article: <FileText size={16} />,
    practice: <ClipboardList size={16} />,
  };
  
  const resourceTypeLabels = {
    video: '视频',
    article: '文章',
    practice: '练习',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/learning-path" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← 返回学习路径
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{kp.name}</h1>
          <p className="text-gray-500 mt-1">{kp.category}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">掌握度</p>
          <p className="text-3xl font-bold" style={{ color: getMasteryColor(mastery) }}>
            {mastery}%
          </p>
          <p className="text-sm" style={{ color: getMasteryColor(mastery) }}>
            {getMasteryLevel(mastery)}
          </p>
        </div>
      </div>
      
      <Card className="p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          知识点介绍
        </h3>
        <p className="text-gray-600 leading-relaxed">{kp.description}</p>
        
        {kp.prerequisites.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">前置知识：</p>
            <div className="flex flex-wrap gap-2">
              {kp.prerequisites.map(prereq => {
                const prereqKp = getKnowledgePointById(prereq);
                return (
                  <span
                    key={prereq}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {prereqKp?.name || prereq}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </Card>
      
      <Card className="p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">学习资源</h3>
        <div className="grid grid-cols-3 gap-4">
          {kp.learningResources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500">{resourceTypeIcons[resource.type]}</span>
                <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                  {resourceTypeLabels[resource.type]}
                </span>
              </div>
              <p className="font-medium text-gray-700 text-sm">{resource.title}</p>
            </motion.div>
          ))}
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Code size={20} />
            相关题目
          </h3>
          <span className="text-sm text-gray-500">{problems.length} 道</span>
        </div>
        
        <div className="space-y-3">
          {problems.map((problem, index) => {
            const completedRecord = userData.completedProblems.find(cp => cp.problemId === problem.id);
            const isCompleted = completedRecord?.status === 'accepted';
            
            return (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
                    style={{ backgroundColor: `${getDifficultyColor(problem.difficulty)}15`, color: getDifficultyColor(problem.difficulty) }}
                  >
                    {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 flex items-center gap-2">
                      {problem.title}
                      {isCompleted && <CheckCircle size={16} className="text-green-500" />}
                    </p>
                    <p className="text-sm text-gray-500">{problem.hints[0]}</p>
                  </div>
                </div>
                {isCompleted ? (
                  <Link to={`/daily/problem/${problem.id}`} className="text-sm text-green-600 font-medium hover:underline">
                    已完成 ✓
                  </Link>
                ) : (
                  <Link to={`/daily/problem/${problem.id}`}>
                    <Button variant="outline" size="sm">
                      开始练习
                      <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
      
      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-2">学习进度</p>
            <ProgressBar
              value={mastery}
              color={getMasteryColor(mastery)}
              height={12}
              className="w-64"
            />
          </div>
          <Link to="/daily">
            <Button>
              继续练习
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};