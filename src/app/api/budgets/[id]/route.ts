import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * PUT /api/budgets/[id] - Update budget
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, goal, currentAmount } = await request.json();
    const budgetId = params.id;

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if budget belongs to user
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId: user.id
      }
    });

    if (!existingBudget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    const updatedBudget = await prisma.budget.update({
      where: { id: budgetId },
      data: {
        ...(name && { name }),
        ...(goal && { goal }),
      }
    });

    // If currentAmount is provided, update expenses
    if (currentAmount !== undefined) {
      // For simplicity, we'll create/update a single expense entry
      await prisma.expense.upsert({
        where: {
          budgetId_description: {
            budgetId: budgetId,
            description: 'Manual Update'
          }
        },
        update: {
          amount: currentAmount
        },
        create: {
          budgetId: budgetId,
          amount: currentAmount,
          description: 'Manual Update',
          category: 'General'
        }
      });
    }

    return NextResponse.json({ 
      budget: {
        ...updatedBudget,
        currentAmount: currentAmount || 0
      }
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/budgets/[id] - Delete budget
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const budgetId = params.id;

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if budget belongs to user
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId: user.id
      }
    });

    if (!existingBudget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    // Delete related expenses first
    await prisma.expense.deleteMany({
      where: { budgetId: budgetId }
    });

    // Delete budget
    await prisma.budget.delete({
      where: { id: budgetId }
    });

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}