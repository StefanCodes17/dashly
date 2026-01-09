import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createWrapper } from '../test/utils';
import type { DataSource } from '../types';
import { useDataSource } from './use-data-source';

describe('useDataSource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('static data source', () => {
    it('should return static data immediately', async () => {
      const staticData = { value: 123, label: 'Test' };
      const source: DataSource = {
        type: 'static',
        data: staticData,
      };

      const { result } = renderHook(() => useDataSource(source, 'test-widget'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(staticData);
      expect(result.current.error).toBeNull();
    });

    it('should handle different data types', async () => {
      const testCases = [
        { data: { value: 'string' }, id: 'string-test' },
        { data: { value: 123 }, id: 'number-test' },
        { data: { value: true }, id: 'boolean-test' },
        { data: { value: null }, id: 'null-test' },
        { data: { value: [1, 2, 3] }, id: 'array-test' },
        { data: { nested: { value: 'deep' } }, id: 'nested-test' },
      ];

      for (const { data: testData, id } of testCases) {
        const source: DataSource = {
          type: 'static',
          data: testData,
        };

        const { result, unmount } = renderHook(() => useDataSource(source, id), {
          wrapper: createWrapper(),
        });

        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 2000 },
        );

        expect(result.current.data).toEqual(testData);
        unmount();
      }
    });
  });

  describe('REST data source', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
      globalThis.fetch = vi.fn();
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('should fetch data from REST endpoint', async () => {
      const mockData = { users: 100, revenue: 50000 };
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });
      globalThis.fetch = mockFetch;

      const source: DataSource = {
        type: 'rest',
        url: 'https://api.example.com/metrics',
      };

      const { result } = renderHook(() => useDataSource(source, 'metrics-widget'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: undefined,
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should support different HTTP methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;

      for (const method of methods) {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ success: true }),
        });
        globalThis.fetch = mockFetch;

        const source: DataSource = {
          type: 'rest',
          url: 'https://api.example.com/data',
          method,
        };

        const { result } = renderHook(() => useDataSource(source, `widget-${method}`), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/data',
          expect.objectContaining({ method }),
        );
      }
    });

    it('should include custom headers', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });
      globalThis.fetch = mockFetch;

      const source: DataSource = {
        type: 'rest',
        url: 'https://api.example.com/data',
        headers: {
          Authorization: 'Bearer token123',
          'X-Custom-Header': 'value',
        },
      };

      const { result } = renderHook(() => useDataSource(source, 'auth-widget'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/data',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token123',
            'X-Custom-Header': 'value',
          },
        }),
      );
    });

    it('should include request body for POST requests', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1 }),
      });
      globalThis.fetch = mockFetch;

      const requestBody = { name: 'Test', value: 123 };
      const source: DataSource = {
        type: 'rest',
        url: 'https://api.example.com/create',
        method: 'POST',
        body: requestBody,
      };

      const { result } = renderHook(() => useDataSource(source, 'create-widget'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/create',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        }),
      );
    });

    it('should handle HTTP errors', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });
      globalThis.fetch = mockFetch;

      const source: DataSource = {
        type: 'rest',
        url: 'https://api.example.com/not-found',
      };

      const { result } = renderHook(() => useDataSource(source, 'error-widget'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toContain('404');
    });

    it('should handle network errors', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      globalThis.fetch = mockFetch;

      const source: DataSource = {
        type: 'rest',
        url: 'https://api.example.com/data',
      };

      const { result } = renderHook(() => useDataSource(source, 'network-error-widget'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toBe('Network error');
    });
  });

  describe('query key generation', () => {
    it('should use unique query keys for different widgets', async () => {
      const source: DataSource = {
        type: 'static',
        data: { value: 1 },
      };

      const { result: result1 } = renderHook(() => useDataSource(source, 'widget-1'), {
        wrapper: createWrapper(),
      });

      const { result: result2 } = renderHook(() => useDataSource(source, 'widget-2'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
        expect(result2.current.isLoading).toBe(false);
      });

      // Both should have the same data but are independent queries
      expect(result1.current.data).toEqual({ value: 1 });
      expect(result2.current.data).toEqual({ value: 1 });
    });
  });
});
