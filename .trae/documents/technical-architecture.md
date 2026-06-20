# 信奥赛智能学习诊断系统 - 技术架构文档

## 1. 架构设计

系统采用纯前端架构，所有数据内置在应用中，用户学习数据存储在浏览器localStorage。应用可部署到任何静态文件服务器，无需后端支持。

```mermaid
graph TB
    subgraph "前端应用"
        "React应用<br/>Vite构建"
        "状态管理<br/>Zustand"
        "路由管理<br/>React Router"
        "数据持久化<br/>localStorage"
    end

    subgraph "数据层"
        "内置数据<br/>src/data/*.json"
        "用户数据<br/>localStorage"
    end

    subgraph "UI组件"
        "页面组件<br/>Pages"
        "通用组件<br/>Components"
        "图表组件<br/>ECharts"
        "代码编辑器<br/>Monaco Editor"
    end

    subgraph "工具库"
        "样式方案<br/>Tailwind CSS"
        "动画库<br/>Framer Motion"
        "工具函数<br/>Utils"
    end

    "React应用<br/>Vite构建" --> "状态管理<br/>Zustand"
    "React应用<br/>Vite构建" --> "路由管理<br/>React Router"
    "状态管理<br/>Zustand" --> "数据持久化<br/>localStorage"
    "状态管理<br/>Zustand" --> "内置数据<br/>src/data/*.json"
    "React应用<br/>Vite构建" --> "页面组件<br/>Pages"
    "页面组件<br/>Pages" --> "通用组件<br/>Components"
    "页面组件<br/>Pages" --> "图表组件<br/>ECharts"
    "页面组件<br/>Pages" --> "代码编辑器<br/>Monaco Editor"
    "React应用<br/>Vite构建" --> "样式方案<br/>Tailwind CSS"
    "React应用<br/>Vite构建" --> "动画库<br/>Framer Motion"
    "React应用<br/>Vite构建" --> "工具函数<br/>Utils"
```

## 2. 技术栈说明

### 2.1 核心技术栈
- **框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **样式方案**：Tailwind CSS 3
- **状态管理**：Zustand（轻量级状态管理）
- **路由**：React Router v6
- **图表库**：ECharts 5
- **代码编辑器**：Monaco Editor（VS Code编辑器核心）
- **动画库**：Framer Motion
- **HTTP客户端**：Axios（用于未来可能的API扩展）

### 2.2 开发工具
- **代码规范**：ESLint + Prettier
- **类型检查**：TypeScript
- **版本控制**：Git
- **包管理器**：pnpm / npm

### 2.3 部署方案
- **静态部署**：Vercel / Netlify / GitHub Pages
- **构建产物**：静态HTML、CSS、JS文件
- **CDN加速**：可选，用于加速静态资源加载

## 3. 项目结构

