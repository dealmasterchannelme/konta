'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useCreateBudgetMutation, useGetBudgetsQuery } from '@/features/budgets/services/budgetsApi';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubscriptionGate } from '@/components/subscription/SubscriptionGate';
import { PlusCircle, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BudgetForm = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const { data, refetch } = useGetBudgetsQuery();
  const [createBudget, { isLoading }] = useCreateBudgetMutation();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');

  const budgets = data?.budgets || [];
  const isPremium = user?.publicMetadata?.isPremium === true;
  const maxBudgets = isPremium ? Infinity : 10;

  if (budgets.length >= maxBudgets && !isPremium) {
    return (
      <SubscriptionGate 
        feature={t('budget.form.title')}
        showUpgrade={true}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !goal) {
      toast.error(t('budget.form.missing_fields', 'נא למלא שם וסכום יעד'));
      return;
    }
    if (budgets.length >= maxBudgets) {
      toast.error(
        isPremium
          ? t('budget.form.max_reached_premium', 'הגעת למספר המקסימלי של תקציבים.')
          : t('budget.form.max_reached', 'במנוי החינמי אפשר עד 10 תקציבים בלבד. להצטרפות לפרימיום – לחץ כאן')
      );
      return;
    }
    try {
      await createBudget({ name, goal: Number(goal) }).unwrap();
      toast.success(t('budget.form.success', 'התקציב נוצר בהצלחה'));
      setName('');
      setGoal('');
      refetch();
    } catch (err) {
      toast.error(t('budget.form.error', 'שגיאה ביצירת תקציב'));
    }
  };

  return (
    <div dir={i18n.language === 'he' ? 'rtl' : 'ltr'} className="w-full max-w-md">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Target className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {t('budget.form.title')}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {t('budget.form.subtitle', 'צור תקציב חדש ועקוב אחר ההתקדמות שלך')}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="budgetName" className="text-sm font-medium text-gray-700">
                {t('budget.form.name')}
              </Label>
              <div className="relative">
                <Input
                  id="budgetName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('budget.form.name_placeholder')}
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  dir="auto"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetGoal" className="text-sm font-medium text-gray-700">
                {t('budget.form.goal')}
              </Label>
              <div className="relative">
                <Input
                  id="budgetGoal"
                  type="number"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder={t('budget.form.goal_placeholder')}
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  min={1}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !name.trim() || !goal}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('budget.form.loading')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  {t('budget.form.cta')}
                </div>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {isPremium 
                ? t('budget.form.unlimited', 'תקציבים ללא הגבלה')
                : t('budget.form.limit', `${budgets.length}/10 תקציבים`)
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};