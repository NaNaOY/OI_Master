// NOI题单数据
// 来源：题单.xlsx

import { knowledgePoints } from './knowledgePoints';

export interface ProblemItem {
  id: string;
  category: string; // 知识点分类（与诊断知识点对应）
  platform: string; // 来源平台（洛谷/蓝桥杯/LeetCode等）
  problemId: string; // 题号
  title: string; // 题目名称
  difficulty: 'easy' | 'medium' | 'hard'; // 难度
}

// CSP-J 知识点与题单分类的精确映射
// j1: 程序设计基础（输入输出、变量） -> 基础语法/简单模拟
// j2: 选择结构（if语句） -> 基础语法/选择结构
// j3: 循环结构（for/while） -> 基础语法/循环结构
// j4: 数组 -> 基础语法/数组
// j5: 字符串 -> 基础语法/字符串
// j6: 函数与递归 -> 函数与递归
// j7: 动态规划基础 -> 动态规划入门
// j8: 搜索算法 -> 搜索入门
// j9: 排序与贪心 -> 排序贪心
// j10: 数学基础 -> 数学基础

// CSP-S 知识点与题单分类的精确映射
// s1: 递归与分治 -> 分治递归
// s2: 栈与队列 -> 栈队列
// s3: 链表 -> 链表
// s4: 树与二叉树 -> 二叉树
// s5: 图论基础 -> 图论基础
// s6: 动态规划进阶 -> 动态规划进阶
// s7: 数学进阶 -> 数学进阶
// s8: 高级数据结构 -> 高级数据结构
// s9: 图论算法 -> 图论算法
// s10: 动态规划专题 -> 动态规划专题
// s11: 高级算法 -> 高级算法
// s12: 数论基础 -> 数论基础
// s13: 组合数学 -> 组合数学
// s14: 计算几何 -> 计算几何

// 知识点到题目分类的映射
export const knowledgeToCategory: Record<string, string[]> = {
  // CSP-J 基础语法部分
  'j1': ['基础语法', '简单模拟'], // 程序设计基础
  'j2': ['选择结构', '条件判断'], // 选择结构
  'j3': ['循环结构', '递推'], // 循环结构
  'j4': ['数组应用', '模拟'], // 数组
  'j5': ['字符串处理', '模拟'], // 字符串
  'j6': ['递归函数', '分治'], // 函数与递归
  'j7': ['动态规划入门', '记忆化搜索'], // 动态规划基础
  'j8': ['搜索入门', 'BFS', 'DFS'], // 搜索算法
  'j9': ['排序', '贪心'], // 排序与贪心
  'j10': ['数学基础', '思维'], // 数学基础
  
  // CSP-S 进阶部分
  's1': ['分治', '递归'], // 递归与分治
  's2': ['栈', '队列', '单调栈'], // 栈与队列
  's3': ['链表', '模拟'], // 链表
  's4': ['二叉树', '树形结构'], // 树与二叉树
  's5': ['图论基础', '搜索'], // 图论基础
  's6': ['动态规划进阶', '背包'], // 动态规划进阶
  's7': ['数学进阶', '数论'], // 数学进阶
  's8': ['线段树', '树状数组', '单调队列'], // 高级数据结构
  's9': ['最短路', '最小生成树'], // 图论算法
  's10': ['区间DP', '树形DP', '状压DP'], // 动态规划专题
  's11': ['KMP', 'AC自动机', '哈希'], // 高级算法
  's12': ['数论基础', '数学'], // 数论基础
  's13': ['组合数学', '概率'], // 组合数学
  's14': ['计算几何'], // 计算几何
};

