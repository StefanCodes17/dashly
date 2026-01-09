import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { KPIWidgetConfig } from '../types';
import { KPICard } from './kpi-card';

describe('KPICard', () => {
  const baseConfig: KPIWidgetConfig = {
    id: 'test-kpi',
    type: 'kpi',
    title: 'Test KPI',
    dataSource: { type: 'static', data: {} },
    valueKey: 'value',
  };

  describe('loading state', () => {
    it('should display loading indicator', () => {
      render(<KPICard config={baseConfig} data={null} isLoading={true} error={null} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not show title during loading', () => {
      render(<KPICard config={baseConfig} data={null} isLoading={true} error={null} />);

      expect(screen.queryByText('Test KPI')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should display error message', () => {
      const error = new Error('Failed to fetch data');
      render(<KPICard config={baseConfig} data={null} isLoading={false} error={error} />);

      expect(screen.getByText(/Error: Failed to fetch data/i)).toBeInTheDocument();
    });

    it('should display generic error for different error types', () => {
      const errors = [new Error('Network error'), new Error('404 Not Found'), new Error('Timeout')];

      for (const error of errors) {
        const { unmount } = render(
          <KPICard config={baseConfig} data={null} isLoading={false} error={error} />,
        );

        expect(screen.getByText(new RegExp(error.message, 'i'))).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe('success state', () => {
    it('should display title', () => {
      const data = { value: 123 };
      render(<KPICard config={baseConfig} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('Test KPI')).toBeInTheDocument();
    });

    it('should display value from data', () => {
      const data = { value: 12847 };
      render(<KPICard config={baseConfig} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('12847')).toBeInTheDocument();
    });

    it('should handle missing value gracefully', () => {
      const data = { otherKey: 'value' };
      render(<KPICard config={baseConfig} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should apply custom format function', () => {
      const config: KPIWidgetConfig = {
        ...baseConfig,
        format: (value) => `$${Number(value).toLocaleString()}`,
      };
      const data = { value: 45230 };

      render(<KPICard config={config} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('$45,230')).toBeInTheDocument();
    });

    it('should display different value types', () => {
      const testCases = [
        { data: { value: 'text' }, expected: 'text' },
        { data: { value: 123 }, expected: '123' },
        { data: { value: 0 }, expected: '0' },
        { data: { value: true }, expected: 'true' },
        { data: { value: false }, expected: 'false' },
      ];

      for (const { data, expected } of testCases) {
        const { unmount } = render(
          <KPICard config={baseConfig} data={data} isLoading={false} error={null} />,
        );

        expect(screen.getByText(expected)).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe('trend display', () => {
    it('should display trend when configured', () => {
      const config: KPIWidgetConfig = {
        ...baseConfig,
        trend: { key: 'trend' },
      };
      const data = { value: 100, trend: '+12.5%' };

      render(<KPICard config={config} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });

    it('should apply custom trend format', () => {
      const config: KPIWidgetConfig = {
        ...baseConfig,
        trend: {
          key: 'trendValue',
          format: (value) => `${value}% increase`,
        },
      };
      const data = { value: 100, trendValue: 15 };

      render(<KPICard config={config} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('15% increase')).toBeInTheDocument();
    });

    it('should handle missing trend data', () => {
      const config: KPIWidgetConfig = {
        ...baseConfig,
        trend: { key: 'trend' },
      };
      const data = { value: 100 };

      render(<KPICard config={config} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.queryByText(/trend/i)).not.toBeInTheDocument();
    });

    it('should display negative trends', () => {
      const config: KPIWidgetConfig = {
        ...baseConfig,
        trend: { key: 'trend' },
      };
      const data = { value: 342, trend: '-2.1%' };

      render(<KPICard config={config} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('-2.1%')).toBeInTheDocument();
    });
  });

  describe('icon display', () => {
    it('should display icon when provided', () => {
      const config: KPIWidgetConfig = {
        ...baseConfig,
        icon: <span data-testid="custom-icon">📊</span>,
      };
      const data = { value: 100 };

      render(<KPICard config={config} data={data} isLoading={false} error={null} />);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should work without icon', () => {
      const data = { value: 100 };

      render(<KPICard config={baseConfig} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('title display', () => {
    it('should work without title', () => {
      const config: KPIWidgetConfig = {
        ...baseConfig,
        title: undefined,
      };
      const data = { value: 100 };

      render(<KPICard config={config} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.queryByText('Test KPI')).not.toBeInTheDocument();
    });
  });

  describe('complex data structures', () => {
    it('should extract values from nested objects', () => {
      const data = {
        metrics: { value: 500 },
        value: 123,
      };

      render(<KPICard config={baseConfig} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should handle arrays and objects as values', () => {
      const testCases = [
        { data: { value: [1, 2, 3] }, expected: '1,2,3' },
        { data: { value: { nested: 'object' } }, expected: '[object Object]' },
      ];

      for (const { data, expected } of testCases) {
        const { unmount } = render(
          <KPICard config={baseConfig} data={data} isLoading={false} error={null} />,
        );

        expect(screen.getByText(expected)).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe('null and undefined handling', () => {
    it('should handle null data', () => {
      render(<KPICard config={baseConfig} data={null} isLoading={false} error={null} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle undefined data', () => {
      render(<KPICard config={baseConfig} data={undefined} isLoading={false} error={null} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle null value in data object', () => {
      const data = { value: null };

      render(<KPICard config={baseConfig} data={data} isLoading={false} error={null} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });
});
