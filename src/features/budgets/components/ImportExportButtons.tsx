'use client';

import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { useImportBudgetsMutation, useGetBudgetsQuery } from '@/features/budgets/services/budgetsApi';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/**
 * כפתורי ייבוא/ייצוא תקציבים + הורדת תבנית RTL מעוצבת
 */
export const ImportExportButtons = () => {
  const { t, i18n } = useTranslation();
  const { data } = useGetBudgetsQuery();
  const [importBudgets, { isLoading }] = useImportBudgetsMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const budgets = data?.budgets || [];

  // הורדת תבנית בעברית, RTL, עם עיצוב (אפשר לשדרג לפורמט ממותג)
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['שם תקציב', 'סכום יעד', 'סכום נוכחי'],
      ['', '', ''],
    ]);
    // עיצוב — לדפדפן אין תמיכה במילוי צבע, אז הקפד על RTL וכותרת ממורכזת
    ws['!cols'] = [{ wch: 24 }, { wch: 16 }, { wch: 16 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'תבנית תקציב');
    XLSX.writeFile(wb, 'תבנית_יבוא_תקציבים.xlsx');
    toast.success(t('import_export.template_downloaded', 'התבנית ירדה בהצלחה'));
  };

  // ייבוא תקציבים מאקסל
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
      // לדג' – התעלמות משורה ראשונה (header)
      const budgetsToImport = rows.slice(1).map(r => ({
        name: r[0] || '',
        goal: Number(r[1]) || 0,
        currentAmount: Number(r[2]) || 0,
      })).filter(b => b.name && b.goal > 0);
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

  // ייצוא תקציבים קיימים
  const handleExportBudgets = () => {
    if (!budgets.length) {
      toast.error(t('import_export.no_budgets', 'אין תקציבים לייצא.'));
      return;
    }
    const ws = XLSX.utils.aoa_to_sheet([
      ['שם תקציב', 'סכום יעד', 'סכום נוכחי'],
      ...budgets.map(b => [b.name, b.goal, b.currentAmount]),
    ]);
    ws['!cols'] = [{ wch: 24 }, { wch: 16 }, { wch: 16 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'התקציבים שלי');
    XLSX.writeFile(wb, 'התקציבים_שלי.xlsx');
    toast.success(t('import_export.export_success', 'הייצוא הסתיים בהצלחה!'));
  };

  return (
    <div dir={i18n.language === 'he' ? 'rtl' : 'ltr'} className="flex flex-col gap-4 items-center">
      <Button onClick={handleDownloadTemplate} variant="outline">
        {t('import_export.download_template', 'הורד תבנית לאקסל')}
      </Button>
      <Button onClick={() => fileInputRef.current?.click()} variant="outline">
        {t('import_export.import_budgets', 'ייבוא תקציבים מאקסל')}
      </Button>
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImportBudgets}
      />
      <Button onClick={handleExportBudgets} variant="outline">
        {t('import_export.export_budgets', 'ייצוא תקציבים לאקסל')}
      </Button>
    </div>
  );
};
