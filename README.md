# Dashly

A developer-first React dashboard library with a built-in data layer. Build production-ready dashboards in minutes with declarative config-based API.

## Features

- **Declarative Config-Based API** - Define your dashboard with TypeScript objects
- **Built-in Data Layer** - REST, GraphQL, WebSocket, and static data sources with automatic caching
- **Pre-built Components** - Beautiful, production-ready widgets (KPI cards, charts, tables)
- **TypeScript-First** - Full type inference and autocomplete
- **Real-time Updates** - Built on TanStack Query for automatic refetching and caching
- **Zero Config** - Works out of the box with sensible defaults

## Installation

```bash
npm install dashly-react
# or
pnpm add dashly-react
# or
yarn add dashly-react
```

## Quick Start

```tsx
import { Dashboard, type DashboardConfig } from 'dashly-react';

const config: DashboardConfig = {
  widgets: [
    {
      id: 'total-users',
      type: 'kpi',
      title: 'Total Users',
      dataSource: {
        type: 'static',
        data: { value: 12847, trend: '+12.5%' },
      },
      valueKey: 'value',
      trend: { key: 'trend' },
    },
    {
      id: 'live-data',
      type: 'kpi',
      title: 'Live Data',
      dataSource: {
        type: 'rest',
        url: 'https://api.example.com/metrics',
        refetchInterval: 5000, // Refetch every 5 seconds
      },
      valueKey: 'activeUsers',
    },
  ],
};

export function App() {
  return <Dashboard config={config} />;
}
```

## Core Concepts

### Dashboard Config

The main configuration object that defines your entire dashboard:

```typescript
interface DashboardConfig {
  widgets: WidgetConfig[];
  layout?: {
    columns?: number;  // Default: 12
    gap?: number;      // Default: 16
  };
  theme?: {
    primary?: string;
    background?: string;
    text?: string;
  };
}
```

### Data Sources

Dashly supports multiple data source types:

#### Static Data

```typescript
{
  type: 'static',
  data: { value: 12847 }
}
```

#### REST API

```typescript
{
  type: 'rest',
  url: 'https://api.example.com/data',
  method: 'GET',  // Optional: GET, POST, PUT, DELETE
  headers: {},    // Optional
  body: {},       // Optional
  refetchInterval: 5000,  // Optional: auto-refetch in ms
}
```

### Widgets

#### KPI Card

Display single metrics with optional trends:

```typescript
{
  id: 'revenue',
  type: 'kpi',
  title: 'Monthly Revenue',
  dataSource: { type: 'static', data: { value: 45230, trend: '+8.2%' } },
  valueKey: 'value',
  format: (value) => `$${Number(value).toLocaleString()}`,
  trend: { key: 'trend' },
  position: { x: 0, y: 0, width: 3, height: 1 },
}
```

### Layout System

Dashly uses a 12-column grid system by default. Control widget positioning:

```typescript
position: {
  x: 0,      // Start column (0-11)
  y: 0,      // Start row
  width: 3,  // Span 3 columns
  height: 1, // Span 1 row
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build library
pnpm build

# Watch mode (auto-rebuild on changes)
pnpm dev

# Type checking
pnpm typecheck

# Lint and format
pnpm lint
pnpm format

# Run example
cd examples/basic
pnpm dev
```

## Project Structure

```
dashly/
├── src/
│   ├── components/    # Core Dashboard component
│   ├── data/         # Data layer (TanStack Query integration)
│   ├── widgets/      # Widget components (KPI, charts, etc.)
│   └── types/        # TypeScript definitions
├── examples/
│   └── basic/        # Basic example app
└── dist/            # Built library output
```

## Roadmap

- [x] Core architecture
- [x] Data layer with REST connector
- [x] KPI Card widget
- [x] Layout system
- [ ] Chart widgets (Line, Bar, Area)
- [ ] Table widget
- [ ] GraphQL connector
- [ ] WebSocket connector
- [ ] Custom chart implementation (replace Recharts)
- [ ] Server-side fetching per component
- [ ] Auto interpolation
- [ ] Documentation site

## License

MIT
