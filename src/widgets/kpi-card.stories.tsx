import type { Meta, StoryObj } from '@storybook/react';
import { KPICard } from './kpi-card';
import type { KPIWidgetConfig } from '../types';

const meta: Meta<typeof KPICard> = {
  title: 'Widgets/KPICard',
  component: KPICard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof KPICard>;

const baseConfig: KPIWidgetConfig = {
  id: 'revenue',
  type: 'kpi',
  title: 'Total Revenue',
  dataSource: {
    type: 'static',
    data: {},
  },
  valueKey: 'value',
};

export const Default: Story = {
  args: {
    config: {
      ...baseConfig,
      title: 'Total Revenue',
      valueKey: 'value',
      format: (val) => `$${Number(val).toLocaleString()}`,
    },
    data: { value: 125000 },
    isLoading: false,
    error: null,
  },
};

export const WithIcon: Story = {
  args: {
    config: {
      ...baseConfig,
      title: 'Active Users',
      valueKey: 'users',
      format: (val) => Number(val).toLocaleString(),
      icon: '👥',
    },
    data: { users: 2847 },
    isLoading: false,
    error: null,
  },
};

export const WithTrend: Story = {
  args: {
    config: {
      ...baseConfig,
      title: 'Monthly Sales',
      valueKey: 'sales',
      format: (val) => `$${Number(val).toLocaleString()}`,
      trend: {
        key: 'change',
        format: (val) => `${val}% from last month`,
      },
      icon: '📈',
    },
    data: { sales: 58320, change: 12.5 },
    isLoading: false,
    error: null,
  },
};

export const LargeNumber: Story = {
  args: {
    config: {
      ...baseConfig,
      title: 'Total Impressions',
      valueKey: 'impressions',
      format: (val) => {
        const num = Number(val);
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
      },
      icon: '👁️',
    },
    data: { impressions: 3450000 },
    isLoading: false,
    error: null,
  },
};

export const Percentage: Story = {
  args: {
    config: {
      ...baseConfig,
      title: 'Conversion Rate',
      valueKey: 'rate',
      format: (val) => `${Number(val).toFixed(2)}%`,
      trend: {
        key: 'diff',
        format: (val) => {
          const num = Number(val);
          return num >= 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`;
        },
      },
      icon: '🎯',
    },
    data: { rate: 3.42, diff: 0.38 },
    isLoading: false,
    error: null,
  },
};

export const Rating: Story = {
  args: {
    config: {
      ...baseConfig,
      title: 'Customer Satisfaction',
      valueKey: 'rating',
      format: (val) => `${Number(val).toFixed(1)}/5`,
      trend: {
        key: 'change',
        format: (val) => {
          const num = Number(val);
          return num >= 0 ? `+${num.toFixed(1)}` : `${num.toFixed(1)}`;
        },
      },
      icon: '⭐',
    },
    data: { rating: 4.8, change: 0.3 },
    isLoading: false,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    config: baseConfig,
    data: null,
    isLoading: true,
    error: null,
  },
};

export const Error: Story = {
  args: {
    config: baseConfig,
    data: null,
    isLoading: false,
    error: new Error('Failed to fetch data'),
  },
};

export const NoValue: Story = {
  args: {
    config: {
      ...baseConfig,
      title: 'No Data',
      valueKey: 'missing',
    },
    data: {},
    isLoading: false,
    error: null,
  },
};

export const MinimalNoTitle: Story = {
  args: {
    config: {
      ...baseConfig,
      title: undefined,
      valueKey: 'value',
      format: (val) => `$${Number(val).toLocaleString()}`,
      icon: '💰',
    },
    data: { value: 99999 },
    isLoading: false,
    error: null,
  },
};

export const ComplexFormatting: Story = {
  args: {
    config: {
      ...baseConfig,
      title: 'Response Time',
      valueKey: 'ms',
      format: (val) => {
        const ms = Number(val);
        if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
        return `${ms}ms`;
      },
      trend: {
        key: 'improvement',
        format: (val) => `${Number(val) * -1}% faster`,
      },
      icon: '⚡',
    },
    data: { ms: 145, improvement: 15 },
    isLoading: false,
    error: null,
  },
};
