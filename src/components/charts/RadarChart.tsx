import ReactECharts from 'echarts-for-react';

interface RadarChartProps {
  data: { name: string; value: number }[];
  title?: string;
}

export const RadarChart = ({ data, title }: RadarChartProps) => {
  const option = {
    title: title ? { text: title, left: 'center' } : undefined,
    tooltip: {},
    legend: {
      data: ['掌握度'],
      bottom: 10,
    },
    radar: {
      indicator: data.map(item => ({ name: item.name, max: 100 })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#6b7280',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: ['#e5e7eb'],
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#f9fafb', '#ffffff'],
        },
      },
      axisLine: {
        lineStyle: {
          color: '#d1d5db',
        },
      },
    },
    series: [
      {
        name: '掌握度',
        type: 'radar',
        data: [
          {
            value: data.map(item => item.value),
            name: '掌握度',
            areaStyle: {
              color: 'rgba(59, 130, 246, 0.2)',
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
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '300px', width: '100%' }} />;
};