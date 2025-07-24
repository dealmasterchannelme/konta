import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/budgets - Get all budgets for authenticated user
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: '', // Will be updated when available
        }
      });
    }

    const budgets = await prisma.budget.findMany({
      where: { userId: user.id },
      include: {
        expenses: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate current amounts from expenses
    const budgetsWithCurrentAmount = budgets.map(budget => ({
      ...budget,
      currentAmount: budget.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    }));

    return NextResponse.json({ budgets: budgetsWithCurrentAmount });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/budgets - Create new budget
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, goal } = await request.json();

    if (!name || !goal || goal <= 0) {
      return NextResponse.json({ error: 'Invalid budget data' }, { status: 400 });
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
    
    if (!isPremium && existingBudgets >= 10) {
      return NextResponse.json({ 
        error: 'Budget limit reached. Upgrade to premium for unlimited budgets.' 
      }, { status: 403 });
    }

    const budget = await prisma.budget.create({
      data: {
        name,
        goal,
        userId: user.id
      }
    });

    return NextResponse.json({ 
      budget: {
        ...budget,
        currentAmount: 0
      }
    });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}