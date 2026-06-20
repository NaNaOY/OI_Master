import type { KnowledgePoint } from '@/types/knowledge';

// NOI大纲知识点体系
export const knowledgePoints: KnowledgePoint[] = [
  // ============ CSP-J 入门组 ============
  {
    id: 'kp1',
    name: '程序设计基础',
    category: '程序设计基础',
    description: 'C++基本语法，包括变量、数据类型、运算符、输入输出等基础概念。',
    prerequisites: [],
    difficultyLevel: 1,
    problems: ['p1', 'p2'],
    learningResources: [
      { title: 'C++入门教程', url: '#', type: 'video' },
      { title: '数据类型详解', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp2',
    name: '条件语句与循环',
    category: '程序设计基础',
    description: 'if-else条件语句、for/while循环语句的使用方法和技巧。',
    prerequisites: ['kp1'],
    difficultyLevel: 2,
    problems: ['p3', 'p4'],
    learningResources: [
      { title: '条件语句详解', url: '#', type: 'video' },
      { title: '循环语句练习', url: '#', type: 'practice' },
    ],
  },
  {
    id: 'kp3',
    name: '函数基础',
    category: '程序设计基础',
    description: '函数的定义、调用、参数传递和返回值。',
    prerequisites: ['kp2'],
    difficultyLevel: 3,
    problems: ['p5'],
    learningResources: [
      { title: '函数入门', url: '#', type: 'video' },
      { title: '递归函数基础', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp4',
    name: '数组',
    category: '基础数据结构',
    description: '一维数组和二维数组的声明、初始化、遍历和应用。',
    prerequisites: ['kp2'],
    difficultyLevel: 3,
    problems: ['p6', 'p7'],
    learningResources: [
      { title: '数组基础', url: '#', type: 'video' },
      { title: '二维数组应用', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp5',
    name: '字符串',
    category: '基础数据结构',
    description: '字符串的存储、处理和相关函数的使用。',
    prerequisites: ['kp4'],
    difficultyLevel: 4,
    problems: ['p8'],
    learningResources: [
      { title: '字符串处理', url: '#', type: 'video' },
      { title: '字符串函数库', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp6',
    name: '排序算法',
    category: '基础算法',
    description: '冒泡排序、选择排序、插入排序等基础排序算法。',
    prerequisites: ['kp4'],
    difficultyLevel: 4,
    problems: ['p9'],
    learningResources: [
      { title: '排序算法动画', url: '#', type: 'video' },
      { title: '排序算法比较', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp7',
    name: '查找算法',
    category: '基础算法',
    description: '顺序查找和二分查找算法的原理与实现。',
    prerequisites: ['kp6'],
    difficultyLevel: 4,
    problems: ['p10'],
    learningResources: [
      { title: '二分查找详解', url: '#', type: 'video' },
      { title: '查找算法优化', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp8',
    name: '基础数论',
    category: '数学基础',
    description: '质数判断、约数、最大公约数（欧几里得算法）、最小公倍数。',
    prerequisites: ['kp2'],
    difficultyLevel: 5,
    problems: ['p11'],
    learningResources: [
      { title: '质数与筛法', url: '#', type: 'video' },
      { title: 'GCD与LCM', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp9',
    name: '模拟与枚举',
    category: '基础算法',
    description: '根据题目描述模拟过程，以及枚举思想的应用。',
    prerequisites: ['kp2', 'kp4'],
    difficultyLevel: 5,
    problems: ['p12'],
    learningResources: [
      { title: '模拟算法技巧', url: '#', type: 'video' },
      { title: '枚举优化策略', url: '#', type: 'article' },
    ],
  },
  // ============ CSP-S 提高组 ============
  {
    id: 'kp10',
    name: '递归与分治',
    category: '进阶算法',
    description: '递归思想、分治策略以及经典分治应用。',
    prerequisites: ['kp3'],
    difficultyLevel: 6,
    problems: ['p13'],
    learningResources: [
      { title: '递归思想入门', url: '#', type: 'video' },
      { title: '分治算法详解', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp11',
    name: '栈与队列',
    category: '进阶数据结构',
    description: '栈和队列的实现、性质及其应用场景。',
    prerequisites: ['kp3'],
    difficultyLevel: 6,
    problems: ['p14'],
    learningResources: [
      { title: '栈与队列基础', url: '#', type: 'video' },
      { title: '单调栈应用', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp12',
    name: '链表',
    category: '进阶数据结构',
    description: '单链表、双向链表、循环链表的创建和基本操作。',
    prerequisites: ['kp11'],
    difficultyLevel: 7,
    problems: ['p15'],
    learningResources: [
      { title: '链表实现', url: '#', type: 'video' },
      { title: '链表应用', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp13',
    name: '二叉树',
    category: '进阶数据结构',
    description: '二叉树的存储、遍历（前序、中序、后序、层序）以及性质。',
    prerequisites: ['kp12'],
    difficultyLevel: 7,
    problems: ['p16'],
    learningResources: [
      { title: '二叉树遍历', url: '#', type: 'video' },
      { title: '二叉搜索树', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp14',
    name: '图的基础',
    category: '图论',
    description: '图的存储方式（邻接矩阵、邻接表）、DFS和BFS遍历。',
    prerequisites: ['kp11'],
    difficultyLevel: 7,
    problems: ['p17'],
    learningResources: [
      { title: '图论入门', url: '#', type: 'video' },
      { title: 'DFS与BFS', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp15',
    name: '最短路径',
    category: '图论',
    description: 'Dijkstra算法、Bellman-Ford算法、Floyd算法的原理与实现。',
    prerequisites: ['kp14'],
    difficultyLevel: 8,
    problems: ['p18'],
    learningResources: [
      { title: 'Dijkstra算法', url: '#', type: 'video' },
      { title: '最短路径问题汇总', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp16',
    name: '最小生成树',
    category: '图论',
    description: 'Prim算法和Kruskal算法的原理与实现。',
    prerequisites: ['kp14'],
    difficultyLevel: 8,
    problems: ['p19'],
    learningResources: [
      { title: 'MST算法', url: '#', type: 'video' },
      { title: '并查集应用', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp17',
    name: '动态规划',
    category: '进阶算法',
    description: '动态规划的基本思想、状态设计、状态转移方程，以及常见DP类型。',
    prerequisites: ['kp10', 'kp9'],
    difficultyLevel: 9,
    problems: ['p20', 'p21'],
    learningResources: [
      { title: 'DP入门', url: '#', type: 'video' },
      { title: '状态设计技巧', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp18',
    name: '贪心算法',
    category: '进阶算法',
    description: '贪心策略的证明方法和常见贪心问题类型。',
    prerequisites: ['kp9'],
    difficultyLevel: 8,
    problems: ['p22'],
    learningResources: [
      { title: '贪心算法入门', url: '#', type: 'video' },
      { title: '贪心证明方法', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp19',
    name: '搜索与剪枝',
    category: '进阶算法',
    description: '深度优先搜索、广度优先搜索的优化技巧和剪枝策略。',
    prerequisites: ['kp10', 'kp14'],
    difficultyLevel: 9,
    problems: ['p23'],
    learningResources: [
      { title: '搜索优化技巧', url: '#', type: 'video' },
      { title: '剪枝策略', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp20',
    name: '组合数学基础',
    category: '数学进阶',
    description: '排列组合、容斥原理、抽屉原理等组合数学基础。',
    prerequisites: ['kp8'],
    difficultyLevel: 8,
    problems: ['p24'],
    learningResources: [
      { title: '排列组合', url: '#', type: 'video' },
      { title: '组合计数技巧', url: '#', type: 'article' },
    ],
  },
];

export const getKnowledgePointById = (id: string): KnowledgePoint | undefined => {
  return knowledgePoints.find(kp => kp.id === id);
};

export const getKnowledgePointsByCategory = (category: string): KnowledgePoint[] => {
  return knowledgePoints.filter(kp => kp.category === category);
};

// 获取知识点对应的实际题目数量
export const getProblemCountByKnowledgePoint = (id: string): number => {
  const kp = knowledgePoints.find(k => k.id === id);
  return kp?.problems.length || 0;
};
