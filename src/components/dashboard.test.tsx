import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DashboardConfig } from '../types';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render empty dashboard', () => {
      const config: DashboardConfig = {
        widgets: [],
      };

      const { container } = render(<Dashboard config={config} />);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should render single KPI widget', async () => {
      const config: DashboardConfig = {
        widgets: [
          {
            id: 'test-kpi',
            type: 'kpi',
            title: 'Total Users',
            dataSource: {
              type: 'static',
              data: { value: 100 },
            },
            valueKey: 'value',
          },
        ],
      };

      render(<Dashboard config={config} />);

      await waitFor(() => {
        expect(screen.getByText('Total Users')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
      });
    });

    it('should render multiple widgets', async () => {
      const config: DashboardConfig = {
        widgets: [
          {
            id: 'users',
            type: 'kpi',
            title: 'Users',
            dataSource: { type: 'static', data: { value: 100 } },
            valueKey: 'value',
          },
          {
            id: 'revenue',
            type: 'kpi',
            title: 'Revenue',
            dataSource: { type: 'static', data: { value: 5000 } },
            valueKey: 'value',
          },
        ],
      };

      render(<Dashboard config={config} />);

      await waitFor(() => {
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('Revenue')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('5000')).toBeInTheDocument();
      });
    });
  });

  describe('layout configuration', () => {
    it('should apply default layout', async () => {
      const config: DashboardConfig = {
        widgets: [
          {
            id: 'test',
            type: 'kpi',
            dataSource: { type: 'static', data: { value: 1 } },
            valueKey: 'value',
          },
        ],
      };

      const { container } = render(<Dashboard config={config} />);

      await waitFor(() => {
        const grid = container.querySelector('div');
        expect(grid).toHaveStyle({ display: 'grid' });
      });
    });

    it('should apply custom column count', async () => {
      const config: DashboardConfig = {
        layout: {
          columns: 6,
        },
        widgets: [
          {
            id: 'test',
            type: 'kpi',
            dataSource: { type: 'static', data: { value: 1 } },
            valueKey: 'value',
          },
        ],
      };

      const { container } = render(<Dashboard config={config} />);

      await waitFor(() => {
        const grid = container.querySelector('div');
        expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(6, 1fr)' });
      });
    });

    it('should apply custom gap', async () => {
      const config: DashboardConfig = {
        layout: {
          gap: 24,
        },
        widgets: [
          {
            id: 'test',
            type: 'kpi',
            dataSource: { type: 'static', data: { value: 1 } },
            valueKey: 'value',
          },
        ],
      };

      const { container } = render(<Dashboard config={config} />);

      await waitFor(() => {
        const grid = container.querySelector('div');
        expect(grid).toHaveStyle({ gap: '24px' });
      });
    });
  });

  describe('theme configuration', () => {
    it('should apply default theme', async () => {
      const config: DashboardConfig = {
        widgets: [
          {
            id: 'test',
            type: 'kpi',
            dataSource: { type: 'static', data: { value: 1 } },
            valueKey: 'value',
          },
        ],
      };

      const { container } = render(<Dashboard config={config} />);

      await waitFor(() => {
        const grid = container.querySelector('div');
        expect(grid).toHaveStyle({
          backgroundColor: '#f9fafb',
          color: '#111827',
        });
      });
    });

    it('should apply custom theme colors', async () => {
      const config: DashboardConfig = {
        theme: {
          background: '#1a1a1a',
          text: '#ffffff',
        },
        widgets: [
          {
            id: 'test',
            type: 'kpi',
            dataSource: { type: 'static', data: { value: 1 } },
            valueKey: 'value',
          },
        ],
      };

      const { container } = render(<Dashboard config={config} />);

      await waitFor(() => {
        const grid = container.querySelector('div');
        expect(grid).toHaveStyle({
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
        });
      });
    });
  });

  describe('widget positioning', () => {
    it('should apply widget position', async () => {
      const config: DashboardConfig = {
        widgets: [
          {
            id: 'positioned',
            type: 'kpi',
            title: 'Positioned Widget',
            dataSource: { type: 'static', data: { value: 1 } },
            valueKey: 'value',
            position: {
              x: 0,
              y: 0,
              width: 3,
              height: 1,
            },
          },
        ],
      };

      const { container } = render(<Dashboard config={config} />);

      await waitFor(() => {
        expect(screen.getByText('Positioned Widget')).toBeInTheDocument();
      });

      const widgetContainer = container.querySelector('div > div > div');
      expect(widgetContainer).toHaveAttribute('style');
      const style = widgetContainer?.getAttribute('style') ?? '';
      expect(style).toContain('grid-column: 1 / span 3');
      expect(style).toContain('grid-row: 1 / span 1');
    });

    it('should handle widgets without position', async () => {
      const config: DashboardConfig = {
        widgets: [
          {
            id: 'no-position',
            type: 'kpi',
            dataSource: { type: 'static', data: { value: 1 } },
            valueKey: 'value',
          },
        ],
      };

      render(<Dashboard config={config} />);

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });

    it('should position multiple widgets independently', async () => {
      const config: DashboardConfig = {
        widgets: [
          {
            id: 'widget-1',
            type: 'kpi',
            title: 'First',
            dataSource: { type: 'static', data: { value: 1 } },
            valueKey: 'value',
            position: { x: 0, y: 0, width: 4, height: 1 },
          },
          {
            id: 'widget-2',
            type: 'kpi',
            title: 'Second',
            dataSource: { type: 'static', data: { value: 2 } },
            valueKey: 'value',
            position: { x: 4, y: 0, width: 4, height: 1 },
          },
        ],
      };

      render(<Dashboard config={config} />);

      await waitFor(() => {
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
      });
    });
  });

  describe('custom QueryClient', () => {
    it('should accept custom QueryClient', async () => {
      const customClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 5,
            staleTime: 60000,
          },
        },
      });

      const config: DashboardConfig = {
        widgets: [
          {
            id: 'test',
            type: 'kpi',
            dataSource: { type: 'static', data: { value: 123 } },
            valueKey: 'value',
          },
        ],
      };

      render(<Dashboard config={config} queryClient={customClient} />);

      await waitFor(() => {
        expect(screen.getByText('123')).toBeInTheDocument();
      });
    });
  });

  describe('data fetching', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
      globalThis.fetch = vi.fn();
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('should fetch data for REST widgets', async () => {
      const mockData = { activeUsers: 250 };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const config: DashboardConfig = {
        widgets: [
          {
            id: 'live-users',
            type: 'kpi',
            title: 'Active Users',
            dataSource: {
              type: 'rest',
              url: 'https://api.example.com/users',
            },
            valueKey: 'activeUsers',
          },
        ],
      };

      render(<Dashboard config={config} />);

      await waitFor(() => {
        expect(screen.getByText('Active Users')).toBeInTheDocument();
        expect(screen.getByText('250')).toBeInTheDocument();
      });
    });

    it('should handle loading state', () => {
      globalThis.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: async () => ({ value: 100 }),
              });
            }, 100);
          }),
      );

      const config: DashboardConfig = {
        widgets: [
          {
            id: 'slow-widget',
            type: 'kpi',
            title: 'Slow Data',
            dataSource: {
              type: 'rest',
              url: 'https://api.example.com/slow',
            },
            valueKey: 'value',
          },
        ],
      };

      render(<Dashboard config={config} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should handle errors gracefully', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('API Error'));

      const config: DashboardConfig = {
        widgets: [
          {
            id: 'error-widget',
            type: 'kpi',
            dataSource: {
              type: 'rest',
              url: 'https://api.example.com/error',
            },
            valueKey: 'value',
          },
        ],
      };

      render(<Dashboard config={config} />);

      await waitFor(
        () => {
          expect(screen.getByText(/Error: API Error/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('widget types', () => {
    it('should render all supported widget types', async () => {
      const config: DashboardConfig = {
        widgets: [
          {
            id: 'kpi-widget',
            type: 'kpi',
            title: 'KPI Widget',
            dataSource: { type: 'static', data: { value: 100 } },
            valueKey: 'value',
          },
        ],
      };

      render(<Dashboard config={config} />);

      await waitFor(() => {
        expect(screen.getByText('KPI Widget')).toBeInTheDocument();
      });
    });
  });
});
