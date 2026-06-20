import type { AIResponse } from '@/types/ai';

export const aiResponses: AIResponse[] = [
  {
    errorType: 'wrong_answer',
    knowledgePoint: 'kp1',
    analysis: {
      rootCause: '基础语法错误，可能是变量类型不匹配、运算符使用错误或条件判断逻辑有误。',
      commonMistakes: [
        '整数除法忘记取整',
        '浮点数比较使用==而不是近似比较',
        '条件判断中的逻辑运算符错误',
      ],
      suggestions: [
        '仔细检查变量类型是否正确',
        '注意运算符优先级',
        '添加调试输出验证中间结果',
      ],
      relatedKnowledgePoints: ['kp1'],
      codeExamples: [
        {
          wrongCode: 'int a = 5 / 2;\ncout << a * 2;',
          correctCode: 'int a = 5 / 2;\ncout << a * 2.0;',
          explanation: '整数除法会截断小数部分，需要注意类型转换。',
        },
      ],
    },
  },
  {
    errorType: 'wrong_answer',
    knowledgePoint: 'kp2',
    analysis: {
      rootCause: '数组或字符串操作错误，可能是下标越界、长度计算错误或遍历逻辑有误。',
      commonMistakes: ['数组下标从1开始', '忘记处理空数组', '字符串索引越界'],
      suggestions: ['确认数组下标从0开始', '检查数组长度', '使用边界条件测试'],
      relatedKnowledgePoints: ['kp1', 'kp2'],
      codeExamples: [
        {
          wrongCode: 'int arr[5];\nfor(int i=1;i<=5;i++) arr[i]=i;',
          correctCode: 'int arr[5];\nfor(int i=0;i<5;i++) arr[i]=i+1;',
          explanation: '数组下标从0开始，应使用i<5而不是i<=5。',
        },
      ],
    },
  },
  {
    errorType: 'wrong_answer',
    knowledgePoint: 'kp7',
    analysis: {
      rootCause: '动态规划状态转移方程错误，可能是状态定义不准确或转移逻辑有误。',
      commonMistakes: [
        '状态定义不完整',
        '状态转移方程遗漏某些情况',
        '初始条件设置错误',
      ],
      suggestions: [
        '先明确状态定义',
        '手动推导小规模样例验证转移方程',
        '检查边界条件',
      ],
      relatedKnowledgePoints: ['kp5', 'kp6', 'kp7'],
      codeExamples: [
        {
          wrongCode: 'dp[i] = dp[i-1] + arr[i];',
          correctCode: 'dp[i] = max(dp[i-1] + arr[i], arr[i]);',
          explanation: '最大子数组和需要考虑是否从当前位置重新开始。',
        },
      ],
    },
  },
  {
    errorType: 'runtime_error',
    knowledgePoint: 'kp3',
    analysis: {
      rootCause: '运行时错误，可能是空指针访问、数组越界或栈溢出。',
      commonMistakes: ['未初始化指针', '递归深度过大', '数组下标越界'],
      suggestions: ['检查指针是否为空', '优化递归深度', '添加边界检查'],
      relatedKnowledgePoints: ['kp2', 'kp3', 'kp8'],
      codeExamples: [
        {
          wrongCode: 'int* p;\n*p = 10;',
          correctCode: 'int* p = new int;\n*p = 10;',
          explanation: '指针未初始化时不能直接解引用。',
        },
      ],
    },
  },
  {
    errorType: 'time_limit_exceeded',
    knowledgePoint: 'kp5',
    analysis: {
      rootCause: '时间复杂度太高，算法效率不足。',
      commonMistakes: ['使用O(n^2)算法处理大规模数据', '重复计算', '不必要的循环'],
      suggestions: ['优化算法复杂度', '使用缓存避免重复计算', '减少循环次数'],
      relatedKnowledgePoints: ['kp5', 'kp6', 'kp7'],
      codeExamples: [
        {
          wrongCode: 'for(int i=0;i<n;i++) for(int j=0;j<n;j++) ...',
          correctCode: 'for(int i=0;i<n;i++) ...',
          explanation: '尝试将嵌套循环优化为单层循环。',
        },
      ],
    },
  },
  {
    errorType: 'time_limit_exceeded',
    knowledgePoint: 'kp7',
    analysis: {
      rootCause: '动态规划未优化，时间或空间复杂度太高。',
      commonMistakes: ['未使用滚动数组优化空间', '状态转移计算冗余', '状态数量过多'],
      suggestions: ['使用滚动数组', '优化状态转移', '减少状态维度'],
      relatedKnowledgePoints: ['kp7'],
      codeExamples: [
        {
          wrongCode: 'int dp[n+1][m+1];',
          correctCode: 'int dp[2][m+1];',
          explanation: '只保留当前和上一行，可以将空间从O(nm)优化到O(m)。',
        },
      ],
    },
  },
  {
    errorType: 'compile_error',
    knowledgePoint: 'kp1',
    analysis: {
      rootCause: '编译错误，代码语法不正确。',
      commonMistakes: [
        '缺少分号',
        '括号不匹配',
        '未声明变量',
        '函数参数类型不匹配',
      ],
      suggestions: ['检查语法错误', '确保括号配对', '声明所有使用的变量'],
      relatedKnowledgePoints: ['kp1'],
      codeExamples: [
        {
          wrongCode: 'int main() { cout << "Hello" }',
          correctCode: 'int main() { cout << "Hello"; }',
          explanation: '语句末尾需要分号。',
        },
      ],
    },
  },
];

export const getAIResponse = (errorType: string, knowledgePoint: string): AIResponse | undefined => {
  return aiResponses.find(
    response => response.errorType === errorType && response.knowledgePoint === knowledgePoint
  );
};

export const getGenericAIResponse = (errorType: string): AIResponse | undefined => {
  return aiResponses.find(response => response.errorType === errorType);
};