```
oi-learning-system/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/          # 通用组件
│   │   ├── common/         # 基础组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/         # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   └── charts/         # 图表组件
│   │       ├── RadarChart.tsx
│   │       ├── LineChart.tsx
│   │       └── BarChart.tsx
│   ├── pages/              # 页面组件
│   │   ├── Home/          # 首页
│   │   │   ├── index.tsx
│   │   │   └── components/
│   │   ├── Diagnosis/      # 诊断中心
│   │   │   ├── index.tsx
│   │   │   ├── TestPage.tsx
│   │   │   ├── ReportPage.tsx
│   │   │   └── components/
│   │   ├── LearningPath/   # 学习路径
│   │   │   ├── index.tsx
│   │   │   ├── KnowledgeDetail.tsx
│   │   │   └── components/
│   │   ├── DailyPractice/  # 每日推荐
│   │   │   ├── index.tsx
│   │   │   ├── ProblemPage.tsx
│   │   │   └── components/
│   │   ├── Mistakes/       # 错题归因
│   │   │   ├── index.tsx
│   │   │   ├── AnalysisPage.tsx
│   │   │   └── components/
│   │   └── ParentReport/   # 家长报告
│   │       ├── index.tsx
│   │       └── components/
│   ├── data/              # 内置数据
│   │   ├── problems.json          # 题库数据
│   │   ├── knowledgePoints.json   # 知识点数据
│   │   ├── diagnosisQuestions.json # 诊断题目
│   │   ├── learningPath.json      # 学习路径
│   │   ├── aiResponses.json       # AI归因预设响应
│   │   └── sampleCode.ts          # 示例代码
│   ├── store/             # 状态管理
│   │   ├── useUserStore.ts        # 用户状态
│   │   ├── useDiagnosisStore.ts   # 诊断状态
│   │   ├── useLearningStore.ts    # 学习状态
│   │   └── useMistakesStore.ts    # 错题状态
│   ├── hooks/             # 自定义Hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useProblem.ts
│   │   └── useAnalysis.ts
│   ├── utils/             # 工具函数
│   │   ├── storage.ts             # localStorage操作
│   │   ├── analysis.ts             # 数据分析
│   │   ├── recommendation.ts      # 推荐算法
│   │   └── helpers.ts              # 辅助函数
│   ├── types/             # 类型定义
│   │   ├── problem.ts
│   │   ├── knowledge.ts
│   │   ├── user.ts
│   │   └── diagnosis.ts
│   ├── styles/            # 全局样式
│   │   └── globals.css
│   ├── App.tsx            # 根组件
│   ├── main.tsx           # 入口文件
│   └── vite-env.d.ts      # Vite类型定义
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 4. 路由定义

| 路由路径 | 页面名称 | 功能描述 |
|----------|----------|----------|
| `/` | 首页 | 系统介绍、数据概览、快速入口 |
| `/diagnosis` | 诊断中心 | 水平诊断测试入口 |
| `/diagnosis/test/:level` | 诊断测试页 | 进行诊断测试（CSP-J/CSP-S） |
| `/diagnosis/report/:id` | 诊断报告页 | 查看诊断报告 |
| `/learning-path` | 学习路径页 | 查看个性化学习路径 |
| `/learning-path/:nodeId` | 知识点详情页 | 查看知识点详情 |
| `/daily` | 每日推荐页 | 查看今日推荐题目 |
| `/daily/problem/:id` | 答题页 | 进行题目练习 |
| `/mistakes` | 错题本页 | 查看错题列表 |
| `/mistakes/:id` | 错题详情页 | 查看错题归因分析 |
| `/parent/report` | 家长报告页 | 查看学习进度报告 |

## 5. 数据模型

### 5.1 题目数据 (problems.json)

```typescript
interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  knowledgePoints: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  testCases: TestCase[];
  hints: string[];
  timeLimit: number; // 毫秒
  memoryLimit: number; // KB
}

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}
```

### 5.2 知识点数据 (knowledgePoints.json)

```typescript
interface KnowledgePoint {
  id: string;
  name: string;
  category: '基础语法' | '数据结构' | '算法' | '数学' | '图论' | '动态规划';
  description: string;
  prerequisites: string[]; // 前置知识点ID
  difficultyLevel: number; // 1-10
  problems: string[]; // 相关题目ID
  learningResources: {
    title: string;
    url: string;
    type: 'video' | 'article' | 'practice';
  }[];
}
```

### 5.3 诊断题目数据 (diagnosisQuestions.json)

```typescript
interface DiagnosisQuestion {
  id: string;
  level: 'CSP-J' | 'CSP-S';
  knowledgePoint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  type: 'choice' | 'code';
  options?: string[]; // 选择题选项
  correctAnswer: string | string[];
  codeTemplate?: string; // 代码题模板
  testCases?: TestCase[];
  explanation: string;
}
```

### 5.4 学习路径数据 (learningPath.json)

```typescript
interface LearningPath {
  id: string;
  name: string;
  level: 'CSP-J' | 'CSP-S';
  nodes: LearningNode[];
}

interface LearningNode {
  id: string;
  knowledgePointId: string;
  order: number;
  prerequisites: string[]; // 前置节点ID
  unlockCondition: {
    minMasteryLevel: number;
    requiredProblems: number;
  };
}
```

### 5.5 AI归因预设响应 (aiResponses.json)

```typescript
interface AIResponse {
  errorType: 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'compile_error';
  knowledgePoint: string;
  analysis: {
    rootCause: string;
    commonMistakes: string[];
    suggestions: string[];
    relatedKnowledgePoints: string[];
  };
  codeExamples: {
    wrongCode: string;
    correctCode: string;
    explanation: string;
  }[];
}
```

### 5.6 用户学习数据 (localStorage)

```typescript
interface UserLearningData {
  // 基本信息
  userId: string;
  name: string;
  createdAt: string;
  lastLoginAt: string;

  // 诊断记录
  diagnosisHistory: DiagnosisRecord[];

  // 学习进度
  learningProgress: KnowledgeProgress[];

  // 题目记录
  completedProblems: ProblemRecord[];

  // 错题记录
  mistakes: MistakeRecord[];

  // 学习统计
  statistics: {
    totalStudyTime: number; // 分钟
    streakDays: number;
    totalProblems: number;
    correctProblems: number;
    lastStudyDate: string;
  };
}

interface DiagnosisRecord {
  id: string;
  date: string;
  level: 'CSP-J' | 'CSP-S';
  scores: Record<string, number>; // 知识点ID -> 分数
  weakPoints: string[];
  recommendations: string[];
}

interface KnowledgeProgress {
  knowledgePointId: string;
  masteryLevel: number; // 0-100
  completedProblems: number;
  correctProblems: number;
  lastPracticeDate: string;
}

