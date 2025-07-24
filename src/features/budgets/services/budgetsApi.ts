/**
 * RTK Query API לתקציבים – חיבור ל־API עם Clerk (UserID או JWT)
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Budget, CreateBudgetData, UpdateBudgetData, ImportResult } from '../types/budget.types';

export const budgetsApi = createApi({
  reducerPath: 'budgetsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/budgets',
    prepareHeaders: (headers, { getState }) => {
      // חובה – הוסף מזהה Clerk/Auth header
      // אם אתה משתמש ב־jwt של Clerk:
      // headers.set('authorization', `Bearer ${token}`);
      // אם רק userId:
      // headers.set('x-user-id', userId);

      // **שים כאן מימוש אמיתי בהמשך**
      return headers;
    },
  }),
  tagTypes: ['Budget'],
  endpoints: (builder) => ({
    getBudgets: builder.query<{ budgets: Budget[] }, void>({
      query: () => '',
      providesTags: ['Budget'],
    }),
    createBudget: builder.mutation<{ budget: Budget }, CreateBudgetData>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Budget'],
    }),
    updateBudget: builder.mutation<{ budget: Budget }, { id: string; data: UpdateBudgetData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Budget'],
    }),
    deleteBudget: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Budget'],
    }),
    importBudgets: builder.mutation<ImportResult, any[]>({
      query: (budgets) => ({
        url: '/import',
        method: 'POST',
        body: { budgets },
      }),
      invalidatesTags: ['Budget'],
    }),
  }),
});

export const {
  useGetBudgetsQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
  useImportBudgetsMutation,
} = budgetsApi;