// 题单数据
export const problemList: ProblemItem[] = [
  // ==================== 基础语法部分（CSP-J j1-j5） ====================
  
  // 基础语法 - 洛谷入门题目
  { id: 'basic-1', category: '基础语法', platform: '洛谷', problemId: 'P1000', title: '超级玛丽游戏', difficulty: 'easy' },
  { id: 'basic-2', category: '基础语法', platform: '洛谷', problemId: 'P1001', title: 'A+B Problem', difficulty: 'easy' },
  { id: 'basic-3', category: '基础语法', platform: '洛谷', problemId: 'P1002', title: 'A+B Problem', difficulty: 'easy' },
  { id: 'basic-4', category: '基础语法', platform: '洛谷', problemId: 'P1003', title: '铺地毯', difficulty: 'easy' },
  { id: 'basic-5', category: '基础语法', platform: '洛谷', problemId: 'P1008', title: '大力水手', difficulty: 'easy' },
  
  // 简单模拟 - 洛谷入门
  { id: 'simple-1', category: '简单模拟', platform: '洛谷', problemId: 'P1420', title: '最长连号', difficulty: 'easy' },
  { id: 'simple-2', category: '简单模拟', platform: '洛谷', problemId: 'P1421', title: '小玉买文具', difficulty: 'easy' },
  { id: 'simple-3', category: '简单模拟', platform: '洛谷', problemId: 'P1422', title: '小玉家的电费', difficulty: 'easy' },
  { id: 'simple-4', category: '简单模拟', platform: '洛谷', problemId: 'P1423', title: '小玉在游泳', difficulty: 'easy' },
  { id: 'simple-5', category: '简单模拟', platform: '洛谷', problemId: 'P1424', title: '小玉的游泳路线', difficulty: 'easy' },
  
  // 选择结构
  { id: 'if-1', category: '选择结构', platform: '洛谷', problemId: 'P1425', title: '小鱼的游泳时间', difficulty: 'easy' },
  { id: 'if-2', category: '选择结构', platform: '洛谷', problemId: 'P1426', title: '小鱼会有危险吗', difficulty: 'easy' },
  { id: 'if-3', category: '选择结构', platform: '洛谷', problemId: 'P1427', title: '小鱼的固执', difficulty: 'easy' },
  { id: 'if-4', category: '选择结构', platform: '洛谷', problemId: 'P1428', title: '小鱼比丑', difficulty: 'easy' },
  { id: 'if-5', category: '选择结构', platform: '洛谷', problemId: 'P1429', title: '蛋糕切割', difficulty: 'easy' },
  
  // 循环结构
  { id: 'loop-1', category: '循环结构', platform: '洛谷', problemId: 'P1428', title: '小鱼比丑', difficulty: 'easy' },
  { id: 'loop-2', category: '循环结构', platform: '洛谷', problemId: 'P1430', title: '小鱼的凝视', difficulty: 'easy' },
  { id: 'loop-3', category: '循环结构', platform: '洛谷', problemId: 'P1431', title: '小鱼的等待', difficulty: 'easy' },
  { id: 'loop-4', category: '循环结构', platform: '洛谷', problemId: 'P1432', title: '小鱼的旅行', difficulty: 'easy' },
  { id: 'loop-5', category: '循环结构', platform: '洛谷', problemId: 'P1433', title: '小红吃苹果', difficulty: 'easy' },
  
  // 数组应用
  { id: 'array-1', category: '数组应用', platform: '洛谷', problemId: 'P1428', title: '小鱼比丑', difficulty: 'easy' },
  { id: 'array-2', category: '数组应用', platform: '洛谷', problemId: 'P1443', title: '马的遍历', difficulty: 'easy' },
  { id: 'array-3', category: '数组应用', platform: '洛谷', problemId: 'P1464', title: 'Compliment', difficulty: 'easy' },
  { id: 'array-4', category: '数组应用', platform: '洛谷', problemId: 'P1465', title: '眷恋', difficulty: 'easy' },
  { id: 'array-5', category: '数组应用', platform: '洛谷', problemId: 'P1467', title: '简单背包', difficulty: 'easy' },
  
  // 字符串处理
  { id: 'string-1', category: '字符串处理', platform: '洛谷', problemId: 'P1050', title: 'Noip 循环', difficulty: 'medium' },
  { id: 'string-2', category: '字符串处理', platform: '洛谷', problemId: 'P1051', title: 'Car的旅行路线', difficulty: 'medium' },
  { id: 'string-3', category: '字符串处理', platform: '洛谷', problemId: 'P1052', title: 'Tian Ji', difficulty: 'medium' },
  { id: 'string-4', category: '字符串处理', platform: '洛谷', problemId: 'P1053', title: '庄严的神殿', difficulty: 'medium' },
  { id: 'string-5', category: '字符串处理', platform: '洛谷', problemId: 'P1054', title: 'Canvas', difficulty: 'medium' },
  
  // ==================== 进阶基础部分（CSP-J j6-j10） ====================
  
  // 递归函数
  { id: 'func-1', category: '递归函数', platform: '洛谷', problemId: 'P1498', title: '红与黑', difficulty: 'easy' },
  { id: 'func-2', category: '递归函数', platform: '洛谷', problemId: 'P1505', title: '数据中心', difficulty: 'medium' },
  { id: 'func-3', category: '递归函数', platform: '洛谷', problemId: 'P1506', title: '拯救Oier', difficulty: 'medium' },
  { id: 'func-4', category: '递归函数', platform: '洛谷', problemId: 'P1507', title: 'Cow Curling', difficulty: 'hard' },
  { id: 'func-5', category: '递归函数', platform: '洛谷', problemId: 'P1508', title: 'Cowline', difficulty: 'hard' },
  
  // 动态规划入门
  { id: 'dp-intro-1', category: '动态规划入门', platform: '洛谷', problemId: 'P1044', title: '购物', difficulty: 'easy' },
  { id: 'dp-intro-2', category: '动态规划入门', platform: '洛谷', problemId: 'P1045', title: '亲和数', difficulty: 'easy' },
  { id: 'dp-intro-3', category: '动态规划入门', platform: '洛谷', problemId: 'P1046', title: '读取杨辉三角', difficulty: 'easy' },
  { id: 'dp-intro-4', category: '动态规划入门', platform: '洛谷', problemId: 'P1047', title: '读取杨辉三角2', difficulty: 'easy' },
  { id: 'dp-intro-5', category: '动态规划入门', platform: '洛谷', problemId: 'P1048', title: '采药', difficulty: 'easy' },
  { id: 'dp-intro-6', category: '动态规划入门', platform: '洛谷', problemId: 'P1049', title: '装箱问题', difficulty: 'easy' },
  { id: 'dp-intro-7', category: '动态规划入门', platform: '洛谷', problemId: 'P1050', title: '循环', difficulty: 'medium' },
  { id: 'dp-intro-8', category: '动态规划入门', platform: '洛谷', problemId: 'P1160', title: '队列安排', difficulty: 'easy' },
  
  // 搜索入门
  { id: 'search-intro-1', category: '搜索入门', platform: '洛谷', problemId: 'P1162', title: '填色游戏', difficulty: 'medium' },
  { id: 'search-intro-2', category: '搜索入门', platform: '洛谷', problemId: 'P1163', title: 'Bangalore Towers', difficulty: 'medium' },
  { id: 'search-intro-3', category: '搜索入门', platform: '洛谷', problemId: 'P1164', title: '小 A 点菜', difficulty: 'easy' },
  { id: 'search-intro-4', category: '搜索入门', platform: '洛谷', problemId: 'P1165', title: 'Alphacode', difficulty: 'medium' },
  { id: 'search-intro-5', category: '搜索入门', platform: '洛谷', problemId: 'P1166', title: 'Birijin', difficulty: 'medium' },
  
  // 排序与贪心
  { id: 'sort-1', category: '排序', platform: '洛谷', problemId: 'P1051', title: 'Car的旅行路线', difficulty: 'medium' },
  { id: 'sort-2', category: '排序', platform: '洛谷', problemId: 'P1068', title: '分数线划定', difficulty: 'easy' },
  { id: 'sort-3', category: '排序', platform: '洛谷', problemId: 'P1069', title: '细胞分裂', difficulty: 'medium' },
  { id: 'sort-4', category: '排序', platform: '洛谷', problemId: 'P1070', title: 'Vanya and Triangles', difficulty: 'hard' },
  { id: 'sort-5', category: '排序', platform: '洛谷', problemId: 'P1071', title: 'USACO 驯化迁徙', difficulty: 'medium' },
  { id: 'greedy-1', category: '贪心', platform: '洛谷', problemId: 'P1090', title: '合并果子', difficulty: 'easy' },
  { id: 'greedy-2', category: '贪心', platform: '洛谷', problemId: 'P1095', title: '津津的储蓄计划', difficulty: 'easy' },
  { id: 'greedy-3', category: '贪心', platform: '洛谷', problemId: 'P1096', title: ' Hanoi 双塔问题', difficulty: 'easy' },
  { id: 'greedy-4', category: '贪心', platform: '洛谷', problemId: 'P1097', title: '水仙花数', difficulty: 'easy' },
  { id: 'greedy-5', category: '贪心', platform: '洛谷', problemId: 'P1098', title: '等价表达式', difficulty: 'medium' },
  
  // 数学基础
  { id: 'math-basic-1', category: '数学基础', platform: '洛谷', problemId: 'P1086', title: '台球碰撞', difficulty: 'medium' },
  { id: 'math-basic-2', category: '数学基础', platform: '洛谷', problemId: 'P1087', title: 'FBI树', difficulty: 'easy' },
  { id: 'math-basic-3', category: '数学基础', platform: '洛谷', problemId: 'P1088', title: '月球车', difficulty: 'medium' },
  { id: 'math-basic-4', category: '数学基础', platform: '洛谷', problemId: 'P1089', title: 'Quicksum', difficulty: 'easy' },
  { id: 'math-basic-5', category: '数学基础', platform: '洛谷', problemId: 'P1090', title: '合并果子', difficulty: 'easy' },
  { id: 'math-basic-6', category: '思维', platform: '洛谷', problemId: 'P1091', title: '合唱队形', difficulty: 'medium' },
  { id: 'math-basic-7', category: '思维', platform: '洛谷', problemId: 'P1092', title: 'Kinot', difficulty: 'hard' },
  { id: 'math-basic-8', category: '思维', platform: '洛谷', problemId: 'P1093', title: '百练', difficulty: 'medium' },
  { id: 'math-basic-9', category: '思维', platform: '蓝桥杯', problemId: '19709', title: '好数', difficulty: 'easy' },
  { id: 'math-basic-10', category: '思维', platform: '蓝桥杯', problemId: '3491', title: '幸运数', difficulty: 'easy' },
  
  // ==================== CSP-S 进阶部分 ====================
  
  // 分治
  { id: 'divide-1', category: '分治', platform: '洛谷', problemId: 'P1052', title: 'Tian Ji', difficulty: 'medium' },
  { id: 'divide-2', category: '分治', platform: '洛谷', problemId: 'P1225', title: '黑白棋子的移动', difficulty: 'hard' },
  { id: 'divide-3', category: '分治', platform: '洛谷', problemId: 'P1226', title: '快速幂|取余运算', difficulty: 'easy' },
  { id: 'divide-4', category: '分治', platform: '洛谷', problemId: 'P1227', title: 'The Suspects', difficulty: 'medium' },
  { id: 'divide-5', category: '分治', platform: '洛谷', problemId: 'P1228', title: '地毯填补', difficulty: 'hard' },
  
  // 栈与队列
  { id: 'stack-1', category: '栈', platform: '洛谷', problemId: 'P1165', title: 'Alphacode', difficulty: 'medium' },
  { id: 'stack-2', category: '栈', platform: '洛谷', problemId: 'P1175', title: '负数进制转换', difficulty: 'medium' },
  { id: 'stack-3', category: '栈', platform: '洛谷', problemId: 'P1176', title: '字符串变换', difficulty: 'medium' },
  { id: 'stack-4', category: '单调栈', platform: '洛谷', problemId: 'P5788', title: '单调栈', difficulty: 'medium' },
  { id: 'queue-1', category: '队列', platform: '洛谷', problemId: 'P1160', title: '队列安排', difficulty: 'easy' },
  
  // 二叉树
  { id: 'tree-1', category: '二叉树', platform: '洛谷', problemId: 'P1030', title: '求先序排列', difficulty: 'easy' },
  { id: 'tree-2', category: '二叉树', platform: '洛谷', problemId: 'P1229', title: '遍历问题', difficulty: 'easy' },
  { id: 'tree-3', category: '二叉树', platform: '洛谷', problemId: 'P1087', title: 'FBI树', difficulty: 'easy' },
  { id: 'tree-4', category: '树形结构', platform: '洛谷', problemId: 'P1827', title: '美国血统', difficulty: 'easy' },
  { id: 'tree-5', category: '树形结构', platform: '洛谷', problemId: 'P4913', title: '二叉树深度', difficulty: 'easy' },
  
  // 图论基础
  { id: 'graph-1', category: '图论基础', platform: '洛谷', problemId: 'P1330', title: '封锁阳光大学', difficulty: 'medium' },
  { id: 'graph-2', category: '搜索', platform: '洛谷', problemId: 'P1294', title: '高手去散步', difficulty: 'medium' },
  { id: 'graph-3', category: '搜索', platform: '洛谷', problemId: 'P5318', title: '查找文献', difficulty: 'medium' },
  { id: 'graph-4', category: 'BFS', platform: '洛谷', problemId: 'P1443', title: '马的遍历', difficulty: 'easy' },
  { id: 'graph-5', category: 'DFS', platform: '洛谷', problemId: 'P1498', title: '红与黑', difficulty: 'easy' },
  
  // 动态规划进阶 - 背包
  { id: 'dp-adv-1', category: '动态规划进阶', platform: '洛谷', problemId: 'P1048', title: '采药', difficulty: 'easy' },
  { id: 'dp-adv-2', category: '动态规划进阶', platform: '洛谷', problemId: 'P1049', title: '装箱问题', difficulty: 'easy' },
  { id: 'dp-adv-3', category: '背包', platform: '洛谷', problemId: 'P1060', title: '开心的金明', difficulty: 'easy' },
  { id: 'dp-adv-4', category: '背包', platform: '洛谷', problemId: 'P1164', title: '小A点菜', difficulty: 'easy' },
  { id: 'dp-adv-5', category: '背包', platform: '洛谷', problemId: 'P1510', title: '精卫填海', difficulty: 'easy' },
  { id: 'dp-adv-6', category: '背包', platform: '洛谷', problemId: 'P1855', title: '榨取kkksc03', difficulty: 'medium' },
  { id: 'dp-adv-7', category: '区间DP', platform: '洛谷', problemId: 'P2426', title: '删数', difficulty: 'medium' },
  { id: 'dp-adv-8', category: '区间DP', platform: '洛谷', problemId: 'P1775', title: '石子合并', difficulty: 'medium' },
  
  // 最短路
  { id: 'shortest-1', category: '最短路', platform: '洛谷', problemId: 'P4779', title: '单源最短路', difficulty: 'medium' },
  { id: 'shortest-2', category: '最短路', platform: '洛谷', problemId: 'P1339', title: 'Warmaw', difficulty: 'medium' },
  { id: 'shortest-3', category: '最短路', platform: '洛谷', problemId: 'P1340', title: 'Can WG', difficulty: 'medium' },
  
  // 数论基础
  { id: 'number-1', category: '数论基础', platform: '洛谷', problemId: 'P1069', title: '细胞分裂', difficulty: 'medium' },
  { id: 'number-2', category: '数论基础', platform: '洛谷', problemId: 'P1077', title: '摆花', difficulty: 'medium' },
  { id: 'number-3', category: '数论基础', platform: '洛谷', problemId: 'P1226', title: '快速幂', difficulty: 'easy' },
  { id: 'number-4', category: '数论基础', platform: '洛谷', problemId: 'P1176', title: '字符串变换', difficulty: 'medium' },
  { id: 'number-5', category: '数论基础', platform: '洛谷', problemId: 'P1179', title: '数字统计', difficulty: 'easy' },
  { id: 'number-6', category: '数论基础', platform: '洛谷', problemId: 'P1149', title: '火柴棒等式', difficulty: 'easy' },
  
  // 蓝桥杯题目补充
  { id: 'lanqiao-1', category: '思维', platform: '蓝桥杯', problemId: '1443', title: '卡片', difficulty: 'easy' },
  { id: 'lanqiao-2', category: '思维', platform: '蓝桥杯', problemId: '1065', title: '寻找2020', difficulty: 'easy' },
  { id: 'lanqiao-3', category: '思维', platform: '蓝桥杯', problemId: '19732', title: '小球反弹', difficulty: 'medium' },
  { id: 'lanqiao-4', category: '思维', platform: '蓝桥杯', problemId: '3495', title: '特殊日期', difficulty: 'easy' },
  { id: 'lanqiao-5', category: '枚举', platform: '蓝桥杯', problemId: '3492', title: '日期统计', difficulty: 'easy' },
  { id: 'lanqiao-6', category: '枚举', platform: '蓝桥杯', problemId: '19730', title: '神奇闹钟', difficulty: 'easy' },
  { id: 'lanqiao-7', category: '前缀和', platform: '蓝桥杯', problemId: '17142', title: '弹珠堆放', difficulty: 'medium' },
  { id: 'lanqiao-8', category: '前缀和', platform: '蓝桥杯', problemId: '97', title: 'k倍区间', difficulty: 'medium' },
  { id: 'lanqiao-9', category: '贪心', platform: '蓝桥杯', problemId: '3532', title: '平均', difficulty: 'easy' },
  { id: 'lanqiao-10', category: '贪心', platform: '蓝桥杯', problemId: '1596', title: '巧克力', difficulty: 'easy' },
  { id: 'lanqiao-11', category: '二分查找', platform: '蓝桥杯', problemId: '2191', title: '卡牌', difficulty: 'medium' },
  { id: 'lanqiao-12', category: '二分查找', platform: '蓝桥杯', problemId: '2129', title: '技能升级', difficulty: 'hard' },
  { id: 'lanqiao-13', category: '单调队列', platform: '蓝桥杯', problemId: '17152', title: '最大区间', difficulty: 'medium' },
  { id: 'lanqiao-14', category: '差分', platform: '蓝桥杯', problemId: '2128', title: '重新排列', difficulty: 'medium' },
];

