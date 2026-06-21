import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface MetricDetail {
  timestamp: string;
  requests: number;
  latency: number;
  errors: number;
}

export interface DashboardMetrics {
  totalRequests: number;
  avgLatency: number;
  errorRate: number;
  activeUsers: number;
  trends: {
    requests: number;
    latency: number;
    errors: number;
    activeUsers: number;
  };
  chartData: MetricDetail[];
}

export interface ServiceStatus {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'offline';
  uptime: string;
  version: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  service: string;
  message: string;
}

export const caclhaApi = createApi({
  reducerPath: 'caclhaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  }),
  tagTypes: ['Metrics', 'Services', 'Logs'],
  endpoints: (builder) => ({
    getMetrics: builder.query<DashboardMetrics, { period: string }>({
      query: ({ period }) => `metrics?period=${period}`,
      providesTags: ['Metrics'],
      // Standard RTK Query mock/fallback for demo if backend is not up yet
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Silent catch to prevent console spam when backend is not running
        }
      },
    }),
    getServices: builder.query<ServiceStatus[], void>({
      query: () => 'services',
      providesTags: ['Services'],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
    }),
    getLogs: builder.query<SystemLog[], { limit?: number }>({
      query: ({ limit = 10 }) => `logs?limit=${limit}`,
      providesTags: ['Logs'],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
    }),
    restartService: builder.mutation<{ success: boolean; message: string }, string>({
      query: (serviceId) => ({
        url: `services/${serviceId}/restart`,
        method: 'POST',
      }),
      invalidatesTags: ['Services', 'Logs'],
    }),
  }),
});

export const {
  useGetMetricsQuery,
  useGetServicesQuery,
  useGetLogsQuery,
  useRestartServiceMutation,
} = caclhaApi;
