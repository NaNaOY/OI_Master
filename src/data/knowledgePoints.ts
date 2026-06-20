import type { KnowledgePoint } from '@/types/knowledge';

export const knowledgePoints: KnowledgePoint[] = [
  // ==================== CSP-J 入门组 ====================
  {
    id: 'j1',
    name: '程序设计基础',
    category: 'CSP-J · 基础',
    difficulty: 1,
    description: '掌握C++基本语法，包括变量、数据类型、常量、运算符等核心概念。',
    prerequisites: [],
    learningResources: [
      { type: 'video', title: 'C++入门教程', url: '' },
      { type: 'article', title: '基本语法速查表', url: '' },
      { type: 'practice', title: '语法练习题集', url: '' },
    ],
  },
  {
    id: 'j2',
    name: '选择结构',
    category: 'CSP-J · 基础',
    difficulty: 2,
    description: '学习if语句和switch语句的使用，理解条件判断的逻辑。',
    prerequisites: ['j1'],
    learningResources: [
      { type: 'video', title: '条件判断详解', url: '' },
      { type: 'article', title: 'if-else使用技巧', url: '' },
    ],
  },
  {
    id: 'j3',
    name: '循环结构',
    category: 'CSP-J · 基础',
    difficulty: 2,
    description: '掌握for、while、do-while三种循环结构的用法和应用场景。',
    prerequisites: ['j1'],
    learningResources: [
      { type: 'video', title: '循环结构精讲', url: '' },
      { type: 'practice', title: '循环进阶练习', url: '' },
    ],
  },
  {
    id: 'j4',
    name: '函数基础',
    category: 'CSP-J · 进阶',
    difficulty: 3,
    description: '理解函数的定义、调用、参数传递和返回值，提升代码复用性。',
    prerequisites: ['j2', 'j3'],
    learningResources: [
      { type: 'video', title: '函数使用指南', url: '' },
      { type: 'article', title: '参数传递详解', url: '' },
    ],
  },
  {
    id: 'j5',
    name: '数组基础',
    category: 'CSP-J · 进阶',
    difficulty: 3,
    description: '学习一维数组的声明、初始化、遍历和基本操作。',
    prerequisites: ['j3'],
    learningResources: [
      { type: 'video', title: '数组入门', url: '' },
      { type: 'practice', title: '数组练习题', url: '' },
    ],
  },
  {
    id: 'j6',
    name: '字符串处理',
    category: 'CSP-J · 进阶',
    difficulty: 3,
    description: '掌握字符数组和string类的字符串操作方法。',
    prerequisites: ['j5'],
    learningResources: [
      { type: 'video', title: '字符串处理', url: '' },
      { type: 'article', title: '常用字符串函数', url: '' },
    ],
  },
  {
    id: 'j7',
    name: '基础排序算法',
    category: 'CSP-J · 算法',
    difficulty: 4,
    description: '学习冒泡排序、选择排序、插入排序等基础排序算法。',
    prerequisites: ['j5'],
    learningResources: [
      { type: 'video', title: '排序算法原理', url: '' },
      { type: 'practice', title: '排序实战练习', url: '' },
    ],
  },
  {
    id: 'j8',
    name: '基础查找算法',
    category: 'CSP-J · 算法',
    difficulty: 4,
    description: '掌握顺序查找和二分查找的思想与实现。',
    prerequisites: ['j7'],
    learningResources: [
      { type: 'video', title: '二分查找详解', url: '' },
      { type: 'article', title: '查找算法对比', url: '' },
    ],
  },
  {
    id: 'j9',
    name: '基础数论',
    category: 'CSP-J · 数学',
    difficulty: 4,
    description: '学习质数判定、分解质因数、最大公约数等基础数论知识。',
    prerequisites: ['j3'],
    learningResources: [
      { type: 'video', title: '数论基础', url: '' },
      { type: 'practice', title: '数论练习', url: '' },
    ],
  },
  {
    id: 'j10',
    name: '模拟与枚举',
    category: 'CSP-J · 技巧',
    difficulty: 5,
    description: '掌握模拟复杂过程和枚举优化的高级技巧。',
    prerequisites: ['j5', 'j3'],
    learningResources: [
      { type: 'video', title: '模拟枚举技巧', url: '' },
      { type: 'article', title: '枚举优化方法', url: '' },
    ],
  },

  // ==================== CSP-S 提高组 ====================
  {
    id: 's1',
    name: '递归与分治',
    category: 'CSP-S · 核心',
    difficulty: 5,
    description: '深入理解递归思想，掌握分治策略解决复杂问题。',
    prerequisites: [],
    learningResources: [
      { type: 'video', title: '递归思想入门', url: '' },
      { type: 'article', title: '分治算法模板', url: '' },
      { type: 'practice', title: '递归专项训练', url: '' },
    ],
  },
  {
    id: 's2',
    name: '栈与队列',
    category: 'CSP-S · 基础数据结构',
    difficulty: 5,
    description: '学习栈和队列的实现原理，理解先进后出与先进先出的特性。',
    prerequisites: ['s1'],
    learningResources: [
      { type: 'video', title: '栈队列原理', url: '' },
      { type: 'article', title: 'STL容器详解', url: '' },
    ],
  },
  {
    id: 's3',
    name: '链表',
    category: 'CSP-S · 高级数据结构',
    difficulty: 6,
    description: '掌握单向链表、双向链表的创建与操作，理解指针的精髓。',
    prerequisites: ['s2'],
    learningResources: [
      { type: 'video', title: '链表精讲', url: '' },
      { type: 'practice', title: '链表练习题', url: '' },
    ],
  },
  {
    id: 's4',
    name: '二叉树',
    category: 'CSP-S · 高级数据结构',
    difficulty: 6,
    description: '学习二叉树的遍历方式，掌握线索二叉树与二叉树的应用。',
    prerequisites: ['s3'],
    learningResources: [
      { type: 'video', title: '二叉树基础', url: '' },
      { type: 'article', title: '二叉树遍历模板', url: '' },
    ],
  },
  {
    id: 's5',
    name: '图的存储与遍历',
    category: 'CSP-S · 图论基础',
    difficulty: 6,
    description: '掌握邻接矩阵、邻接表的图存储方式，学习DFS/BFS遍历图。',
    prerequisites: ['s2'],
    learningResources: [
      { type: 'video', title: '图论入门', url: '' },
      { type: 'practice', title: '图遍历练习', url: '' },
    ],
  },
  {
    id: 's6',
    name: '最短路径',
    category: 'CSP-S · 图论算法',
    difficulty: 7,
    description: '学习Dijkstra、Bellman-Ford、Floyd等最短路径算法。',
    prerequisites: ['s5'],
    learningResources: [
      { type: 'video', title: '最短路径算法', url: '' },
      { type: 'article', title: '算法对比分析', url: '' },
    ],
  },
  {
    id: 's7',
    name: '最小生成树',
    category: 'CSP-S · 图论算法',
    difficulty: 7,
    description: '掌握Prim和Kruskal算法，理解生成树与最小生成树的概念。',
    prerequisites: ['s5'],
    learningResources: [
      { type: 'video', title: '最小生成树', url: '' },
      { type: 'practice', title: 'MST专项训练', url: '' },
    ],
  },
  {
    id: 's8',
    name: '动态规划基础',
    category: 'CSP-S · 核心算法',
    difficulty: 7,
    description: '理解动态规划思想，掌握状态定义与转移方程的建立方法。',
    prerequisites: ['s1'],
    learningResources: [
      { type: 'video', title: 'DP入门', url: '' },
      { type: 'article', title: 'DP经典模型', url: '' },
    ],
  },
  {
    id: 's9',
    name: '动态规划进阶',
    category: 'CSP-S · 核心算法',
    difficulty: 8,
    description: '学习背包问题、状态压缩DP、树形DP等高级动态规划技巧。',
    prerequisites: ['s8'],
    learningResources: [
      { type: 'video', title: 'DP进阶技巧', url: '' },
      { type: 'practice', title: 'DP专项训练', url: '' },
    ],
  },
  {
    id: 's10',
    name: '贪心算法',
    category: 'CSP-S · 算法策略',
    difficulty: 7,
    description: '理解贪心策略的正确性证明，学习典型贪心问题。',
    prerequisites: ['s8'],
    learningResources: [
      { type: 'video', title: '贪心算法', url: '' },
      { type: 'article', title: '贪心证明方法', url: '' },
    ],
  },
  {
    id: 's11',
    name: '搜索与剪枝',
    category: 'CSP-S · 搜索',
    difficulty: 8,
    description: '掌握深度优先搜索与广度优先搜索，学习剪枝优化技巧。',
    prerequisites: ['s5'],
    learningResources: [
      { type: 'video', title: '搜索算法', url: '' },
      { type: 'practice', title: '剪枝技巧练习', url: '' },
    ],
  },
  {
    id: 's12',
    name: '高级数论',
    category: 'CSP-S · 数学',
    difficulty: 8,
    description: '学习扩展欧几里得、欧拉函数、中国剩余定理等高级数论。',
    prerequisites: ['s1'],
    learningResources: [
      { type: 'video', title: '数论进阶', url: '' },
      { type: 'article', title: '数论模板汇总', url: '' },
    ],
  },
  {
    id: 's13',
    name: '组合数学',
    category: 'CSP-S · 数学',
    difficulty: 8,
    description: '掌握排列组合、容斥原理、递推关系的应用。',
    prerequisites: ['s1'],
    learningResources: [
      { type: 'video', title: '组合数学', url: '' },
      { type: 'practice', title: '计数问题练习', url: '' },
    ],
  },
  {
    id: 's14',
    name: '哈希与集合',
    category: 'CSP-S · 数据结构',
    difficulty: 6,
    description: '学习哈希表、set、map等高级数据结构的原理与应用。',
    prerequisites: ['s2'],
    learningResources: [
      { type: 'video', title: '哈希与集合', url: '' },
      { type: 'article', title: 'STL进阶用法', url: '' },
    ],
  },
];

export const getKnowledgePointById = (id: string): KnowledgePoint | undefined => {
  return knowledgePoints.find(kp => kp.id === id);
};

export const getKnowledgePointsByCategory = (category: string): KnowledgePoint[] => {
  return knowledgePoints.filter(kp => kp.category.startsWith(category));
};

// 获取所有 CSP-J 知识点
export const getCSPJKnowledgePoints = (): KnowledgePoint[] => {
  return knowledgePoints.filter(kp => kp.category.startsWith('CSP-J'));
};

// 获取所有 CSP-S 知识点
export const getCSPSKnowledgePoints = (): KnowledgePoint[] => {
  return knowledgePoints.filter(kp => kp.category.startsWith('CSP-S'));
};
