'use server';

import prisma from "@/lib/prisma";

// Create revenue record when payment is received
export async function revenue(data: {
  amount: number;
  source: 'REPAIR_SERVICE' | 'PARTS_SALE' | 'LABOR_CHARGE' | 'DIAGNOSTIC_FEE' | 'RUSH_SERVICE' | 'WARRANTY_WORK' | 'OTHER';
  description?: string;
  invoiceId?: string;
  paymentDate?: Date;
}) {
  
    const revenue = await prisma.revenue.create({
      data: {
        amount: data.amount,
        source: data.source,
        description: data.description,
        invoiceId: data.invoiceId,
        paymentDate: data.paymentDate || new Date(),
      },
    });

    return { success: true, revenueId: revenue.id };
  }



export async function getRevenueSummary(
  startDate: Date, 
  endDate: Date
) {
  try {
    const revenue = await prisma.revenue.findMany({
      where: {
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        invoice: true,
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });



    const totalRevenue = revenue.reduce((sum: any, rev: any) => sum + rev.amount, 0);

    return {
      success: true,
      revenue,
      totalRevenue,
      period: { startDate, endDate },
    };
  } catch (error) {
    console.error('Error getting revenue summary:', error);
    return { success: false, error: 'Failed to get revenue summary' };
  }
}

// Get daily revenue for charts
export async function getDailyRevenue(days: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const revenue = await prisma.revenue.findMany({
      where: {
        paymentDate: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
        paymentDate: true,
        source: true,
      },
      orderBy: {
        paymentDate: 'asc',
      },
    });

    return {
      success: true,
      revenue,
    };
  } catch (error) {
    console.error('Error getting daily revenue:', error);
    return { success: false, error: 'Failed to get daily revenue' };
  }
}

