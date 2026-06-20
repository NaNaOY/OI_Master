import type { Problem } from '@/types/problem';

export const problems: Problem[] = [
  // ============ CSP-J 入门组 ============
  // j1: 程序设计基础
  { id: 'pj1', title: 'A+B问题', difficulty: 'easy', knowledgePoints: ['j1'], description: '输入两个整数A和B，输出它们的和。', inputFormat: '一行，包含两个整数A和B，用空格分隔。', outputFormat: '一行，输出A+B的结果。', sampleInput: '1 2', sampleOutput: '3', testCases: [{ input: '1 2', output: '3' }, { input: '100 200', output: '300' }, { input: '-5 3', output: '-2' }], hints: ['使用加法运算符+即可'], timeLimit: 1000, memoryLimit: 256000 },
  { id: 'pj2', title: '求最大值', difficulty: 'easy', knowledgePoints: ['j1'], description: '输入三个整数，输出其中的最大值。', inputFormat: '一行，包含三个整数，用空格分隔。', outputFormat: '一行，输出最大值。', sampleInput: '3 1 4', sampleOutput: '4', testCases: [{ input: '3 1 4', output: '4' }, { input: '-1 -5 -3', output: '-1' }], hints: ['使用if语句或max函数'], timeLimit: 1000, memoryLimit: 256000 },
  // j2: 选择结构
  { id: 'pj3', title: '水仙花数', difficulty: 'easy', knowledgePoints: ['j2'], description: '输出所有三位数的水仙花数。', inputFormat: '无输入', outputFormat: '输出所有水仙花数，每个数占一行。', sampleInput: '', sampleOutput: '153\n370\n371\n407', testCases: [{ input: '', output: '153\n370\n371\n407' }], hints: ['使用循环遍历100-999'], timeLimit: 1000, memoryLimit: 256000 },
  { id: 'pj4', title: '成绩评级', difficulty: 'easy', knowledgePoints: ['j2'], description: '根据输入的成绩输出等级：A(>=90), B(>=80), C(>=60), D(<60)', inputFormat: '一行，一个整数表示成绩（0-100）', outputFormat: '一行，输出等级字符', sampleInput: '85', sampleOutput: 'B', testCases: [{ input: '85', output: 'B' }, { input: '95', output: 'A' }], hints: ['使用if-else语句判断'], timeLimit: 1000, memoryLimit: 256000 },
  // j3: 循环结构
  { id: 'pj5', title: '打印九九乘法表', difficulty: 'easy', knowledgePoints: ['j3'], description: '打印九九乘法表。', inputFormat: '无输入', outputFormat: '输出九九乘法表', sampleInput: '', sampleOutput: '1*1=1 1*2=2 ...', testCases: [{ input: '', output: '1*1=1' }], hints: ['使用双重循环'], timeLimit: 1000, memoryLimit: 256000 },
  { id: 'pj6', title: '求阶乘和', difficulty: 'medium', knowledgePoints: ['j3'], description: '求1!+2!+...+n!的值', inputFormat: '一行，一个整数n（1<=n<=10）', outputFormat: '一行，输出阶乘和', sampleInput: '4', sampleOutput: '33', testCases: [{ input: '4', output: '33' }, { input: '3', output: '9' }], hints: ['注意数据溢出'], timeLimit: 1000, memoryLimit: 256000 },
  // j4: 函数基础
  { id: 'pj7', title: '阶乘函数', difficulty: 'easy', knowledgePoints: ['j4'], description: '编写函数计算n的阶乘', inputFormat: '一行，一个整数n（0<=n<=12）', outputFormat: '一行，输出n的阶乘', sampleInput: '5', sampleOutput: '120', testCases: [{ input: '5', output: '120' }, { input: '0', output: '1' }], hints: ['注意0的阶乘为1'], timeLimit: 1000, memoryLimit: 256000 },
  // j5: 数组基础
  { id: 'pj8', title: '数组求和', difficulty: 'easy', knowledgePoints: ['j5'], description: '输入一个整数数组，输出数组中所有元素的和', inputFormat: '第一行输入n；第二行输入n个整数', outputFormat: '一行，输出和', sampleInput: '3\n1 2 3', sampleOutput: '6', testCases: [{ input: '3\n1 2 3', output: '6' }], hints: ['使用循环遍历数组累加'], timeLimit: 1000, memoryLimit: 256000 },
  { id: 'pj9', title: '数组最大值', difficulty: 'easy', knowledgePoints: ['j5'], description: '找出数组中的最大值及其位置', inputFormat: '第一行输入n；第二行输入n个整数', outputFormat: '输出最大值和下标', sampleInput: '5\n3 1 4 5 2', sampleOutput: '5 3', testCases: [{ input: '5\n3 1 4 5 2', output: '5 3' }], hints: ['记录最大值和下标'], timeLimit: 1000, memoryLimit: 256000 },
  // j6: 字符串处理
  { id: 'pj10', title: '字符串反转', difficulty: 'easy', knowledgePoints: ['j6'], description: '输入一个字符串，将其反转后输出', inputFormat: '一行，一个字符串', outputFormat: '一行，反转后的字符串', sampleInput: 'hello', sampleOutput: 'olleh', testCases: [{ input: 'hello', output: 'olleh' }], hints: ['可以从后往前读取'], timeLimit: 1000, memoryLimit: 256000 },
  // j7: 基础排序算法
  { id: 'pj11', title: '冒泡排序', difficulty: 'medium', knowledgePoints: ['j7'], description: '使用冒泡排序对数组升序排序', inputFormat: '第一行输入n；第二行输入n个整数', outputFormat: '一行，输出排序后的数组', sampleInput: '5\n3 1 4 1 5', sampleOutput: '1 1 3 4 5', testCases: [{ input: '5\n3 1 4 1 5', output: '1 1 3 4 5' }], hints: ['比较相邻元素交换'], timeLimit: 1000, memoryLimit: 256000 },
  // j8: 基础查找算法
  { id: 'pj12', title: '二分查找', difficulty: 'medium', knowledgePoints: ['j8'], description: '在有序数组中查找目标值的位置', inputFormat: '第一行输入n和target；第二行输入n个有序整数', outputFormat: '一行，输出索引或-1', sampleInput: '5 3\n1 2 3 4 5', sampleOutput: '2', testCases: [{ input: '5 3\n1 2 3 4 5', output: '2' }], hints: ['每次将搜索范围缩小一半'], timeLimit: 1000, memoryLimit: 256000 },
  // j9: 基础数论
  { id: 'pj13', title: '质数判断', difficulty: 'easy', knowledgePoints: ['j9'], description: '判断一个数是否为质数', inputFormat: '一行，整数n（2<=n<=10^6）', outputFormat: 'YES或NO', sampleInput: '7', sampleOutput: 'YES', testCases: [{ input: '7', output: 'YES' }, { input: '10', output: 'NO' }], hints: ['检查到sqrt(n)即可'], timeLimit: 1000, memoryLimit: 256000 },
  // j10: 模拟与枚举
  { id: 'pj14', title: '鸡兔同笼', difficulty: 'easy', knowledgePoints: ['j10'], description: '鸡兔同笼，已知头数和脚数', inputFormat: '一行，两个整数h和f', outputFormat: '鸡的数量和兔的数量', sampleInput: '35 94', sampleOutput: '23 12', testCases: [{ input: '35 94', output: '23 12' }], hints: ['列方程求解'], timeLimit: 1000, memoryLimit: 256000 },

  // ============ CSP-S 提高组 ============
  // s1: 递归与分治
  { id: 'ps1', title: '快速幂', difficulty: 'medium', knowledgePoints: ['s1'], description: '计算a的b次幂对mod取模', inputFormat: '一行，三个整数a, b, mod', outputFormat: '一行，输出结果', sampleInput: '2 10 1000', sampleOutput: '24', testCases: [{ input: '2 10 1000', output: '24' }], hints: ['使用分治思想'], timeLimit: 1000, memoryLimit: 256000 },
  { id: 'ps2', title: '归并排序', difficulty: 'medium', knowledgePoints: ['s1'], description: '使用归并排序对数组排序', inputFormat: '第一行输入n；第二行输入n个整数', outputFormat: '一行，输出排序后的数组', sampleInput: '5\n3 1 4 1 5', sampleOutput: '1 1 3 4 5', testCases: [{ input: '5\n3 1 4 1 5', output: '1 1 3 4 5' }], hints: ['分治：先排序左右半部分，再合并'], timeLimit: 1000, memoryLimit: 256000 },
  // s2: 栈与队列
  { id: 'ps3', title: '括号匹配', difficulty: 'medium', knowledgePoints: ['s2'], description: '判断字符串是否括号匹配', inputFormat: '一行，字符串', outputFormat: 'YES或NO', sampleInput: '()[]{}', sampleOutput: 'YES', testCases: [{ input: '()[]{}', output: 'YES' }, { input: '([)]', output: 'NO' }], hints: ['使用栈，左括号入栈'], timeLimit: 1000, memoryLimit: 256000 },
  { id: 'ps4', title: '队列实现', difficulty: 'medium', knowledgePoints: ['s2'], description: '用两个栈实现队列', inputFormat: '多行操作命令', outputFormat: '输出操作结果', sampleInput: 'push 1\npush 2\npop\npop', sampleOutput: '1', testCases: [{ input: 'push 1\npush 2\npop\npop', output: '1' }], hints: ['一个栈入队，一个栈出队'], timeLimit: 1000, memoryLimit: 256000 },
  // s3: 链表
  { id: 'ps5', title: '链表反转', difficulty: 'medium', knowledgePoints: ['s3'], description: '反转一个单链表', inputFormat: '第一行输入n；第二行输入n个整数', outputFormat: '输出反转后的链表', sampleInput: '5\n1 2 3 4 5', sampleOutput: '5 4 3 2 1', testCases: [{ input: '5\n1 2 3 4 5', output: '5 4 3 2 1' }], hints: ['遍历时改变指针方向'], timeLimit: 1000, memoryLimit: 256000 },
  { id: 'ps6', title: '链表合并', difficulty: 'medium', knowledgePoints: ['s3'], description: '合并两个有序链表', inputFormat: '两行，每行若干有序整数', outputFormat: '一行，合并后的有序链表', sampleInput: '1 3 5\n2 4 6', sampleOutput: '1 2 3 4 5 6', testCases: [{ input: '1 3 5\n2 4 6', output: '1 2 3 4 5 6' }], hints: ['双指针合并'], timeLimit: 1000, memoryLimit: 256000 },
  // s4: 二叉树
  { id: 'ps7', title: '二叉树遍历', difficulty: 'medium', knowledgePoints: ['s4'], description: '给定前序和中序遍历，构建二叉树并输出后序', inputFormat: 'n\n前序\n中序', outputFormat: '后序遍历', sampleInput: '3\n1 2 3\n2 1 3', sampleOutput: '2 3 1', testCases: [{ input: '3\n1 2 3\n2 1 3', output: '2 3 1' }], hints: ['前序找根，中序分左右'], timeLimit: 1000, memoryLimit: 256000 },
  // s5: 图的存储与遍历
  { id: 'ps8', title: '图的DFS遍历', difficulty: 'medium', knowledgePoints: ['s5'], description: '给定图和起点，输出DFS遍历顺序', inputFormat: 'n m s\nm条边', outputFormat: 'DFS顺序', sampleInput: '5 4 1\n1 2\n1 3\n2 4\n2 5', sampleOutput: '1 2 4 5 3', testCases: [{ input: '5 4 1\n1 2\n1 3\n2 4\n2 5', output: '1 2 4 5 3' }], hints: ['使用递归或栈'], timeLimit: 1000, memoryLimit: 256000 },
  { id: 'ps9', title: '图的BFS遍历', difficulty: 'medium', knowledgePoints: ['s5'], description: '给定图和起点，输出BFS遍历顺序', inputFormat: 'n m s\nm条边', outputFormat: 'BFS顺序', sampleInput: '5 4 1\n1 2\n1 3\n2 4\n2 5', sampleOutput: '1 2 3 4 5', testCases: [{ input: '5 4 1\n1 2\n1 3\n2 4\n2 5', output: '1 2 3 4 5' }], hints: ['使用队列'], timeLimit: 1000, memoryLimit: 256000 },
  // s6: 最短路径
  { id: 'ps10', title: 'Dijkstra最短路', difficulty: 'hard', knowledgePoints: ['s6'], description: '使用Dijkstra算法求单源最短路径', inputFormat: 'n m s\nm条边', outputFormat: '到各点的最短距离', sampleInput: '4 5 1\n1 2 2\n1 3 5\n2 3 1\n2 4 3\n3 4 2', sampleOutput: '0\n2\n3\n5', testCases: [{ input: '4 5 1\n1 2 2\n1 3 5\n2 3 1\n2 4 3\n3 4 2', output: '0\n2\n3\n5' }], hints: ['使用优先队列优化'], timeLimit: 1000, memoryLimit: 256000 },
  // s7: 最小生成树
  { id: 'ps11', title: 'Kruskal最小生成树', difficulty: 'hard', knowledgePoints: ['s7'], description: '使用Kruskal算法求最小生成树总权重', inputFormat: 'n m\nm条边', outputFormat: 'MST总权重', sampleInput: '4 5\n1 2 1\n1 3 4\n2 3 3\n2 4 2\n3 4 5', sampleOutput: '6', testCases: [{ input: '4 5\n1 2 1\n1 3 4\n2 3 3\n2 4 2\n3 4 5', output: '6' }], hints: ['按边权排序，用并查集'], timeLimit: 1000, memoryLimit: 256000 },
  // s8: 动态规划基础
  { id: 'ps12', title: '斐波那契数列', difficulty: 'medium', knowledgePoints: ['s8'], description: '求斐波那契数列第n项', inputFormat: '一行，n', outputFormat: '第n项的值', sampleInput: '10', sampleOutput: '55', testCases: [{ input: '10', output: '55' }], hints: ['使用滚动数组优化'], timeLimit: 1000, memoryLimit: 256000 },
  { id: 'ps13', title: '最大子段和', difficulty: 'hard', knowledgePoints: ['s8'], description: '求最大连续子数组和', inputFormat: 'n\nn个整数', outputFormat: '最大和', sampleInput: '9\n-2 1 -3 4 -1 2 1 -5 4', sampleOutput: '6', testCases: [{ input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6' }], hints: ['使用Kadane算法'], timeLimit: 1000, memoryLimit: 256000 },
  // s9: 动态规划进阶
  { id: 'ps14', title: '0-1背包', difficulty: 'hard', knowledgePoints: ['s9'], description: '0-1背包问题', inputFormat: 'n m\nn个物品的重量和价值', outputFormat: '最大价值', sampleInput: '4 8\n2 3\n3 4\n4 5\n5 6', sampleOutput: '8', testCases: [{ input: '4 8\n2 3\n3 4\n4 5\n5 6', output: '8' }], hints: ['dp[i][j]表示前i个物品容量j的最大价值'], timeLimit: 1000, memoryLimit: 256000 },
  { id: 'ps15', title: '最长公共子序列', difficulty: 'hard', knowledgePoints: ['s9'], description: '求两个字符串的最长公共子序列长度', inputFormat: '两行，每行一个字符串', outputFormat: 'LCS长度', sampleInput: 'abcde\nace', sampleOutput: '3', testCases: [{ input: 'abcde\nace', output: '3' }], hints: ['dp[i][j]表示前i和前j个字符的LCS'], timeLimit: 1000, memoryLimit: 256000 },
  // s10: 贪心算法
  { id: 'ps16', title: '活动选择', difficulty: 'hard', knowledgePoints: ['s10'], description: '选择最多不重叠的活动', inputFormat: 'n\nn个活动的起止时间', outputFormat: '最大活动数', sampleInput: '4\n1 3\n2 4\n3 5\n5 7', sampleOutput: '3', testCases: [{ input: '4\n1 3\n2 4\n3 5\n5 7', output: '3' }], hints: ['按结束时间排序'], timeLimit: 1000, memoryLimit: 256000 },
  // s11: 搜索与剪枝
  { id: 'ps17', title: '全排列', difficulty: 'medium', knowledgePoints: ['s11'], description: '生成1到n的所有全排列', inputFormat: '一行，n', outputFormat: '所有排列', sampleInput: '3', sampleOutput: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', testCases: [{ input: '3', output: '1 2 3' }], hints: ['DFS回溯'], timeLimit: 1000, memoryLimit: 256000 },
  // s12: 高级数论
  { id: 'ps18', title: '扩展欧几里得', difficulty: 'hard', knowledgePoints: ['s12'], description: '求ax+by=gcd(a,b)的解', inputFormat: '一行，a b', outputFormat: 'x y gcd', sampleInput: '4 6', sampleOutput: '-1 1 2', testCases: [{ input: '4 6', output: '-1 1 2' }], hints: ['递归求解'], timeLimit: 1000, memoryLimit: 256000 },
  // s13: 组合数学
  { id: 'ps19', title: '计算组合数', difficulty: 'hard', knowledgePoints: ['s13'], description: '计算C(n,m)对mod取模', inputFormat: '一行，n m mod', outputFormat: 'C(n,m) % mod', sampleInput: '5 2 1000', sampleOutput: '10', testCases: [{ input: '5 2 1000', output: '10' }], hints: ['使用杨辉三角或阶乘'], timeLimit: 1000, memoryLimit: 256000 },
  // s14: 哈希与集合
  { id: 'ps20', title: '两数之和', difficulty: 'medium', knowledgePoints: ['s14'], description: '在数组中找和为目标值的两个数', inputFormat: 'n target\nn个整数', outputFormat: '两个数的下标', sampleInput: '4 9\n2 7 11 15', sampleOutput: '0 1', testCases: [{ input: '4 9\n2 7 11 15', output: '0 1' }], hints: ['使用哈希表O(n)解决'], timeLimit: 1000, memoryLimit: 256000 },
];

export const getProblemById = (id: string): Problem | undefined => {
  return problems.find(p => p.id === id);
};

export const getProblemsByKnowledgePoint = (knowledgePointId: string): Problem[] => {
  return problems.filter(p => p.knowledgePoints.includes(knowledgePointId));
};

export const getProblemsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Problem[] => {
  return problems.filter(p => p.difficulty === difficulty);
};
