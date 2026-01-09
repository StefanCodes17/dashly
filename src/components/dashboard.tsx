import type { QueryClient } from '@tanstack/react-query';
import { DashlyQueryProvider } from '../data';
import type { DashboardConfig } from '../types';
import { WidgetRenderer } from './widget-renderer';

export interface DashboardProps {
  config: DashboardConfig;
  queryClient?: QueryClient;
}

function DashboardContent({ config }: { config: DashboardConfig }) {
  const columns = config.layout?.columns ?? 12;
  const gap = config.layout?.gap ?? 16;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        padding: `${gap}px`,
        backgroundColor: config.theme?.background ?? '#f9fafb',
        minHeight: '100vh',
        color: config.theme?.text ?? '#111827',
      }}
    >
      {config.widgets.map((widget) => {
        const position = widget.position;
        const style: React.CSSProperties = position
          ? {
              gridColumn: `${position.x + 1} / span ${position.width}`,
              gridRow: `${position.y + 1} / span ${position.height}`,
            }
          : {};

        return (
          <div key={widget.id} style={style}>
            <WidgetRenderer config={widget} />
          </div>
        );
      })}
    </div>
  );
}

export function Dashboard({ config, queryClient }: DashboardProps) {
  return (
    <DashlyQueryProvider queryClient={queryClient}>
      <DashboardContent config={config} />
    </DashlyQueryProvider>
  );
}
