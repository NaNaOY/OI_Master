import type { DiagnosisQuestion } from '@/types/diagnosis';

// NOI大纲配套诊断题目 - 每个知识点都有对应题目
export const diagnosisQuestions: DiagnosisQuestion[] = [
  // ============ CSP-J 入门组 ============
  // kp1: 程序设计基础
  {
    id: 'dq1',
    level: 'CSP-J',
    knowledgePoint: 'kp1',
    difficulty: 'easy',
    question: '以下哪个是C++中正确的整数类型声明？',
    type: 'choice',
    options: ['int x = 10;', 'x = 10;', 'integer x = 10;', 'var x = 10;'],
    correctAnswer: 'A',
    explanation: 'C++中变量声明需要指定类型，int是正确的整数类型关键字。',
  },
  {
    id: 'dq2',
    level: 'CSP-J',
    knowledgePoint: 'kp1',
    difficulty: 'easy',
    question: '以下代码的输出是什么？\nint a = 5;\nint b = 3;\ncout << a % b;',
    type: 'choice',
    options: ['1', '2', '0', '1.666'],
    correctAnswer: 'B',
    explanation: '%是取模运算符，5除以3余2。',
  },
  // kp2: 条件语句与循环
  {
    id: 'dq3',
    level: 'CSP-J',
    knowledgePoint: 'kp2',
    difficulty: 'easy',
    question: '以下循环会执行多少次？\nfor (int i = 0; i < 5; i++) { ... }',
    type: 'choice',
    options: ['4次', '5次', '6次', '无限次'],
    correctAnswer: 'B',
    explanation: '循环从i=0开始，当i<5时执行，i=0,1,2,3,4时都会执行，共5次。',
  },
  {
    id: 'dq4',
    level: 'CSP-J',
    knowledgePoint: 'kp2',
    difficulty: 'medium',
    question: '以下代码的输出是什么？\nint sum = 0;\nfor (int i = 1; i <= 10; i++) {\n  if (i % 2 == 0) sum += i;\n}\ncout << sum;',
    type: 'choice',
    options: ['25', '30', '55', '20'],
    correctAnswer: 'B',
    explanation: '偶数之和：2+4+6+8+10=30。',
  },
  // kp3: 函数基础
  {
    id: 'dq5',
    level: 'CSP-J',
    knowledgePoint: 'kp3',
    difficulty: 'medium',
    question: '递归函数必须满足的条件是？',
    type: 'choice',
    options: [
      '只有一个参数',
      '有终止条件和递归步骤',
      '返回值必须为整数',
      '不能调用自身',
    ],
    correctAnswer: 'B',
    explanation: '递归函数需要有终止条件（基础情况）和递归步骤（调用自身）。',
  },
  // kp4: 数组
  {
    id: 'dq6',
    level: 'CSP-J',
    knowledgePoint: 'kp4',
    difficulty: 'easy',
    question: '数组下标从几开始？',
    type: 'choice',
    options: ['0', '1', '-1', '任意'],
    correctAnswer: 'A',
    explanation: 'C++数组下标从0开始。',
  },
  {
    id: 'dq7',
    level: 'CSP-J',
    knowledgePoint: 'kp4',
    difficulty: 'medium',
    question: '以下代码输出什么？\nint a[5] = {1, 2, 3, 4, 5};\ncout << a[3];',
    type: 'choice',
    options: ['2', '3', '4', '5'],
    correctAnswer: 'C',
    explanation: 'a[3]是第4个元素，值为4。',
  },
  // kp5: 字符串
  {
    id: 'dq8',
    level: 'CSP-J',
    knowledgePoint: 'kp5',
    difficulty: 'medium',
    question: 'C++中string类型字符串的长度可以通过哪个函数获取？',
    type: 'choice',
    options: ['length()', 'size()', 'strlen()', '以上都可以'],
    correctAnswer: 'D',
    explanation: 'string类型可以使用length()、size()或strlen()获取长度。',
  },
  // kp6: 排序算法
  {
    id: 'dq9',
    level: 'CSP-J',
    knowledgePoint: 'kp6',
    difficulty: 'medium',
    question: '冒泡排序的时间复杂度是多少？',
    type: 'choice',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    correctAnswer: 'C',
    explanation: '冒泡排序需要两层循环，时间复杂度为O(n^2)。',
  },
  // kp7: 查找算法
  {
    id: 'dq10',
    level: 'CSP-J',
    knowledgePoint: 'kp7',
    difficulty: 'medium',
    question: '二分查找的前提条件是什么？',
    type: 'choice',
    options: ['数组无序', '数组有序', '数组为空', '数组长度为偶数'],
    correctAnswer: 'B',
    explanation: '二分查找需要数组有序，才能通过比较中间元素缩小搜索范围。',
  },
  // kp8: 基础数论
  {
    id: 'dq11',
    level: 'CSP-J',
    knowledgePoint: 'kp8',
    difficulty: 'medium',
    question: '判断一个数是否为质数，最优的方法是检查到哪个范围？',
    type: 'choice',
    options: ['n', 'n/2', 'sqrt(n)', 'n-1'],
    correctAnswer: 'C',
    explanation: '只需检查到sqrt(n)即可，因为如果n有因数，必有一个小于等于sqrt(n)。',
  },
  // kp9: 模拟与枚举
  {
    id: 'dq12',
    level: 'CSP-J',
    knowledgePoint: 'kp9',
    difficulty: 'medium',
    question: '枚举算法的特点是什么？',
    type: 'choice',
    options: [
      '将问题所有可能的情况逐一列举',
      '将大问题分解为小问题',
      '每次选择最优解',
      '利用问题的数学性质',
    ],
    correctAnswer: 'A',
    explanation: '枚举算法通过逐一列举问题的所有可能情况来找到答案。',
  },
  // ============ CSP-S 提高组 ============
  // kp10: 递归与分治
  {
    id: 'dq13',
    level: 'CSP-S',
    knowledgePoint: 'kp10',
    difficulty: 'medium',
    question: '分治算法通常包含哪三个步骤？',
    type: 'choice',
    options: [
      '递归、合并、优化',
      '分解、解决、合并',
      '划分、递归、输出',
      '分解、递归、返回',
    ],
    correctAnswer: 'B',
    explanation: '分治算法通常包含：分解（Divide）、解决（Conquer）、合并（Combine）三个步骤。',
  },
  // kp11: 栈与队列
  {
    id: 'dq14',
    level: 'CSP-S',
    knowledgePoint: 'kp11',
    difficulty: 'medium',
    question: '以下哪种数据结构适合实现括号匹配？',
    type: 'choice',
    options: ['队列', '栈', '链表', '树'],
    correctAnswer: 'B',
    explanation: '栈的LIFO特性适合匹配问题，左括号入栈，右括号时弹出匹配。',
  },
  // kp12: 链表
  {
    id: 'dq15',
    level: 'CSP-S',
    knowledgePoint: 'kp12',
    difficulty: 'medium',
    question: '在单链表中，删除一个节点需要修改哪个指针？',
    type: 'choice',
    options: [
      '只需修改被删除节点的指针',
      '只需修改前驱节点的指针',
      '只需修改后继节点的指针',
      '需要修改前驱和后继节点的指针',
    ],
    correctAnswer: 'B',
    explanation: '删除节点需要修改前驱节点的next指针，使其指向被删除节点的下一个节点。',
  },
  // kp13: 二叉树
  {
    id: 'dq16',
    level: 'CSP-S',
    knowledgePoint: 'kp13',
    difficulty: 'medium',
    question: '二叉树的前序遍历顺序是什么？',
    type: 'choice',
    options: ['左-根-右', '根-左-右', '左-右-根', '根-右-左'],
    correctAnswer: 'B',
    explanation: '前序遍历顺序是：先访问根节点，再遍历左子树，最后遍历右子树。',
  },
  // kp14: 图的基础
  {
    id: 'dq17',
    level: 'CSP-S',
    knowledgePoint: 'kp14',
    difficulty: 'medium',
    question: 'DFS和BFS的主要区别是什么？',
    type: 'choice',
    options: [
      'DFS用栈，BFS用队列',
      'DFS用队列，BFS用栈',
      '两者没有区别',
      'DFS用于有权图，BFS用于无权图',
    ],
    correctAnswer: 'A',
    explanation: 'DFS使用栈（递归实现隐式使用栈），BFS使用队列来按层次遍历图。',
  },
  // kp15: 最短路径
  {
    id: 'dq18',
    level: 'CSP-S',
    knowledgePoint: 'kp15',
    difficulty: 'hard',
    question: 'Dijkstra算法用于解决什么问题？',
    type: 'choice',
    options: ['最小生成树', '最短路径', '拓扑排序', '强连通分量'],
    correctAnswer: 'B',
    explanation: 'Dijkstra算法用于求解图中从起点到其他所有节点的最短路径。',
  },
  // kp16: 最小生成树
  {
    id: 'dq19',
    level: 'CSP-S',
    knowledgePoint: 'kp16',
    difficulty: 'hard',
    question: 'Kruskal算法使用什么数据结构来判断是否形成环？',
    type: 'choice',
    options: ['栈', '队列', '并查集', '堆'],
    correctAnswer: 'C',
    explanation: 'Kruskal算法使用并查集来判断加入的边是否连接了相同的连通分量（是否成环）。',
  },
  // kp17: 动态规划
  {
    id: 'dq20',
    level: 'CSP-S',
    knowledgePoint: 'kp17',
    difficulty: 'hard',
    question: '动态规划中，状态转移方程的作用是什么？',
    type: 'choice',
    options: [
      '定义问题边界',
      '描述状态之间的转移关系',
      '初始化数据',
      '优化空间复杂度',
    ],
    correctAnswer: 'B',
    explanation: '状态转移方程描述了如何从子问题的解推导出原问题的解。',
  },
  // kp18: 贪心算法
  {
    id: 'dq21',
    level: 'CSP-S',
    knowledgePoint: 'kp18',
    difficulty: 'hard',
    question: '贪心算法适用于什么问题？',
    type: 'choice',
    options: [
      '所有优化问题',
      '局部最优能导致全局最优的问题',
      'NP完全问题',
      '所有决策问题',
    ],
    correctAnswer: 'B',
    explanation: '贪心算法适用于局部最优选择能导致全局最优的问题，如活动选择、Huffman编码等。',
  },
  // kp19: 搜索与剪枝
  {
    id: 'dq22',
    level: 'CSP-S',
    knowledgePoint: 'kp19',
    difficulty: 'hard',
    question: '剪枝的主要目的是什么？',
    type: 'choice',
    options: [
      '增加搜索树的深度',
      '减少搜索空间，提高效率',
      '确保找到最优解',
      '简化数据结构',
    ],
    correctAnswer: 'B',
    explanation: '剪枝通过排除不可能产生最优解的分支，减少搜索空间，提高搜索效率。',
  },
  // kp20: 组合数学基础
  {
    id: 'dq23',
    level: 'CSP-S',
    knowledgePoint: 'kp20',
    difficulty: 'hard',
    question: '从n个不同元素中取出m个元素的排列数是多少？',
    type: 'choice',
    options: [
      'C(n,m) = n!/m!(n-m)!',
      'A(n,m) = n!/(n-m)!',
      'P(n,m) = n!',
      'A(n,m) = n!',
    ],
    correctAnswer: 'B',
    explanation: '排列数A(n,m) = n!/(n-m)!，组合数C(n,m) = n!/m!(n-m)!。',
  },
];

export const getDiagnosisQuestionsByLevel = (level: 'CSP-J' | 'CSP-S'): DiagnosisQuestion[] => {
  return diagnosisQuestions.filter(q => q.level === level);
};

export const getDiagnosisQuestionById = (id: string): DiagnosisQuestion | undefined => {
  return diagnosisQuestions.find(q => q.id === id);
};

// 获取某个知识点的诊断题目
export const getDiagnosisQuestionsByKnowledgePoint = (kpId: string): DiagnosisQuestion[] => {
  return diagnosisQuestions.filter(q => q.knowledgePoint === kpId);
};
