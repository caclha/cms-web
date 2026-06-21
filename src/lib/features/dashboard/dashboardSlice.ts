import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  sidebarOpen: boolean;
  activeTab: string;
  filterStatus: 'all' | 'active' | 'inactive';
  selectedMetric: 'requests' | 'latency' | 'errors';
}

const initialState: DashboardState = {
  sidebarOpen: true,
  activeTab: 'overview',
  filterStatus: 'all',
  selectedMetric: 'requests',
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<'all' | 'active' | 'inactive'>) => {
      state.filterStatus = action.payload;
    },
    setSelectedMetric: (state, action: PayloadAction<'requests' | 'latency' | 'errors'>) => {
      state.selectedMetric = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setActiveTab,
  setFilterStatus,
  setSelectedMetric,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
