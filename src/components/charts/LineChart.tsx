import ReactECharts from 'echarts-for-react';

interface LineChartProps {
  data: { date: string; value: number }[];
  title?: string;
  yAxisLabel?: string;
}

export const LineChart = ({ data, title, yAxisLabel }: LineChartProps) => {
  const option = {
    title: title ? { text: title, left: 'center' } : undefined,
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.date),
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#d1d5db',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: yAxisLabel,
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#d1d5db',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
    },
    series: [
      {
        name: yAxisLabel || '数值',
        type: 'line',
        smooth: true,
        data: data.map(item => item.value),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ],
          },
        },
        lineStyle: {
          color: '#3b82f6',
          width: 2,
        },
        itemStyle: {
          color: '#3b82f6',
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '250px', width: '100%' }} />;
};