import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/budgets/import - Import multiple budgets
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { budgets } = await request.json();

    if (!Array.isArray(budgets) || budgets.length === 0) {
      return NextResponse.json({ error: 'Invalid budgets data' }, { status: 400 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: '',
        }
      });
    }

    // Check budget limits for free users
    const existingBudgets = await prisma.budget.count({
      where: { userId: user.id }
    });

    // Check if user is premium (you'll need to implement this check)
    const isPremium = false; // Replace with actual premium check
    
    if (!isPremium && (existingBudgets + budgets.length) > 10) {
      return NextResponse.json({ 
        error: 'Budget limit would be exceeded. Upgrade to premium for unlimited budgets.' 
      }, { status: 403 });
    }

    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const budgetData of budgets) {
      try {
        const { name, goal, currentAmount = 0, category, targetDate } = budgetData;

        if (!name || !goal || goal <= 0) {
          failed++;
          errors.push(`Invalid data for budget: ${name || 'Unknown'}`);
          continue;
        }

        // Create budget
        const budget = await prisma.budget.create({
          data: {
            name,
            goal,
            userId: user.id
          }
        });

        // Create initial expense if currentAmount is provided
        if (currentAmount > 0) {
          await prisma.expense.create({
            data: {
              budgetId: budget.id,
              amount: currentAmount,
              description: 'Imported Amount',
              category: category || 'General'
            }
          });
        }

        successful++;
      } catch (error) {
        failed++;
        errors.push(`Failed to import budget: ${budgetData.name || 'Unknown'}`);
      }
    }

    return NextResponse.json({
      successful,
      failed,
      errors
    });
  } catch (error) {
    console.error('Error importing budgets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}