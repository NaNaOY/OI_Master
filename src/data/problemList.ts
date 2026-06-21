// NOI题单数据
// 来源：题单.xlsx

export interface ProblemItem {
  id: string;
  category: string; // 知识点分类
  platform: string; // 来源平台（洛谷/蓝桥杯/LeetCode等）
  problemId: string; // 题号
  title: string; // 题目名称
}

// 知识点分类与题单分类的映射
export const categoryMapping: Record<string, string[]> = {
  // CSP-J 知识点
  'j1': ['枚举', '数学思维'], // 程序设计基础
  'j2': ['枚举', '贪心思想'], // 选择结构
  'j3': ['枚举', '贪心思想'], // 循环结构
  'j4': ['数学思维', '前缀和'], // 数组
  'j5': ['数学思维', '前缀和'], // 字符串
  'j6': ['枚举', '回溯算法'], // 函数与递归
  'j7': ['区间DP', '背包DP'], // 动态规划基础
  'j8': ['建图搜索', '搜索算法'], // 搜索算法
  'j9': ['贪心思想', '二分查找'], // 排序与贪心
  'j10': ['数学思维', '前缀和'], // 数学基础
  
  // CSP-S 知识点
  's1': ['回溯算法', '搜索算法'], // 递归与分治
  's2': ['树形结构'], // 栈与队列
  's3': ['树形结构'], // 链表
  's4': ['树形结构'], // 树与二叉树
  's5': ['背包DP', '区间DP'], // 图论基础
  's6': ['背包DP', '区间DP'], // 动态规划进阶
  's7': ['数学思维'], // 数学进阶
  's8': ['贪心思想', '二分查找'], // 高级数据结构
  's9': ['建图搜索', '搜索算法'], // 图论算法
  's10': ['背包DP', '区间DP'], // 动态规划专题
  's11': ['单调双端队列', '单调性枚举'], // 高级算法
  's12': ['差分', '前缀和'], // 数论基础
  's13': ['树形结构'], // 组合数学
  's14': ['数学思维'], // 计算几何
};