interface ProblemRecord {
  problemId: string;
  completedAt: string;
  code: string;
  status: 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded';
  executionTime: number;
  memoryUsage: number;
}

interface MistakeRecord {
  id: string;
  problemId: string;
  date: string;
  code: string;
  errorType: string;
  aiAnalysis: string;
  reviewed: boolean;
  reviewedAt?: string;
}
```

## 6. 核心功能实现

### 6.1 诊断功能实现

#### 诊断流程
1. 用户选择诊断级别（CSP-J 或 CSP-S）
2. 系统从内置诊断题库中随机抽取题目
3. 用户答题，系统记录答案
4. 系统分析答题情况，计算各知识点得分
5. 生成诊断报告，展示知识点掌握度雷达图
6. 推荐个性化学习路径

#### 诊断算法
```typescript
// 诊断分析算法
function analyzeDiagnosis(answers: Answer[]): DiagnosisResult {
  const knowledgeScores: Record<string, number> = {};

  // 按知识点分组计算得分
  answers.forEach(answer => {
    const question = diagnosisQuestions.find(q => q.id === answer.questionId);
    if (!question) return;

    if (!knowledgeScores[question.knowledgePoint]) {
      knowledgeScores[question.knowledgePoint] = 0;
    }

    if (answer.isCorrect) {
      knowledgeScores[question.knowledgePoint] += question.difficulty === 'easy' ? 1 :
                                                   question.difficulty === 'medium' ? 2 : 3;
    }
  });

  // 归一化得分（0-100）
  const normalizedScores = normalizeScores(knowledgeScores);

  // 识别薄弱项（得分低于60的知识点）
  const weakPoints = Object.entries(normalizedScores)
    .filter(([_, score]) => score < 60)
    .map(([id, _]) => id);

  // 生成学习建议
  const recommendations = generateRecommendations(weakPoints);

  return {
    scores: normalizedScores,
    weakPoints,
    recommendations
  };
}
```

### 6.2 学习路径推荐

#### 推荐算法
```typescript
// 学习路径推荐算法
function recommendLearningPath(diagnosisResult: DiagnosisResult): LearningNode[] {
  const { weakPoints, scores } = diagnosisResult;

  // 获取所有知识点节点
  const allNodes = learningPath.nodes;

  // 根据薄弱项和前置关系排序
  const recommendedNodes = allNodes
    .filter(node => weakPoints.includes(node.knowledgePointId))
    .sort((a, b) => {
      // 优先推荐前置知识点已掌握的
      const aPrereqMet = a.prerequisites.every(p =>
        scores[p] >= 60
      );
      const bPrereqMet = b.prerequisites.every(p =>
        scores[p] >= 60
      );

      if (aPrereqMet && !bPrereqMet) return -1;
      if (!aPrereqMet && bPrereqMet) return 1;

      // 都满足前置条件，按得分从低到高排序
      return scores[a.knowledgePointId] - scores[b.knowledgePointId];
    });

  return recommendedNodes;
}
```

### 6.3 每日推荐算法

#### 推荐策略
```typescript
// 每日题目推荐算法
function recommendDailyProblems(userProgress: UserLearningData): Problem[] {
  const { learningProgress, completedProblems, mistakes } = userProgress;

  // 获取未掌握的知识点
  const weakKnowledgePoints = learningProgress
    .filter(p => p.masteryLevel < 80)
    .map(p => p.knowledgePointId);

  // 获取错题相关的知识点
  const mistakeKnowledgePoints = [...new Set(
    mistakes.map(m => {
      const problem = problems.find(p => p.id === m.problemId);
      return problem?.knowledgePoints[0];
    }).filter(Boolean)
  )];

  // 合并需要加强的知识点
  const targetKnowledgePoints = [...new Set([
    ...weakKnowledgePoints,
    ...mistakeKnowledgePoints
  ])];

  // 筛选题目
  const recommendedProblems = problems
    .filter(p => {
      // 未做过的题目
      const notCompleted = !completedProblems.find(cp => cp.problemId === p.id);
      // 包含目标知识点
      const hasTargetKP = p.knowledgePoints.some(kp =>
        targetKnowledgePoints.includes(kp)
      );
      return notCompleted && hasTargetKP;
    })
    .sort((a, b) => {
      // 按难度排序：先易后难
      const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    })
    .slice(0, 5); // 推荐5道题

  return recommendedProblems;
}
```

### 6.4 错题AI归因

#### 归因分析
```typescript
// 错题归因分析
function analyzeMistake(mistake: MistakeRecord): AIAnalysis {
  const problem = problems.find(p => p.id === mistake.problemId);
  if (!problem) throw new Error('Problem not found');

  // 从预设响应中查找匹配的分析
  const matchedResponse = aiResponses.find(response =>
    response.errorType === mistake.errorType &&
    problem.knowledgePoints.includes(response.knowledgePoint)
  );

  if (matchedResponse) {
    return {
      rootCause: matchedResponse.analysis.rootCause,
      commonMistakes: matchedResponse.analysis.commonMistakes,
      suggestions: matchedResponse.analysis.suggestions,
      relatedKnowledgePoints: matchedResponse.analysis.relatedKnowledgePoints,
      codeExamples: matchedResponse.codeExamples
    };
  }

  // 如果没有预设响应，生成通用分析
  return generateGenericAnalysis(mistake, problem);
}
```

### 6.5 家长报告生成

#### 报告生成
```typescript
// 生成家长报告
function generateParentReport(userProgress: UserLearningData): ParentReport {
  const { statistics, learningProgress, diagnosisHistory, mistakes } = userProgress;

  // 计算学习趋势（最近7天）
  const last7Days = getLast7DaysData(userProgress);

  // 计算知识点掌握度
  const knowledgePointMastery = learningProgress.map(p => ({
    name: getKnowledgePointName(p.knowledgePointId),
    masteryLevel: p.masteryLevel,
    completedProblems: p.completedProblems,
    correctRate: p.completedProblems > 0
      ? (p.correctProblems / p.completedProblems) * 100
      : 0
  }));

  // 识别薄弱项
  const weakPoints = knowledgePointMastery
    .filter(kp => kp.masteryLevel < 60)
    .map(kp => kp.name);

  // 生成学习建议
  const recommendations = generateWeeklyRecommendations(weakPoints, mistakes);

  return {
    summary: {
      totalStudyTime: statistics.totalStudyTime,
      totalProblems: statistics.totalProblems,
      correctRate: statistics.totalProblems > 0
        ? (statistics.correctProblems / statistics.totalProblems) * 100
        : 0,
      streakDays: statistics.streakDays
    },
    trends: last7Days,
    knowledgePointMastery,
    weakPoints,
    recommendations
  };
}
```

## 7. 数据持久化

### 7.1 localStorage管理

```typescript
// localStorage操作工具
const STORAGE_KEYS = {
  USER_DATA: 'oi_user_data',
  LEARNING_PROGRESS: 'oi_learning_progress',
  MISTAKES: 'oi_mistakes',
  SETTINGS: 'oi_settings'
};

