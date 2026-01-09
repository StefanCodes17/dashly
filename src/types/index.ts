import type { ReactNode } from 'react';

/**
 * Data source configuration types
 */
export type DataSourceType = 'rest' | 'graphql' | 'websocket' | 'static';

export interface RestDataSource {
  type: 'rest';
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  refetchInterval?: number;
}

export interface StaticDataSource<T = unknown> {
  type: 'static';
  data: T;
}

export type DataSource<T = unknown> = RestDataSource | StaticDataSource<T>;

/**
 * Widget configuration types
 */
export type WidgetType = 'kpi' | 'line-chart' | 'bar-chart' | 'area-chart' | 'table';

export interface BaseWidgetConfig {
  id: string;
  title?: string;
  dataSource: DataSource;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface KPIWidgetConfig extends BaseWidgetConfig {
  type: 'kpi';
  valueKey: string;
  format?: (value: unknown) => string;
  trend?: {
    key: string;
    format?: (value: unknown) => string;
  };
  icon?: ReactNode;
}

export type WidgetConfig = KPIWidgetConfig;

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  widgets: WidgetConfig[];
  layout?: {
    columns?: number;
    gap?: number;
  };
  theme?: {
    primary?: string;
    background?: string;
    text?: string;
  };
}

/**
 * Internal widget props after data fetching
 */
export interface WidgetProps<T = unknown> {
  config: WidgetConfig;
  data: T;
  isLoading: boolean;
  error: Error | null;
}
