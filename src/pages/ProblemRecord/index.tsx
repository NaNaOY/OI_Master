import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { problemList } from '@/data/problemList';
import { useUserStore } from '@/store/useUserStore';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Check, Clock, ExternalLink, Filter, Search, SortAsc, SortDesc, Trash2, Trophy, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3 } 
  }
};

export const ProblemRecord = () => {
  const { userData, clearCompletedProblem } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'difficulty'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  
  // 根据平台获取题目链接
  const getProblemLink = (platform: string, problemId: string): string => {
    switch (platform) {
      case '洛谷':
        return `https://www.luogu.com.cn/problem/${problemId}`;
      case '蓝桥杯':
        return `https://www.lanqiao.cn/problems/${problemId}/learning/`;
      case 'LeetCode':
        return `https://leetcode.cn/problems/${problemId}/`;
      case '杭电OJ':
      case '杭电 OJ':
        return `http://acm.hdu.edu.cn/showproblem.php?pid=${problemId}`;
      default:
        return '#';
    }
  };
  
  // 获取已做题目的详细信息
  const completedProblemsWithDetails = userData.completedProblems.map(cp => {
    const problemDetail = problemList.find(p => p.id === cp.problemId);
    return {
      ...cp,
      detail: problemDetail,
    };
  }).filter(cp => cp.detail);
  
  // 搜索过滤
  let filteredProblems = completedProblemsWithDetails.filter(cp => {
    if (!cp.detail) return false;
    const matchesSearch = searchTerm === '' || 
      cp.detail.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cp.detail.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cp.detail.problemId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || cp.detail.difficulty === filterDifficulty;
    const matchesPlatform = filterPlatform === 'all' || cp.detail.platform === filterPlatform;
    return matchesSearch && matchesDifficulty && matchesPlatform;
  });
  
  // 排序
  filteredProblems = filteredProblems.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.completedAt).getTime();
      const dateB = new Date(b.completedAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else {
      const order = { easy: 0, medium: 1, hard: 2 };
      const diffA = order[a.detail?.difficulty || 'easy'];
      const diffB = order[b.detail?.difficulty || 'easy'];
      return sortOrder === 'desc' ? diffB - diffA : diffA - diffB;
    }
  });
  
  // 获取所有平台
  const platforms = ['all', ...new Set(problemList.map(p => p.platform))];
  
  // 统计数据
  const totalCompleted = completedProblemsWithDetails.length;
  const easyCount = completedProblemsWithDetails.filter(cp => cp.detail?.difficulty === 'easy').length;
  const mediumCount = completedProblemsWithDetails.filter(cp => cp.detail?.difficulty === 'medium').length;
  const hardCount = completedProblemsWithDetails.filter(cp => cp.detail?.difficulty === 'hard').length;
  
  const handleDelete = (problemId: string) => {
    clearCompletedProblem(problemId);
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 头部 */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
          
          <div className="relative">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BookOpen size={16} />
              <span className="text-sm font-medium">做题记录本</span>
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              我的做题记录
            </motion.h1>
            
            <motion.p 
              className="text-white/90 text-lg mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              记录你的每一次进步，见证成长轨迹
            </motion.p>
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <Trophy size={20} />
                  <div>
                    <span className="text-xs text-white/70">已完成</span>
                    <span className="block text-2xl font-bold">{totalCompleted}</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <Check size={20} className="text-green-300" />
                  <div>
                    <span className="text-xs text-white/70">简单题</span>
                    <span className="block text-2xl font-bold">{easyCount}</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-amber-300" />
                  <div>
                    <span className="text-xs text-white/70">中等题</span>
                    <span className="block text-2xl font-bold">{mediumCount}</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <Trophy size={20} className="text-red-300" />
                  <div>
                    <span className="text-xs text-white/70">困难题</span>
                    <span className="block text-2xl font-bold">{hardCount}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* 搜索和筛选 */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="搜索题目名称、分类或题号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* 难度筛选 */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-neutral-400" />
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value as 'all' | 'easy' | 'medium' | 'hard')}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 outline-none transition-all"
              >
                <option value="all">全部难度</option>
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
            
            {/* 平台筛选 */}
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 outline-none transition-all"
            >
              <option value="all">全部平台</option>
              {platforms.filter(p => p !== 'all').map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            
            {/* 排序 */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'difficulty')}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 outline-none transition-all"
              >
                <option value="date">按日期</option>
                <option value="difficulty">按难度</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-2.5 rounded-xl border border-neutral-200 hover:border-primary-500 transition-all"
              >
                {sortOrder === 'desc' ? <SortDesc size={18} /> : <SortAsc size={18} />}
              </motion.button>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* 题目列表 */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 border border-neutral-100/50 shadow-lg rounded-2xl">
          {filteredProblems.length > 0 ? (
            <div className="space-y-3">
              {filteredProblems.map((cp, index) => {
                const detail = cp.detail!;
                const completedDate = new Date(cp.completedAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                
                return (
                  <motion.div
                    key={cp.problemId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100/30 border border-neutral-100 hover:border-primary-200 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      detail.difficulty === 'easy' 
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-600' 
                        : detail.difficulty === 'medium'
                        ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600'
                        : 'bg-gradient-to-br from-red-100 to-rose-100 text-red-600'
                    }`}>
                      <Check size={18} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-neutral-800">{detail.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          detail.difficulty === 'easy' 
                            ? 'bg-green-100 text-green-600' 
                            : detail.difficulty === 'medium'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {detail.difficulty === 'easy' ? '简单' : detail.difficulty === 'medium' ? '中等' : '困难'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                          {detail.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">{detail.platform}</span>
                        <span className="text-neutral-400">{detail.problemId}</span>
                        <span className="text-neutral-300">|</span>
                        <Calendar size={14} className="text-neutral-400" />
                        <span className="text-neutral-400">{completedDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.a
                        href={getProblemLink(detail.platform, detail.problemId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-indigo-500 text-white text-sm font-medium hover:from-primary-600 hover:to-indigo-600 transition-all shadow-md"
                      >
                        <ExternalLink size={14} />
                        再练一次
                      </motion.a>
                      
                      <motion.button
                        onClick={() => handleDelete(cp.problemId)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                        title="删除记录"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen size={24} className="text-neutral-400" />
              </motion.div>
              <p className="text-neutral-500 mb-2">暂无做题记录</p>
              <p className="text-sm text-neutral-400">完成题目后会自动记录在这里</p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                <Link to="/daily">
                  <Button className="bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 shadow-lg px-6 py-3 rounded-xl">
                    <ExternalLink size={18} className="mr-2" />
                    开始做题
                  </Button>
                </Link>
              </motion.div>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};