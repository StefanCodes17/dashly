import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './dashboard';
import type { DashboardConfig } from '../types';

const meta: Meta<typeof Dashboard> = {
  title: 'Components/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

const basicConfig: DashboardConfig = {
  widgets: [
    {
      id: 'revenue',
      type: 'kpi',
      title: 'Total Revenue',
      dataSource: {
        type: 'static',
        data: { value: 125000, trend: '+12.5%' },
      },
      valueKey: 'value',
      format: (val) => `$${Number(val).toLocaleString()}`,
      trend: {
        key: 'trend',
      },
      icon: '💰',
      position: { x: 0, y: 0, width: 3, height: 1 },
    },
    {
      id: 'users',
      type: 'kpi',
      title: 'Active Users',
      dataSource: {
        type: 'static',
        data: { value: 2847, trend: '+8.2%' },
      },
      valueKey: 'value',
      format: (val) => Number(val).toLocaleString(),
      trend: {
        key: 'trend',
      },
      icon: '👥',
      position: { x: 3, y: 0, width: 3, height: 1 },
    },
    {
      id: 'orders',
      type: 'kpi',
      title: 'Orders Today',
      dataSource: {
        type: 'static',
        data: { value: 156, trend: '+23.1%' },
      },
      valueKey: 'value',
      trend: {
        key: 'trend',
      },
      icon: '📦',
      position: { x: 6, y: 0, width: 3, height: 1 },
    },
    {
      id: 'satisfaction',
      type: 'kpi',
      title: 'Customer Satisfaction',
      dataSource: {
        type: 'static',
        data: { value: 4.8, trend: '+0.3' },
      },
      valueKey: 'value',
      format: (val) => `${val}/5`,
      trend: {
        key: 'trend',
      },
      icon: '⭐',
      position: { x: 9, y: 0, width: 3, height: 1 },
    },
  ],
};

export const Basic: Story = {
  args: {
    config: basicConfig,
  },
};

export const CustomLayout: Story = {
  args: {
    config: {
      ...basicConfig,
      layout: {
        columns: 8,
        gap: 24,
      },
      widgets: basicConfig.widgets.map((widget, index) => ({
        ...widget,
        position: { x: (index * 2) % 8, y: Math.floor((index * 2) / 8), width: 2, height: 1 },
      })),
    },
  },
};

export const CustomTheme: Story = {
  args: {
    config: {
      ...basicConfig,
      theme: {
        primary: '#6366f1',
        background: '#0f172a',
        text: '#f8fafc',
      },
    },
  },
};

export const SingleWidget: Story = {
  args: {
    config: {
      widgets: [
        {
          id: 'revenue',
          type: 'kpi',
          title: 'Monthly Revenue',
          dataSource: {
            type: 'static',
            data: { value: 450000, trend: '+18.5%' },
          },
          valueKey: 'value',
          format: (val) => `$${Number(val).toLocaleString()}`,
          trend: {
            key: 'trend',
          },
          icon: '💵',
          position: { x: 0, y: 0, width: 4, height: 1 },
        },
      ],
      layout: {
        columns: 12,
        gap: 20,
      },
    },
  },
};

export const WithoutPositioning: Story = {
  args: {
    config: {
      widgets: [
        {
          id: 'metric1',
          type: 'kpi',
          title: 'Metric 1',
          dataSource: {
            type: 'static',
            data: { value: 100 },
          },
          valueKey: 'value',
          icon: '📊',
        },
        {
          id: 'metric2',
          type: 'kpi',
          title: 'Metric 2',
          dataSource: {
            type: 'static',
            data: { value: 250 },
          },
          valueKey: 'value',
          icon: '📈',
        },
        {
          id: 'metric3',
          type: 'kpi',
          title: 'Metric 3',
          dataSource: {
            type: 'static',
            data: { value: 75 },
          },
          valueKey: 'value',
          icon: '📉',
        },
      ],
    },
  },
};
