'use client';

import { useUser } from '@clerk/nextjs';
import { BudgetForm } from '@/features/budgets/components/BudgetForm';
import { BudgetList } from '@/features/budgets/components/BudgetList';
import { ImportExportButtons } from '@/features/budgets/components/ImportExportButtons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetBudgetsQuery } from '@/features/budgets/services/budgetsApi';
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  PieChart,
  Plus,
  BarChart3 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Main dashboard page for budget management
 */
export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { user, isLoaded } = useUser();
  const { data } = useGetBudgetsQuery();

  const budgets = data?.budgets || [];

  // Calculate summary stats
  const totalBudgets = budgets.length;
  const totalGoalAmount = budgets.reduce((sum, budget) => sum + budget.goal, 0);
  const totalCurrentAmount = budgets.reduce((sum, budget) => sum + budget.currentAmount, 0);
  const completedBudgets = budgets.filter(budget => budget.currentAmount >= budget.goal).length;
  const overallProgress = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language === 'he' ? 'he-IL' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('dashboard.welcome', { name: user?.firstName || t('dashboard.guest') })} 👋
              </h1>
              <p className="text-gray-600 mt-1">
                {t('dashboard.overview')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {t('dashboard.title')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{t('dashboard.stats.totalBudgets')}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBudgets}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{t('dashboard.stats.totalGoals')}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGoalAmount)}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{t('dashboard.stats.totalSaved')}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentAmount)}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{t('dashboard.stats.completed')}</p>
                  <p className="text-2xl font-bold text-gray-900">{completedBudgets}</p>
                  <p className="text-xs text-gray-500">
                    {totalBudgets > 0 ? Math.round((completedBudgets / totalBudgets) * 100) : 0}% {t('dashboard.stats.complete')}
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-full">
                  <PieChart className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="budgets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-400">
            <TabsTrigger value="budgets" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t('dashboard.tabs.myBudgets')}
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('dashboard.tabs.createBudget')}
            </TabsTrigger>
            <TabsTrigger value="import-export" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('dashboard.tabs.importExport')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="budgets" className="space-y-6">
            <BudgetList />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="flex justify-center">
              <BudgetForm />
            </div>
          </TabsContent>

          <TabsContent value="import-export" className="space-y-6">
            <ImportExportButtons />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}