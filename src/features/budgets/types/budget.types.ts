/**
 * טיפוסים לתקציבים – תקני MVP
 */
export interface Budget {
    id: string;
    name: string;
    goal: number;
    currentAmount: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateBudgetData {
    name: string;
    goal: number;
  }
  
  export interface UpdateBudgetData {
    name?: string;
    goal?: number;
    currentAmount?: number;
  }
  
  export interface ImportBudgetData {
    name: string;
    goal: number;
    currentAmount?: number;
  }
  
  export interface ImportResult {
    successful: number;
    failed: number;
    errors: string[];
  }
  
  export interface BudgetsState {
    budgets: Budget[];
    loading: boolean;
    error: string | null;
    maxReached: boolean; // האם המשתמש הגיע ל-10 תקציבים (ללא פרימיום)
  }
  