import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { getAIResponse, getGenericAIResponse } from '@/data/aiResponses';
import { getProblemById } from '@/data/problems';
import { useUserStore } from '@/store/useUserStore';
import { getKnowledgePointName, getProblemTitle } from '@/utils/analysis';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, BookOpen, CheckCircle, Code, Lightbulb, Sparkles, Target } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

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

export const MistakeAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData, markMistakeReviewed } = useUserStore();
  
  const mistake = userData.mistakes.find(m => m.id === id);
  
  if (!mistake) {
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
            <AlertTriangle className="w-10 h-10 text-neutral-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-neutral-800 mb-3">错题记录不存在</h3>
          <p className="text-neutral-500 mb-8">请返回错题本查看所有错题</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => navigate('/mistakes')} className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-8 py-3 rounded-xl">
              <ArrowLeft size={18} className="mr-2" />
              返回错题本
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    );
  }
  
  const problem = getProblemById(mistake.problemId);
  const kpId = problem?.knowledgePoints[0] || '';
  const aiResponse = getAIResponse(mistake.errorType, kpId) || getGenericAIResponse(mistake.errorType);
  
  const getErrorTypeConfig = (type: string) => {
    const configs: Record<string, { label: string; gradient: string; bg: string }> = {
      wrong_answer: { label: '答案错误', gradient: 'from-red-500 to-rose-600', bg: 'bg-gradient-to-br from-red-50 to-rose-50' },
      runtime_error: { label: '运行时错误', gradient: 'from-amber-500 to-orange-600', bg: 'bg-gradient-to-br from-amber-50 to-orange-50' },
      time_limit_exceeded: { label: '超时', gradient: 'from-violet-500 to-purple-600', bg: 'bg-gradient-to-br from-violet-50 to-purple-50' },
      compile_error: { label: '编译错误', gradient: 'from-neutral-500 to-neutral-600', bg: 'bg-gradient-to-br from-neutral-50 to-neutral-100' },
    };
    return configs[type] || configs.compile_error;
  };
  
  const errorConfig = getErrorTypeConfig(mistake.errorType);
  
  const difficultyConfig = problem ? {
    easy: { label: '简单', gradient: 'from-emerald-500 to-green-600', bg: 'bg-gradient-to-br from-emerald-50 to-green-50' },
    medium: { label: '中等', gradient: 'from-amber-500 to-orange-600', bg: 'bg-gradient-to-br from-amber-50 to-orange-50' },
    hard: { label: '困难', gradient: 'from-red-500 to-rose-600', bg: 'bg-gradient-to-br from-red-50 to-rose-50' },
  }[problem.difficulty] : null;
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* 头部导航 */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <motion.button
          onClick={() => navigate('/mistakes')}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-700 transition-colors group"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={20} />
          <span className="font-medium group-hover:text-primary-600">返回错题本</span>
        </motion.button>
        
        {!mistake.reviewed && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => markMistakeReviewed(mistake.id)}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg px-6 py-3 rounded-xl"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <CheckCircle size={18} className="mr-2" />
              </motion.div>
              标记已复习
            </Button>
          </motion.div>
        )}
      </motion.div>
      
      {/* 题目信息 */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-red-100/50 to-transparent rounded-full blur-2xl opacity-50" />
          
          <motion.div 
            className="flex items-center gap-5 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className={`w-14 h-14 rounded-2xl ${errorConfig.bg} flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            >
              <AlertTriangle size={28} className={`text-gradient ${errorConfig.gradient}`} />
            </motion.div>
            <div>
              <motion.h1 
                className="text-2xl font-bold text-neutral-800 tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {getProblemTitle(mistake.problemId)}
              </motion.h1>
              <motion.div 
                className="flex items-center gap-3 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.span 
                  className={`px-4 py-1.5 rounded-xl text-sm font-bold bg-gradient-to-r ${errorConfig.gradient} text-white shadow-md`}
                  whileHover={{ scale: 1.1 }}
                >
                  {errorConfig.label}
                </motion.span>
                {difficultyConfig && (
                  <motion.span 
                    className={`px-4 py-1.5 rounded-xl text-sm font-bold bg-gradient-to-r ${difficultyConfig.gradient} text-white shadow-md`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {difficultyConfig.label}
                  </motion.span>
                )}
                {/* 知识点标签 */}
                {problem && problem.knowledgePoints.length > 0 && (
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {problem.knowledgePoints.map((kpId, idx) => (
                      <motion.span
                        key={kpId}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl text-xs font-medium border border-blue-100/50"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        {getKnowledgePointName(kpId)}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 gap-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <motion.h3 
                className="font-semibold text-neutral-700 mb-4 flex items-center gap-3 text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Code size={20} className="text-violet-500" />
                </motion.div>
                提交代码
              </motion.h3>
              <motion.pre 
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-neutral-100 p-5 rounded-xl text-sm overflow-x-auto max-h-[300px] overflow-y-auto border border-neutral-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {mistake.code}
              </motion.pre>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <motion.h3 
                className="font-semibold text-neutral-700 mb-4 flex items-center gap-3 text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle size={20} className="text-red-500" />
                </motion.div>
                错误原因分析
              </motion.h3>
              <motion.div 
                className="p-5 bg-gradient-to-r from-red-50 to-transparent rounded-xl border border-red-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-red-700 font-medium leading-relaxed">{aiResponse?.analysis.rootCause || mistake.aiAnalysis}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
      
      {/* AI分析内容 */}
      {aiResponse && (
        <>
          {/* 常见错误 */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full blur-2xl opacity-50" />
              
              <motion.h3 
                className="font-bold text-neutral-800 mb-6 flex items-center gap-3 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lightbulb size={22} className="text-amber-500" />
                </motion.div>
                常见错误
              </motion.h3>
              
              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={containerVariants}
              >
                {aiResponse.analysis.commonMistakes.map((mistakeItem) => (
                  <motion.div
                    key={mistakeItem}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-transparent rounded-xl border border-amber-100/50"
                  >
                    <motion.span 
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-md"
                      whileHover={{ scale: 1.1 }}
                    >
                      {aiResponse.analysis.commonMistakes.indexOf(mistakeItem) + 1}
                    </motion.span>
                    <span className="text-sm text-amber-700 font-medium">{mistakeItem}</span>
                  </motion.div>
                ))}
              </motion.div>
            </Card>
          </motion.div>
          
          {/* 改进建议 */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full blur-2xl opacity-50" />
              
              <motion.h3 
                className="font-bold text-neutral-800 mb-6 flex items-center gap-3 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen size={22} className="text-emerald-500" />
                </motion.div>
                改进建议
              </motion.h3>
              
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
              >
                {aiResponse.analysis.suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-5 bg-gradient-to-r from-emerald-50 to-transparent rounded-xl border border-emerald-100/50"
                  >
                    <motion.span 
                      className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white text-sm font-bold flex items-center justify-center shadow-md"
                      whileHover={{ scale: 1.1 }}
                    >
                      {aiResponse.analysis.suggestions.indexOf(suggestion) + 1}
                    </motion.span>
                    <span className="text-neutral-700 font-medium leading-relaxed">{suggestion}</span>
                  </motion.div>
                ))}
              </motion.div>
            </Card>
          </motion.div>
          
          {/* 代码对比 */}
          {aiResponse.analysis.codeExamples && aiResponse.analysis.codeExamples.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
                {/* 背景装饰 */}
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-blue-100/50 to-transparent rounded-full blur-2xl opacity-50" />
                
                <motion.h3 
                  className="font-bold text-neutral-800 mb-6 flex items-center gap-3 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Code size={22} className="text-blue-500" />
                  </motion.div>
                  代码对比
                </motion.h3>
                
                <motion.div 
                  className="grid grid-cols-2 gap-6"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <motion.h4 
                      className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <AlertTriangle size={16} />
                      错误代码
                    </motion.h4>
                    <pre className="bg-gradient-to-br from-red-50 to-neutral-100 p-4 rounded-xl text-sm overflow-x-auto border border-red-100">
                      {aiResponse.analysis.codeExamples[0].wrongCode}
                    </pre>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <motion.h4 
                      className="text-sm font-bold text-emerald-600 mb-3 flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <CheckCircle size={16} />
                      正确代码
                    </motion.h4>
                    <pre className="bg-gradient-to-br from-emerald-50 to-neutral-100 p-4 rounded-xl text-sm overflow-x-auto border border-emerald-100">
                      {aiResponse.analysis.codeExamples[0].correctCode}
                    </pre>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm text-blue-700 font-medium">
                    <strong>说明：</strong>{aiResponse.analysis.codeExamples[0].explanation}
                  </p>
                </motion.div>
              </Card>
            </motion.div>
          )}
          
          {/* 相关知识点 */}
          {aiResponse.analysis.relatedKnowledgePoints && aiResponse.analysis.relatedKnowledgePoints.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="p-8 border border-neutral-100/50 shadow-lg rounded-2xl overflow-hidden relative">
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-100/50 to-transparent rounded-full blur-2xl opacity-50" />
                
                <motion.h3 
                  className="font-bold text-neutral-800 mb-5 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  相关知识点
                </motion.h3>
                
                <motion.div 
                  className="flex flex-wrap gap-3"
                  variants={containerVariants}
                >
                  {aiResponse.analysis.relatedKnowledgePoints.map(kpId => (
                    <motion.span
                      key={kpId}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 bg-gradient-to-r from-primary-50 to-indigo-50 text-primary-600 rounded-xl text-sm font-medium border border-primary-100/50"
                    >
                      {getKnowledgePointName(kpId)}
                    </motion.span>
                  ))}
                </motion.div>
              </Card>
            </motion.div>
          )}
        </>
      )}
      
      {/* 底部按钮 */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-center gap-5 pt-4"
      >
        {problem && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => navigate(`/daily/problem/${problem.id}`)}
              className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-8 py-3 rounded-xl font-semibold"
            >
              <Sparkles size={18} className="mr-2" />
              重新练习
            </Button>
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            onClick={() => navigate('/daily')}
            className="border-neutral-200 px-8 py-3 rounded-xl font-semibold"
          >
            <Target size={18} className="mr-2" />
            继续刷题
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};