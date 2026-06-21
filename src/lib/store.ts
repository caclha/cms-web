import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboard/dashboardSlice';
import cmsReducer from './features/cms/cmsSlice';
import { caclhaApi } from './services/api';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('caclha_state');
    if (serializedState === null) {
      return undefined;
    }
    return { cms: JSON.parse(serializedState) };
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state.cms);
    localStorage.setItem('caclha_state', serializedState);
  } catch {
    // ignore write errors
  }
};

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    cms: cmsReducer,
    [caclhaApi.reducerPath]: caclhaApi.reducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(caclhaApi.middleware),
});

store.subscribe(() => {
  saveState(store.getState());
});

// Infer the types from the store itself
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
