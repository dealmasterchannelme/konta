'use client';

import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { useImportBudgetsMutation, useGetBudgetsQuery } from '@/features/budgets/services/budgetsApi';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { SubscriptionGate } from '@/components/subscription/SubscriptionGate';
import { useUser } from '@clerk/nextjs';

/**
 * Import/Export buttons with premium gating and enhanced templates
 */
export const ImportExportButtons = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const { data } = useGetBudgetsQuery();
  const [importBudgets, { isLoading }] = useImportBudgetsMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const budgets = data?.budgets || [];
  const isPremium = user?.publicMetadata?.isPremium === true;

  // Enhanced template with examples and proper formatting
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      [
        i18n.language === 'he' ? 'שם תקציב' : 'Budget Name',
        i18n.language === 'he' ? 'סכום יעד' : 'Goal Amount',
        i18n.language === 'he' ? 'סכום נוכחי' : 'Current Amount',
        i18n.language === 'he' ? 'קטגוריה' : 'Category',
        i18n.language === 'he' ? 'תאריך יעד' : 'Target Date'
      ],
      [
        i18n.language === 'he' ? 'קרן חירום' : 'Emergency Fund',
        '10000',
        '2500',
        i18n.language === 'he' ? 'חיסכון' : 'Savings',
        '2024-12-31'
      ],
      [
        i18n.language === 'he' ? 'חופשה בקיץ' : 'Summer Vacation',
        '5000',
        '1200',
        i18n.language === 'he' ? 'נסיעות' : 'Travel',
        '2024-07-01'
      ],
      [
        i18n.language === 'he' ? 'רכישת רכב' : 'Car Purchase',
        '25000',
        '8000',
        i18n.language === 'he' ? 'רכב' : 'Vehicle',
        '2025-03-01'
      ],
      ['', '', '', '', ''], // Empty row for user input
    ]);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Budget Name
      { wch: 15 }, // Goal Amount
      { wch: 15 }, // Current Amount
      { wch: 15 }, // Category
      { wch: 15 }  // Target Date
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, i18n.language === 'he' ? 'תבנית תקציב' : 'Budget Template');
    
    const fileName = i18n.language === 'he' ? 'תבנית_תקציבים_קונטה.xlsx' : 'konta_budget_template.xlsx';
    XLSX.writeFile(wb, fileName);
    toast.success(t('import_export.template_downloaded', 'התבנית ירדה בהצלחה'));
  };

  // Enhanced import with better error handling
  const handleImportBudgets = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      
      const wb = XLSX.read(data, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      
      // Skip header row and process data
      const budgetsToImport = rows.slice(1)
        .map(r => ({
          name: r[0] || '',
          goal: Number(r[1]) || 0,
          currentAmount: Number(r[2]) || 0,
          category: r[3] || '',
          targetDate: r[4] || null,
        }))
        .filter(b => b.name && b.goal > 0);
      
      if (budgetsToImport.length === 0) {
        toast.error(t('import_export.no_valid_data', 'לא נמצאו נתונים תקינים לייבוא'));
        return;
      }
      
      try {
        await importBudgets(budgetsToImport).unwrap();
        toast.success(t('import_export.import_success', 'התקציבים יובאו בהצלחה!'));
      } catch {
        toast.error(t('import_export.import_fail', 'שגיאה בייבוא התקציבים'));
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // איפוס קלט
  };

  // Enhanced export with more data
  const handleExportBudgets = () => {
    if (!budgets.length) {
      toast.error(t('import_export.no_budgets', 'אין תקציבים לייצא.'));
      return;
    }
    
    const ws = XLSX.utils.aoa_to_sheet([
      [
        i18n.language === 'he' ? 'שם תקציב' : 'Budget Name',
        i18n.language === 'he' ? 'סכום יעד' : 'Goal Amount',
        i18n.language === 'he' ? 'סכום נוכחי' : 'Current Amount',
        i18n.language === 'he' ? 'אחוז השלמה' : 'Completion %',
        i18n.language === 'he' ? 'תאריך יצירה' : 'Created Date',
        i18n.language === 'he' ? 'סטטוס' : 'Status'
      ],
      ...budgets.map(b => [
        b.name,
        b.goal,
        b.currentAmount,
        `${Math.round((b.currentAmount / b.goal) * 100)}%`,
        new Date(b.createdAt).toLocaleDateString(i18n.language),
        b.currentAmount >= b.goal 
          ? (i18n.language === 'he' ? 'הושלם' : 'Completed')
          : (i18n.language === 'he' ? 'בתהליך' : 'In Progress')
      ]),
    ]);
    
    ws['!cols'] = [
      { wch: 20 }, // Budget Name
      { wch: 15 }, // Goal Amount
      { wch: 15 }, // Current Amount
      { wch: 15 }, // Completion %
      { wch: 15 }, // Created Date
      { wch: 15 }  // Status
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, i18n.language === 'he' ? 'התקציבים שלי' : 'My Budgets');
    
    const fileName = i18n.language === 'he' 
      ? `התקציבים_שלי_${new Date().toISOString().split('T')[0]}.xlsx`
      : `my_budgets_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(t('import_export.export_success', 'הייצוא הסתיים בהצלחה!'));
  };

  return (
    <div dir={i18n.language === 'he' ? 'rtl' : 'ltr'} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={handleDownloadTemplate} 
          variant="outline"
          className="h-12 flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t('import_export.download_template')}
        </Button>
        
        <SubscriptionGate feature={t('import_export.import_budgets')} showUpgrade={!isPremium}>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline"
            className="h-12 flex items-center gap-2"
            disabled={!isPremium}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {t('import_export.import_budgets')}
          </Button>
        </SubscriptionGate>
        
        <Button 
          onClick={handleExportBudgets} 
          variant="outline"
          className="h-12 flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 11l3 3m0 0l3-3m-3 3V8" />
          </svg>
          {t('import_export.export_budgets')}
        </Button>
      </div>
      
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImportBudgets}
      />
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">
          {t('import_export.tips.title', 'טיפים לייבוא וייצוא')}
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• {t('import_export.tips.template', 'השתמש בתבנית המוכנה לייבוא מדויק')}</li>
          <li>• {t('import_export.tips.examples', 'התבנית כוללת דוגמאות לעזרה')}</li>
          <li>• {t('import_export.tips.backup', 'ייצא את הנתונים שלך לגיבוי')}</li>
        </ul>
      </div>
    </div>
  );
};
