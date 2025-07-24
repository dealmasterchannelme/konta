/**
 * קובץ קונפיגורציית Redux Store לכל האפליקציה
 */
import { configureStore } from '@reduxjs/toolkit';
import { budgetsApi } from '../features/budgets/services/budgetsApi';
import budgetsSlice from '../features/budgets/slices/budgetsSlice';

export const store = configureStore({
  reducer: {
    budgets: budgetsSlice,
    [budgetsApi.reducerPath]: budgetsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(budgetsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
