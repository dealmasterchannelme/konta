'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trash2, DollarSign, Target, TrendingUp } from 'lucide-react';
import { Budget } from '../types/budget.types';
import { useDeleteBudgetMutation } from '../services/budgetsApi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface BudgetCardProps {
  budget: Budget;
}

/**
 * Individual budget card component displaying budget details and actions
 */
export function BudgetCard({ budget }: BudgetCardProps) {
  const { t, i18n } = useTranslation();
  const [deleteBudget, { isLoading: isDeleting }] = useDeleteBudgetMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const progressPercentage = Math.min((budget.currentAmount / budget.goal) * 100, 100);
  const isCompleted = budget.currentAmount >= budget.goal;
  const remainingAmount = Math.max(budget.goal - budget.currentAmount, 0);

  const handleDelete = async () => {
    try {
      await deleteBudget(budget.id).unwrap();
      toast.success(t('budget.delete.success', { name: budget.name }));
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error(t('budget.delete.error', 'Failed to delete budget'));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200 border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {budget.name}
            </CardTitle>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <Target className="w-3 h-3 mr-1" />
                {t('budget.card.goalReached')}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {!showDeleteConfirm ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="h-8 px-2 text-xs"
                  disabled={isDeleting}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 px-2 text-xs"
                  disabled={isDeleting}
                >
                  {isDeleting ? t('common.deleting') : t('common.delete')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{t('budget.card.progress')}</span>
            <span className="font-medium text-gray-900">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>

        {/* Financial Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <TrendingUp className="w-3 h-3" />
              {t('budget.card.current')}
            </div>
            <div className="font-semibold text-blue-600">
              {formatCurrency(budget.currentAmount)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <Target className="w-3 h-3" />
              {t('budget.card.goal')}
            </div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(budget.goal)}
            </div>
          </div>
        </div>

        {/* Remaining Amount */}
        {!isCompleted && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('budget.card.remaining')}</span>
              <span className="font-medium text-orange-600">
                {formatCurrency(remainingAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="text-xs text-gray-500 pt-1">
          {t('budget.card.created')} {new Date(budget.createdAt).toLocaleDateString(i18n.language)}
        </div>
      </CardContent>
    </Card>
  );
}