'use client';

import { useGetBudgetsQuery } from '@/features/budgets/services/budgetsApi';
import { BudgetCard } from '@/features/budgets/components/BudgetCard';
import { Loader2, PiggyBank } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Component that displays a list of user's budgets
 */
export function BudgetList() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error } = useGetBudgetsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t('budget.list.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-600 mb-2">{t('budget.list.error.title')}</div>
          <div className="text-sm text-gray-500">{t('budget.list.error.description')}</div>
        </div>
      </div>
    );
  }

  const budgets = data?.budgets || [];

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-50 rounded-full p-6 mb-4">
          <PiggyBank className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('budget.list.empty.title')}
        </h3>
        <p className="text-gray-600 mb-4 max-w-sm">
          {t('budget.list.empty.description')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('budget.list.title')} ({budgets.length})
        </h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
}