// 保存用户数据
function saveUserData(data: UserLearningData): void {
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
}

// 加载用户数据
function loadUserData(): UserLearningData | null {
  const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return data ? JSON.parse(data) : null;
}

// 初始化用户数据
function initializeUserData(): UserLearningData {
  return {
    userId: generateUUID(),
    name: '学生',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    diagnosisHistory: [],
    learningProgress: [],
    completedProblems: [],
    mistakes: [],
    statistics: {
      totalStudyTime: 0,
      streakDays: 0,
      totalProblems: 0,
      correctProblems: 0,
      lastStudyDate: new Date().toISOString().split('T')[0]
    }
  };
}
```

## 8. 性能优化

### 8.1 代码分割
- 使用React.lazy和Suspense进行路由级代码分割
- 按需加载Monaco Editor（仅在答题页面加载）
- 按需加载ECharts（仅在需要图表的页面加载）

### 8.2 数据优化
- 内置数据按需加载（诊断题库、题库分块）
- localStorage数据压缩存储
- 使用索引加速数据查找

### 8.3 渲染优化
- 使用React.memo避免不必要的重渲染
- 使用useMemo和useCallback优化计算和回调
- 虚拟列表优化长列表渲染

### 8.4 缓存策略
- 内置数据缓存到内存
- 用户数据实时同步到localStorage
- 使用Service Worker缓存静态资源

## 9. 部署方案

### 9.1 构建命令
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 9.2 部署平台
- **Vercel**：推荐，自动部署，CDN加速
- **Netlify**：免费，支持自定义域名
- **GitHub Pages**：免费，适合开源项目
- **阿里云OSS / 腾讯云COS**：国内访问速度快

### 9.3 环境变量
```env
# 应用配置
VITE_APP_TITLE=信奥赛智能学习诊断系统
VITE_APP_VERSION=1.0.0
```

## 10. 开发计划

### 10.1 第一阶段：核心功能（优先）
- 首页展示
- 诊断功能（诊断测试 + 报告生成）
- 学习路径展示
- 每日推荐（题目展示 + 答题界面）
- 错题归因（错题列表 + AI分析）

### 10.2 第二阶段：完善功能
- 家长报告
- 数据统计和可视化
- 用户设置
- 学习提醒

### 10.3 第三阶段：优化和扩展
- 性能优化
- 移动端适配
- 小程序版本
- 数据导出功能