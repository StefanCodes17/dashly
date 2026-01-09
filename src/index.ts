// Main exports
export { Dashboard } from './components';
export type { DashboardProps } from './components';

// Type exports for configuration
export type {
  DashboardConfig,
  WidgetConfig,
  KPIWidgetConfig,
  DataSource,
  RestDataSource,
  StaticDataSource,
  WidgetType,
  DataSourceType,
} from './types';

// Re-export QueryClient for advanced users
export { QueryClient } from '@tanstack/react-query';
