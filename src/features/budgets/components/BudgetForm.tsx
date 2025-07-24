'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useCreateBudgetMutation, useGetBudgetsQuery } from '@/features/budgets/services/budgetsApi';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
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
    <form
      dir={i18n.language === 'he' ? 'rtl' : 'ltr'}
      className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md space-y-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold">{t('budget.form.title', 'הוספת תקציב חדש')}</h2>
      <div className="space-y-2">
        <label className="block text-sm font-medium">{t('budget.form.name', 'שם התקציב')}</label>
        <input
          className="w-full border rounded-xl p-3"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={t('budget.form.name_placeholder', 'לדוג\': פרויקט קיץ')}
          dir="auto"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">{t('budget.form.goal', 'סכום יעד')}</label>
        <input
          className="w-full border rounded-xl p-3"
          type="number"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder={t('budget.form.goal_placeholder', 'לדוג\' 5000')}
          min={1}
        />
      </div>
      <Button type="submit" disabled={isLoading || budgets.length >= maxBudgets}>
        {isLoading ? t('budget.form.loading', 'יוצר...') : t('budget.form.cta', 'צור תקציב')}
      </Button>
    </form>
  );
};
