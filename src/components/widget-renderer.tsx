import { useDataSource } from '../data';
import type { WidgetConfig } from '../types';
import { KPICard } from '../widgets';

interface WidgetRendererProps {
  config: WidgetConfig;
}

export function WidgetRenderer({ config }: WidgetRendererProps) {
  const { data, isLoading, error } = useDataSource(config.dataSource, config.id);

  switch (config.type) {
    case 'kpi':
      return <KPICard config={config} data={data} isLoading={isLoading} error={error} />;
    default:
      return (
        <div style={{ padding: '24px', color: '#ef4444' }}>
          Unsupported widget type: {config.type}
        </div>
      );
  }
}
