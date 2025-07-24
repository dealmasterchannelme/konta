import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // דוגמת משתמש דמו (אם אין כבר)
    const user = await prisma.user.upsert({
        where: { email: "demo@konta.ai" },
        update: {},
        create: {
            clerkId: "demo-clerk-id",
            email: "demo@konta.ai",
            createdAt: new Date(),
        },
    })

    // דוגמת מנוי לאותו משתמש (פרימיום)
    await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            stripeCustomerId: "cus_demo",
            stripeSubId: "sub_demo",
            active: true,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000), // חודש קדימה
            createdAt: new Date(),
        },
    })

    // דוגמת תקציב
    const budget = await prisma.budget.upsert({
        where: { id: "demo-budget" },
        update: {},
        create: {
            id: "demo-budget",
            name: "אירוע קיץ",
            goal: 5000,
            createdAt: new Date(),
            userId: user.id,
        },
    })

    // דוגמת הוצאה
    await prisma.expense.create({
        data: {
            amount: 350,
            description: "קייטרינג",
            category: "אוכל",
            date: new Date(),
            budgetId: budget.id,
        },
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