// 根据知识点ID获取推荐的题目
export const getRecommendedProblemsByKnowledgePoint = (kpId: string): ProblemItem[] => {
  const categories = knowledgeToCategory[kpId] || [];
  if (categories.length === 0) return [];

  // 获取知识点难度
  const kp = knowledgePoints.find(k => k.id === kpId);
  const kpDifficulty = kp?.difficulty || 3;

  // 从匹配分类中筛选题目
  const matched = problemList.filter(p => categories.includes(p.category));

  if (matched.length === 0) return [];

  // 按知识点难度优先级排序，同时混入各难度题目保证多样性
  const easy = matched.filter(p => p.difficulty === 'easy');
  const medium = matched.filter(p => p.difficulty === 'medium');
  const hard = matched.filter(p => p.difficulty === 'hard');

  // 根据知识点难度确定各难度题目的比例
  let result: ProblemItem[] = [];
  if (kpDifficulty <= 2) {
    result = [...easy.slice(0, 6), ...medium.slice(0, 3), ...hard.slice(0, 1)];
  } else if (kpDifficulty <= 4) {
    result = [...medium.slice(0, 5), ...easy.slice(0, 3), ...hard.slice(0, 2)];
  } else if (kpDifficulty <= 6) {
    result = [...medium.slice(0, 4), ...hard.slice(0, 4), ...easy.slice(0, 2)];
  } else {
    result = [...hard.slice(0, 5), ...medium.slice(0, 4), ...easy.slice(0, 1)];
  }

  return result.slice(0, 10);
};

