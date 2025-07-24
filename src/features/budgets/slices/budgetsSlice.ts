/**
 * Redux slice לתקציבים (State מקומי, אינו מחליף את RTK Query)
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Budget, BudgetsState } from '../types/budget.types';

const initialState: BudgetsState = {
  budgets: [],
  loading: false,
  error: null,
  maxReached: false,
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload;
      state.maxReached = action.payload.length >= 10;
      state.error = null;
    },
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.unshift(action.payload);
      state.maxReached = state.budgets.length >= 10;
      state.error = null;
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
      state.error = null;
    },
    removeBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter(b => b.id !== action.payload);
      state.maxReached = state.budgets.length >= 10;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setBudgets,
  addBudget,
  updateBudget,
  removeBudget,
  setLoading,
  setError,
  clearError,
} = budgetsSlice.actions;

export default budgetsSlice.reducer;
