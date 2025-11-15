// app/account/actions.ts
'use server'

import prisma from '@/lib/prisma'

export async function getTotalRevenue() {
  // Get all invoices with their details
  const invoices = await prisma.invoice.findMany({
    select: { 
      total: true,
      paidAmount: true, 
      dueAmount: true 
    },
  });

  // Get payments with their methods
  const payments = await prisma.payment.findMany({
    select: {
      amount: true,
      method: true
    }
  });

  // Calculate totals
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);
  const totalDue = invoices.reduce((sum, invoice) => sum + invoice.dueAmount, 0);
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  
  // Calculate collection rate (paid / total invoiced)
  const collectionRate = totalInvoiced > 0 ? (totalRevenue / totalInvoiced) * 100 : 0;
  
  // Calculate average invoice
  const averageInvoice = invoices.length > 0 ? totalInvoiced / invoices.length : 0;

  // Group payments by method
  const paymentsByMethod = payments.reduce((acc, payment) => {
    if (!acc[payment.method]) {
      acc[payment.method] = { total: 0, count: 0 };
    }
    acc[payment.method].total += payment.amount;
    acc[payment.method].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  // Get recent invoices for dashboard
  const recentInvoices = await prisma.invoice.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      ticket: {
        select: {
          customerName: true,
          device: true
        }
      }
    }
  });

  return {
    totalRevenue,
    totalDue,
    totalInvoiced,
    collectionRate,
    averageInvoice,
    paymentsByMethod,
    recentInvoices
  };
}