// 根据薄弱知识点列表获取推荐的题目
export const getRecommendedProblemsByWeakPoints = (weakPoints: string[]): ProblemItem[] => {
  if (weakPoints.length === 0) return [];

  const allProblems: ProblemItem[] = [];
  const addedIds = new Set<string>();

  // 对每个薄弱知识点获取推荐题目（优先难度高的知识点）
  const sortedWeakPoints = [...weakPoints].sort((a, b) => {
    const kpA = knowledgePoints.find(k => k.id === a);
    const kpB = knowledgePoints.find(k => k.id === b);
    return (kpB?.difficulty || 0) - (kpA?.difficulty || 0);
  });

  sortedWeakPoints.forEach(kpId => {
    const problems = getRecommendedProblemsByKnowledgePoint(kpId);
    problems.forEach(p => {
      if (!addedIds.has(p.id)) {
        allProblems.push(p);
        addedIds.add(p.id);
      }
    });
  });

  // 最终按知识点难度加权排序：高难度的题目排在前面
  return allProblems.sort((a, b) => {
    const order = { hard: 0, medium: 1, easy: 2 };
    return order[a.difficulty] - order[b.difficulty];
  }).slice(0, 20);
};

// 获取所有题目分类
export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  problemList.forEach(p => categories.add(p.category));
  return Array.from(categories).sort();
};