// 题单数据
export const problemList: ProblemItem[] = [
  // 数学思维
  { id: 'math-1', category: '数学思维', platform: '蓝桥杯', problemId: '19709', title: '好数' },
  { id: 'math-2', category: '数学思维', platform: '蓝桥杯', problemId: '3491', title: '幸运数' },
  { id: 'math-3', category: '数学思维', platform: '蓝桥杯', problemId: '1443', title: '卡片' },
  { id: 'math-4', category: '数学思维', platform: '蓝桥杯', problemId: '1065', title: '寻找 2020' },
  { id: 'math-5', category: '数学思维', platform: '蓝桥杯', problemId: '19732', title: '小球反弹' },
  { id: 'math-6', category: '数学思维', platform: '蓝桥杯', problemId: '3495', title: '特殊日期' },
  { id: 'math-7', category: '数学思维', platform: '蓝桥杯', problemId: '3492', title: '日期统计' },
  { id: 'math-8', category: '数学思维', platform: '蓝桥杯', problemId: '19730', title: '神奇闹钟' },
  { id: 'math-9', category: '数学思维', platform: '洛谷', problemId: 'P1179', title: '数字统计' },
  { id: 'math-10', category: '数学思维', platform: '洛谷', problemId: 'P1149', title: '火柴棒等式' },
  
  // 背包 DP
  { id: 'dp-1', category: '背包 DP', platform: '洛谷', problemId: 'P2663', title: '越越的组队' },
  { id: 'dp-2', category: '背包 DP', platform: '洛谷', problemId: 'P1855', title: '榨取 kkksc03' },
  { id: 'dp-3', category: '背包 DP', platform: '洛谷', problemId: 'P1910', title: 'L 国的战斗之间谍' },
  { id: 'dp-4', category: '背包 DP', platform: '洛谷', problemId: 'P1510', title: '精卫填海' },
  { id: 'dp-5', category: '背包 DP', platform: '洛谷', problemId: 'P1048', title: '采药' },
  { id: 'dp-6', category: '背包 DP', platform: '洛谷', problemId: 'P1049', title: '装箱问题' },
  { id: 'dp-7', category: '背包 DP', platform: '洛谷', problemId: 'P1060', title: '开心的金明' },
  { id: 'dp-8', category: '背包 DP', platform: '洛谷', problemId: 'P1164', title: '小 A 点菜' },
  { id: 'dp-9', category: '背包 DP', platform: '洛谷', problemId: 'P1734', title: '最大约数和' },
  { id: 'dp-10', category: '背包 DP', platform: '洛谷', problemId: 'P2347', title: '砝码称重' },
  
  // 建图搜索
  { id: 'search-1', category: '建图搜索', platform: '洛谷', problemId: 'P8605', title: '网络寻路' },
  { id: 'search-2', category: '建图搜索', platform: '洛谷', problemId: 'P8604', title: '危险系数' },
  { id: 'search-3', category: '建图搜索', platform: '洛谷', problemId: 'P5318', title: '查找文献' },
  { id: 'search-4', category: '建图搜索', platform: '洛谷', problemId: 'P1330', title: '封锁阳光大学' },
  { id: 'search-5', category: '建图搜索', platform: '洛谷', problemId: 'P1294', title: '高手去散步' },
  { id: 'search-6', category: '建图搜索', platform: '洛谷', problemId: 'P8674', title: '调手表' },
  { id: 'search-7', category: '建图搜索', platform: '洛谷', problemId: 'P5663', title: '加工零件' },
  { id: 'search-8', category: '建图搜索', platform: '洛谷', problemId: 'P9751', title: '旅游巴士' },
  
  // 树形结构
  { id: 'tree-1', category: '树形结构', platform: '洛谷', problemId: 'P1827', title: '美国血统 American Heritage' },
  { id: 'tree-2', category: '树形结构', platform: '洛谷', problemId: 'B3642', title: '二叉树的遍历' },
  { id: 'tree-3', category: '树形结构', platform: '洛谷', problemId: 'P1087', title: 'FBI 树' },
  { id: 'tree-4', category: '树形结构', platform: '洛谷', problemId: 'P1030', title: '求先序排列' },
  { id: 'tree-5', category: '树形结构', platform: '洛谷', problemId: 'P1229', title: '遍历问题' },
  { id: 'tree-6', category: '树形结构', platform: '洛谷', problemId: 'P2171', title: 'Hz 吐泡泡' },
  { id: 'tree-7', category: '树形结构', platform: '洛谷', problemId: 'P2052', title: '道路修建' },
  { id: 'tree-8', category: '树形结构', platform: '洛谷', problemId: 'P9304', title: 'DTOI-5' },
  
  // 区间 DP
  { id: 'interval-1', category: '区间DP', platform: '洛谷', problemId: 'P1775', title: '石子合并（弱化版）' },
  { id: 'interval-2', category: '区间DP', platform: '洛谷', problemId: 'P2858', title: 'Treats for the Cows G/S' },
  { id: 'interval-3', category: '区间DP', platform: '洛谷', problemId: 'P2426', title: '删数' },
  { id: 'interval-4', category: '区间DP', platform: '洛谷', problemId: 'P1063', title: '能量项链' },
  { id: 'interval-5', category: '区间DP', platform: '洛谷', problemId: 'P1622', title: '释放囚犯' },
  { id: 'interval-6', category: '区间DP', platform: '洛谷', problemId: 'P3146', title: '248 G' },
  { id: 'interval-7', category: '区间DP', platform: '洛谷', problemId: 'P4170', title: '涂色' },
  { id: 'interval-8', category: '区间DP', platform: '洛谷', problemId: 'P3205', title: '合唱队' },
  
  // 枚举
  { id: 'enum-1', category: '枚举', platform: '蓝桥杯', problemId: '19709', title: '好数' },
  { id: 'enum-2', category: '枚举', platform: '蓝桥杯', problemId: '3491', title: '幸运数' },
  { id: 'enum-3', category: '枚举', platform: '蓝桥杯', problemId: '1443', title: '卡片' },
  { id: 'enum-4', category: '枚举', platform: '蓝桥杯', problemId: '1065', title: '寻找 2020' },
  { id: 'enum-5', category: '枚举', platform: '蓝桥杯', problemId: '19732', title: '小球反弹' },
  { id: 'enum-6', category: '枚举', platform: '蓝桥杯', problemId: '3495', title: '特殊日期' },
  { id: 'enum-7', category: '枚举', platform: '蓝桥杯', problemId: '3492', title: '日期统计' },
  { id: 'enum-8', category: '枚举', platform: '蓝桥杯', problemId: '19730', title: '神奇闹钟' },
  { id: 'enum-9', category: '枚举', platform: '洛谷', problemId: 'P1179', title: '数字统计' },
  { id: 'enum-10', category: '枚举', platform: '洛谷', problemId: 'P1149', title: '火柴棒等式' },
  
  // 前缀和
  { id: 'prefix-1', category: '前缀和', platform: '蓝桥杯', problemId: '17142', title: '弹珠堆放' },
  { id: 'prefix-2', category: '前缀和', platform: '洛谷', problemId: 'P2004', title: '领地选择' },
  { id: 'prefix-3', category: '前缀和', platform: '蓝桥杯', problemId: '19717', title: '挖矿' },
  { id: 'prefix-4', category: '前缀和', platform: '蓝桥杯', problemId: '97', title: 'k 倍区间' },
  { id: 'prefix-5', category: '前缀和', platform: '洛谷', problemId: 'P8865', title: '种花' },
  { id: 'prefix-6', category: '前缀和', platform: '洛谷', problemId: 'P5638', title: '光雅者荣耀' },
  { id: 'prefix-7', category: '前缀和', platform: 'LeetCode', problemId: '42', title: '接雨水' },
  { id: 'prefix-8', category: '前缀和', platform: '蓝桥杯', problemId: '17110', title: '抓娃娃' },
  
  // 单调双端队列
  { id: 'mono-1', category: '单调双端队列', platform: '洛谷', problemId: 'P5788', title: '单调栈' },
  { id: 'mono-2', category: '单调双端队列', platform: '洛谷', problemId: 'P1901', title: '发射站' },
  { id: 'mono-3', category: '单调双端队列', platform: '蓝桥杯', problemId: '17152', title: '最大区间' },
  { id: 'mono-4', category: '单调双端队列', platform: '蓝桥杯', problemId: '3521', title: '子矩阵' },
  { id: 'mono-5', category: '单调双端队列', platform: '洛谷', problemId: 'P9290', title: 'Decryption' },
  { id: 'mono-6', category: '单调双端队列', platform: '洛谷', problemId: 'P1886', title: '滑动窗口' },
  { id: 'mono-7', category: '单调双端队列', platform: '蓝桥杯', problemId: '6251', title: '游戏' },
  { id: 'mono-8', category: '单调双端队列', platform: 'LeetCode', problemId: '85', title: '最大矩形' },
  
  // 差分
  { id: 'diff-1', category: '差分', platform: '洛谷', problemId: 'P9094', title: '油漆' },
  { id: 'diff-2', category: '差分', platform: '蓝桥杯', problemId: '2128', title: '重新排列' },
  { id: 'diff-3', category: '差分', platform: 'LeetCode', problemId: '2132', title: '用邮票贴满网格图' },
  { id: 'diff-4', category: '差分', platform: '洛谷', problemId: 'P10266', title: '高效清理' },
  { id: 'diff-5', category: '差分', platform: '洛谷', problemId: 'P6070', title: 'Decrease' },
  { id: 'diff-6', category: '差分', platform: '蓝桥杯', problemId: '3533', title: '棋盘' },
  { id: 'diff-7', category: '差分', platform: '蓝桥杯', problemId: '19716', title: '商品库存管理' },
  { id: 'diff-8', category: '差分', platform: '洛谷', problemId: 'P4231', title: '三步必杀' },
  
  // 单调性枚举
  { id: 'enum-mono-1', category: '单调性枚举', platform: '蓝桥杯', problemId: '179', title: '日志统计' },
  { id: 'enum-mono-2', category: '单调性枚举', platform: '洛谷', problemId: 'P10444', title: '极差' },
  { id: 'enum-mono-3', category: '单调性枚举', platform: 'LeetCode', problemId: '395', title: 'K 重复最小子串' },
  { id: 'enum-mono-4', category: '单调性枚举', platform: '洛谷', problemId: 'P8708', title: '整数小拼接' },
  { id: 'enum-mono-5', category: '单调性枚举', platform: '洛谷', problemId: 'P11243', title: '繁花' },
  { id: 'enum-mono-6', category: '单调性枚举', platform: '蓝桥杯', problemId: '2109', title: '统计子矩阵' },
  { id: 'enum-mono-7', category: '单调性枚举', platform: '蓝桥杯', problemId: '2209', title: '近似 GCD' },
  { id: 'enum-mono-8', category: '单调性枚举', platform: 'LeetCode', problemId: '11', title: '盛最多水的容器' },
  
  // 贪心思想
  { id: 'greedy-1', category: '贪心思想', platform: 'LeetCode', problemId: '435', title: '无重叠区间' },
  { id: 'greedy-2', category: '贪心思想', platform: 'LeetCode', problemId: '23', title: '有序合并（合并 K 个升序链表）' },
  { id: 'greedy-3', category: '贪心思想', platform: '蓝桥杯', problemId: '3532', title: '平均' },
  { id: 'greedy-4', category: '贪心思想', platform: '蓝桥杯', problemId: '3518', title: '三国' },
  { id: 'greedy-5', category: '贪心思想', platform: '蓝桥杯', problemId: '1596', title: '巧克力' },
  { id: 'greedy-6', category: '贪心思想', platform: '杭电 OJ', problemId: '1789', title: '做作业' },
  { id: 'greedy-7', category: '贪心思想', platform: '蓝桥杯', problemId: '19715', title: '回文数组' },
  { id: 'greedy-8', category: '贪心思想', platform: '蓝桥杯', problemId: '19724', title: '食堂' },
  
  // 二分查找
  { id: 'binary-1', category: '二分查找', platform: '洛谷', problemId: 'P2249', title: '二分【模版】' },
  { id: 'binary-2', category: '二分查找', platform: '蓝桥杯', problemId: '2191', title: '卡牌' },
  { id: 'binary-3', category: '二分查找', platform: '洛谷', problemId: 'P1024', title: '一元三次' },
  { id: 'binary-4', category: '二分查找', platform: '蓝桥杯', problemId: '2129', title: '技能升级' },
  { id: 'binary-5', category: '二分查找', platform: '洛谷', problemId: 'P1083', title: '借教室' },
  { id: 'binary-6', category: '二分查找', platform: '蓝桥杯', problemId: '3544', title: '管道' },
  { id: 'binary-7', category: '二分查找', platform: 'LeetCode', problemId: '410', title: '分割数组【例题】' },
  { id: 'binary-8', category: '二分查找', platform: '洛谷', problemId: 'P2678', title: '跳石头' },
  
  // 回溯算法
  { id: 'backtrack-1', category: '回溯算法', platform: 'LeetCode', problemId: '77', title: '组合' },
  { id: 'backtrack-2', category: '回溯算法', platform: 'LeetCode', problemId: '78', title: '子集' },
  { id: 'backtrack-3', category: '回溯算法', platform: 'LeetCode', problemId: '46', title: '全排列1' },
  { id: 'backtrack-4', category: '回溯算法', platform: 'LeetCode', problemId: '47', title: '全排列2' },
  { id: 'backtrack-5', category: '回溯算法', platform: 'LeetCode', problemId: '39', title: '组合总数1' },
  { id: 'backtrack-6', category: '回溯算法', platform: 'LeetCode', problemId: '40', title: '组合总数2' },
  { id: 'backtrack-7', category: '回溯算法', platform: '蓝桥杯', problemId: '3511', title: '飞机降落-23省赛' },
  { id: 'backtrack-8', category: '回溯算法', platform: '蓝桥杯', problemId: '19712', title: '数字接龙-24省赛' },
  
  // 搜索算法
  { id: 'search-algo-1', category: '搜索算法', platform: 'LeetCode', problemId: '1926', title: '迷宫中离入口最近的出口' },
  { id: 'search-algo-2', category: '搜索算法', platform: '杭电OJ', problemId: '1072', title: '噩梦' },
  { id: 'search-algo-3', category: '搜索算法', platform: 'LeetCode', problemId: '200', title: '岛屿数量' },
  { id: 'search-algo-4', category: '搜索算法', platform: '洛谷', problemId: 'P4779', title: '单源最短路（模版）' },
  { id: 'search-algo-5', category: '搜索算法', platform: '蓝桥杯', problemId: '3538', title: '合并区域[23省赛-B]' },
  { id: 'search-algo-6', category: '搜索算法', platform: '蓝桥杯', problemId: '3513', title: '岛屿个数[23省赛-B]' },
  { id: 'search-algo-7', category: '搜索算法', platform: '蓝桥杯', problemId: '2222', title: '迷宫[22-国赛B]' },
  { id: 'search-algo-8', category: '搜索算法', platform: '蓝桥杯', problemId: '229', title: '迷宫与陷阱[18国赛-C]' },
];

// 根据知识点ID获取推荐的题目
export const getRecommendedProblemsByKnowledgePoint = (kpId: string): ProblemItem[] => {
  const categories = categoryMapping[kpId] || [];
  const problems = problemList.filter(p => categories.includes(p.category));
  return problems.slice(0, 10); // 返回最多10道题
};

// 根据薄弱知识点列表获取推荐的题目
export const getRecommendedProblemsByWeakPoints = (weakPoints: string[]): ProblemItem[] => {
  const allProblems: ProblemItem[] = [];
  
  weakPoints.forEach(kpId => {
    const problems = getRecommendedProblemsByKnowledgePoint(kpId);
    problems.forEach(p => {
      if (!allProblems.find(ap => ap.id === p.id)) {
        allProblems.push(p);
      }
    });
  });
  
  return allProblems.slice(0, 20); // 返回最多20道题
};

// 获取题单分类列表
export const getProblemCategories = (): string[] => {
  const categories = new Set<string>();
  problemList.forEach(p => categories.add(p.category));
  return Array.from(categories);
};