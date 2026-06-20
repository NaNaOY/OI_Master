import type { KnowledgePoint } from '@/types/knowledge';

export const knowledgePoints: KnowledgePoint[] = [
  {
    id: 'kp1',
    name: '基础语法',
    category: '基础语法',
    description: 'C++基础语法，包括变量、数据类型、运算符、条件语句、循环语句等。',
    prerequisites: [],
    difficultyLevel: 1,
    problems: ['p1', 'p2'],
    learningResources: [
      { title: 'C++基础教程', url: '#', type: 'video' },
      { title: '条件语句详解', url: '#', type: 'article' },
      { title: '循环练习', url: '#', type: 'practice' },
    ],
  },
  {
    id: 'kp2',
    name: '数组与字符串',
    category: '数据结构',
    description: '数组、字符串的基本操作，包括遍历、查找、修改等。',
    prerequisites: ['kp1'],
    difficultyLevel: 2,
    problems: ['p3'],
    learningResources: [
      { title: '数组入门', url: '#', type: 'video' },
      { title: '字符串操作', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp3',
    name: '链表与树',
    category: '数据结构',
    description: '链表、二叉树等数据结构的实现和操作。',
    prerequisites: ['kp2'],
    difficultyLevel: 5,
    problems: ['p8'],
    learningResources: [
      { title: '链表教程', url: '#', type: 'video' },
      { title: '二叉树详解', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp4',
    name: '图论基础',
    category: '图论',
    description: '图的表示方法、遍历算法等基础内容。',
    prerequisites: ['kp3'],
    difficultyLevel: 7,
    problems: ['p9'],
    learningResources: [
      { title: '图论入门', url: '#', type: 'video' },
      { title: '图的遍历算法', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp5',
    name: '排序算法',
    category: '算法',
    description: '冒泡排序、选择排序、快速排序等常见排序算法。',
    prerequisites: ['kp2'],
    difficultyLevel: 3,
    problems: ['p4'],
    learningResources: [
      { title: '排序算法动画', url: '#', type: 'video' },
      { title: '排序算法详解', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp6',
    name: '查找算法',
    category: '算法',
    description: '线性查找、二分查找等查找算法。',
    prerequisites: ['kp5'],
    difficultyLevel: 3,
    problems: ['p5'],
    learningResources: [
      { title: '二分查找教程', url: '#', type: 'video' },
      { title: '查找算法对比', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp7',
    name: '动态规划',
    category: '动态规划',
    description: '动态规划的基本概念、状态转移方程、常见问题类型。',
    prerequisites: ['kp5', 'kp6'],
    difficultyLevel: 8,
    problems: ['p6', 'p7'],
    learningResources: [
      { title: '动态规划入门', url: '#', type: 'video' },
      { title: '状态转移方程详解', url: '#', type: 'article' },
      { title: 'DP专题练习', url: '#', type: 'practice' },
    ],
  },
  {
    id: 'kp8',
    name: '递归与分治',
    category: '算法',
    description: '递归的基本概念、分治策略、常见应用。',
    prerequisites: ['kp1'],
    difficultyLevel: 4,
    problems: ['p8'],
    learningResources: [
      { title: '递归入门', url: '#', type: 'video' },
      { title: '分治算法详解', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp9',
    name: '最短路径',
    category: '图论',
    description: 'Dijkstra、Floyd等最短路径算法。',
    prerequisites: ['kp4'],
    difficultyLevel: 8,
    problems: ['p9'],
    learningResources: [
      { title: 'Dijkstra算法', url: '#', type: 'video' },
      { title: '最短路径算法对比', url: '#', type: 'article' },
    ],
  },
  {
    id: 'kp10',
    name: '数论基础',
    category: '数学',
    description: '质数、因数、最大公约数、最小公倍数等数论基础知识。',
    prerequisites: ['kp1'],
    difficultyLevel: 4,
    problems: ['p10'],
    learningResources: [
      { title: '数论入门', url: '#', type: 'video' },
      { title: '质数判断方法', url: '#', type: 'article' },
    ],
  },
];

export const getKnowledgePointById = (id: string): KnowledgePoint | undefined => {
  return knowledgePoints.find(kp => kp.id === id);
};

export const getKnowledgePointsByCategory = (category: string): KnowledgePoint[] => {
  return knowledgePoints.filter(kp => kp.category === category);
};