// 根据分类获取题目
export const getProblemsByCategory = (category: string): ProblemItem[] => {
  return problemList.filter(p => p.category === category);
};

// 反向映射：从题目分类获取知识点ID
export const categoryToKnowledge: Record<string, string[]> = {};
Object.entries(knowledgeToCategory).forEach(([kpId, categories]) => {
  categories.forEach(cat => {
    if (!categoryToKnowledge[cat]) {
      categoryToKnowledge[cat] = [];
    }
    categoryToKnowledge[cat].push(kpId);
  });
});

// 根据做题记录计算各知识点的掌握度
export const calculateKnowledgeMasteryFromRecords = (
  completedProblemIds: string[]
): Record<string, number> => {
  const mastery: Record<string, number> = {};
  
  // 初始化所有知识点为0
  knowledgePoints.forEach(kp => {
    mastery[kp.id] = 0;
  });
  
  // 统计每个知识点对应的题目总数和已完成数
  const kpStats: Record<string, { total: number; completed: number }> = {};
  
  knowledgePoints.forEach(kp => {
    const categories = knowledgeToCategory[kp.id] || [];
    const totalProblems = problemList.filter(p => categories.includes(p.category)).length;
    kpStats[kp.id] = { total: totalProblems, completed: 0 };
  });
  
  // 计算已完成的题目对应的知识点
  completedProblemIds.forEach(problemId => {
    const problem = problemList.find(p => p.id === problemId);
    if (problem) {
      const kpIds = categoryToKnowledge[problem.category] || [];
      kpIds.forEach(kpId => {
        if (kpStats[kpId]) {
          kpStats[kpId].completed++;
        }
      });
    }
  });
  
  // 计算掌握度百分比（已完成/总数 * 100，上限100）
  Object.entries(kpStats).forEach(([kpId, stats]) => {
    if (stats.total > 0) {
      mastery[kpId] = Math.min(100, Math.round((stats.completed / stats.total) * 100));
    }
  });
  
  return mastery;
};