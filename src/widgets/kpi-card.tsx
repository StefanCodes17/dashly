import type { KPIWidgetConfig } from '../types';

interface KPICardProps {
  config: KPIWidgetConfig;
  data: unknown;
  isLoading: boolean;
  error: Error | null;
}

function getValueByKey(data: unknown, key: string): unknown {
  if (!data || typeof data !== 'object') return undefined;
  return (data as Record<string, unknown>)[key];
}

export function KPICard({ config, data, isLoading, error }: KPICardProps) {
  if (isLoading) {
    return (
      <div
        style={{
          padding: '24px',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#666', fontSize: '14px' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '24px',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#ef4444', fontSize: '14px' }}>Error: {error.message}</div>
      </div>
    );
  }

  const value = getValueByKey(data, config.valueKey);
  const displayValue = config.format ? config.format(value) : String(value ?? 'N/A');

  let trendValue: unknown;
  let displayTrend: string | undefined;

  if (config.trend) {
    trendValue = getValueByKey(data, config.trend.key);
    displayTrend = config.trend.format ? config.trend.format(trendValue) : String(trendValue ?? '');
  }

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        minHeight: '120px',
      }}
    >
      {config.title && (
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
          {config.title}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {config.icon && <div style={{ fontSize: '24px' }}>{config.icon}</div>}
        <div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
            {displayValue}
          </div>
          {displayTrend && (
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              {displayTrend}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
