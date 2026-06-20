import ReactECharts from 'echarts-for-react';

interface BarChartProps {
  data: { name: string; value: number; color?: string }[];
  title?: string;
  yAxisLabel?: string;
}

export const BarChart = ({ data, title, yAxisLabel }: BarChartProps) => {
  const option = {
    title: title ? { text: title, left: 'center' } : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        rotate: data.length > 6 ? 30 : 0,
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
        type: 'bar',
        data: data.map(item => ({
          value: item.value,
          itemStyle: {
            color: item.color || '#3b82f6',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '50%',
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '250px', width: '100%' }} />;
};