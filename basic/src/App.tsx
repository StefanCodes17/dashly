import { Dashboard, type DashboardConfig } from '@dashly/core';

const config: DashboardConfig = {
  layout: {
    columns: 12,
    gap: 16,
  },
  theme: {
    background: '#f9fafb',
    text: '#111827',
  },
  widgets: [
    {
      id: 'total-users',
      type: 'kpi',
      title: 'Total Users',
      dataSource: {
        type: 'static',
        data: {
          value: 12847,
          trend: '+12.5%',
        },
      },
      valueKey: 'value',
      trend: {
        key: 'trend',
      },
      position: {
        x: 0,
        y: 0,
        width: 3,
        height: 1,
      },
    },
    {
      id: 'revenue',
      type: 'kpi',
      title: 'Monthly Revenue',
      dataSource: {
        type: 'static',
        data: {
          value: 45230,
          trend: '+8.2%',
        },
      },
      valueKey: 'value',
      format: (value) => `$${Number(value).toLocaleString()}`,
      trend: {
        key: 'trend',
      },
      position: {
        x: 3,
        y: 0,
        width: 3,
        height: 1,
      },
    },
    {
      id: 'active-sessions',
      type: 'kpi',
      title: 'Active Sessions',
      dataSource: {
        type: 'static',
        data: {
          value: 342,
          trend: '-2.1%',
        },
      },
      valueKey: 'value',
      trend: {
        key: 'trend',
      },
      position: {
        x: 6,
        y: 0,
        width: 3,
        height: 1,
      },
    },
    {
      id: 'conversion-rate',
      type: 'kpi',
      title: 'Conversion Rate',
      dataSource: {
        type: 'static',
        data: {
          value: 3.24,
          trend: '+0.5%',
        },
      },
      valueKey: 'value',
      format: (value) => `${Number(value).toFixed(2)}%`,
      trend: {
        key: 'trend',
      },
      position: {
        x: 9,
        y: 0,
        width: 3,
        height: 1,
      },
    },
    {
      id: 'live-api-status',
      type: 'kpi',
      title: 'API Status (Live)',
      dataSource: {
        type: 'rest',
        url: 'https://jsonplaceholder.typicode.com/users/1',
        refetchInterval: 5000,
      },
      valueKey: 'name',
      position: {
        x: 0,
        y: 1,
        width: 6,
        height: 1,
      },
    },
  ],
};

export function App() {
  return <Dashboard config={config} />;
}
